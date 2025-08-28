import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {

      const item = state.items.find(p => p.id === action.payload.id)
      if (item) {
        item.quantity += 1
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
      }
    },
    removeFromCart: (state, action) => {
      const item = state.items.find(p => p.id === action.payload);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter(p => p.id !== action.payload);
        }
      }
    },
    deleteCartItem: (state, action) => {
      const item = state.items.find(p => p.id === action.payload);
      if (item) {
        state.items = state.items.filter(p => p.id !== action.payload);
      }
    },
    clearCart: (state) => {
      state.items = []
    },
  },
})

export const { addToCart, removeFromCart, clearCart, deleteCartItem } = cartSlice.actions
export default cartSlice.reducer
