<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  createVendor,
  fetchVendors,
  updateVendor,
  type Vendor,
  type CreateVendorInput,
} from '@/lib/vendors/api'

import { ApiError } from '@/lib/api'

const vendors = ref<Vendor[]>([])
const vendor = ref<CreateVendorInput>({
  name: '',
  email: '',
  phone: '',
  website: '',
  notes: '',
})
const loading = ref(true)
const error = ref('')

const showVendorForm = ref(false)
const editingVendorId = ref<string | null>(null)
const submitting = ref(false)
const submitError = ref('')

const form = ref<CreateVendorInput>({
  name: '',
  email: '',
  phone: '',
  website: '',
  notes: '',
})

const formErrors = ref<Record<string, string>>({})

function resetForm() {
  form.value = {
    name: '',
    email: '',
    phone: '',
    website: '',
    notes: '',
  }
  vendor.value = {
    name: '',
    email: '',
    phone: '',
    website: '',
    notes: '',
  }
  submitError.value = ''
  formErrors.value = {}
  editingVendorId.value = null
}

function openCreateForm() {
  resetForm()
  showVendorForm.value = true
}

function openEditForm(vendorData: Vendor) {
  const cleanData = {
    name: vendorData.name,
    email: vendorData.email ?? '',
    phone: vendorData.phone ?? '',
    website: vendorData.website ?? '',
    notes: vendorData.notes ?? '',
  }
  vendor.value = { ...cleanData }
  form.value = { ...cleanData }
  submitError.value = ''
  formErrors.value = {}
  editingVendorId.value = vendorData.id
  showVendorForm.value = true
}

async function loadVendors() {
  try {
    error.value = ''
    vendors.value = await fetchVendors()
  } catch (err) {
    error.value = err instanceof ApiError ? err.message : 'Something went wrong'
  } finally {
    loading.value = false
  }
}

function closeVendorForm() {
  showVendorForm.value = false
  resetForm()
}

function normalizePayload(input: CreateVendorInput): CreateVendorInput {
  return {
    name: input.name.trim(),
    email: input.email?.trim() || undefined,
    phone: input.phone?.trim() || undefined,
    website: input.website?.trim() || undefined,
    notes: input.notes?.trim() || undefined,
  }
}

function isSameVendorForm(form: CreateVendorInput, vendor: CreateVendorInput) {
  return (
    form.name === vendor.name &&
    (form.email ?? '') === (vendor.email ?? '') &&
    (form.phone ?? '') === (vendor.phone ?? '') &&
    (form.website ?? '') === (vendor.website ?? '') &&
    (form.notes ?? '') === (vendor.notes ?? '')
  )
}

async function submitVendorForm() {
  submitError.value = ''
  submitting.value = true
  formErrors.value = {}

  try {
    const payload = normalizePayload(form.value)
    if (!editingVendorId.value) {
      const createdVendor = await createVendor(payload)
      vendors.value = [createdVendor, ...vendors.value]
    } else if (!isSameVendorForm(form.value, vendor.value)) {
      const updatedVendor = await updateVendor(editingVendorId.value, payload)
      vendors.value = vendors.value.map((vendor) =>
        vendor.id === updatedVendor.id ? updatedVendor : vendor,
      )
    }

    closeVendorForm()
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.content) {
        formErrors.value = err.content
        return
      }
      submitError.value = err.message
    } else {
      submitError.value = 'Something went wrong'
    }
  } finally {
    submitting.value = false
  }
}

onMounted(loadVendors)
</script>

