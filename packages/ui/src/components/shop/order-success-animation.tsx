"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  CheckCircle, Package, Truck, MapPin, PartyPopper,
  CreditCard, ShieldCheck, Clock, Star
} from "lucide-react"

interface OrderSuccessAnimationProps {
  orderNumber: string
  totalAmount: string
  paymentMethod: string
  deliveryMethod: string
}

const orderSteps = [
  { 
    id: "confirmed", 
    icon: CheckCircle, 
    label: "Order Confirmed", 
    description: "Payment verified successfully",
    color: "emerald" 
  },
  { 
    id: "packing", 
    icon: Package, 
    label: "Packing Order", 
    description: "Items being carefully packed",
    color: "blue" 
  },
  { 
    id: "dispatched", 
    icon: Truck, 
    label: "Dispatched", 
    description: "Out for delivery",
    color: "orange" 
  },
  { 
    id: "delivered", 
    icon: MapPin, 
    label: "Delivered", 
    description: "Arriving soon",
    color: "purple" 
  },
]

export function OrderSuccessAnimation({ 
  orderNumber, 
  totalAmount, 
  paymentMethod,
  deliveryMethod 
}: OrderSuccessAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [showCelebration, setShowCelebration] = useState(true)

  useEffect(() => {
    // Auto-advance through order steps for demo
    const timers: NodeJS.Timeout[] = []
    
    // Step through the stages
    timers.push(setTimeout(() => setCurrentStep(1), 3000))
    timers.push(setTimeout(() => setCurrentStep(2), 5500))
    timers.push(setTimeout(() => setCurrentStep(3), 8000))
    
    // Hide celebration after initial burst
    timers.push(setTimeout(() => setShowCelebration(false), 2500))

    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="relative mb-10">
      {/* Celebration particles */}
      <AnimatePresence>
        {showCelebration && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            {Array.from({ length: 40 }).map((_, i) => {
              const colors = ["#f43f5e", "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#06b6d4"]
              const shapes = ["rounded-full", "rounded-sm rotate-45", "rounded-full"]
              return (
                <motion.div
                  key={i}
                  className={`absolute ${shapes[i % shapes.length]}`}
                  style={{
                    width: 4 + Math.random() * 8,
                    height: 4 + Math.random() * 8,
                    backgroundColor: colors[i % colors.length],
                    left: "50%",
                    top: "30%",
                  }}
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{
                    x: (Math.random() - 0.5) * 600,
                    y: (Math.random() - 0.5) * 400 - 100,
                    scale: [0, 1.2, 0],
                    rotate: Math.random() * 720,
                    opacity: [1, 1, 0],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 2 + Math.random(),
                    delay: Math.random() * 0.5,
                    ease: "easeOut",
                  }}
                />
              )
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Main success card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 bg-card rounded-2xl border shadow-2xl overflow-hidden"
      >
        {/* Gradient header */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-8 text-white relative overflow-hidden">
          {/* Animated background circles */}
          <motion.div
            className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-5 -left-5 w-24 h-24 rounded-full bg-white/10"
            animate={{ scale: [1.2, 1, 1.2] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          
          <div className="flex flex-col items-center text-center space-y-4 relative z-10">
            {/* Animated checkmark */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 10, stiffness: 200, delay: 0.3 }}
              className="relative"
            >
              <motion.div
                className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                animate={{ boxShadow: ["0 0 0px rgba(255,255,255,0.3)", "0 0 30px rgba(255,255,255,0.3)", "0 0 0px rgba(255,255,255,0.3)"] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.div
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                >
                  <CheckCircle className="h-10 w-10 text-white" />
                </motion.div>
              </motion.div>
              
              {/* Sparkle effects */}
              {[0, 1, 2, 3].map(i => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                  style={{
                    top: `${[0, 50, 100, 50][i]}%`,
                    left: `${[50, 100, 50, 0][i]}%`,
                  }}
                  animate={{
                    scale: [0, 1.5, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: 0.5 + i * 0.2,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                />
              ))}
            </motion.div>

            <motion.h1 
              className="text-3xl md:text-4xl font-bold"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Order Confirmed! 🎉
            </motion.h1>
            <motion.p
              className="text-white/80 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Thank you for your purchase • Order #{orderNumber}
            </motion.p>

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex gap-6 mt-4"
            >
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                <CreditCard className="h-4 w-4" />
                <span>{paymentMethod === "UPI" ? "UPI" : "COD"}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                <ShieldCheck className="h-4 w-4" />
                <span>Verified</span>
              </div>
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-bold">
                {totalAmount}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Order Timeline / Progress */}
        <div className="p-6 md:p-8">
          <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            Order Progress (Demo Simulation)
          </h3>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[22px] top-0 bottom-0 w-0.5 bg-muted" />
            
            {/* Animated progress line */}
            <motion.div
              className="absolute left-[22px] top-0 w-0.5 bg-gradient-to-b from-emerald-500 to-blue-500"
              initial={{ height: 0 }}
              animate={{ height: `${Math.min(100, (currentStep / (orderSteps.length - 1)) * 100)}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />

            <div className="space-y-8">
              {orderSteps.map((step, index) => {
                const isActive = index <= currentStep
                const isCurrent = index === currentStep
                const StepIcon = step.icon

                const colorMap: Record<string, { bg: string; text: string; ring: string }> = {
                  emerald: { bg: "bg-emerald-500", text: "text-emerald-500", ring: "ring-emerald-500/30" },
                  blue: { bg: "bg-blue-500", text: "text-blue-500", ring: "ring-blue-500/30" },
                  orange: { bg: "bg-orange-500", text: "text-orange-500", ring: "ring-orange-500/30" },
                  purple: { bg: "bg-purple-500", text: "text-purple-500", ring: "ring-purple-500/30" },
                }
                const colors = colorMap[step.color]

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 + 0.5 }}
                    className="flex items-start gap-4 relative"
                  >
                    {/* Step icon */}
                    <motion.div
                      animate={isCurrent ? { scale: [1, 1.15, 1] } : {}}
                      transition={{ duration: 1.5, repeat: isCurrent ? Infinity : 0 }}
                      className={`relative z-10 w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${
                        isActive 
                          ? `${colors.bg} text-white shadow-lg ring-4 ${colors.ring}`
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <StepIcon className="h-5 w-5" />
                    </motion.div>

                    {/* Step content */}
                    <div className={`pt-2 transition-all duration-500 ${isActive ? "" : "opacity-40"}`}>
                      <p className={`font-semibold ${isCurrent ? colors.text : ""}`}>
                        {step.label}
                        {isCurrent && (
                          <motion.span
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                          >
                            In Progress
                          </motion.span>
                        )}
                        {isActive && !isCurrent && (
                          <span className="ml-2 text-xs text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            ✓ Done
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Delivery partner info */}
          {deliveryMethod === "HOME_DELIVERY" && currentStep >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-500/5 dark:to-amber-500/5 rounded-2xl border border-orange-200/50 dark:border-orange-500/20 p-5"
            >
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30"
                >
                  <Truck className="h-7 w-7 text-white" />
                </motion.div>
                <div>
                  <p className="font-bold text-lg">Rajesh Kumar</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>4.8</span>
                    <span>•</span>
                    <span>2,847 deliveries</span>
                    <span>•</span>
                    <span>🏍️ Motorcycle</span>
                  </div>
                  <p className="text-sm text-orange-600 dark:text-orange-400 font-medium mt-1">
                    Estimated arrival: 25-35 minutes
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
