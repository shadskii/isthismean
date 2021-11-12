import "@tensorflow/tfjs";
import * as toxicity from "@tensorflow-models/toxicity";
// import "@tensorflow/tfjs-backend-webgl";
import { ToxicityClassifier } from "@tensorflow-models/toxicity";

const scope = self as unknown as Worker;

const threshold = 0.8;

let cachedClassifier: undefined | ToxicityClassifier;

/**
 * Creates a classifier, unless one already exists, then the cached version is returned.
 *
 * @returns A classifier
 */
async function loadClassifier(): Promise<ToxicityClassifier> {
  if (cachedClassifier) {
    return cachedClassifier;
  }
  cachedClassifier = await toxicity.load(threshold, []);
  return cachedClassifier;
}

scope.addEventListener("message", async (ev) => {
  try {
    const classifier = await loadClassifier();
    const predictions = await classifier.classify([ev.data]);

    scope.postMessage(predictions);
  } catch (e) {
    console.error(e);
  }
});
