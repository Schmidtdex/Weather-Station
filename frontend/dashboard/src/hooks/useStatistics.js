import { useEffect, useState } from "react";
import { http } from "../api/api";

export function useStatistics() {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetch = async () => {
        try {
            setError(null)
      const res = await http.get('/api/estatisticas')
      setStats(res.data)
        } catch(err) {
        setError("Não foi possível carregar as estatísticas")
        console.error(err)
        } finally {
        setLoading(false)
        }
    }

    useEffect(() => {
        fetch()
        const iv = setInterval(fetch, 10_000)
        return () => clearInterval(iv)
    }, [])
    return { stats, loading, error, refetch: fetch}
}