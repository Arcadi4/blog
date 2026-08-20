import { ErrorPageClient } from "./ErrorPageClient"

export default function Forbidden() {
  return (
    <ErrorPageClient
      code="403"
      description={["You do not have", "access to"]}
      title={["Access", "forbidden."]}
    />
  )
}
