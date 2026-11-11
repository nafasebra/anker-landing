"use client";
import { useEffect, useRef } from "react";

import { Eyebrow, PrimaryLink } from "./ui";
export function AvailabilityDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (open) dialog.current?.showModal();
    else dialog.current?.close();
  }, [open]);
  return (
    <dialog
      ref={dialog}
      className="fixed m-auto w-[calc(100%_-_40px)] max-w-[460px] rounded-[10px] border border-[#ffffff20] bg-[#1b1e23] px-[35px] pt-[50px] pb-[35px] text-[#eee] backdrop:bg-[#000b] backdrop:backdrop-blur-[8px]"
      aria-labelledby="availability-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <Eyebrow>SOUNDCORE R50i / A3949</Eyebrow>
      <h2
        className="my-[18px] text-[42px] leading-[1.04] font-heading font-bold tracking-[-.065em] md:my-[25px]"
        id="availability-title"
      >
        Find your sound.
      </h2>
      <p className="mb-6 text-sm leading-[1.8] text-[#a1a8b2]">
        Availability varies by region. Visit Soundcore to find your local store and current product
        availability.
      </p>
      <PrimaryLink href="https://www.soundcore.com/" target="_blank" rel="noopener noreferrer">
        Visit Soundcore <span>↗</span>
      </PrimaryLink>
      <button
        autoFocus
        className="absolute top-[17px] right-[22px] text-sm text-[#aaa]"
        onClick={() => onClose()}
      >
        Close ×
      </button>
    </dialog>
  );
}
