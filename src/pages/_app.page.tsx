import '@/styles/globals.css'
import type {AppProps} from 'next/app'
import {CssBaseline} from "@mui/material";
import createEmotionCache from "@/lib/createEmotionCache";
import {EmotionCache} from "@emotion/cache";
import {CacheProvider} from "@emotion/react";

const clientSideEmotionCache = createEmotionCache()

export default function App({
                              Component,
                              emotionCache = clientSideEmotionCache,
                              pageProps
                            }: AppProps & { emotionCache: EmotionCache }) {
  return <>
    <CacheProvider value={emotionCache}>
      <CssBaseline/>
      <Component {...pageProps} />
    </CacheProvider>
  </>
}
