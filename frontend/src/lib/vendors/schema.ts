import { z } from 'zod'
export const vendorFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(120, 'Name must be at most 120 characters'),
  email: z
    .string()
    .trim()
    .max(120, 'Email must be at most 120 characters')
    .pipe(z.email('Email must be a valid email address'))
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .trim()
    .max(40, 'Phone must be at most 40 characters')
    .optional()
    .or(z.literal('')),
  website: z
    .string()
    .trim()
    .pipe(z.url('Website must be a valid URL'))
    .optional()
    .or(z.literal('')),
  notes: z
    .string()
    .trim()
    .max(1000, 'Notes must be at most 1000 characters')
    .optional()
    .or(z.literal('')),
})

export type VendorFormValues = z.infer<typeof vendorFormSchema>

export const vendorSchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().max(120).pipe(z.email()).nullable(),
  phone: z.string().trim().max(40).nullable(),
  website: z.string().trim().pipe(z.url()).nullable(),
  notes: z.string().trim().max(1000).nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  archivedAt: z.iso.datetime().nullable(),
})

export type Vendor = z.infer<typeof vendorSchema>
