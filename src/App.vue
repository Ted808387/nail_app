<template>
  <Navbar />
  <router-view />
  <Notification :message="notification.message" :type="notification.type" :duration="notification.duration" />
</template>

<script setup>
import Navbar from './components/Navbar.vue';
import Notification from './components/Notification.vue'; // 引入 Notification 組件
import { useNotification } from './composables/useNotification'; // 引入 useNotification

const notification = useNotification(); // 使用組合式函數
</script>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
