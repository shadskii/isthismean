<template>
  <div class="container">
    <CBox v-bind="mainStyles[colorMode]" w="100vw" h="100vh">
      <CFlex
        justify="space-between"
        direction="row"
        align="center"
        px="3"
        pt="3"
      >
        <CHeading> Is this mean? </CHeading>
        <CIconButton
          :icon="colorMode === 'light' ? 'moon' : 'sun'"
          :aria-label="`Switch to ${
            colorMode === 'light' ? 'dark' : 'light'
          } mode`"
          @click="toggleColorMode"
        />
      </CFlex>

      <CHeading text-align="center" class="emoji">{{ emoji }}</CHeading>
      <CFlex justify="center" direction="row" align="center" h="50px">
        <CBadge v-for="badge in badges" :key="badge" mx="1">
          {{ badge }}
        </CBadge>
      </CFlex>
      <CFlex justify="center" direction="column" align="center">
        <CBox
          mb="3"
          :width="[
            '80%', // base
            '50%', // 480px upwards
            '25%', // 768px upwards
            '15%', // 992px upwards
          ]"
        >
          <CText font-size="sm" mb="4">
            Write me a message and I'll tell you if I think it's mean.
          </CText>
          <CTextarea v-model="message" h="50px"> </CTextarea>
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
  CText,
  CHeading,
} from '@chakra-ui/vue'
import { computed, defineComponent, inject, ref } from '@nuxtjs/composition-api'
import '@tensorflow/tfjs-backend-webgl'

import { useIsTextMean } from '~/models'

export default defineComponent({
  name: 'App',
  components: {
    CTextarea,
    CBadge,
    CBox,
    CIconButton,
    CFlex,
    CHeading,
    CText,
  },
  setup() {
    const chakraColorMode = inject('$chakraColorMode') as () => string
    const toggleColorMode = inject('$toggleColorMode')
    const colorMode = computed(() => {
      return chakraColorMode()
    })
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

    const { message, sentiment, isProcessing } = useIsTextMean()

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
      if (isProcessing.value) {
        return '🤔'
      }
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
  font-size: 12em;
}
</style>