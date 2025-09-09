"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RotateCw, Maximize, Minimize } from "lucide-react"

export default function ServerVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isRotating, setIsRotating] = useState(true)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let angle = 0

    // Set canvas dimensions
    const resizeCanvas = () => {
      const container = canvas.parentElement
      if (container) {
        canvas.width = container.clientWidth
        canvas.height = container.clientHeight
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Draw server rack
    const drawServerRack = (rotation: number) => {
      if (!ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Center of canvas
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Server rack dimensions
      const rackWidth = 200
      const rackHeight = 300
      const rackDepth = 100

      // Save context state
      ctx.save()

      // Translate to center
      ctx.translate(centerX, centerY)

      // Rotate based on angle
      ctx.rotate((rotation * Math.PI) / 180)

      // Draw rack frame
      ctx.strokeStyle = "#3b82f6"
      ctx.lineWidth = 2

      // Front face
      ctx.beginPath()
      ctx.rect(-rackWidth / 2, -rackHeight / 2, rackWidth, rackHeight)
      ctx.stroke()

      // Top line to create 3D effect
      ctx.beginPath()
      ctx.moveTo(-rackWidth / 2, -rackHeight / 2)
      ctx.lineTo(-rackWidth / 2 + rackDepth / 2, -rackHeight / 2 - rackDepth / 4)
      ctx.stroke()

      // Right line to create 3D effect
      ctx.beginPath()
      ctx.moveTo(rackWidth / 2, -rackHeight / 2)
      ctx.lineTo(rackWidth / 2 + rackDepth / 2, -rackHeight / 2 - rackDepth / 4)
      ctx.stroke()

      // Connect top right corners
      ctx.beginPath()
      ctx.moveTo(-rackWidth / 2 + rackDepth / 2, -rackHeight / 2 - rackDepth / 4)
      ctx.lineTo(rackWidth / 2 + rackDepth / 2, -rackHeight / 2 - rackDepth / 4)
      ctx.stroke()

      // Connect top right to bottom right
      ctx.beginPath()
      ctx.moveTo(rackWidth / 2 + rackDepth / 2, -rackHeight / 2 - rackDepth / 4)
      ctx.lineTo(rackWidth / 2 + rackDepth / 2, rackHeight / 2 - rackDepth / 4)
      ctx.stroke()

      // Draw servers inside rack
      const serverHeight = 30
      const serverGap = 5
      const serversCount = Math.floor(rackHeight / (serverHeight + serverGap)) - 1

      for (let i = 0; i < serversCount; i++) {
        const yPos = -rackHeight / 2 + (i + 1) * (serverHeight + serverGap)

        // Server box
        ctx.fillStyle = i % 3 === 0 ? "#1e40af" : "#2563eb"
        ctx.fillRect(-rackWidth / 2 + 10, yPos, rackWidth - 20, serverHeight)

        // Server front details
        ctx.fillStyle = "#60a5fa"

        // Status lights
        ctx.beginPath()
        ctx.arc(-rackWidth / 2 + 25, yPos + serverHeight / 2, 3, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = i % 2 === 0 ? "#4ade80" : "#f87171"
        ctx.beginPath()
        ctx.arc(-rackWidth / 2 + 40, yPos + serverHeight / 2, 3, 0, Math.PI * 2)
        ctx.fill()

        // Server front panel
        ctx.fillStyle = "#1e293b"
        ctx.fillRect(rackWidth / 2 - 70, yPos + 5, 40, serverHeight - 10)
      }

      // Restore context state
      ctx.restore()
    }

    // Animation loop
    const animate = () => {
      if (isRotating) {
        angle = (angle + 0.2) % 360
      }
      drawServerRack(angle)
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isRotating])

  const toggleFullscreen = () => {
    if (!canvasRef.current) return

    if (!isFullscreen) {
      if (canvasRef.current.requestFullscreen) {
        canvasRef.current.requestFullscreen()
        setIsFullscreen(true)
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden border border-border/50 bg-black/20">
      <div className="absolute top-4 left-4 z-10">
        <Badge className="bg-blue-600/80 text-white border-none">3D Server Visualization</Badge>
      </div>

      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-background/50 backdrop-blur-sm"
          onClick={() => setIsRotating(!isRotating)}
        >
          <RotateCw className={`h-4 w-4 ${isRotating ? "text-blue-600" : "text-muted-foreground"}`} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-background/50 backdrop-blur-sm"
          onClick={toggleFullscreen}
        >
          {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </Button>
      </div>

      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}

