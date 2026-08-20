import { ErrorPageClient } from "./ErrorPageClient"

export default function NotFound() {
  return (
    <ErrorPageClient
      code="404"
      description={["You are trying", "to visit"]}
      title={["This page", "does not exist."]}
    />
  )
}
