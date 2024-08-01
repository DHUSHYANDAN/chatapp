import axios  from "axios";
import {HOST} from "@/utils/constants";

const apiClient=axios.create({
    baseURL:HOST,
})