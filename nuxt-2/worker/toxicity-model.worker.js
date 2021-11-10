
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as tfjs from '@tensorflow/tfjs'
import * as toxicity from '@tensorflow-models/toxicity'
import '@tensorflow/tfjs-backend-webgl'

onmessage = (e) =>{

  const threshold = 0.8
  toxicity.load(threshold, []).then((model) => {
    model.classify([e.data]).then((predictions) => {
      postMessage(predictions);
    })
  }) 

}
