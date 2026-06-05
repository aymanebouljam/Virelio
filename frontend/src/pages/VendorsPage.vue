<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchVendors } from '@/lib/api'

type Vendor = {
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

const vendors = ref<Vendor[]>([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    vendors.value = await fetchVendors()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error'
  } finally {
    loading.value = false
  }
})
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

        <button
          type="button"
          class="inline-flex items-center justify-center rounded-2xl bg-stone-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-stone-700"
        >
          Add vendor
        </button>
      </div>
    </header>

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

            <div class="shrink-0">
              <span
                class="inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-stone-500 ring-1 ring-stone-200"
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
