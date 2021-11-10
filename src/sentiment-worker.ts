import "@tensorflow/tfjs";
import * as toxicity from "@tensorflow-models/toxicity";
import "@tensorflow/tfjs-backend-webgl";

const scope = self as unknown as Worker;

scope.addEventListener("message", async (ev) => {
  const threshold = 0.8;

  const classifier = await toxicity.load(threshold, []);
  const predictions = await classifier.classify([ev.data]);
  console.log(predictions);
  scope.postMessage(predictions);
});
