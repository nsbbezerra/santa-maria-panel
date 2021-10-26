import axios from "axios";
import { configs } from "./index";

const route = configs.production_url;

const api = axios.create({
  baseURL: route,
});

export { api, route };
