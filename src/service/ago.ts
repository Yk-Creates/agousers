// api.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: 'https://agobackend.onrender.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getData = async () => {
  const response = await apiClient.get('/users/usertest');
  return response.data;
};

export const login = async (phoneNo: any, password: any) => {
  const response = await apiClient.post('/users/login', {phoneNo, password});
  return response.data;
};
export const getRates = async () => {
  const response = await apiClient.get('/cab/getrate');
  return response.data;
};

export const bookCab = async ({
  startLat,
  startLong,
  endLat,
  endLong,
  date,
  time,
}: any) => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (!token) {
      throw new Error('Token is required');
    }

    const response = await apiClient.post(
      '/cab/bookcab',
      {
        startLat,
        startLong,
        endLat,
        endLong,
        date,
        time,
      },
      {
        headers: {
          token: token,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error('Error booking cab:', error);
    throw error; // Rethrow the error for the calling code to handle
  }
};

// api.js
export const getActiveRequests = async () => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (!token) {
      throw new Error('Token is required');
    }

    const response = await apiClient.get('/users/getactiverequests', {
      headers: {
        token: token,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching active requests:', error);
    throw error;
  }
};
