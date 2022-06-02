
import * as axios from "axios"
const http = axios.create({
    baseURL: "http://localhost:5000/",
    timeout: 5000,
    responseType: "json"
})

export const httpGet= (url)=>{
    return http.get(url)
    .then((data)=>data.data)
}

export const httpPut=(url,data)=>{
    return http.put(url,data)
    .then(console.log)
}
