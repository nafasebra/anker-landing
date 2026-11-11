# Soundcore R50i product experience

A Next.js / React / TypeScript landing page styled with Tailwind CSS, with one continuous React Three Fiber scene, Drei studio lighting and controls, and GSAP ScrollTrigger storytelling.

## Run locally

```sh
pnpm install
pnpm dev
```

Open http://localhost:3000. For production, run `npm run build` and `npm start`.

## Edit the experience

- `src/components/product/product-experience.tsx`: connects the scroll state, scene, sections, and overlays.
- `src/components/product/sections/`: hero, reveal, feature storytelling, product close-up, and final product section. Dialog state stays with the final section.
- `src/components/product/hooks/`: browser capabilities, scroll listeners, callout positioning, and scene visibility.
- `src/components/product/scene/`: canvas, model setup, animation helpers, pose data, lighting, and the scene error boundary.
- `src/components/product/animations/`: GSAP plugin registration, chapter measurement, and feature-label timelines. `use-product-scroll` owns these through `useGSAP` and responsive `matchMedia` cleanup.
- `src/components/product/features.ts`: editable feature copy; `styles.ts` and `ui.tsx` share the existing Tailwind utilities and repeated UI elements.
- `src/components/product/types.ts`: shared scene and animation contracts.
- `src/components/product/store/`: a page-scoped Zustand store for scroll progress, scene loading/errors, WebGL support, and reduced-motion settings. Components subscribe through selectors; the Three.js frame loop reads the store directly and subscribes to invalidate demand rendering. Dialog state and DOM refs remain local.
- `src/app/globals.css`: Tailwind import, theme tokens, shared accessibility defaults, and the label entrance animation. Component layouts and responsive styling use Tailwind utilities in the JSX.
- `public/models/soundcore-r50i.glb`: supplied asset served at the requested public URL. The original source asset is retained in `src/app`.
- `public/product-fallback.svg`: local static illustration for unsupported WebGL or loading errors.

No price, discount, stock status, battery duration, driver size, IP rating, or ANC claim is supplied. Feature copy is editorial placeholder copy for review; technical specifications should be added only after verification. The availability CTA opens a dialog linking to Soundcore's home page rather than an unverified purchase listing.

## Model inspection and animation

The updated GLB uses meters with Y up and front at +Z. `Case_Base`, `Case_Lid`, `Lid_Hinge`, `Earbud_Left`, and `Earbud_Right` are present. The lid belongs to `Lid_Hinge`, whose pivot is approximately `(0, 0.0226, -0.020)`; opening uses negative X rotation. The asset's earbud parents start around Y=0.062; the presentation explicitly sets their animated positions. Their child components remain attached throughout animation. The sound callout targets `Left_Organic_Housing` and the touch callout targets `Left_Touch_Surface` in this asset.

The hero starts with the lid open and a slight tilt to show the earbuds resting in the case. During reveal, the earbuds rise from the case as their parent transforms spread apart. The updated asset includes a charging tray, wells, and pins. The presentation retains the low front angle, and the case recedes before closeups. The case is closed again for the close-up chapter. The model URL includes a content-version query to refresh cached copies after replacement.

Rendering uses demand mode, a pixel ratio capped at 1.5 (1.25 for coarse pointers, lower core counts, or reduced motion), a small locally generated environment map, no postprocessing, and a visibility listener to pause hidden-tab rendering. Model geometries remain shared with the loader cache. Non-highlighted meshes share cloned materials; the three highlighted parts have isolated materials. Only owned material clones are disposed on unmount. Part lookups are cached and highlights update only when the focused part changes.

Coordinated 3D poses use a paused GSAP timeline created inside `useGSAP`; the frame loop seeks it from scroll progress and applies the existing settling motion. The timeline has no continuously playing ticker. Each feature label uses one reversible ScrollTrigger for its entry, hold, and exit. Motion preference changes rebuild or revert those animations. Chapter positions are measured from the actual sections, with refreshes after font loading and section-height changes.

Reduced motion keeps a stable assembled composition and disables pointer tilt and entrance effects. Mobile places copy below the model, fits the model to the available viewport width, and preserves vertical touch scrolling. The decorative page background uses `next/image` with viewport-sized responsive sources.

## Validation

### R3F Timer compatibility patch

R3F is pinned to `9.8.2` with a pnpm patch registered in `pnpm-workspace.yaml`. Its internal `state.clock` interface is backed by `THREE.Timer`, which removes the Clock deprecation warning while preserving the timing API used by Drei and R3F's demand/manual frame loops. This addresses the [upstream Clock migration](https://github.com/pmndrs/react-three-fiber/issues/3741) without changing renderer majors or filtering console messages. The patch covers development, production, and ESM bundles and reapplies on `pnpm install`.

Run `pnpm test:timer` to check root creation without the Clock warning and verify delta/elapsed timing, start/stop, and frameloop transitions. Remove or update the version-specific patch when upgrading R3F.

Run `npm run format` to format the project, or `npm run format:check` to check formatting. Generated files and static assets are excluded through `.prettierignore`.

Run `npm run lint`, `npm run typecheck`, `npm run test:timer`, and `npm run build` for validation. The focused Timer regression check uses Node's built-in assertions.

Production build includes TypeScript checks. The root-level `types/` folder contains stale generated starter validators with incorrect relative imports, so it is excluded from TypeScript; Next.js continues to generate and validate the current route types under `.next/types`.
