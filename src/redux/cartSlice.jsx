// redux/cartSlice.js
import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  cartItems: [],
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // Check if product already in cart
      const { id, selectedSize } = action.payload
      // Check if same product + same size exists
      const existing = state.cartItems.find(
        (item) => item.id === id && item.selectedSize === selectedSize
      )
      if (existing) {
        existing.quantity += 1
      } else {
        state.cartItems.push({ ...action.payload, quantity: 1 })
      }
    },
    removeFromCart: (state, action) => {
      const item = action.payload;
      state.cartItems = state.cartItems.filter(
        (i) => !(i.id === item.id && i.selectedSize === item.selectedSize)
      );
    },
    clearCart: (state) => {
      state.cartItems = []
    },
    increaseQuantity: (state, action) => {
  const item = state.cartItems.find(
    (i) =>
      i.id === action.payload.id &&
      i.selectedSize === action.payload.selectedSize
  )
  if (item) item.quantity += 1
},

decreaseQuantity: (state, action) => {
  const item = state.cartItems.find(
    (i) =>
      i.id === action.payload.id &&
      i.selectedSize === action.payload.selectedSize
  )
  if (item && item.quantity > 1) item.quantity -= 1
},

  }
})

export const { addToCart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity } = cartSlice.actions
export default cartSlice.reducer
