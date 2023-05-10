const API_URL = "http://localhost:8080/api/1.0"
const HEADER = {
  'Content-Type': 'application/json'
}
import axios from "axios"

export function getPositions(){
    const url = API_URL + "/getAllPositions";
    return axios.get(url);
}