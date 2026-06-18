"use client";
import { useState } from "react";
import { siteImages, SiteImageKey } from "@/config/siteImages";

const FALLBACKS: Record<string, string> = {
  hero:       "linear-gradient(110deg,#010408 0%,#05101f 30%,#091828 55%,#0e2038 75%,#162840 100%)",
  ai:         "linear-gradient(135deg,#060f22 0%,#0d1e38 50%,#162840 100%)",
  reference:  "linear-gradient(135deg,#080318 0%,#10062a 50%,#180a38 100%)",
  result:     "linear-gradient(135deg,#060f22 0%,#0a1828 50%,#162840 100%)",
  furniture:  "linear-gradient(135deg,#04090e 0%,#071420 50%,#0a1e30 100%)",
  blueprint:  "linear-gradient(135deg,#01050d 0%,#020810 50%,#030d18 100%)",
  products:   "linear-gradient(135deg,#060f22 0%,#0c1a34 50%,#12243e 100%)",
  product:    "linear-gradient(135deg,#060d1a 0%,#0c1828 50%,#121e32 100%)",
  courses:    "linear-gradient(135deg,#06030d 0%,#0a0520 50%,#100830 100%)",
  course:     "linear-gradient(135deg,#06030d 0%,#0e0820 50%,#140c28 100%)",
  pricing:    "linear-gradient(135deg,#050a0f 0%,#0a1420 50%,#0f1e30 100%)",
  recharge:   "linear-gradient(135deg,#060f22 0%,#0c1a34 50%,#12243e 100%)",
  about:      "linear-gradient(135deg,#060f22 0%,#0c1a34 50%,#162840 100%)",
  company:    "linear-gradient(135deg,#040c14 0%,#081828 50%,#0d2038 100%)",
  contact:    "linear-gradient(135deg,#060f22 0%,#0c1a34 50%,#162840 100%)",
  office:     "linear-gradient(135deg,#040c14 0%,#081828 50%,#0d2038 100%)",
  living:     "linear-gradient(135deg,#0d1e34 0%,#162840 60%,#1a3050 100%)",
  bedroom:    "linear-gradient(135deg,#08121e 0%,#0f1e30 60%,#14263c 100%)",
  kitchen:    "linear-gradient(135deg,#07111e 0%,#0d1e2c 60%,#102030 100%)",
  wardrobe:   "linear-gradient(135deg,#060f20 0%,#0c1a30 60%,#10203a 100%)",
  default:    "linear-gradient(135deg,#040c1c 0%,#060f22 50%,#08142e 100%)",
};

function getFallback(key: SiteImageKey): string {
  const k = key.toLowerCase();
  const entry = Object.entries(FALLBACKS).find(([p]) => k.startsWith(p) || k.includes(p));
  return entry ? entry[1] : FALLBACKS.default;
}

interface SiteImageProps {
  imageKey: SiteImageKey;
  alt?: string;
  style?: React.CSSProperties;
  className?: string;
  /** Renders as a div with background-image. Children render normally inside. */
  asBackground?: boolean;
  children?: React.ReactNode;
  objectFit?: "cover" | "contain";
  objectPosition?: string;
}

export default function SiteImage({
  imageKey,
  alt = "",
  style = {},
  className,
  asBackground,
  children,
  objectFit = "cover",
  objectPosition = "center",
}: SiteImageProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const src = siteImages[imageKey];
  const fallback = getFallback(imageKey);

  /* ── Background-image mode ── */
  if (asBackground) {
    return (
      <div
        className={className}
        style={{
          // Gradient always visible — image overlaid via absolute img below
          background: fallback,
          position: "relative",
          overflow: "hidden",
          ...style,
        }}
      >
        {/* Real image as absolute fill — loads on top of gradient */}
        {!imgFailed && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt=""
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgFailed(true)}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit,
              objectPosition,
              opacity: imgLoaded ? 1 : 0,
              transition: "opacity 0.5s ease",
              pointerEvents: "none",
              // Sits below children (z-index -1 relative to stacking context)
              zIndex: 0,
            }}
          />
        )}
        {/*
          Children receive their own stacking context.
          Pages already set position:absolute / position:relative on child divs
          so they render above the image naturally.
          We ensure children don't inherit z-index from the image by isolating.
        */}
        {children}
      </div>
    );
  }

  /* ── Inline image mode ── */
  if (imgFailed) {
    return (
      <div
        className={className}
        style={{ background: fallback, ...style }}
        aria-label={alt}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      onLoad={() => setImgLoaded(true)}
      onError={() => setImgFailed(true)}
      style={{
        objectFit,
        objectPosition,
        display: "block",
        opacity: imgLoaded ? 1 : 0,
        transition: "opacity 0.4s ease",
        ...style,
      }}
    />
  );
}
