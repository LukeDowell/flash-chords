'use client'

import React from "react";
import AppDrawer from "@/components/app-drawer/AppDrawer";
import {AppRouterCacheProvider} from "@mui/material-nextjs/v14-appRouter";
import {Roboto} from "next/font/google";
import {ThemeProvider} from "@mui/material";
import theme from '@/styles/theme'

type Props = {
  children?: React.ReactNode
}

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
})

export default function RootLayout({children}: Props) {
  return (
    <html lang="en">
    <body className={roboto.variable}>
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <AppDrawer>{children}</AppDrawer>
      </ThemeProvider>
    </AppRouterCacheProvider>
    </body>
    </html>
  )
}
