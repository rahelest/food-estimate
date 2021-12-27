import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { getEmptyRow } from "../composables/useSavedData"
import { FoodRow } from "../models"
import { AppState } from "./store"

export interface FoodRowsState {
  list: FoodRow[]
}

const initialState: FoodRowsState = {
  list: [getEmptyRow()],
}

export const foodRowsSlice = createSlice({
  name: "foodRows",
  initialState,
  reducers: {
    setFoodRows: (state, action: PayloadAction<FoodRow[]>) => {
      state.list = action.payload
    },
    addRow: (state) => {
      state.list.push(getEmptyRow())
    },
    updateRow: (
      state,
      action: PayloadAction<{
        id: number
        field: string
        value: string | number
      }>
    ) => {
      state.list = state.list.map((item) => {
        if (item.id !== action.payload.id) return item
        return { ...item, [action.payload.field]: action.payload.value }
      })
    },
    removeRow: (state, action: PayloadAction<number>) => {
      state.list = state.list.filter(({ id }) => id !== action.payload)
    },
    clear: (state) => {
      state.list = [getEmptyRow()]
    },
  },
})

export const { setFoodRows, addRow, updateRow, removeRow, clear } =
  foodRowsSlice.actions

export const selectFoodRows = (state: AppState) => state.foodRows.list

export default foodRowsSlice.reducer
