<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { debounce, startCase } from 'lodash'
import SentimentWorker from '../sentiment-worker.ts?worker'
import { Prediction } from "../sentiment-worker";


const sentimentWorker = new SentimentWorker();

const message = ref('');
const sentiment = ref<Prediction>([])

const requests = ref(0);
const isProcessing = computed(() => {
  return requests.value > 0;
});

sentimentWorker.onmessage = (e) => {
  sentiment.value = e.data;
  requests.value -= 1;
}

watch(
  message,
  debounce((messageText) => {
    requests.value += 1;
    sentimentWorker.postMessage(messageText);
  }, 500)
)

const badges = computed(() => {
  return sentiment.value
    .filter((sentiment) => {
      return sentiment.results[0].match !== false
    })
    .map((sentiment) => {
      return startCase(sentiment.label.replaceAll('_', ' '))
    })
})

const emoji = computed(() => {
  if (isProcessing.value) {
    return '🤔'
  }
  if (badges.value.length === 0) {
    return '🙂'
  }
  return '😡'
})

</script>

<template>
  <div class="container">
    <h2 class="emoji">{{ emoji }}</h2>
    <div class="badge-container">
      <span v-for="badge in badges" :key="badge" class="badge">{{ badge }}</span>
    </div>
    <textarea class="text-input" v-model="message" rows="5" />
    <p>Write me a message and I'll tell you if I think it's mean.</p>
  </div>
</template>

<style>
.container {
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  max-width: 40rem;
  margin: 0 auto;
  padding: 0 1rem;
}
.emoji {
  font-size: 8rem;
  margin: 0;
  text-align: center;
}
.badge-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0.5rem 0;
  min-height: 1.5rem;
}
.badge-container .badge {
  display: inline-block;
  height: 1.25rem;
  margin: 0.25rem 0.5rem;
  padding: 0 0.5rem;
  border-radius: 0.25rem;
  background-color: #c70f2b73;
}
.text-input {
  flex: 1;
  display: flex;
  align-items: center;
  transition: all 0.2s ease 0s;
  outline: none;
  appearance: none;
  font-size: 1rem;
  padding: 8px 1rem;
  line-height: 1.25;
  border-radius: 0.25rem;
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.04);
  background-color: rgba(255, 255, 255, 0.06);
  color: var(--font-color);
  font-family: inherit;
  width: 100%;
}
.text-input:focus {
  border-color: white;
}
</style>