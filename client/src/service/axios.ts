import axiosInstance from "axios";
import { getBaseUrl } from "./url";

export const axios = axiosInstance.create({
  baseURL: getBaseUrl()
});

axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
