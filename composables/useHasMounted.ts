import { useEffect, useState } from "react"

export function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  return hasMounted
}

type Props = {
  children: JSX.Element
}

export function ClientOnly({ children }: Props) {
  const hasMounted = useHasMounted()

  if (!hasMounted) {
    return null
  }

  return children
}
