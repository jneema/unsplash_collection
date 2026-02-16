import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getCollections } from '../api/unsplash_collection';
import { setCollectionsCount } from '../store/appSlice';

export const useInitialData = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const init = async () => {
      try {
        const data = await getCollections();
        dispatch(setCollectionsCount(data.length));
      } catch (error) {
        console.error("Failed to pre-fetch collections for badge:", error);
      }
    };

    init();
  }, [dispatch]);
};