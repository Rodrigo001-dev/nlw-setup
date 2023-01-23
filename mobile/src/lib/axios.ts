import axios from "axios";

export const api = axios.create({
  baseURL: "http://172.17.48.211:3333",
});
