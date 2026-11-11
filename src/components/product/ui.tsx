import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

const eyebrowClass =
  "flex flex-wrap items-center gap-[7px] text-sm leading-[1.8] font-medium tracking-[1.4px] text-[#b6b8bc] md:gap-2.5 md:tracking-[2.2px]";
const primaryButtonClass =
  "inline-flex min-h-[45px] min-w-[168px] items-center justify-between gap-[35px] rounded px-[17px] bg-[#91bfff] text-sm font-semibold text-[#111b2a] transition-[background,translate] duration-250 hover:-translate-y-0.5 hover:bg-[#bbd7ff] md:min-h-12 md:min-w-[185px] md:px-[22px] [&_span]:text-[17px] [&_span]:font-normal";
const sectionNumberClass =
  "absolute top-[110px] left-[7.1%] z-20 hidden text-sm tracking-[2px] text-[#686c73] md:inline";
export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className={eyebrowClass}>{children}</div>;
}
export function SectionNumber({ children }: { children: ReactNode }) {
  return <span className={sectionNumberClass}>{children}</span>;
}
export function StatusDot() {
  return (
    <span className="inline-block size-[5px] rounded-full bg-[#5aabff] shadow-[0_0_12px_#5aabff66]" />
  );
}
export function PrimaryLink(props: Omit<ComponentProps<typeof Link>, "className">) {
  return <Link className={primaryButtonClass} {...props} />;
}
export function PrimaryButton(props: Omit<ComponentProps<"button">, "className">) {
  return <button className={primaryButtonClass} {...props} />;
}
