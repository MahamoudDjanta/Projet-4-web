import { useEffect, useState } from 'react'

export function useAsyncData(loader, deps = []) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const depsKey = JSON.stringify(deps)

  useEffect(() => {
    let mounted = true
    queueMicrotask(() => {
      if (mounted) setIsLoading(true)
    })
    loader()
      .then((response) => {
        if (mounted) setData(response.data ?? response)
      })
      .catch((err) => {
        if (mounted) setError(err)
      })
      .finally(() => {
        if (mounted) setIsLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [depsKey])

  return { data, isLoading, error }
}
