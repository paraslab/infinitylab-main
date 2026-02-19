import api from "./axios";

/* ---------------- PUBLIC ---------------- */

// Get media by key (no auth required)
export const getMediaByKey = (key) => {
  return api.get(`/media/${key}`);
};

/* ---------------- ADMIN ---------------- */

// List media (admin)
export const getAllMedia = () => {
  return api.get("/media");
};

// Create media
export const createMedia = (formData) => {
  return api.post("/media", formData);
};

// Update media by key
export const updateMediaByKey = (key, formData) => {
  return api.post(`/media/${key}`, formData);
};

// Delete media
export const deleteMedia = (id) => {
  return api.delete(`/media/${id}`);
};
