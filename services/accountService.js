const API_URL = "http://localhost:8080/api/1.0"
const HEADER = {
    'Content-Type': 'application/json',
}
import axios from "axios"

export function logIn(jsonObject){
    const url = API_URL + "/auth"
    console.log(url);
    return axios.post(url, {},{auth: jsonObject})
}
