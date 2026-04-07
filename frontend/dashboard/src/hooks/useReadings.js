import { useCallback, useEffect, useState } from "react";
import { http } from "../api/api";


export function useReadings(page = 1, limite = 20) {
    const [data, setData] = useState({ data: [], total: 0, pages: 1})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)


    const fetch = useCallback( async () => {
        setLoading(true)
        try {
            setError(null)
            const res = await http.get(`/leituras?page=${page}&limite=${limite}`)
            setData(res.data)
        } catch (err) {
            setError('Não foi possível carregar o histórico')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [page, limite])

    useEffect(() => {
        fetch()
    }, [fetch])

    return {data, loading, error, refetch: fetch}
}