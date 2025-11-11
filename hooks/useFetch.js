import { catchError } from "@/lib/helperFunction";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";


const useFetch = (url, method = "GET", options = {}) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [refreshIndex, setRefreshIndex] = useState(0);

    const optionsString = JSON.stringify(options);

    const requestOptions = useMemo(() => {
        const opts = { ...options }
        if (method === "POST" && !opts.data) {
            opts.data = {};
        }

        return opts;
    }, [method, optionsString]);


    useEffect(() => {
        const apiCall = async () => {
            setLoading(true);
            setError(null);
            try {
                const { data: responseData } = await axios({ url, method, ...(requestOptions) });

                if (responseData.success === false) {
                    throw new Error(responseData.message || 'Error fetching data');
                }

                setData(responseData);
                //setLoading(false);

            } catch (error) {
                setError(error.message || catchError(error));
                //  setLoading(false);
            } finally {
                setLoading(false);
            }

        }
        apiCall();

    }, [url, refreshIndex, requestOptions])


    const refetch = () => {
        setRefreshIndex(prev => prev + 1);
    }
    return { data, error, loading, refetch };

}

export default useFetch;