import { apiConfig } from '../api'

export type Vendor = {
  id: string
  name: string
  email: string | null
  phone: string | null
  website: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
  archivedAt: string | null
}

export type CreateVendorInput = {
  name: string
  email?: string
  phone?: string
  website?: string
  notes?: string
}

export async function fetchVendors() {
  return (await apiConfig('vendors')) as Vendor[]
}

export async function createVendor(input: CreateVendorInput) {
  return (await apiConfig('vendors', 'POST', input)) as Vendor
}
