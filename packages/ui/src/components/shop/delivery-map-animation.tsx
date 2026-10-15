"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  CheckCircle, Truck, Package, MapPin, Store,
  Phone, MessageCircle, Star, Clock, Navigation
} from "lucide-react"

interface DeliveryMapAnimationProps {
  orderNumber: string
  orderId: string
}

// Road path points (normalized 0-1 coordinates for the SVG viewBox)
const roadPath = [
  { x: 0.12, y: 0.75 }, // Shop
  { x: 0.20, y: 0.70 },
  { x: 0.28, y: 0.60 },
  { x: 0.35, y: 0.50 },
  { x: 0.42, y: 0.45 },
  { x: 0.50, y: 0.40 },
  { x: 0.58, y: 0.38 },
  { x: 0.65, y: 0.35 },
  { x: 0.72, y: 0.32 },
  { x: 0.80, y: 0.28 },
  { x: 0.88, y: 0.25 }, // Home
]

type DeliveryStage = "pickup" | "on_the_way" | "nearby" | "delivered"

const deliveryStages: { id: DeliveryStage; label: string; description: string; icon: typeof Truck }[] = [
  { id: "pickup", label: "Picking Up", description: "Collecting your order from the store", icon: Package },
  { id: "on_the_way", label: "On the Way", description: "Your order is en route", icon: Truck },
  { id: "nearby", label: "Almost There", description: "Delivery partner is nearby", icon: Navigation },
  { id: "delivered", label: "Delivered!", description: "Your order has arrived 🎉", icon: CheckCircle },
]