<template>
  <section class="space-y-8">
    <header class="space-y-3">
      <p class="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">Vendors</p>

      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 class="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            Vendor directory
          </h2>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-stone-500 sm:text-base">
            Manage the businesses that issue your invoices and receipts before linking them to
            expenses.
          </p>
        </div>

        <div v-if="!showVendorForm">
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-2xl bg-stone-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-stone-700"
            @click="openCreateForm"
          >
            Add vendor
          </button>
        </div>
      </div>
    </header>
    <section
      v-if="showVendorForm"
      class="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm"
    >
      <div class="flex items-start justify-between gap-4">
        <div>
          <h3 class="text-lg font-semibold tracking-tight text-stone-900">
            {{ editingVendorId ? 'Edit vendor' : 'Create vendor' }}
          </h3>

          <p class="mt-1 text-sm text-stone-500">
            Add a vendor before linking expenses and uploaded proofs.
          </p>
        </div>
      </div>

      <form class="mt-6 space-y-5" @submit.prevent="submitVendorForm">
        <div class="grid gap-4 sm:grid-cols-2">
          <label class="block">
            <span class="mb-2 block text-sm font-medium text-stone-700">Name</span>
            <input
              v-model="form.name"
              type="text"
              maxlength="120"
              required
              :class="[
                'w-full rounded-2xl border bg-white px-4 py-3 text-sm text-stone-900 outline-none transition',
                formErrors.name
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-stone-300 focus:border-stone-900',
              ]"
            />

            <p v-if="formErrors.name" class="ml-3 mt-2 text-sm text-red-600">
              {{ formErrors.name }}
            </p>
          </label>

          <label class="block">
            <span class="mb-2 block text-sm font-medium text-stone-700">Email</span>
            <input
              v-model="form.email"
              type="email"
              maxlength="120"
              :class="[
                'w-full rounded-2xl border bg-white px-4 py-3 text-sm text-stone-900 outline-none transition',
                formErrors.email
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-stone-300 focus:border-stone-900',
              ]"
            />

            <p v-if="formErrors.email" class="ml-3 mt-2 text-sm text-red-600">
              {{ formErrors.email }}
            </p>
          </label>

          <label class="block">
            <span class="mb-2 block text-sm font-medium text-stone-700">Phone</span>
            <input
              v-model="form.phone"
              type="text"
              maxlength="40"
              :class="[
                'w-full rounded-2xl border bg-white px-4 py-3 text-sm text-stone-900 outline-none transition',
                formErrors.phone
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-stone-300 focus:border-stone-900',
              ]"
            />

            <p v-if="formErrors.phone" class="ml-3 mt-2 text-sm text-red-600">
              {{ formErrors.phone }}
            </p>
          </label>

          <label class="block">
            <span class="mb-2 block text-sm font-medium text-stone-700">Website</span>
            <input
              v-model="form.website"
              type="url"
              maxlength="120"
              :class="[
                'w-full rounded-2xl border bg-white px-4 py-3 text-sm text-stone-900 outline-none transition',
                formErrors.website
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-stone-300 focus:border-stone-900',
              ]"
            />

            <p v-if="formErrors.website" class="ml-3 mt-2 text-sm text-red-600">
              {{ formErrors.website }}
            </p>
          </label>
        </div>

        <label class="block">
          <span class="mb-2 block text-sm font-medium text-stone-700">Notes</span>
          <textarea
            v-model="form.notes"
            rows="4"
            maxlength="1000"
            :class="[
              'w-full rounded-2xl border bg-white px-4 py-3 text-sm text-stone-900 outline-none transition',
              formErrors.notes
                ? 'border-red-300 focus:border-red-500'
                : 'border-stone-300 focus:border-stone-900',
            ]"
          />

          <p v-if="formErrors.notes" class="ml-3 mt-2 text-sm text-red-600">
            {{ formErrors.notes }}
          </p>
        </label>

        <div
          v-if="submitError"
          class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {{ submitError }}
        </div>

        <div class="flex items-center justify-end gap-3">
          <button
            type="button"
            class="rounded-2xl px-4 py-3 text-sm font-medium text-stone-600 transition hover:bg-stone-100 hover:text-stone-900"
            @click="closeVendorForm"
          >
            Cancel
          </button>

          <button
            type="submit"
            :disabled="submitting"
            class="inline-flex items-center justify-center rounded-2xl bg-stone-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-400"
          >
            {{ submitting ? 'Saving...' : 'Save vendor' }}
          </button>
        </div>
      </form>
    </section>

    <section class="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
      <div v-if="loading" class="space-y-3">
        <div class="h-5 w-40 animate-pulse rounded bg-stone-200"></div>
        <div class="space-y-2">
          <div class="h-16 animate-pulse rounded-2xl bg-stone-100"></div>
          <div class="h-16 animate-pulse rounded-2xl bg-stone-100"></div>
          <div class="h-16 animate-pulse rounded-2xl bg-stone-100"></div>
        </div>
      </div>

      <div
        v-else-if="error"
        class="rounded-2xl border border-red-200 bg-red-50 px-4 py-5 text-sm text-red-700"
      >
        <p class="font-medium">Could not load vendors</p>
        <p class="mt-1">{{ error }}</p>
      </div>

      <div
        v-else-if="vendors.length === 0"
        class="rounded-2xl border border-dashed border-stone-200 bg-stone-50 px-5 py-12 text-center"
      >
        <p class="text-base font-medium text-stone-700">No vendors yet</p>
        <p class="mt-2 text-sm text-stone-500">
          Add your first vendor to start organizing expense records.
        </p>
      </div>

      <div v-else class="space-y-3">
        <article
          v-for="vendor in vendors"
          :key="vendor.id"
          class="rounded-2xl border border-stone-200 bg-stone-50 px-5 py-4 transition hover:border-stone-300 hover:bg-stone-100"
        >
          <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div class="min-w-0">
              <h3 class="text-base font-semibold tracking-tight text-stone-900">
                {{ vendor.name }}
              </h3>

              <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-stone-500">
                <span v-if="vendor.email">{{ vendor.email }}</span>
                <span v-if="vendor.phone">{{ vendor.phone }}</span>
                <a
                  v-if="vendor.website"
                  :href="vendor.website"
                  target="_blank"
                  rel="noopener"
                  class="font-medium text-stone-700 underline decoration-stone-300 underline-offset-4 hover:text-stone-900"
                >
                  Website
                </a>
              </div>

              <p v-if="vendor.notes" class="mt-3 text-sm leading-6 text-stone-600">
                {{ vendor.notes }}
              </p>
            </div>

            <div class="flex shrink-0 items-center gap-3">
              <button
                type="button"
                class="inline-flex items-center rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-600 transition hover:border-stone-300 hover:text-stone-900"
                @click="openEditForm(vendor)"
              >
                Edit
              </button>

              <span
                class="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-stone-500 ring-1 ring-stone-200"
              >
                Active
              </span>
            </div>
          </div>
        </article>
      </div>
    </section>
  </section>
</template>
