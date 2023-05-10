const API_URL = "http://localhost:8080/api/1.0"
const HEADER = {
    'Content-Type': 'application/json'
  }
import axios from "axios"

export function getAllProjects(){
    const url = API_URL + "/getProjects"
    return axios.get(url)
}

export function addProject(jsonObject){
    const url = API_URL + "/addProject"
    return axios.post(url, jsonObject,{headers: HEADER})
}