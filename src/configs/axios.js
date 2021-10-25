import axios from "axios";

const route = "https://vps34531.publiccloud.com.br";

const api = axios.create({
  baseURL: route,
});

export { api, route };
