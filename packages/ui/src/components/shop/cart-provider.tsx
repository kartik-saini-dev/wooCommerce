"use client"

import React, { createContext, useContext, useState, useOptimistic, useEffect, startTransition } from "react"
import { Cart, CartItem, Product, ProductImage } from "@prisma/client"

type ExtendedCartItem = CartItem & {
  product: Product & { images: ProductImage[], inventory?: { quantity: number } | null }
}

type ExtendedCart = Cart & {
  items: ExtendedCartItem[]
}

type CartContextType = {
  cart: ExtendedCart | null
  optimisticCart: ExtendedCart | null
  addToCartOptimistic: (item: ExtendedCartItem) => void
  updateQuantityOptimistic: (itemId: string, quantity: number) => void
  removeItemOptimistic: (itemId: string) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ 
  children, 
  initialCart 
}: { 
  children: React.ReactNode
  initialCart: ExtendedCart | null 
}) {
  const [optimisticCart, addOptimisticAction] = useOptimistic<
    ExtendedCart | null, 
    { type: "ADD"; payload: ExtendedCartItem } | { type: "UPDATE_QUANTITY"; payload: { itemId: string; quantity: number } } | { type: "REMOVE"; payload: { itemId: string } }
  >(initialCart, (state, action) => {
    if (!state) {
      if (action.type === "ADD") {
        return {
          id: "optimistic-cart",
          userId: "user",
          createdAt: new Date(),
          updatedAt: new Date(),
          items: [action.payload],
        } as ExtendedCart
      }
      return state
    }

    switch (action.type) {
      case "ADD": {
        const existingItemIndex = state.items.findIndex(
          i => i.productId === action.payload.productId
        )
        if (existingItemIndex >= 0) {
          const newItems = [...state.items]
          newItems[existingItemIndex] = {
            ...newItems[existingItemIndex],
            quantity: newItems[existingItemIndex].quantity + action.payload.quantity
          }
          return { ...state, items: newItems }
        }
        return { ...state, items: [...state.items, action.payload] }
      }
      case "UPDATE_QUANTITY": {
        return {
          ...state,
          items: state.items.map(i => 
            i.id === action.payload.itemId 
              ? { ...i, quantity: action.payload.quantity } 
              : i
          )
        }
      }
      case "REMOVE": {
        return {
          ...state,
          items: state.items.filter(i => i.id !== action.payload.itemId)
        }
      }
      default:
        return state
    }
  })

  const addToCartOptimistic = (item: ExtendedCartItem) => {
    startTransition(() => {
      addOptimisticAction({ type: "ADD", payload: item })
    })
  }

  const updateQuantityOptimistic = (itemId: string, quantity: number) => {
    startTransition(() => {
      addOptimisticAction({ type: "UPDATE_QUANTITY", payload: { itemId, quantity } })
    })
  }

  const removeItemOptimistic = (itemId: string) => {
    startTransition(() => {
      addOptimisticAction({ type: "REMOVE", payload: { itemId } })
    })
  }

  return (
    <CartContext.Provider value={{
      cart: initialCart,
      optimisticCart,
      addToCartOptimistic,
      updateQuantityOptimistic,
      removeItemOptimistic,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
