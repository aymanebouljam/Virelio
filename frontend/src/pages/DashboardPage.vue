<template>
  <section class="space-y-8">
    <header class="space-y-3">
      <p class="text-xs font-semibold uppercase tracking-[0.24em] text-stone-400">
        Dashboard
      </p>
      <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 class="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            Spending at a glance
          </h2>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-stone-500 sm:text-base">
            Keep an eye on vendor activity, uncategorized expenses, and incoming receipts as the app grows.
          </p>
        </div>

        <div class="rounded-2xl border border-stone-200 bg-white px-4 py-3 shadow-sm">
          <p class="text-xs font-medium uppercase tracking-[0.2em] text-stone-400">
            Current focus
          </p>
          <p class="mt-1 text-sm font-medium text-stone-700">
            Vendor and expense workflows
          </p>
        </div>
      </div>
    </header>

    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <article class="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
          Total spend
        </p>
        <p class="mt-4 text-3xl font-semibold tracking-tight text-stone-900">
          $0.00
        </p>
        <p class="mt-2 text-sm text-stone-500">
          Will update once expenses are recorded.
        </p>
      </article>

      <article class="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
          Active vendors
        </p>
        <p class="mt-4 text-3xl font-semibold tracking-tight text-stone-900">
          --
        </p>
        <p class="mt-2 text-sm text-stone-500">
          Visible vendors that can be linked to new expenses.
        </p>
      </article>

      <article class="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
          Uncategorized
        </p>
        <p class="mt-4 text-3xl font-semibold tracking-tight text-stone-900">
          --
        </p>
        <p class="mt-2 text-sm text-stone-500">
          Expenses waiting for category assignment.
        </p>
      </article>

      <article class="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-[0.22em] text-stone-400">
          Receipts
        </p>
        <p class="mt-4 text-3xl font-semibold tracking-tight text-stone-900">
          --
        </p>
        <p class="mt-2 text-sm text-stone-500">
          Upload support will surface recent documents here.
        </p>
      </article>
    </div>

    <div class="grid gap-6 xl:grid-cols-[1.25fr_0.85fr]">
      <section class="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="text-lg font-semibold tracking-tight text-stone-900">
              Recent activity
            </h3>
            <p class="mt-1 text-sm text-stone-500">
              This area can later show the latest expenses, vendor changes, and receipt uploads.
            </p>
          </div>
        </div>

        <div class="mt-6 rounded-2xl border border-dashed border-stone-200 bg-stone-50 px-5 py-10 text-center">
          <p class="text-sm font-medium text-stone-600">
            No activity yet
          </p>
          <p class="mt-2 text-sm text-stone-500">
            Start by creating vendors and expenses to populate the dashboard.
          </p>
        </div>
      </section>

      <section class="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <h3 class="text-lg font-semibold tracking-tight text-stone-900">
          Next build steps
        </h3>
        <ul class="mt-5 space-y-3 text-sm text-stone-600">
          <li class="rounded-2xl bg-stone-50 px-4 py-3">
            Finish vendor management UI
          </li>
          <li class="rounded-2xl bg-stone-50 px-4 py-3">
            Add expense categories
          </li>
          <li class="rounded-2xl bg-stone-50 px-4 py-3">
            Build the expense creation flow
          </li>
        </ul>
      </section>
    </div>
  </section>
</template>