// components/WorldMap.tsx
'use client'

import React from "react"

type Dot = {
  top: string
  left: string
  label?: string
}

const glowingDots: Dot[] = [
  { top: "28%", left: "23%", label: "North America" },
  { top: "24%", left: "47%", label: "Europe" },
  { top: "30%", left: "64%", label: "Asia" },
  { top: "48%", left: "80%", label: "Australia" },
]

const WorldMap: React.FC = () => {
  return (
    <div className="relative w-full h-full bg-black overflow-hidden rounded-lg">
      {/* إذا عندك صورة خريطة، فعّل هذا السطر */}
      {/* <img
        src="/world-map.svg"
        alt="World Map"
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
      /> */}

      {/* Gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 via-black to-indigo-900/20 z-0" />

      {/* Glowing animated dots */}
      {glowingDots.map((dot, index) => (
        <div
          key={index}
          className="absolute z-10 group"
          style={{ top: dot.top, left: dot.left }}
        >
          <div className="relative">
            {/* Pulse glow */}
            <span className="absolute inset-0 animate-ping rounded-full bg-cyan-400 opacity-75"></span>
            {/* Dot */}
            <span className="relative w-4 h-4 bg-cyan-400 rounded-full block shadow-[0_0_15px_4px_rgba(0,255,255,0.5)]" />
          </div>
          {dot.label && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-black/60 rounded shadow-md opacity-0 group-hover:opacity-100 transition duration-300">
              {dot.label}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default WorldMap
