import { createStore } from "zustand/vanilla";
import { features } from "../features";
import type { SceneMotion } from "../types";

export type ProductState = SceneMotion & {
  reduced: boolean;
  supported: boolean | null;
  loaded: boolean;
  sceneFailed: boolean;
};

type ProductActions = {
  setPhase: (phase: number) => void;
  setPointer: (pointerX: number, pointerY: number) => void;
  rotateView: (direction: number) => void;
  resetView: () => void;
  setCapabilities: (supported: boolean, reduced: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
  markLoaded: () => void;
  markSceneFailed: () => void;
};

export type ProductStore = ProductState & ProductActions;

// Each page instance gets its own store, with matching server/client defaults.
export function createProductStore() {
  return createStore<ProductStore>()((set) => ({
    phase: 0,
    pointerX: 0,
    pointerY: 0,
    reset: 0,
    reduced: false,
    supported: null,
    loaded: false,
    sceneFailed: false,
    setPhase: (phase) => set({ phase: Math.min(7, Math.max(0, phase)) }),
    setPointer: (pointerX, pointerY) => set({ pointerX, pointerY }),
    rotateView: (direction) => set((state) => ({ pointerX: state.pointerX + direction * 0.4 })),
    resetView: () => set((state) => ({ reset: state.reset + 1, pointerX: 0, pointerY: 0 })),
    setCapabilities: (supported, reduced) => set({ supported, reduced }),
    setReducedMotion: (reduced) => set({ reduced }),
    markLoaded: () => set({ loaded: true }),
    markSceneFailed: () => set({ sceneFailed: true }),
  }));
}

export const selectAvailable = (state: ProductStore) =>
  state.sceneFailed ? false : state.supported;
export const selectActiveFeature = (state: ProductStore) =>
  Math.min(features.length - 1, Math.max(0, Math.round(state.phase - 2)));
export const selectIsExploring = (state: ProductStore) => state.phase >= 5.65 && state.phase < 6.65;
export const selectNavigationVisible = (state: ProductStore) =>
  state.phase > 1.55 && state.phase < 5.6;
export const selectCalloutVisible = (state: ProductStore) =>
  Boolean(selectAvailable(state) && state.loaded && state.phase > 1.65 && state.phase < 5.55);
