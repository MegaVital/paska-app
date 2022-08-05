import { CartEntry } from '../types';
import { createSlice } from '@reduxjs/toolkit'
const initialState: CartEntry[] = []

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToCart(state: CartEntry[], action: { payload: CartEntry }) {
      state.push({
        id: action.payload.id,
        quantity: action.payload.quantity,
      })
    },
    addQuantity(state: CartEntry[], action: { payload: { index: number } }) {
      state[action.payload.index].quantity += 1
    },

    deleteItemFromCart(state: CartEntry[], action: { payload: { index: number } }) {
      state.splice(action.payload.index, 1
      )
    },
    reduceQuantity(state: CartEntry[], action: { payload: { index: number } }) {
      state[action.payload.index].quantity -= 1
    },
    deleteItem(state: CartEntry[]) {
      state.shift()
    },
  }
})

export const { addItemToCart, deleteItemFromCart, addQuantity, reduceQuantity, deleteItem } = cartSlice.actions
export default cartSlice.reducer

