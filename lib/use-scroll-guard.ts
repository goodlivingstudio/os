// ─── Scroll Guard Hook ──────────────────────────────────────────────────────
// Prevents accidental click/tap events during or immediately after scrolling.
// Use on any mobile surface where scrollable content contains clickable cards.
//
// Usage:
//   const scroll = useScrollGuard()
//   <div onScroll={scroll.onScroll}>
//     <button onClick={scroll.guardedClick(() => doSomething())}>
//
// The guard suppresses clicks for 300ms after the last scroll event.

import { useRef, useCallback } from "react"

export function useScrollGuard(cooldownMs = 300) {
  const scrolling = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const onScroll = useCallback(() => {
    scrolling.current = true
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => { scrolling.current = false }, cooldownMs)
  }, [cooldownMs])

  const guardedClick = useCallback((fn: () => void) => {
    return () => { if (!scrolling.current) fn() }
  }, [])

  return { onScroll, guardedClick }
}
