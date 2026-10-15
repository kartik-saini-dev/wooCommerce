"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Loader2, CheckCircle, CreditCard, Shield, Truck, Package, 
  Sparkles, MapPin, BadgeCheck, ArrowRight, PartyPopper
} from "lucide-react"
import { Button } from "@repo/ui/components/ui/button"
import { Container } from "@repo/ui/components/ui/container"
import { toast } from "sonner"

type Stage = "verifying" | "processing" | "confirmed" | "assigning" | "ready"

const stageConfig = {
  verifying: {
    icon: Shield,
    title: "Verifying Payment",
    subtitle: "Securely processing your transaction...",
    color: "text-blue-500",
    bg: "from-blue-500/20 to-indigo-500/20",
    progress: 20,
  },
  processing: {
    icon: CreditCard,
    title: "Processing Payment",
    subtitle: "Connecting with payment gateway...",
    color: "text-purple-500",
    bg: "from-purple-500/20 to-pink-500/20",
    progress: 45,
  },
  confirmed: {
    icon: CheckCircle,
    title: "Payment Successful!",
    subtitle: "₹ debited successfully • Transaction verified",
    color: "text-emerald-500",
    bg: "from-emerald-500/20 to-green-500/20",
    progress: 70,
  },
  assigning: {
    icon: Truck,
    title: "Assigning Delivery Partner",
    subtitle: "Finding the nearest delivery partner for you...",
    color: "text-orange-500",
    bg: "from-orange-500/20 to-amber-500/20",
    progress: 90,
  },
  ready: {
    icon: PartyPopper,
    title: "Order is On Its Way! 🎉",
    subtitle: "Your delivery partner is picking up your order",
    color: "text-emerald-500",
    bg: "from-emerald-500/20 to-teal-500/20",
    progress: 100,
  },
}

// Floating particle component
function FloatingParticle({ delay, x, size }: { delay: number; x: number; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-primary/20"
      style={{ width: size, height: size, left: `${x}%` }}
      initial={{ y: "100%", opacity: 0 }}
      animate={{ 
        y: "-100%", 
        opacity: [0, 0.6, 0],
        scale: [0.5, 1, 0.3]
      }}
      transition={{ 
        duration: 4, 
        delay, 
        repeat: Infinity,
        ease: "easeOut" 
      }}
    />
  )
}

