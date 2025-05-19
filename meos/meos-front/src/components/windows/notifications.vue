<script setup lang="ts">
import { ref, Ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

</script>
<template>
  <div class="fixed inset-0 z-[100] pointer-events-none select-none" aria-hidden="true">
    <div class="absolute inset-0 flex items-end pointer-events-none p-4 sm:items-start sm:justify-end">
      <div class="w-full flex flex-col-reverse items-center sm:items-end sm:max-w-sm">
        <transition-group
          name="notification"
          tag="div"
          class="space-y-4 w-full"
        >
          <div
            v-for="notification in store.getters['notification/all']"
            :key="notification.id"
            class="w-full backdrop-blur-sm dark:bg-secondary-dark/90 bg-white/90 shadow-card border dark:border-tertiary-dark border-tertiary-light rounded-lg pointer-events-auto overflow-hidden"
          >
            <div class="p-4">
              <div class="flex items-start">
                <div class="flex-shrink-0">
                  <i
                    v-if="notification.type === 'success'"
                    class="fas fa-circle-check text-success text-lg"
                  ></i>
                  <i
                    v-else-if="notification.type === 'error'"
                    class="fas fa-circle-xmark text-danger text-lg"
                  ></i>
                  <i
                    v-else-if="notification.type === 'warning'"
                    class="fas fa-triangle-exclamation text-warning text-lg"
                  ></i>
                  <i
                    v-else
                    class="fas fa-circle-info text-info text-lg"
                  ></i>
                </div>
                <div class="ml-3 flex-1">
                  <p
                    v-if="notification.message && notification.message.length"
                    class="text-sm dark:text-text-dark text-text-light first-letter:uppercase"
                    v-html="notification.message"
                  ></p>
                </div>
                <div class="ml-4 flex-shrink-0 flex">
                  <button
                    @click="store.dispatch('notification/hide', notification.id)"
                    type="button"
                    class="inline-flex rounded-md dark:text-text-dark-tertiary text-text-light-tertiary hover:dark:text-text-dark hover:text-text-light focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                  >
                    <span class="sr-only" v-t="'Close'"></span>
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}
.notification-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.notification-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
