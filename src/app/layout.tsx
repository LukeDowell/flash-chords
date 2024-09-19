'use client'

import React from "react";
import ThemeRegistry from "@/app/ThemeRegistry";
import AppDrawer from "@/components/app-drawer/AppDrawer";

type Props = {
  children?: React.ReactNode
}

export default function RootLayout({children}: Props) {
  return (
    <html lang="en">
    <body>
    <ThemeRegistry options={{key: 'mui'}}>
      <AppDrawer>
        {children}
      </AppDrawer>
    </ThemeRegistry>
    </body>
    </html>
  )
}
