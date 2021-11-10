import {
  onMounted,
  ref,
  watch,
} from '@nuxtjs/composition-api'
import debounce from 'lodash/debounce'
// @ts-ignore
import ToxicityModelWorker from './worker/toxicity-model.worker.js';


type Prediction = {
  label: string
  results: {
    probabilities: Float32Array
    match: boolean
  }[]
}

export function useIsTextMean(){
  const message = ref('');
  const sentiment = ref<Prediction[]>([])
  
  const worker = ref<Worker | undefined>(undefined)
  const isProcessing = ref(false);
  onMounted(() => {
    const w = new ToxicityModelWorker() as Worker;
    worker.value = w;
  
    w.onmessage = (e)=>{
      sentiment.value = e.data;
      isProcessing.value = false;
    }
  })
  watch(
    message,
    debounce((messageText) => {
      worker.value?.postMessage(messageText)
      isProcessing.value = true;
    }, 500)
  )
  return {
    message,
    sentiment,
    isProcessing,
  }
}