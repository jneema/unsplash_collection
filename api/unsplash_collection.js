import api from ".";

export const search = async (query, page = 1) => {
  try {
    const response = await api.get(`/api/unsplash/search`, {
      params: {
        query: query,
        page: page,
        per_page: 30,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching:", error);
    throw error;
  }
};

export const getPhotoDetails = async (photoId) => {
  try {
    const response = await api.get(`/api/unsplash/photos/${photoId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching photo details:", error);
    throw error;
  }
};

export const trackPhotoDownload = async (photo) => {
  return await api.post(`/api/unsplash/track-download`, {
    unsplash_id: photo.id,
    image_url: photo.urls.full,
    download_location: photo.links.download_location,
  });
};

export const getCollections = async () => {
  const response = await api.get("/api/collections");
  return response.data;
};

export const createCollection = async (name) => {
  const response = await api.post("/api/collections", { name });
  return response.data;
};

export const getCollectionImages = async (collectionId) => {
  const response = await api.get(`/api/collections/${collectionId}/images`);
  return response.data;
};

export const addImageToCollection = async (collectionId, photoData) => {
  try {
    const response = await api.post(`/api/collections/${collectionId}/images`, {
      unsplash_id: photoData.unsplash_id,
      image_url: photoData.image_url,
      download_location: photoData.download_location,
    });
    return response.data;
  } catch (error) {
    console.error(
      "API Error adding image:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const removeImageFromCollection = async (collectionId, unsplashId) => {
  try {
    const response = await api.delete(
      `/api/collections/${collectionId}/images/${unsplashId}`,
    );

    return response.data;
  } catch (error) {
    console.error("API Error (removeImage):", error);
    throw error;
  }
};

export const updateCollection = async (id, name) => {
  try {
    const res = await api.put(
      `/api/collections/${id}?name=${encodeURIComponent(name)}`,
    );
    return res.data;
  } catch (error) {
    console.error("API Error updating collection:", error);
    throw error;
  }
};

export const deleteFullCollection = async (id) => {
  try {
    const res = await api.delete(`/api/collections/${id}`);
    return res.data;
  } catch (error) {
    console.error("API Error deleting collection:", error);
    throw error;
  }
};
