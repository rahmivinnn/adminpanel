"use client"

import { ReactNode } from "react"

// This is a simple mock for react-dropzone to fix build issues
export function useDropzone(options: any) {
  return {
    getRootProps: () => ({
      onClick: () => {},
      onKeyDown: () => {},
      tabIndex: 0,
      role: "button",
      "aria-label": "Dropzone"
    }),
    getInputProps: () => ({
      type: "file",
      style: { display: "none" },
      multiple: true,
      accept: options?.accept || undefined,
      onChange: () => {}
    }),
    isDragActive: false,
    isDragAccept: false,
    isDragReject: false
  }
}