// Pulsing ring animation
function PulsingRings({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full border-2 ${color.replace('text-', 'border-')}`}
          initial={{ width: 80, height: 80, opacity: 0.5 }}
          animate={{ 
            width: [80, 160 + i * 40], 
            height: [80, 160 + i * 40], 
            opacity: [0.4, 0] 
          }}
          transition={{ 
            duration: 2, 
            delay: i * 0.4, 
            repeat: Infinity,
            ease: "easeOut" 
          }}
        />
      ))}
    </div>
  )
}

// Delivery boy avatar with animation
function DeliveryBoyAvatar() {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", damping: 12, stiffness: 200 }}
      className="relative"
    >
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-xl shadow-orange-500/30">
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Truck className="h-10 w-10 text-white" />
        </motion.div>
      </div>
      {/* Badge */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
        className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 shadow-lg"
      >
        <BadgeCheck className="h-5 w-5 text-white" />
      </motion.div>
    </motion.div>
  )
}

// Confetti burst
function ConfettiBurst() {
  const colors = ["#f43f5e", "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ec4899"]
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{ 
            backgroundColor: colors[i % colors.length],
            left: "50%",
            top: "40%",
          }}
          initial={{ scale: 0 }}
          animate={{
            x: (Math.random() - 0.5) * 400,
            y: (Math.random() - 0.5) * 400,
            scale: [0, 1, 0],
            rotate: Math.random() * 720,
          }}
          transition={{
            duration: 1.5 + Math.random(),
            delay: Math.random() * 0.3,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  )
}

export default function PaymentProcessingPage() {
  const router = useRouter()
  const { id: orderId } = useParams() as { id: string }
  const [stage, setStage] = useState<Stage>("verifying")
  const [showConfetti, setShowConfetti] = useState(false)
  const [deliveryPartner] = useState({
    name: "Rajesh Kumar",
    rating: 4.8,
    deliveries: 2847,
    vehicle: "Motorcycle",
    eta: "25-35 min",
  })

  const currentConfig = stageConfig[stage]
  const StageIcon = currentConfig.icon

  useEffect(() => {
    // Stage 1: Verifying (0-2s)
    const t1 = setTimeout(() => setStage("processing"), 2000)
    
    // Stage 2: Processing + API call (2-5s)
    const t2 = setTimeout(async () => {
      try {
        const res = await fetch(`/api/checkout/pay/${orderId}`, { method: "POST" })
        const data = await res.json()
        if (data.success) {
          setStage("confirmed")
          setShowConfetti(true)
          toast.success("Payment Successful! ✓")
        } else {
          throw new Error(data.error || "Payment failed")
        }
      } catch (e) {
        console.error(e)
        toast.error("Payment processing failed. Please try again.")
        router.push("/checkout")
      }
    }, 4000)

    // Stage 3: Confirmed → Assigning (after confirmation animation plays)
    const t3 = setTimeout(() => {
      setStage("assigning")
      setShowConfetti(false)
    }, 7000)

    // Stage 4: Assigning → Ready
    const t4 = setTimeout(() => {
      setStage("ready")
      setShowConfetti(true)
    }, 9500)

    // Final: redirect to success page
    const t5 = setTimeout(() => {
      router.push(`/checkout/success/${orderId}`)
    }, 12000)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
    }
  }, [orderId, router])

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Floating background particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <FloatingParticle 
          key={i} 
          delay={i * 0.5} 
          x={Math.random() * 100} 
          size={4 + Math.random() * 8} 
        />
      ))}

      {/* Gradient background blob */}
      <motion.div
        className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br ${currentConfig.bg} blur-3xl opacity-40`}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && <ConfettiBurst />}
      </AnimatePresence>

      <Container className="max-w-lg py-16 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8">

          {/* Main icon with pulsing rings */}
          <div className="relative w-40 h-40 flex items-center justify-center">
            <PulsingRings color={currentConfig.color} />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={stage}
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 90 }}
                transition={{ type: "spring", damping: 15, stiffness: 200 }}
                className={`relative z-10 w-24 h-24 rounded-full bg-card border-2 shadow-2xl flex items-center justify-center ${currentConfig.color}`}
              >
                {stage === "verifying" || stage === "processing" ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <StageIcon className="h-12 w-12" />
                  </motion.div>
                ) : stage === "assigning" ? (
                  <DeliveryBoyAvatar />
                ) : (
                  <StageIcon className="h-12 w-12" />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Title & Subtitle */}
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-2"
            >
              <h1 className="text-3xl font-bold tracking-tight">{currentConfig.title}</h1>
              <p className="text-muted-foreground text-lg">{currentConfig.subtitle}</p>
            </motion.div>
          </AnimatePresence>

          {/* Progress bar */}
          <div className="w-full max-w-sm">
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-3 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500"
                initial={{ width: "0%" }}
                animate={{ width: `${currentConfig.progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <motion.p 
              className="text-sm text-muted-foreground mt-2"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {stage === "ready" ? "Redirecting to order details..." : "Please do not close this page"}
            </motion.p>
          </div>

          {/* Delivery Partner Card (shows in assigning/ready stages) */}
          <AnimatePresence>
            {(stage === "assigning" || stage === "ready") && (
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", damping: 20 }}
                className="w-full max-w-sm bg-card rounded-2xl border shadow-xl p-6 space-y-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg">
                    <Truck className="h-7 w-7 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-lg">{deliveryPartner.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        ⭐ {deliveryPartner.rating}
                      </span>
                      <span>•</span>
                      <span>{deliveryPartner.deliveries.toLocaleString()} deliveries</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-muted/50 rounded-xl p-3 text-center">
                    <p className="text-muted-foreground">Vehicle</p>
                    <p className="font-semibold mt-1">🏍️ {deliveryPartner.vehicle}</p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-3 text-center">
                    <p className="text-muted-foreground">ETA</p>
                    <p className="font-semibold mt-1">🕐 {deliveryPartner.eta}</p>
                  </div>
                </div>

                {stage === "ready" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center gap-2 text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-500/10 rounded-xl p-3"
                  >
                    <Package className="h-5 w-5" />
                    <span>Picking up your order now!</span>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Security badge */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-full px-4 py-2"
          >
            <Shield className="h-4 w-4" />
            <span>256-bit SSL encrypted • Secure payment gateway</span>
          </motion.div>
        </div>
      </Container>
    </div>
  )
}
