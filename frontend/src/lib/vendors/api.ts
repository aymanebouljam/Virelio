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

export type UpdateVendorInput = {
  name: string
  email?: string
  phone?: string
  website?: string
  notes?: string
}

export async function fetchVendors() {
  return (await apiConfig({ path: 'vendors' })) as Vendor[]
}

export async function createVendor(input: CreateVendorInput) {
  return (await apiConfig({ path: 'vendors', method: 'POST', input })) as Vendor
}

export async function updateVendor(id: string, input: UpdateVendorInput) {
  return (await apiConfig({ path: 'vendors', method: 'PATCH', input, id })) as Vendor
}
export async function archiveVendor(id: string) {
  return (await apiConfig({ path: 'vendors', method: 'PATCH', id, action: 'archive' })) as Vendor
}

export async function fetchArchivedVendors() {
  return (await apiConfig({ path: 'vendors', action: 'archived' })) as Vendor[]
}

export async function restoreVendor(id: string) {
  return (await apiConfig({ path: 'vendors', method: 'PATCH', id, action: 'restore' })) as Vendor
}
