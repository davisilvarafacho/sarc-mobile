import axios from "axios";

export const auth = axios.create({
    // baseURL: "https://api-sarc.zettabyte.tech/api/auth/",
    baseURL: "http://192.168.1.15:8000/api/auth/",
})

