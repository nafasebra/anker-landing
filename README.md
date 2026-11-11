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
- `src/components/product/sections/`: hero, reveal, feature storytelling, exploration controls, and final product section. Dialog state stays with the final section.
- `src/components/product/hooks/`: browser capabilities, scroll listeners, callout positioning, and scene visibility.
- `src/components/product/scene/`: canvas, model setup, animation helpers, pose data, lighting, and the scene error boundary.
- `src/components/product/features.ts`: editable feature copy; `styles.ts` and `ui.tsx` share the existing Tailwind utilities and repeated UI elements.
- `src/components/product/types.ts`: shared scene and animation contracts.
- `src/components/product/store/`: a page-scoped Zustand store for scroll progress, rotation/reset controls, scene loading/errors, WebGL support, and reduced-motion settings. Components subscribe through selectors; the Three.js frame loop reads the store directly and subscribes to invalidate demand rendering. Dialog state and DOM refs remain local.
- `src/app/globals.css`: Tailwind import, theme tokens, shared accessibility defaults, and the label entrance animation. Component layouts and responsive styling use Tailwind utilities in the JSX.
- `public/models/soundcore-r50i.glb`: supplied asset served at the requested public URL. The original source asset is retained in `src/app`.
- `public/product-fallback.svg`: local static illustration for unsupported WebGL or loading errors.

No price, discount, stock status, battery duration, driver size, IP rating, or ANC claim is supplied. Feature copy is editorial placeholder copy for review; technical specifications should be added only after verification. The availability CTA opens a dialog linking to Soundcore's home page rather than an unverified purchase listing.

## Model inspection and animation

The updated GLB uses meters with Y up and front at +Z. `Case_Base`, `Case_Lid`, `Lid_Hinge`, `Earbud_Left`, and `Earbud_Right` are present. The lid belongs to `Lid_Hinge`, whose pivot is approximately `(0, 0.0226, -0.020)`; opening uses negative X rotation. The asset's earbud parents start around Y=0.062; the presentation explicitly sets their animated positions. Their child components remain attached throughout animation. The sound callout targets `Left_Organic_Housing` and the touch callout targets `Left_Touch_Surface` in this asset.

The hero starts with the lid open and a slight tilt to show the earbuds resting in the case. During reveal, the earbuds rise from the case as their parent transforms spread apart. The updated asset includes a charging tray, wells, and pins. The presentation retains the low front angle, and the case recedes before closeups. The case is closed again for free exploration. The model URL includes a content-version query to refresh cached copies after replacement.

Rendering uses demand mode, a capped 1.5 pixel ratio, a small locally generated environment map, no postprocessing, and a visibility listener to pause hidden-tab rendering. Reduced motion keeps a stable assembled composition and disables pointer tilt and entrance effects. Mobile places copy below the model, fits the model to the available viewport width, and preserves vertical touch scrolling. Rotation also has keyboard-accessible arrow buttons on desktop, plus a reset control.

## Validation

Run `npm run format` to format the project, or `npm run format:check` to check formatting. Generated files and static assets are excluded through `.prettierignore`.

Run `npm run lint`, `npm run typecheck`, and `npm run build` for validation. There is no test runner configured in this project.

Production build includes TypeScript checks. The root-level `types/` folder contains stale generated starter validators with incorrect relative imports, so it is excluded from TypeScript; Next.js continues to generate and validate the current route types under `.next/types`.
