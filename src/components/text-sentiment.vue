<template>
  <div class="container">
    <h2 class="emoji">🙂</h2>
    <textarea v-model="message" rows="5" cols="33" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { debounce } from 'lodash'
import SentimentWorker from '../sentiment-worker.ts?worker'

type Prediction = {
  label: string
  results: {
    probabilities: Float32Array
    match: boolean
  }[]
}

const sentimentWorker = new SentimentWorker();

const message = ref('');
const sentiment = ref<Prediction[]>([])

const isProcessing = ref(false);

sentimentWorker.onmessage = (e) => {
  sentiment.value = e.data;
  isProcessing.value = false;
}

watch(
  message,
  debounce((messageText) => {
    isProcessing.value = true;
    sentimentWorker.postMessage(messageText);
  }, 500)
)

</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
}
.emoji {
  font-size: 10rem;
  margin: 0;
  text-align: center;
}
</style>