import axios from "axios";

export const api = axios.create({
  baseURL: "https://cnab-reader.onrender.com/api/",
});
