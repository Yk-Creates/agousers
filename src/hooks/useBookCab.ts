import {useMutation} from '@tanstack/react-query';
import {bookCab as bookCabApi} from '../service/ago';
import Snackbar from 'react-native-snackbar';

const useBookCab = () => {
  return useMutation({
    mutationFn: cabDetails => bookCabApi(cabDetails),
    onSuccess: data => {
      console.log('cab booked');
    },
    onError: error => {
      const message =
        error.response?.data?.message || 'An unexpected error occurred';
      Snackbar.show({
        text: message,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
      });
      console.log('Booking cab failed:', error);
    },
  });
};

export default useBookCab;
