import { NOTION_API_KEY, NOTION_API_VERSION, NOTION_BASE_URL } from './config';
import { NotionValidationError } from './types';

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

type RequestContext = {
  endpoint: string;
  method: 'GET' | 'POST';
  body?: JsonValue;
  context: string;
};

type QueryResponse = {
  results: JsonValue[];
  has_more?: boolean;
  next_cursor?: string | null;
};

export type PageMarkdown = {
  markdown: string;
  warnings: {
    truncated?: boolean;
    unknown_block_ids?: string[];
  };
};

const cache = new Map<string, Promise<unknown>>();

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function memo<T>(key: string, load: () => Promise<T>): Promise<T> {
  const cached = cache.get(key) as Promise<T> | undefined;
  if (cached) return cached;

  const promise = load();
  cache.set(key, promise);
  return promise;
}

function retryDelay(response: Response, attempt: number) {
  const retryAfter = response.headers.get('Retry-After');
  if (retryAfter) {
    const seconds = Number(retryAfter);
    if (Number.isFinite(seconds)) return seconds * 1000;

    const date = Date.parse(retryAfter);
    if (Number.isFinite(date)) return Math.max(0, date - Date.now());
  }

  return 250 * 2 ** attempt;
}

async function notionFetch<T>({ endpoint, method, body, context }: RequestContext): Promise<T> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const response = await fetch(`${NOTION_BASE_URL}${endpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${NOTION_API_KEY}`,
        'Content-Type': 'application/json',
        'Notion-Version': NOTION_API_VERSION,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (response.ok) return (await response.json()) as T;

    if ((response.status === 429 || response.status >= 500) && attempt < 2) {
      await sleep(retryDelay(response, attempt));
      continue;
    }

    throw new NotionValidationError(
      `Notion API request failed: endpoint=${endpoint} status=${response.status} context=${context}`
    );
  }

  throw new NotionValidationError(
    `Notion API request failed: endpoint=${endpoint} status=unknown context=${context}`
  );
}

export async function queryDataSource(dataSourceId: string): Promise<JsonValue[]> {
  return memo(`queryDataSource:${dataSourceId}`, async () => {
    const endpoint = `/v1/data_sources/${dataSourceId}/query`;
    const results: JsonValue[] = [];
    let startCursor: string | null | undefined;

    do {
      const response = await notionFetch<QueryResponse>({
        endpoint,
        method: 'POST',
        body: {
          page_size: 100,
          ...(startCursor ? { start_cursor: startCursor } : {}),
        },
        context: `query data source ${dataSourceId}`,
      });

      results.push(...response.results);
      startCursor = response.has_more ? response.next_cursor : null;
    } while (startCursor);

    return results;
  });
}

export async function getPageMarkdown(pageId: string): Promise<PageMarkdown> {
  return memo(`getPageMarkdown:${pageId}`, () =>
    notionFetch<PageMarkdown>({
      endpoint: `/v1/pages/${pageId}/markdown`,
      method: 'GET',
      context: `get page markdown ${pageId}`,
    })
  );
}
