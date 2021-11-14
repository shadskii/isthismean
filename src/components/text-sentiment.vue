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

const toxics = ref([
  "threatening language",
  'insults',
  'obscenities',
  'identity-based hate',
  'sexually explicit'
])

</script>
<template>
  <div class="container">
    <h2 class="emoji">{{ emoji }}</h2>
    <div class="badge-container">
      <span v-for="badge in badges" :key="badge" class="badge">{{ badge }}</span>
    </div>
    <textarea class="text-input" v-model="message" rows="5" />
    <p>Write me a message and I'll tell you if it's mean.</p>
    <div>
      <p>Use machine learning to detect toxic text. This site can detect if text contains toxic content such as:</p>
      <div class="badge-container">
        <span v-for="badge in toxics" :key="badge" class="badge">{{ badge }}</span>
      </div>

      <details class="tech-details">
        <summary>Technical Details</summary>
        <h3>ML Model</h3>
        <p>
          Under the hood this site uses a pretrained Tensorflow text toxicity model. This model was trained on the
          <a
            href="https://figshare.com/articles/data_json/7376747"
          >civil comments dataset</a>, a collection of ~2 million comments labeled for toxicity. The comments are user-generated online news comments published from 2015-2017 as part of a now-defunct commenting platform.
        </p>
        <h3>Web Dev Technicals</h3>
        <p>
          This site uses tensorflow.js and it's WebGL backend to perform ML inferences in the browser. This model is published on npm as
          <code>@tensorflow-models/toxicity</code>.
        </p>
        <p>In order to keep the UI responsive, inferences are performed off the main thread on a background thread using the Web Workers API.</p>

        <h3>Dev Stack</h3>
        <p>isthismean is written in typescript using vue.js 3 and bundled with vite.js. The site is hosted on netlify.</p>
        <p>
          Learn more about this project by viewing the source code on
          <a
            href="https://github.com/shadskii/isthismean"
          >Github</a>.
        </p>
      </details>
    </div>
  </div>
</template>

<style>
.container {
  display: flex;
  flex-direction: column;
  text-align: start;
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
.tech-details summary:hover {
  cursor: pointer;
}
.tech-details {
  margin: 2rem 0;
}
</style>