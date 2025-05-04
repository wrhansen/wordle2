/**
 * A custom hook that listens for key press events and triggers the provided handler function.
 *
 * @param handler - A function to handle the key press event. It receives the `KeyboardEvent` as an argument.
 * @param deps - An optional array of dependencies that determines when the effect should be re-applied.
 */
import React, { useEffect } from 'react'

type KeyHandler = (event: KeyboardEvent) => void

export function useKeyPress(handler: KeyHandler, deps: React.DependencyList) {
  useEffect(() => {
    window.addEventListener('keydown', handler)
    return () => {
      window.removeEventListener('keydown', handler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handler, ...deps])
}
