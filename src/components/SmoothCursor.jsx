import { useEffect } from "react"
import { motion, useSpring } from "framer-motion"

export default function DotCursor() {
  const x = useSpring(0, { stiffness: 600, damping: 40 })
  const y = useSpring(0, { stiffness: 600, damping: 40 })

  useEffect(() => {
    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }

    window.addEventListener("mousemove", move)
    return () => window.removeEventListener("mousemove", move)
  }, [])

  return (
    <motion.div
      style={{ x, y }}
      className="
        fixed top-0 left-0
        w-2 h-2
        rounded-full
        bg-black
        -translate-x-1/2 -translate-y-1/2
        pointer-events-none
        z-[9999]
      "
    />
  )
}
