const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function fetchVendors() {
  const response = await fetch(`${API_BASE_URL}/vendors`)

  if (!response.ok) {
    throw new Error('Failed to fetch vendors')
  }

  return response.json()
}
