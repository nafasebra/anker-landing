import type { ComponentProps, ReactNode } from "react";
import { eyebrowClass, primaryButtonClass, sectionNumberClass } from "./styles";
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
export function PrimaryLink(props: Omit<ComponentProps<"a">, "className">) {
  return <a className={primaryButtonClass} {...props} />;
}
export function PrimaryButton(props: Omit<ComponentProps<"button">, "className">) {
  return <button className={primaryButtonClass} {...props} />;
}
