import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit"

import perDayReducer from "../store/perDaySlice"
import foodReducer from "../store/foodSlice"

// https://github.com/vercel/next.js/tree/canary/examples/with-redux
export function makeStore() {
  return configureStore({
    reducer: {
      perDay: perDayReducer,
      foodRows: foodReducer,
    },
  })
}

const store = makeStore()

export type AppState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>

export default store
