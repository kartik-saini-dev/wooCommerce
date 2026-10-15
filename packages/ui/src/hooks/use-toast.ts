"use client"

import { toast as sonnerToast } from "sonner"
import * as React from "react"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

export type ToastProps = {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

export function useToast() {
  const [toasts, setToasts] = React.useState<any[]>([])

  return {
    toasts,
    toast: (props: ToastProps) => {
      if (props.variant === "destructive") {
        sonnerToast.error(props.title as string, {
          description: props.description,
          action: props.action as any,
        })
      } else {
        sonnerToast(props.title as string, {
          description: props.description,
          action: props.action as any,
        })
      }
    },
    dismiss: (toastId?: string) => {
      if (toastId) {
        sonnerToast.dismiss(toastId)
      } else {
        sonnerToast.dismiss()
      }
    },
  }
}
