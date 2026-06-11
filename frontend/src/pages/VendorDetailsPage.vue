<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, RouterLink, useRouter } from 'vue-router'
import { fetchVendor, archiveVendor } from '@/lib/vendors/api'
import { ApiError } from '@/lib/api'
import { vendorSchema, type Vendor } from '@/lib/vendors/schema'

const route = useRoute()
const router = useRouter()

const vendorId = computed(() => String(route.params.id))
const vendor = ref<Vendor | null>(null)
const loading = ref(true)
const error = ref('')
const actionError = ref('')
const archiving = ref(false)

async function loadVendor() {
  try {
    error.value = ''
    const result = vendorSchema.safeParse(await fetchVendor(vendorId.value))
    if (!result.success) {
      error.value = 'Failed to fetch vendor details'
      return
    }
    vendor.value = result.data
  } catch (err) {
    error.value = err instanceof ApiError ? err.message : 'Something went wrong'
  } finally {
    loading.value = false
  }
}

async function archiveCurrentVendor() {
  if (!vendor.value) {
    return
  }

  actionError.value = ''
  archiving.value = true

  try {
    if (!confirm('Are you sure you want to archive this vendor?')) {
      return
    }

    await archiveVendor(vendor.value.id)
    vendor.value = null
    await router.push({ name: 'vendorsArchived' })
  } catch (err) {
    actionError.value = err instanceof ApiError ? err.message : 'Archiving vendor failed'
  } finally {
    archiving.value = false
  }
}

onMounted(loadVendor)
watch(vendorId, () => {
  vendor.value = null
  error.value = ''
  loading.value = true
  void loadVendor()
})
</script>

<template>
  <section class="space-y-8">
    <header class="space-y-3">
      <div class="flex items-center gap-3 text-sm text-stone-500">
        <RouterLink class="transition hover:text-stone-900" to="/vendors">Vendors</RouterLink>
        <span>/</span>
        <span class="text-stone-700">Details</span>
      </div>

      <div v-if="loading" class="space-y-3">
        <div class="h-8 w-56 animate-pulse rounded bg-stone-200"></div>
        <div class="h-4 w-72 animate-pulse rounded bg-stone-100"></div>
      </div>

      <div
        v-else-if="vendor"
        class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
      >
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">Vendor</p>
          <h2 class="mt-2 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            {{ vendor.name }}
          </h2>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-stone-500 sm:text-base">
            Review vendor contact information and related notes before linking expenses.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <RouterLink
            to="/vendors"
            class="inline-flex items-center rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-600 transition hover:border-stone-300 hover:text-stone-900"
          >
            Back to list
          </RouterLink>

          <button
            type="button"
            :disabled="archiving"
            class="inline-flex items-center rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-700 transition hover:border-red-300 hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-60"
            @click="archiveCurrentVendor"
          >
            {{ archiving ? 'Archiving...' : 'Archive' }}
          </button>
        </div>
      </div>
    </header>

    <div
      v-if="actionError"
      class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ actionError }}
    </div>

    <section v-if="loading" class="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
      <div class="grid gap-6 sm:grid-cols-2">
        <div class="space-y-3">
          <div class="h-4 w-24 animate-pulse rounded bg-stone-200"></div>
          <div class="h-5 w-48 animate-pulse rounded bg-stone-100"></div>
        </div>
        <div class="space-y-3">
          <div class="h-4 w-24 animate-pulse rounded bg-stone-200"></div>
          <div class="h-5 w-48 animate-pulse rounded bg-stone-100"></div>
        </div>
      </div>
    </section>

    <div
      v-else-if="error"
      class="rounded-2xl border border-red-200 bg-red-50 px-4 py-5 text-sm text-red-700"
    >
      <p class="font-medium">Could not load vendor</p>
      <p class="mt-1">{{ error }}</p>
    </div>

    <div
      v-else-if="!vendor"
      class="rounded-2xl border border-dashed border-stone-200 bg-stone-50 px-5 py-12 text-center"
    >
      <p class="text-base font-medium text-stone-700">Vendor not available</p>
      <p class="mt-2 text-sm text-stone-500">
        This vendor may have been archived or is no longer available from the active list.
      </p>
    </div>

    <section v-else class="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div class="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <h3 class="text-lg font-semibold tracking-tight text-stone-900">Contact details</h3>

        <dl class="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <dt class="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Email</dt>
            <dd class="mt-2 text-sm text-stone-700">
              {{ vendor.email || 'Not provided' }}
            </dd>
          </div>

          <div>
            <dt class="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Phone</dt>
            <dd class="mt-2 text-sm text-stone-700">
              {{ vendor.phone || 'Not provided' }}
            </dd>
          </div>

          <div class="sm:col-span-2">
            <dt class="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Website</dt>
            <dd class="mt-2 text-sm text-stone-700">
              <a
                v-if="vendor.website"
                :href="vendor.website"
                target="_blank"
                rel="noopener"
                class="font-medium text-stone-700 underline decoration-stone-300 underline-offset-4 hover:text-stone-900"
              >
                {{ vendor.website }}
              </a>
              <span v-else>Not provided</span>
            </dd>
          </div>
        </dl>
      </div>

      <div class="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <h3 class="text-lg font-semibold tracking-tight text-stone-900">Notes and activity</h3>

        <div class="mt-6 space-y-5">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Notes</p>
            <p class="mt-2 text-sm leading-6 text-stone-700">
              {{ vendor.notes || 'No notes added for this vendor.' }}
            </p>
          </div>

          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">Created</p>
              <p class="mt-2 text-sm text-stone-700">
                {{ new Date(vendor.createdAt).toLocaleString() }}
              </p>
            </div>

            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
                Last Update
              </p>
              <p class="mt-2 text-sm text-stone-700">
                {{ new Date(vendor.updatedAt).toLocaleString() }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>
