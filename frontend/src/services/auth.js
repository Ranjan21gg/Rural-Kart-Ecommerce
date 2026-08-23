import api from "./api";

export const fetchMe = () => api.get("/auth/me/");