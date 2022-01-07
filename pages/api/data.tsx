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
        return  undefined
    }

}

/*
export async function getData() {
    let url = `${API_URL}/data`

}
*/