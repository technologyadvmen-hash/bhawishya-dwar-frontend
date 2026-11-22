import api from "./api";

export const authService = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  getMe: () => api.get("/auth/me"),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (data) => api.post("/auth/reset-password", data),
  updateProfile: (data) => api.put("/auth/profile", data),
  changePassword: (data) => api.put("/auth/change-password", data),
  deleteAccount: () => api.delete("/auth/account"),
};

export const palmService = {
  upload: (formData) => api.post("/palm/upload", formData, { headers: { "Content-Type": "multipart/form-data" } }),
  analyze: (scanId) => api.post(`/palm/analyze/${scanId}`),
  getHistory: (params) => api.get("/palm/history", { params }),
  getById: (id) => api.get(`/palm/${id}`),
};

export const aiService = {
  generateReading: (data) => api.post("/ai/palm-reading", data),
  chat: (data) => api.post("/ai/chat", data),
  getUsage: () => api.get("/ai/usage"),
};

export const reportService = {
  getAll: (params) => api.get("/reports", { params }),
  getById: (id) => api.get(`/reports/${id}`),
  delete: (id) => api.delete(`/reports/${id}`),
  download: (id, lang = "en") =>
    api.get(`/reports/${id}/download`, { params: { lang }, responseType: "blob" }),
};

export const astrologyService = {
  getHoroscope: (data) => api.post("/astrology/horoscope", data),
  getBirthChart: (data) => api.post("/astrology/birth-chart", data),
  getNumerology: (data) => api.post("/astrology/numerology", data),
  getCompatibility: (data) => api.post("/astrology/compatibility", data),
  getHistory: (params) => api.get("/astrology/history", { params }),
};

export const adminService = {
  getDashboard: () => api.get("/admin/dashboard"),
  getUsers: (params) => api.get("/admin/users", { params }),
  getScans: (params) => api.get("/admin/scans", { params }),
  getReports: (params) => api.get("/admin/reports", { params }),
  getApiUsage: () => api.get("/admin/api-usage"),
  updateSettings: (data) => api.put("/admin/settings", data),
};
