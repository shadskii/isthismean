<template>
  <div class="container">
    <CBox
      v-bind="mainStyles[colorMode]"
      d="flex"
      w="100vw"
      h="100vh"
      flex-dir="column"
      justify-content="center"
    >
      <CHeading text-align="center" mb="4" class="emoji">{{ emoji }}</CHeading>
      <CFlex justify="center" direction="column" align="center">
        <CBadge v-for="badge in badges" :key="badge">
          {{ badge }}
        </CBadge>
      </CFlex>
      <CFlex justify="center" direction="column" align="center">
        <CBox mb="3">
          <CIconButton
            mr="3"
            :icon="colorMode === 'light' ? 'moon' : 'sun'"
            :aria-label="`Switch to ${
              colorMode === 'light' ? 'dark' : 'light'
            } mode`"
            @click="toggleColorMode"
          />

          <CTextarea v-model="message"> </CTextarea>
        </CBox>
      </CFlex>
    </CBox>
  </div>
</template>

<script lang="ts">
import {
  CBox,
  CTextarea,
  CBadge,
  CIconButton,
  CFlex,
  CHeading,
} from '@chakra-ui/vue'
import {
  computed,
  defineComponent,
  inject,
  ref,
  watch,
} from '@nuxtjs/composition-api'
import * as tfjs from '@tensorflow/tfjs'
import * as toxicity from '@tensorflow-models/toxicity'
import debounce from 'lodash/debounce'

type Prediction = {
  label: string
  results: {
    probabilities: Float32Array
    match: boolean
  }[]
}

export default defineComponent({
  name: 'App',
  components: {
    CTextarea,
    CBadge,
    CBox,
    CIconButton,
    CFlex,
    CHeading,
  },
  setup() {
    const chakraColorMode = inject('$chakraColorMode') as () => string
    const toggleColorMode = inject('$toggleColorMode')
    const colorMode = computed(() => {
      return chakraColorMode()
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const backend = tfjs.getBackend()
    const mainStyles = ref({
      dark: {
        bg: 'gray.700',
        color: 'whiteAlpha.900',
      },
      light: {
        bg: 'white',
        color: 'gray.900',
      },
    })

    const message = ref('')
    const sentiment = ref<Prediction[]>([])

    watch(
      message,
      debounce((messageText) => {
        const threshold = 0.8

        toxicity.load(threshold).then((model) => {
          const sentences = [messageText]

          model.classify(sentences).then((predictions: unknown) => {
            sentiment.value = predictions as Prediction[]
          })
        })
      }, 200)
    )

    const badges = computed(() => {
      return sentiment.value
        .filter((sentiment) => {
          return sentiment.results[0].match !== false
        })
        .map((sentiment) => {
          return sentiment.label
        })
    })

    const emoji = computed(() => {
      if (badges.value.length === 0) {
        return '🙂'
      }
      return '😡'
    })
    return {
      message,
      mainStyles,
      emoji,
      colorMode,
      sentiment,
      toggleColorMode,
      badges,
    }
  },
})
</script>
<style scoped>
.emoji {
  font-size: 10em;
}
</style>