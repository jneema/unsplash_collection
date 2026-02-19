import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "app",
  initialState: {
    collectionsCount: 0,
    likedPhotos: [],
  },
  reducers: {
    setCollectionsCount: (state, action) => {
      state.collectionsCount = action.payload;
    },
    toggleLikePhoto: (state, action) => {
      const photo = action.payload;
      const exists = state.likedPhotos.find((p) => p.id === photo.id);
      if (exists) {
        state.likedPhotos = state.likedPhotos.filter((p) => p.id !== photo.id);
      } else {
        state.likedPhotos.push(photo);
      }
    },
  },
});

export const { setCollectionsCount, toggleLikePhoto } = appSlice.actions;
export default appSlice.reducer;
