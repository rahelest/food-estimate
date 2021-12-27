import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { selectPerDay, setPerDay } from "../store/perDaySlice"
import { selectFoodRows, setFoodRows } from "../store/foodSlice"
import {
  LSFieldHookInterface,
  useSavedList,
  useSavedPerDay,
} from "./useSavedData"
import { AppState } from "../store/store"

export function useLocalStorage() {
  return {
    load(field: string) {
      try {
        const storage = localStorage.getItem(field)
        return JSON.parse(storage || "")
      } catch (err) {
        return undefined
      }
    },

    save(field: string, value: any) {
      try {
        localStorage.setItem(field, JSON.stringify(value))
      } catch (err) {
        //shrug
      }
    },
  }
}

export function PersistGate({ children }: { children: JSX.Element }) {
  const perDayLoaded = useLocalStorageSync({
    selector: selectPerDay,
    lsFieldHook: useSavedPerDay,
    setter: setPerDay,
  })

  const foodRowsLoaded = useLocalStorageSync({
    selector: selectFoodRows,
    lsFieldHook: useSavedList,
    setter: setFoodRows,
  })

  if (!perDayLoaded || !foodRowsLoaded) {
    return null
  }

  return children
}

interface Opts<T> {
  selector: (state: AppState) => T
  lsFieldHook: () => LSFieldHookInterface<T>
  setter: (data: T) => { payload: any; type: string }
}
function useLocalStorageSync<T>({ selector, lsFieldHook, setter }: Opts<T>) {
  const dispatch = useAppDispatch()

  const value = useAppSelector(selector)
  const { load, save } = lsFieldHook()

  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    dispatch(setter(load()))
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) {
      save(value)
    }
  }, [value, save])

  return loaded
}
