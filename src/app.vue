<script setup lang="ts">
import TextSentiment from './components/text-sentiment.vue';

</script>

<template>
  <TextSentiment />
</template>

<style>
:root {
  --bg-color: #2c3e50;
  --font-color: #e2e8f0;
}
#app {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--font-color);
}
html {
  background: var(--bg-color);
}
</style>
