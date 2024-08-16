// api.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ApiResponse, BookCabParams } from '../types';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: 'https://agobackend-test.onrender.com/api/v1',
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

export const register = async (name: any, phoneNo: any, password: any) => {
  const response = await apiClient.post('/users/register', {
    name,
    phoneNo,
    password,
  });
  return response.data;
};
export const getRates = async () => {
  const response = await apiClient.get('/cab/get-cab-rates');
  return response.data;
};

export const bookCab = async (params: BookCabParams): Promise<ApiResponse<any>> => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (!token) {
      throw new Error('Token is required');
    }

    const response = await apiClient.post('/cab/bookcab', params, {
      headers: {
        token: token,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error booking cab:', error);
    throw error;
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

export const getRequestHistory = async () => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (!token) {
      throw new Error('Token is required');
    }

    const response = await apiClient.get('/users/getallrequests', {
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
