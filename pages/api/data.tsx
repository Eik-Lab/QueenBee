import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const config = {
    api: {
        externalResolver: true
    }
}

export async function getIds() {
    let url = `${API_URL}/get_unique_ids`

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(error);
        return undefined
    }

}

interface dataQuery {
    pi_id: string
    start_time: string | Date | null
    stop_time: string | Date | null
}

export async function getData(params: dataQuery) {
    let url = `${API_URL}/data`

    try {
        const response = await axios.get(url, { params, headers: { 'Access-Control-Allow-Origin': '*' } });
        return response.data;
    } catch (error) {
        console.error(error)
        return undefined
    }

}
