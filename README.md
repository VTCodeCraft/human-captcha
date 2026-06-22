# HumanCaptcha

> CAPTCHA, reinvented — verify humans using computer vision, hand gestures, and puzzle solving instead of distorted text.

HumanCaptcha is a gesture-based CAPTCHA proof-of-concept. Instead of typing warped characters or clicking traffic lights, a user proves they're human by using their **hands in front of a webcam**: they frame a region of the live video with two fingers, the captured image is sliced into a shuffled puzzle, and they solve it by grabbing and dropping tiles with their hand — all tracked in real time via [MediaPipe](https://developers.google.com/mediapipe).

The repository is both a working interactive demo and a marketing/landing site for the concept.

## How it works

Verification is a linear state machine (`src/types/captcha.ts`):

```
CAMERA → SELECTING_REGION → CAPTURING → PUZZLE_READY
       → TRACKING → VALIDATING → SUCCESS | FAIL
```

1. **CAMERA** — The webcam streams with hand landmarks drawn on top. The flow waits for two hands.
2. **SELECTING_REGION** — Both index fingertips define the opposite corners of a rectangle. The user holds it steady.
3. **CAPTURING** — Once the rectangle stays within a small movement threshold for ~1 second, the framed region is frozen into an image.
4. **PUZZLE_READY** — The captured image is sliced into a 3×3 grid and shuffled.
5. **TRACKING** — The right hand acts as a cursor. Making a **fist grabs** the tile under the cursor; **opening the hand drops** it, swapping two tiles.
6. **VALIDATING → SUCCESS** — When every tile is back in its correct slot, the user is verified as human.

The gesture detection is fully scale-invariant (fist "openness" is normalized against each finger's own knuckle distance), so it works regardless of how close the hand is to the camera.

## Tech stack

| Area | Technology |
| --- | --- |
| Framework | [Next.js](https://nextjs.org) 16 (App Router) |
| UI | React 19, TypeScript |
| Styling | Tailwind CSS v4, `tw-animate-css` |
| Components | Radix UI, shadcn, lucide-react |
| Animation | Framer Motion |
| State | Zustand |
| Computer vision | `@mediapipe/tasks-vision` (HandLandmarker) |

## Getting started

### Prerequisites

- Node.js 20+
- A webcam and a browser with camera permission (the demo requires `getUserMedia`)

### Install & run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and allow camera access when prompted. Click the "I'm human" checkbox in the **Live demo** section to start a verification.

> The MediaPipe WASM runtime and hand-landmark model are loaded at runtime from the jsDelivr / Google Storage CDNs, so an internet connection is required on first use.

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Project structure

```
src/
├── app/                 # Next.js App Router: layout, page, global styles
├── components/          # UI + verification components
│   ├── CameraFeed.tsx       # Orchestrates the full state machine
│   ├── PuzzleBoard.tsx      # Renders the shuffled tile grid
│   ├── HandLandmarks.tsx    # Draws detected hand skeletons
│   ├── FingerCursor.tsx     # Hand-driven cursor overlay
│   ├── site/                # Landing-page building blocks
│   └── ...                  # Hero, Features, Pricing, FAQ, SDK, etc.
├── hooks/
│   ├── useCamera.ts         # Webcam stream lifecycle
│   ├── useHandTracking.ts   # MediaPipe detection loop (up to 2 hands)
│   ├── useFingerTracking.ts # Smoothed fingertip → pixel position
│   ├── useFistDetection.ts  # Fist (grab) gesture with hysteresis
│   ├── useRegionSelection.ts# Two-finger rectangle + hold detection
│   └── usePuzzle.ts         # Capture → slice → shuffle
├── lib/
│   ├── mediapipe.ts         # Shared HandLandmarker singleton
│   ├── sliceImage.ts        # Slice captured frame into a 3×3 grid
│   ├── shuffleTiles.ts      # Tile shuffling
│   └── captureRegion.ts     # Crop a normalized region from a video frame
├── store/
│   └── captchaStore.ts      # Zustand state machine store
├── types/                   # Shared domain types (captcha, puzzle, hand)
└── constants/               # Repo links, etc.
```

## SDK concept

The landing page documents a proposed drop-in component API. This is a design target (not yet a published package):

```tsx
interface HumanCaptchaProps {
  siteKey: string;
  difficulty?: "easy" | "medium" | "hard"; // 2×2, 3×3 or 4×4
  theme?: "dark" | "light";
  onSuccess?: (token: string) => void;
  onError?: (error: Error) => void;
  onExpired?: () => void;
  size?: "compact" | "normal";
  cameraFacing?: "user" | "environment";
  modal?: boolean;
  language?: string;
}
```

## Privacy

All hand tracking and image processing happens **client-side in the browser**. The captured region is used only to build the puzzle and is not uploaded anywhere by the demo.

## License

See the project repository for license details.
