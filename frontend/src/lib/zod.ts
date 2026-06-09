export function mapZodErrors(
  issues: Array<{ path: PropertyKey[]; message: string }>,
): Record<string, string> {
  const fieldErrors: Record<string, string> = {}

  for (const issue of issues) {
    const field = issue.path[0]
    if (typeof field !== 'string') {
      continue
    }

    if (!fieldErrors[field]) {
      fieldErrors[field] = issue.message
    }
  }

  return fieldErrors
}
