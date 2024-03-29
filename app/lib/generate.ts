import axios from 'axios'
import { defaultImageSettings } from '../constants/defaultSettings';

const apiUrl = "https://api.runpod.ai/v2/kandinsky-v2/runsync";
const apiKey = process.env.RUNPOD_API_KEY || '';

export const generate = async(prompt:string, imageSettings = defaultImageSettings) => {
    const headers = {
        headers:{
            authorization: apiKey,
            'content-type': 'application/json',
            'accept': 'application/json'
        }
    }
    const reqbody = {
        input: {prompt, ...imageSettings}
    }
    try{
        const response = await axios.post(apiUrl, reqbody, headers)
        return {data: response.data, message: "IMAGE GENERATED"}; // return id if not completed so that it can be fetched later
    }catch(error: any){
        console.error('Error in generate: ', error)
        return {data: null, error: error.message}
    }
  
}

