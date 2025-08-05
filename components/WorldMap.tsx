// components/WorldMap.tsx
import React from "react"

type Dot = {
  top: string
  left: string
}

const glowingDots: Dot[] = [
  { top: "30%", left: "25%" }, // North America
  { top: "30%", left: "48%" }, // Europe
  { top: "35%", left: "65%" }, // Asia
  { top: "75%", left: "85%" }, // Australia
]

const WorldMap: React.FC = () => {
  return (
    <div className="relative w-full h-[500px] bg-black overflow-hidden">
      {/* Background hex pattern (you can replace with SVG if needed) */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,gray_1px,transparent_1px)] [background-size:14px_14px]" />

      {/* Glowing Dots */}
      {glowingDots.map((dot, index) => (
        <div
          key={index}
          className="absolute w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_15px_5px_rgba(0,255,255,0.5)]"
          style={{ top: dot.top, left: dot.left }}
        />
      ))}
    </div>
  )
}

export default WorldMap