export function DeliveryMapAnimation({ orderNumber, orderId }: DeliveryMapAnimationProps) {
  const router = useRouter()
  const [progress, setProgress] = useState(0) // 0 to 100
  const [currentStage, setCurrentStage] = useState<DeliveryStage>("pickup")
  const [showDelivered, setShowDelivered] = useState(false)

  // Calculate delivery boy position along the path
  const getPositionOnPath = (pct: number) => {
    const normalizedPct = Math.min(100, Math.max(0, pct)) / 100
    const pathIndex = normalizedPct * (roadPath.length - 1)
    const lower = Math.floor(pathIndex)
    const upper = Math.min(lower + 1, roadPath.length - 1)
    const t = pathIndex - lower
    
    return {
      x: roadPath[lower].x + (roadPath[upper].x - roadPath[lower].x) * t,
      y: roadPath[lower].y + (roadPath[upper].y - roadPath[lower].y) * t,
    }
  }

  useEffect(() => {
    // Animate the delivery over ~20 seconds
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 0.5
        if (next >= 100) {
          clearInterval(interval)
          return 100
        }
        return next
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  // Update stage based on progress
  useEffect(() => {
    if (progress < 15) setCurrentStage("pickup")
    else if (progress < 70) setCurrentStage("on_the_way")
    else if (progress < 95) setCurrentStage("nearby")
    else {
      setCurrentStage("delivered")
      if (progress >= 100 && !showDelivered) {
        setShowDelivered(true)
        
        // Handle delivery completion
        const finalizeDelivery = async () => {
          try {
            await fetch(`/api/orders/${orderId}/deliver`, { method: "POST" })
            // Wait a few seconds for the user to see the delivered state, then redirect
            setTimeout(() => {
              router.push("/account")
            }, 3000)
          } catch (e) {
            console.error("Failed to update delivery status", e)
          }
        }
        
        finalizeDelivery()
      }
    }
  }, [progress, showDelivered, orderId, router])

  const deliveryPos = getPositionOnPath(progress)
  const currentStageIndex = deliveryStages.findIndex(s => s.id === currentStage)

  // Generate the SVG path string for the road
  const pathD = roadPath.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x * 800} ${p.y * 500}`).join(' ')
  
  // Progress path (portion traveled)
  const traveledPoints = []
  const numSegments = Math.floor((progress / 100) * (roadPath.length - 1))
  for (let i = 0; i <= numSegments && i < roadPath.length; i++) {
    traveledPoints.push(roadPath[i])
  }
  traveledPoints.push(getPositionOnPath(progress))
  const traveledD = traveledPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x * 800} ${p.y * 500}`).join(' ')

  return (
    <div className="w-full space-y-6">
      {/* Delivery Status Bar */}
      <div className="bg-card rounded-2xl border shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            Live Delivery Tracking
          </h3>
          <span className="text-sm text-muted-foreground">Order #{orderNumber}</span>
        </div>

        {/* Stage progress steps */}
        <div className="flex items-center justify-between mb-6">
          {deliveryStages.map((stage, index) => {
            const isActive = index <= currentStageIndex
            const isCurrent = index === currentStageIndex
            const StageIcon = stage.icon

            return (
              <div key={stage.id} className="flex flex-col items-center flex-1 relative">
                {/* Connector line */}
                {index > 0 && (
                  <div className="absolute top-5 right-1/2 w-full h-0.5">
                    <div className={`h-full transition-all duration-700 ${
                      index <= currentStageIndex ? 'bg-primary' : 'bg-muted'
                    }`} />
                  </div>
                )}
                
                <motion.div
                  animate={isCurrent ? { scale: [1, 1.15, 1] } : {}}
                  transition={{ duration: 1.5, repeat: isCurrent ? Infinity : 0 }}
                  className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isActive 
                      ? isCurrent 
                        ? 'bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/30' 
                        : 'bg-primary/80 text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <StageIcon className="h-5 w-5" />
                </motion.div>
                <p className={`text-xs mt-2 text-center font-medium ${
                  isCurrent ? 'text-primary' : isActive ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {stage.label}
                </p>
              </div>
            )
          })}
        </div>

        {/* ETA */}
        <div className="flex items-center justify-between text-sm bg-muted/50 rounded-xl p-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {currentStage === "delivered" 
                ? "Delivered successfully!" 
                : `Estimated: ${Math.max(1, Math.round((100 - progress) * 0.35))} min away`
              }
            </span>
          </div>
          <span className="font-bold text-primary">{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Animated Map */}
      <div className="bg-card rounded-2xl border shadow-lg overflow-hidden">
        <div className="relative bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-950/30 dark:via-green-950/20 dark:to-teal-950/30" style={{ height: 350 }}>
          <svg viewBox="0 0 800 500" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            {/* Background grid (roads) */}
            {[100, 200, 300, 400, 500, 600, 700].map(x => (
              <line key={`vl-${x}`} x1={x} y1="0" x2={x} y2="500" stroke="currentColor" className="text-muted/20" strokeWidth="0.5" />
            ))}
            {[80, 160, 240, 320, 400].map(y => (
              <line key={`hl-${y}`} x1="0" y1={y} x2="800" y2={y} stroke="currentColor" className="text-muted/20" strokeWidth="0.5" />
            ))}

            {/* Buildings/blocks */}
            {[
              { x: 180, y: 100, w: 60, h: 40 },
              { x: 350, y: 150, w: 50, h: 50 },
              { x: 500, y: 80, w: 70, h: 45 },
              { x: 250, y: 300, w: 55, h: 40 },
              { x: 420, y: 280, w: 45, h: 55 },
              { x: 600, y: 180, w: 60, h: 35 },
              { x: 150, y: 400, w: 50, h: 45 },
              { x: 550, y: 350, w: 40, h: 50 },
            ].map((b, i) => (
              <rect 
                key={i} 
                x={b.x} y={b.y} width={b.w} height={b.h} 
                rx="4"
                className="fill-muted/30 stroke-muted/40" 
                strokeWidth="1"
              />
            ))}

            {/* Main delivery road (full path - dashed) */}
            <path 
              d={pathD} 
              fill="none" 
              stroke="currentColor" 
              className="text-muted-foreground/30"
              strokeWidth="4" 
              strokeDasharray="8 6"
              strokeLinecap="round"
            />

            {/* Traveled path (solid, animated) */}
            <motion.path 
              d={traveledD}
              fill="none" 
              stroke="url(#roadGradient)" 
              strokeWidth="5" 
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5 }}
            />

            {/* Gradient definition */}
            <defs>
              <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <radialGradient id="pulseGlow">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Shop marker */}
            <g>
              <circle cx={roadPath[0].x * 800} cy={roadPath[0].y * 500} r="20" className="fill-slate-800 dark:fill-slate-200" />
              <foreignObject 
                x={roadPath[0].x * 800 - 10} 
                y={roadPath[0].y * 500 - 10} 
                width="20" height="20"
              >
                <div className="flex items-center justify-center w-full h-full">
                  <Store className="h-4 w-4 text-white dark:text-slate-800" />
                </div>
              </foreignObject>
              <text x={roadPath[0].x * 800} y={roadPath[0].y * 500 + 35} textAnchor="middle" className="fill-foreground text-xs font-bold">
                Our Store
              </text>
            </g>

            {/* Home marker */}
            <g>
              <circle cx={roadPath[roadPath.length-1].x * 800} cy={roadPath[roadPath.length-1].y * 500} r="20" className="fill-emerald-500" />
              <foreignObject 
                x={roadPath[roadPath.length-1].x * 800 - 10} 
                y={roadPath[roadPath.length-1].y * 500 - 10} 
                width="20" height="20"
              >
                <div className="flex items-center justify-center w-full h-full">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
              </foreignObject>
              <text x={roadPath[roadPath.length-1].x * 800} y={roadPath[roadPath.length-1].y * 500 + 35} textAnchor="middle" className="fill-foreground text-xs font-bold">
                Your Home
              </text>
            </g>

            {/* Delivery boy - animated pulse glow */}
            {!showDelivered && (
              <>
                <motion.circle
                  cx={deliveryPos.x * 800}
                  cy={deliveryPos.y * 500}
                  r="30"
                  fill="url(#pulseGlow)"
                  animate={{ r: [25, 40, 25], opacity: [0.6, 0.2, 0.6] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <motion.g
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <circle 
                    cx={deliveryPos.x * 800} 
                    cy={deliveryPos.y * 500} 
                    r="16"
                    className="fill-blue-500 stroke-white" 
                    strokeWidth="3"
                  />
                  <foreignObject 
                    x={deliveryPos.x * 800 - 8} 
                    y={deliveryPos.y * 500 - 8} 
                    width="16" height="16"
                  >
                    <div className="flex items-center justify-center w-full h-full">
                      <Truck className="h-3.5 w-3.5 text-white" />
                    </div>
                  </foreignObject>
                </motion.g>
              </>
            )}

            {/* Delivered checkmark at home */}
            {showDelivered && (
              <motion.g
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10 }}
              >
                <circle 
                  cx={roadPath[roadPath.length-1].x * 800} 
                  cy={roadPath[roadPath.length-1].y * 500 - 40} 
                  r="18"
                  className="fill-emerald-500"
                />
                <foreignObject 
                  x={roadPath[roadPath.length-1].x * 800 - 10} 
                  y={roadPath[roadPath.length-1].y * 500 - 50} 
                  width="20" height="20"
                >
                  <div className="flex items-center justify-center w-full h-full">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                </foreignObject>
              </motion.g>
            )}
          </svg>
        </div>

        {/* Delivery Partner Card */}
        <div className="p-5 border-t">
          <div className="flex items-center gap-4">
            <motion.div
              animate={currentStage !== "delivered" ? { y: [0, -3, 0] } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30"
            >
              <Truck className="h-7 w-7 text-white" />
            </motion.div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-bold text-lg">Rajesh Kumar</p>
                <div className="flex items-center gap-0.5 text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm font-semibold text-foreground">4.8</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                🏍️ Motorcycle • 2,847 deliveries completed
              </p>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors">
                <Phone className="h-4 w-4" />
              </button>
              <button className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors">
                <MessageCircle className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
