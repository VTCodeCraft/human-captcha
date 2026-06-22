import { create } from "zustand";

import { CaptchaState, type Region } from "@/types/captcha";
import type { CapturedImage, Tile } from "@/types/puzzle";

interface CaptchaData {
  /** Current state-machine state. */
  state: CaptchaState;
  /** The selected region (normalized), set once it holds steady. */
  region: Region | null;
  /** The frozen frame captured from the region. */
  capturedImage: CapturedImage | null;
  /** Tiles in solved order. */
  tiles: Tile[];
  /** Tiles in shuffled (display) order. */
  shuffledTiles: Tile[];
  /** Expected path of tile ids to trace. */
  challenge: number[];
  /** Tile ids the cursor has visited, de-duplicated for consecutive repeats. */
  visitedTiles: number[];
}

interface CaptchaActions {
  setState: (state: CaptchaState) => void;
  setRegion: (region: Region | null) => void;
  setCaptured: (image: CapturedImage) => void;
  setPuzzle: (tiles: Tile[], shuffledTiles: Tile[], challenge: number[]) => void;
  /** Records a visited tile, ignoring consecutive duplicates. */
  visitTile: (id: number) => void;
  /** Resets everything back to the initial CAMERA state. */
  reset: () => void;
}

export type CaptchaStore = CaptchaData & CaptchaActions;

const initialData: CaptchaData = {
  state: CaptchaState.CAMERA,
  region: null,
  capturedImage: null,
  tiles: [],
  shuffledTiles: [],
  challenge: [],
  visitedTiles: [],
};

export const useCaptchaStore = create<CaptchaStore>((set) => ({
  ...initialData,

  setState: (state) => set({ state }),

  setRegion: (region) => set({ region }),

  setCaptured: (capturedImage) => set({ capturedImage }),

  setPuzzle: (tiles, shuffledTiles, challenge) =>
    set({ tiles, shuffledTiles, challenge, visitedTiles: [] }),

  visitTile: (id) =>
    set((state) => {
      const last = state.visitedTiles[state.visitedTiles.length - 1];
      if (last === id) return state; // de-dupe consecutive repeats
      return { visitedTiles: [...state.visitedTiles, id] };
    }),

  reset: () => set({ ...initialData }),
}));
