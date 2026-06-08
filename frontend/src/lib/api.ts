const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

type FieldError = {
  field: string
  constraints?: Record<string, string>
}

type ApiErrorResponse = {
  message?: string
  errors?: FieldError[]
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly content: Record<string, string> | null = null,
  ) {
    super(message)
    this.name = 'Api Error'
  }
}

function getApiBaseUrl() {
  if (!API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL is not configured')
  }

  return API_BASE_URL
}

async function validateResponse(response: Response) {
  const body: unknown = await response.json().catch(() => null)
  if (body === null || typeof body !== 'object') {
    throw new Error('Response body is not a valid JSON object or array')
  }
  return body
}

function parseError(body: ApiErrorResponse) {
  if (!Array.isArray(body.errors) || body.errors.length === 0) {
    let message = 'Something went wrong'
    if (typeof body.message === 'string' && body.message.length > 0) {
      message = body.message
    }
    throw new ApiError(message)
  } else {
    const isEntry = (value: [string, string] | null) => value !== null
    const content = Object.fromEntries(
      body.errors
        .map((err): [string, string] | null => {
          if (typeof err.field !== 'string' || err.field.length === 0) {
            return null
          }
          const message = Object.values(err.constraints ?? {})[0] ?? `Invalid ${err.field} value`
          return [err.field, message]
        })
        .filter(isEntry),
    )

    throw new ApiError('Invalid form input', content)
  }
}

type FetchConfig = {
  method: string
  headers: {
    Accept: string
    'Content-Type'?: string
  }
  body?: string
}

export async function apiConfig(
  path: string = '',
  method: string = 'GET',
  input: Record<string, unknown> | undefined = undefined,
  param: string = '',
  segment: string = '',
  query: string = '',
) {
  let endpoint = `${path}`
  if (param) {
    endpoint += `/${param}`
  }
  if (segment) {
    endpoint += `/${segment}`
  }
  if (query) {
    endpoint += `/?${query}`
  }

  const config: FetchConfig = {
    method,
    headers: {
      Accept: 'application/json',
    },
  }

  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    config.headers['Content-Type'] = 'application/json'
    config.body = JSON.stringify(input)
  }

  const response = await fetch(`${getApiBaseUrl()}/${endpoint}`, config)
  const body = await validateResponse(response)
  if (!response.ok) {
    parseError(body)
  }
  return body
}
