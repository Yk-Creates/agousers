// hooks/useActiveRequests.js
import {useQuery} from '@tanstack/react-query';
import {getRequestHistory} from '../service/ago';

const useGetRequestHistory = () => {
  return useQuery({
    queryKey: ['requesthistory'],
    queryFn: getRequestHistory,
  });
};

export default useGetRequestHistory;
