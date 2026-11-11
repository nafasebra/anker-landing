import { createStore } from "zustand/vanilla";
import { features } from "../features";
import type { SceneMotion } from "../types";

export type ProductState = SceneMotion & {
  reduced: boolean;
  supported: boolean | null;
  loaded: boolean;
  revealed: boolean;
  sceneFailed: boolean;
  maxDpr: number;
};

type ProductActions = {
  setPhase: (phase: number) => void;
  setPointer: (pointerX: number, pointerY: number) => void;
  setCapabilities: (supported: boolean, reduced: boolean, lowPower?: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
  markLoaded: () => void;
  markRevealed: () => void;
  markSceneFailed: () => void;
};

export type ProductStore = ProductState & ProductActions;

// Each page instance gets its own store, with matching server/client defaults.
export function createProductStore() {
  return createStore<ProductStore>()((set) => ({
    phase: 0,
    pointerX: 0,
    pointerY: 0,
    reduced: false,
    supported: null,
    loaded: false,
    revealed: false,
    sceneFailed: false,
    maxDpr: 1.5,
    setPhase: (phase) =>
      set((state) => {
        const next = Math.min(7, Math.max(0, phase));
        return Number.isFinite(next) && next !== state.phase ? { phase: next } : state;
      }),
    setPointer: (pointerX, pointerY) =>
      set((state) =>
        state.pointerX === pointerX && state.pointerY === pointerY ? state : { pointerX, pointerY },
      ),
    setCapabilities: (supported, reduced, lowPower = false) =>
      set((state) => {
        const maxDpr = lowPower ? 1.25 : 1.5;
        return state.supported === supported && state.reduced === reduced && state.maxDpr === maxDpr
          ? state
          : { supported, reduced, maxDpr };
      }),
    setReducedMotion: (reduced) =>
      set((state) => (state.reduced === reduced ? state : { reduced })),
    markLoaded: () => set((state) => (state.loaded ? state : { loaded: true })),
    markRevealed: () => set((state) => (state.revealed ? state : { revealed: true })),
    markSceneFailed: () => set((state) => (state.sceneFailed ? state : { sceneFailed: true })),
  }));
}

export const selectAvailable = (state: ProductStore) =>
  state.sceneFailed ? false : state.supported;
export const selectActiveFeature = (state: ProductStore) =>
  Math.min(features.length - 1, Math.max(0, Math.round(state.phase - 2)));
export const selectNavigationVisible = (state: ProductStore) =>
  state.phase > 1.55 && state.phase < 5.6;
export const selectCalloutVisible = (state: ProductStore) =>
  Boolean(selectAvailable(state) && state.revealed && state.phase > 1.65 && state.phase < 5.55);
