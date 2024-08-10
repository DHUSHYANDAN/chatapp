// lib/api-client.js
import axios from "axios";
import { HOST } from "@/utils/constants";
// console.log("HOST:", HOST);
export const apiClient = axios.create({
  baseURL: HOST,
  withCredentials: true,


});
