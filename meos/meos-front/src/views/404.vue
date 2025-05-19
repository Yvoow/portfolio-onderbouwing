<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
<template>
  <main class="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
    <div class="max-w-md w-full text-center">
      <div class="space-y-8">
        <div class="flex justify-center">
          <div class="relative">
            <div class="text-9xl font-bold text-primary/20 dark:text-primary/10">404</div>
            <div class="absolute inset-0 flex items-center justify-center">
              <i class="fas fa-search text-4xl text-primary/60 rotate-12"></i>
            </div>
          </div>
        </div>

        <div>
          <h1 class="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">{{ t('Page not found') }}</h1>
          <p class="mt-4 text-base leading-7 text-gray-600 dark:text-gray-400">{{ t('Something went wrong, the page you are trying to visit does not exist anymore.') }}</p>
        </div>

        <div>
          <RouterLink
            :to="{ name: 'dashboard.home' }"
            class="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
          >
            <i class="fas fa-home mr-2"></i>
            {{ t('Back to dashboard') }}
          </RouterLink>
        </div>
      </div>
    </div>
  </main>
</template>
