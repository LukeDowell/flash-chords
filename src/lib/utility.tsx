import {useEffect, useRef, useState} from 'react'
import {RenderContext, Renderer} from "vexflow";

export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback)

  // Remember the latest callback if it changes.
  useEffect(() => savedCallback.current = callback, [callback])

  // Set up the interval.
  useEffect(() => {
    // Don't schedule if no delay is specified.
    // Note: 0 is a valid value for delay.
    if (!delay && delay !== 0) {
      return
    }

    const id = setInterval(() => savedCallback.current(), delay)

    return () => clearInterval(id)
  }, [delay])
}

export function useWindowSize() {
  const [size, setSize] = useState([600, 800]);
  useEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }

    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

export function useVexflowContext(outputId: string, width?: number, height?: number) {
  const [context, setContext] = useState<RenderContext | undefined>(undefined)
  const [windowWidth, windowHeight] = useWindowSize()

  useEffect(() => {
    const outputDiv = document.getElementById(outputId) as HTMLDivElement
    if (outputDiv === null) throw new Error(`Unable to find context output element with id=${outputId}`)
    if (outputDiv.innerHTML !== "" && context !== undefined) return
    const renderer = new Renderer(outputDiv, Renderer.Backends.SVG)
    const defaultHeight = windowHeight / 10 > 300 ? windowHeight / 10 : 300;
    renderer.resize(
      width ? width : windowWidth,
      height ? height : defaultHeight
    )
    setContext(renderer.getContext())
  })

  return context
}
