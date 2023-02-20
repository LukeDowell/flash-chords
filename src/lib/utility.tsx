import {useEffect, useLayoutEffect, useRef, useState} from 'react'
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

// https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85?permalink_comment_id=3570933#gistcomment-3570933
export const useSSRLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : () => {
}

export function useWindowSize() {
  const [size, setSize] = useState([600, 800]);
  useSSRLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }

    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

export function useVexflowContext(outputId: string, width?: number, height?: number): [RenderContext | undefined, [number, number]] {
  const [context, setContext] = useState<RenderContext | undefined>(undefined)
  const [size, setSize] = useState<[number, number]>([0, 0])
  const [windowWidth, windowHeight] = useWindowSize()

  useEffect(() => {
    const outputDiv = document.getElementById(outputId) as HTMLDivElement
    if (outputDiv === null) throw new Error(`Unable to find context output element with id=${outputId}`)
    outputDiv.innerHTML = ''

    const renderer = new Renderer(outputDiv, Renderer.Backends.SVG)
    // const defaultHeight = windowHeight / 10 > 300 ? windowHeight / 10 : 300
    // const contextHeight = height ? height : defaultHeight
    const contextWidth = width ? width : windowWidth
    const contextHeight = 400

    renderer.resize(contextWidth, contextHeight)
    const ctx = renderer.getContext()
    ctx.rect(0, 0, contextWidth, contextHeight)

    setContext(ctx)
    setSize([contextWidth, contextHeight])
  }, [windowWidth, windowHeight])

  return [context, size]
}
