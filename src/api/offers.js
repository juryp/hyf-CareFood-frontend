import queryString from "./config/query.js";
import http from "./config/http.js";
const api = {
  get: (inputQuery) => {
    const query = queryString(inputQuery);
    console.log(inputQuery)
    return http.get(`/offers${query}`);
  },
};

export default api;
