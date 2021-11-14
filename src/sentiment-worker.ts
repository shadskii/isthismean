import "@tensorflow/tfjs";
import * as toxicity from "@tensorflow-models/toxicity";
import "@tensorflow/tfjs-backend-webgl";
import { ToxicityClassifier } from "@tensorflow-models/toxicity";

// remove after upgrade to typescript 4.5
type Awaited<T> = T extends PromiseLike<infer U> ? U : T;

export type Prediction = Awaited<ReturnType<ToxicityClassifier["classify"]>>;

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
