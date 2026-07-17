export const NOTION_API_VERSION = "2026-03-11"
export const NOTION_BASE_URL = "https://api.notion.com"

function requiredConfigValue(name: string, value: string | undefined) {
  const normalized = value?.trim()
  if (!normalized) {
    throw new Error(`Missing ${name} configuration value.`)
  }

  return normalized
}

export const ARTICLES_DATA_SOURCE_ID = requiredConfigValue(
  "ARTICLES_DATA_SOURCE_ID",
  process.env.NOTION_ARTICLES_DATA_SOURCE_ID ??
    "357f5028-4ed3-8018-beef-000b360564a7"
)
export const TRANSLATIONS_DATA_SOURCE_ID = requiredConfigValue(
  "TRANSLATIONS_DATA_SOURCE_ID",
  process.env.NOTION_TRANSLATIONS_DATA_SOURCE_ID ??
    "357f5028-4ed3-800a-abbf-000b01ac84cc"
)

export const ARTICLE_PROPS = {
  TITLE: "名称",
  SLUG: "Slug",
  EXCERPT: "摘要",
  PUBLISH_DATE: "发布时间",
  ORIGINAL_LANGUAGE: "原文语言",
  TAGS: "标签",
  STATUS: "状态",
  TRANSLATIONS: "译文",
  LAST_EDITED: "上次编辑时间"
} as const

export const ARTICLE_STATUS = {
  PUBLIC: "公开",
  DRAFT: "草稿",
  PRIVATE: "非公开",
  ARCHIVED: "归档"
} as const

export const TRANSLATION_PROPS = {
  TITLE: "标题",
  EXCERPT: "摘要",
  LANGUAGE: "翻译语言",
  PROGRESS: "翻译进度",
  ORIGINAL: "原文"
} as const

export const TRANSLATION_PROGRESS = {
  COMPLETED: "完成",
  IN_PROGRESS: "进行中",
  NOT_STARTED: "未开始"
} as const

export const SUPPORTED_LOCALES = ["zh-CN", "en-US"] as const

export function getNotionApiKey() {
  const key = process.env.NOTION_API_KEY
  if (!key) {
    throw new Error(
      "Missing NOTION_API_KEY environment variable. " +
        "Set NOTION_API_KEY in your .env.local file to authenticate with the Notion API."
    )
  }
  return key
}
