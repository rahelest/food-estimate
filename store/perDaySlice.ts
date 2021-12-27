import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AppState } from "./store"

export interface PerDayState {
  value: number
}

const initialState: PerDayState = {
  value: 1000,
}

export const perDaySlice = createSlice({
  name: "perDay",
  initialState,
  reducers: {
    setPerDay: (state, action: PayloadAction<number>) => {
      state.value = action.payload
    },
  },
})

export const { setPerDay } = perDaySlice.actions

export const selectPerDay = (state: AppState) => state.perDay.value

export default perDaySlice.reducer
