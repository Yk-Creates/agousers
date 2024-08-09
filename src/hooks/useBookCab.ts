import { useMutation, UseMutationResult } from '@tanstack/react-query';
import Snackbar from 'react-native-snackbar';
import { bookCab as bookCabApi } from '../service/ago';

interface CabDetails {
  startLat: number | null;
  startLong: number | null;
  endLat: number | null;
  endLong: number | null;
  date: string;
  time: string;
  type: string;
  model: string;
  desc: string; // Change this to `string` instead of `String`
}

interface ApiResponse<T = any> {
  data: T;
}

const useBookCab = (): UseMutationResult<ApiResponse, Error, CabDetails> => {
  return useMutation({
    mutationFn: (cabDetails: CabDetails) => bookCabApi(cabDetails),
    onSuccess: data => {
      console.log('Cab booked');
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'An unexpected error occurred';
      Snackbar.show({
        text: message,
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
      });
      console.error('Error details:', error.response?.data);
    }
    
  });
};

export default useBookCab;
