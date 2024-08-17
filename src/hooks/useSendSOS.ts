// hooks/useSendSOS.ts
import { useMutation } from '@tanstack/react-query';
import { sendSOS } from '../service/ago';

interface SOSRequest {
  startLat: number;
  startLong: number;
  date: string;
  time: string;
  desc: string;
  type : string;
  model: string;
  endLat : number,
  endLong : number,
}

interface SOSResponse {
  success: boolean;
  message?: string;
}

const useSendSOS = () => {
    return useMutation<SOSResponse, Error, SOSRequest>({
      mutationFn: async ({ startLat, startLong,endLat , endLong ,  date, time, desc, type, model }) => {
        return await sendSOS(startLat, startLong,endLat , endLong , date, time, desc, type, model);
      },
      onError: (error) => {
        console.error('Error sending SOS:', error);
      },
      onSuccess: (data) => {
        console.log('SOS sent successfully:', data);
      },
    });
  };

export default useSendSOS;
