import { useCallback, useEffect, useState } from "react";
import { http } from "../api/api";


export function useLiveReading() {
    const [leituras, setLeituras] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [lastUp, setLastUp] = useState(null)


    const fetch = useCallback(async () => {
        try {
            setError(null)
            const res = await http.get('/')
            setLeituras([...res.data].reverse())
            setLastUp(new Date())
        } catch (err) {
            setError('Falha ao buscar leituras ao vivo')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetch()
        const iv = setInterval(fetch, 10_000)
        return () => clearInterval(iv)
    }, [fetch])

    return {leituras, loading, error, lastUp, refetch: fetch}
}