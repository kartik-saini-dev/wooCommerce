"use client"

import * as React from "react"
import { Star, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@repo/ui/components/ui/dialog"
import { Button } from "@repo/ui/components/ui/button"
import { Textarea } from "@repo/ui/components/ui/textarea"
import { toast } from "sonner"
import { submitReview } from "@repo/services/actions/review"

export function ReviewDialog({ orderId }: { orderId: string }) {
  const [rating, setRating] = React.useState(5)
  const [comment, setComment] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const res = await submitReview(orderId, rating, comment)
    if (res.success) {
      toast.success("Review submitted successfully!")
      setOpen(false)
    } else {
      toast.error(res.error || "Failed to submit review")
    }
    
    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="default">Leave a Review</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rate your Experience</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-8 w-8 cursor-pointer transition-colors ${
                  star <= rating ? "fill-primary text-primary" : "text-muted-foreground"
                }`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Comments (Optional)</label>
            <Textarea
              placeholder="How was the delivery and product quality?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="resize-none"
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Submit Review"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
