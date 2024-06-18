import {useMutation} from '@tanstack/react-query';
import {login} from '../service/ago';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';

const useLogin = () => {
  return useMutation({
    mutationFn: ({phoneNo, password}) => login(phoneNo, password),
    onSuccess: async data => {
      try {
        await AsyncStorage.setItem('token', data.token);
        Snackbar.show({
          text: 'Logged in successfully',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: 'green',
        });
      } catch (error) {
        console.error('Failed to save the token to async storage:', error);
        Snackbar.show({
          text: 'Failed to save the token. Please try again.',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: 'red',
        });
      }
    },
    onError: error => {
      const message =
        error.response?.data?.message || 'An unexpected error occurred';
      Snackbar.show({
        text: message,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
      });
      console.log('Login failed:', error);
    },
  });
};

export default useLogin;
