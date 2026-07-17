import { SUPPORTED_LOCALES } from "../../src/lib/notion/config"
import type { Locale } from "../../src/lib/notion/types"

export type NotionProperty = {
  title?: { plain_text?: string }[]
  rich_text?: { plain_text?: string }[]
  date?: { start?: string | null } | null
  select?: { name?: string } | null
  multi_select?: { name?: string }[]
  status?: { name?: string } | null
  relation?: { id?: string }[]
  last_edited_time?: string
}

export type NotionCover =
  | { type: "file"; file: { url: string } }
  | { type: "external"; external: { url: string } }
  | null

export type NotionPage = {
  id: string
  cover?: NotionCover
  properties?: Record<string, NotionProperty>
}

export function getCoverUrl(cover?: NotionCover): string | null {
  if (!cover) return null
  if (cover.type === "file") return cover.file.url
  if (cover.type === "external") return cover.external.url
  return null
}

export class NotionValidationError extends Error {
  readonly pageId?: string
  readonly pageTitle?: string
  readonly propertyName?: string

  constructor(
    message: string,
    context?: { pageId?: string; pageTitle?: string; propertyName?: string }
  ) {
    super(message)
    this.name = "NotionValidationError"
    this.pageId = context?.pageId
    this.pageTitle = context?.pageTitle
    this.propertyName = context?.propertyName
  }
}

export function plainText(items?: { plain_text?: string }[]) {
  return (
    items
      ?.map((item) => item.plain_text ?? "")
      .join("")
      .trim() ?? ""
  )
}

export function property(page: NotionPage, name: string) {
  return page.properties?.[name] ?? {}
}

export function dateValue(value?: string | null) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function isLocale(value: string): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale)
}
