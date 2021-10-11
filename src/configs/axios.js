import axios from "axios";

const route = localStorage.getItem("route");

const api = axios.create({
  baseURL: route,
});

export { api, route };
