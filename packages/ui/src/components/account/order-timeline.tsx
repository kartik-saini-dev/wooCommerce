"use client"

import * as React from "react"
import { CheckCircle2, Clock, Truck, Package, XCircle, Calendar, Wrench, CheckSquare } from "lucide-react"

import { Card, CardContent } from "@repo/ui/components/ui/card"
import { cn } from "@repo/services/utils"

interface OrderTimelineProps {
  status: string
  type: "order" | "booking"
}

export function OrderTimeline({ status, type }: OrderTimelineProps) {
  let steps: any[] = []
  
  if (type === "order") {
    steps = [
      { id: "PENDING", label: "Pending", icon: Clock },
      { id: "PROCESSING", label: "Processing", icon: Package },
      { id: "SHIPPED", label: "Shipped", icon: Truck },
      { id: "DELIVERED", label: "Delivered", icon: CheckCircle2 },
    ]
  } else {
    steps = [
      { id: "PENDING", label: "Pending", icon: Clock },
      { id: "CONFIRMED", label: "Confirmed", icon: Calendar },
      { id: "IN_PROGRESS", label: "In Progress", icon: Wrench },
      { id: "COMPLETED", label: "Completed", icon: CheckSquare },
    ]
  }

  const isCancelled = status === "CANCELLED" || status === "RETURNED"
  const currentStepIndex = isCancelled ? -1 : steps.findIndex((s) => s.id === status)

  return (
    <Card>
      <CardContent className="p-6">
        {isCancelled ? (
          <div className="flex flex-col items-center justify-center py-4 text-destructive">
            <XCircle className="h-12 w-12 mb-2" />
            <h3 className="font-bold text-lg">
              {type === "order" ? "Order " : "Booking "} {status === "RETURNED" ? "Returned" : "Cancelled"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">This {type} has been {status.toLowerCase()}.</p>
          </div>
        ) : (
          <div className="relative flex flex-col md:flex-row justify-between w-full mt-4">
            {/* Connecting lines */}
            <div className="hidden md:block absolute top-5 left-0 w-full h-1 bg-muted -z-10" />
            <div 
              className="hidden md:block absolute top-5 left-0 h-1 bg-primary -z-10 transition-all duration-500 ease-in-out" 
              style={{ width: `${currentStepIndex >= 0 ? (currentStepIndex / (steps.length - 1)) * 100 : 0}%` }}
            />
            
            {/* Mobile connecting line */}
            <div className="md:hidden absolute left-5 top-0 h-full w-1 bg-muted -z-10" />
            <div 
              className="md:hidden absolute left-5 top-0 w-1 bg-primary -z-10 transition-all duration-500 ease-in-out" 
              style={{ height: `${currentStepIndex >= 0 ? (currentStepIndex / (steps.length - 1)) * 100 : 0}%` }}
            />

            {steps.map((step, index) => {
              const isCompleted = index <= currentStepIndex
              const isCurrent = index === currentStepIndex
              const Icon = step.icon

              return (
                <div key={step.id} className="flex md:flex-col items-center gap-4 md:gap-2 mb-8 md:mb-0 relative bg-card md:bg-transparent">
                  <div className={cn(
                    "flex items-center justify-center h-10 w-10 rounded-full border-4 transition-colors",
                    isCompleted ? "bg-primary border-primary text-primary-foreground" : "bg-card border-muted text-muted-foreground",
                    isCurrent && "ring-4 ring-primary/20"
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className={cn(
                    "font-medium text-sm md:text-center",
                    isCompleted ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {step.label}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
