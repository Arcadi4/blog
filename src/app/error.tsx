"use client"

import { ErrorPageClient } from "./ErrorPageClient"

type ErrorProps = {
  error: Error & { digest?: string }
  retry: () => void
}

export default function Error({ retry }: ErrorProps) {
  return (
    <ErrorPageClient
      code="500"
      description={["The site failed while", "loading"]}
      retry={retry}
      title={["Something went", "wrong."]}
    />
  )
}
