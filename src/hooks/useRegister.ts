import {useMutation} from '@tanstack/react-query';
import {login, register} from '../service/ago';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Snackbar from 'react-native-snackbar';

const useRegister = (navigation: any) => {
  return useMutation({
    mutationFn: ({name, phoneNo, password}: any) =>
      register(name, phoneNo, password),
    onSuccess: async data => {
      try {
        Snackbar.show({
          text: 'Registered successfully',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: 'green',
        });
        navigation.navigate('login');
      } catch (error) {
        console.log('error');
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
      console.log('Register Failed failed:', error);
    },
  });
};

export default useRegister;
