import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const backend = axios.create({
  // baseURL: "https://api-sarc.zettabyte.tech/api/auth/",
  baseURL: "http://192.168.1.15:8000/api/",
});

backend.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("jwt");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});
