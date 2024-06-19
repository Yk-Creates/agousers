import { useMutation } from '@tanstack/react-query';
import Snackbar from 'react-native-snackbar';
import { signup } from '../service/ago';

const useSignup = () => {
  return useMutation({
    mutationFn: ({ name, phoneNo, password }) => signup(name, phoneNo, password),
    onSuccess: () => {
      Snackbar.show({
        text: 'Signed up successfully',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'green',
      });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'An unexpected error occurred';
      Snackbar.show({
        text: message,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
      });
      console.error('Signup failed:', error);
    },
  });
};

export default useSignup;
