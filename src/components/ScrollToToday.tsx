"use client"

import { useEffect } from "react"

export function ScrollToToday() {
  useEffect(() => {
    if (!window.matchMedia("(max-width: 767px)").matches) return

    const today = document.getElementById("today-menu-day")
    if (!today) return

    const bounds = today.getBoundingClientRect()
    if (bounds.top < 0 || bounds.bottom > window.innerHeight) {
      today.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [])

  return null
}
