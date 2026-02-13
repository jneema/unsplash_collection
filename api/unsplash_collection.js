import api from ".";

export const search = async (query, page = 1) => { // Added page parameter
  try {
    // Pass both query and page to the backend
    const response = await api.get(`/api/unsplash/search`, {
      params: { 
        query: query,
        page: page,
        per_page: 30 // Maximize the 30-per-page rule
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error searching:", error);
    throw error;
  }
};