import { ErrorPageClient } from "./ErrorPageClient"

export default function Unauthorized() {
  return (
    <ErrorPageClient
      code="401"
      description={["Please sign in", "to continue to"]}
      title={["Sign-in", "required."]}
    />
  )
}
