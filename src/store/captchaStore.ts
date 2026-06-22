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
  /** Tiles in solved order (index === correctIndex). */
  tiles: Tile[];
  /** Tiles in their current board order; slot `i` shows `shuffledTiles[i]`. */
  shuffledTiles: Tile[];
  /** Board slot of the piece currently grabbed by a pinch, or null. */
  draggingSlot: number | null;
}

interface CaptchaActions {
  setState: (state: CaptchaState) => void;
  setRegion: (region: Region | null) => void;
  setCaptured: (image: CapturedImage) => void;
  setPuzzle: (tiles: Tile[], shuffledTiles: Tile[]) => void;
  /** Grabs the piece in the given slot (pinch down). */
  grabSlot: (slot: number) => void;
  /** Drops the grabbed piece on the given slot, swapping the two (pinch up). */
  dropSlot: (slot: number) => void;
  clearDragging: () => void;
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
  draggingSlot: null,
};

export const useCaptchaStore = create<CaptchaStore>((set) => ({
  ...initialData,

  setState: (state) => set({ state }),

  setRegion: (region) => set({ region }),

  setCaptured: (capturedImage) => set({ capturedImage }),

  setPuzzle: (tiles, shuffledTiles) =>
    set({ tiles, shuffledTiles, draggingSlot: null }),

  grabSlot: (slot) =>
    set((state) => (state.shuffledTiles[slot] ? { draggingSlot: slot } : {})),

  dropSlot: (slot) =>
    set((state) => {
      const from = state.draggingSlot;
      if (from === null || from === slot) return { draggingSlot: null };

      const next = [...state.shuffledTiles];
      [next[from], next[slot]] = [next[slot], next[from]];
      return { shuffledTiles: next, draggingSlot: null };
    }),

  clearDragging: () => set({ draggingSlot: null }),

  reset: () => set({ ...initialData }),
}));
