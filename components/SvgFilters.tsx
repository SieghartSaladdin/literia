// SvgFilters.tsx — Server Component
// SVG displacement filter used by the Author section hover effect

export default function SvgFilters() {
  return (
    <svg style={{ display: "none" }} aria-hidden="true">
      <defs>
        <filter id="displacementFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.02"
            numOctaves={3}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={0}
            xChannelSelector="R"
            yChannelSelector="G"
            id="displacementMap"
          />
        </filter>
      </defs>
    </svg>
  );
}
