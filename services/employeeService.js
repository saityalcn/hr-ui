const API_URL = "http://localhost:8080/api/1.0"
const HEADER = {
  'Content-Type': 'application/json'
}
import axios from "axios"

export function getAllEmployees(){
    const url = API_URL + "/getWorkers"
    return axios.get(url)
}

export function addWorker(jsonObject){
    const url = API_URL + "/addWorker";
    return axios.post(url, jsonObject, {headers: HEADER});
}


export function getWorkersByProjectId(projectId){
  const url = API_URL + "/getAllWorkerFromProject?projectId="+projectId;
  return axios.post(url, {}, {headers: HEADER})
}

export function assignWorkerToPosition(workerId){
  const url = API_URL + "/findFreePosition?workerId="+workerId;
  return axios.post(url, {}, {headers: HEADER});
}


export function getFreeWorkers(){
  const url = API_URL + "/getFreeWorkers";
  return axios.get(url);
}
