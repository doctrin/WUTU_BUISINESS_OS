import { useState } from 'react'

export function useLocalStorage(key, initialValue) {
  const [state, setStateRaw] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      return item !== null ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setState = (value) => {
    try {
      const valueToStore = typeof value === 'function' ? value(state) : value
      setStateRaw(valueToStore)
      localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch {
      setStateRaw(value)
    }
  }

  return [state, setState]
}
