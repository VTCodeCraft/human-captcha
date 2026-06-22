import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";

/**
 * MediaPipe ships the WebAssembly runtime and the hand-landmark model as
 * separate assets. We pin both to the installed `@mediapipe/tasks-vision`
 * version via the jsDelivr CDN so the runtime and model stay in sync.
 */
const WASM_FILESET_PATH =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm";

const HAND_LANDMARKER_MODEL_PATH =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";

/**
 * Cached creation promise. We memoize the promise (not just the resolved
 * value) so concurrent callers during initialization all await the same
 * download instead of kicking off duplicate loads.
 */
let handLandmarkerPromise: Promise<HandLandmarker> | null = null;

async function createHandLandmarker(): Promise<HandLandmarker> {
  const fileset = await FilesetResolver.forVisionTasks(WASM_FILESET_PATH);

  return HandLandmarker.createFromOptions(fileset, {
    baseOptions: {
      modelAssetPath: HAND_LANDMARKER_MODEL_PATH,
      delegate: "GPU",
    },
    // Track up to two hands simultaneously.
    numHands: 2,
    runningMode: "VIDEO",
  });
}

/**
 * Returns the shared {@link HandLandmarker} singleton, creating it on first
 * call. Safe to call repeatedly; every caller receives the same instance.
 *
 * Must be invoked in the browser only (it loads WASM and a model over the
 * network), so call it from client-side effects rather than during SSR.
 */
export function getHandLandmarker(): Promise<HandLandmarker> {
  if (!handLandmarkerPromise) {
    handLandmarkerPromise = createHandLandmarker();
  }
  return handLandmarkerPromise;
}
