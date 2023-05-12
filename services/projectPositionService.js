const API_URL = "http://localhost:8080/api/1.0"
const HEADER = {
  'Content-Type': 'application/json'
}
import axios from "axios"

export function addProjectPosition(jsonObject){
    const url = API_URL + "/addProjectPosition"
    return axios.post(url, jsonObject,{headers: HEADER})
}