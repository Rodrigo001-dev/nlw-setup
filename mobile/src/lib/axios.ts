import axios from "axios";

export const api = axios.create({
  baseURL: "http://172.28.193.126:3333",
});
