import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

export const getAnonymousId = async () => {
  try {
    let id = await AsyncStorage.getItem('user_anon_id');
    if (!id) {
      id = Crypto.randomUUID();
      await AsyncStorage.setItem('user_anon_id', id);
    }
    return id;
  } catch (e) {
    console.error("Failed to manage Anon ID", e);
  }
};