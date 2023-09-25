'use client'

import React from "react";
import ThemeRegistry from "@/app/ThemeRegistry";

type Props = {
  children?: React.ReactNode
}

export default function RootLayout({children}: Props) {
  return (
    <html lang="en">
    <body>
    <ThemeRegistry options={{key: 'mui'}}>{children}</ThemeRegistry>
    </body>
    </html>
  )
}
