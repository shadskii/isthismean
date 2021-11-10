<template>
  <div class="container">
    <h2 class="emoji">🙂</h2>
    <textarea rows="5" cols="33" />
  </div>
</template>

<script setup lang="ts">
import { useWebWorkerFn } from '@vueuse/core'
import { ref, watch } from "vue";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as tfjs from '@tensorflow/tfjs'
import * as toxicity from '@tensorflow-models/toxicity'
import '@tensorflow/tfjs-backend-webgl'
import { debounce } from 'lodash';

type Prediction = {
  label: string
  results: {
    probabilities: Float32Array
    match: boolean
  }[]
}

const { workerFn } = useWebWorkerFn(async (e) => {
  const threshold = 0.8

  const classifier = await toxicity.load(threshold, []);
  const predictions = await classifier.classify([e.data])
  return predictions;

})

const message = ref('');
const sentiment = ref<Prediction[]>([])

const isProcessing = ref(false);
watch(
  message,
  debounce(async (messageText) => {
    isProcessing.value = true;
    sentiment.value = await workerFn(messageText)
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