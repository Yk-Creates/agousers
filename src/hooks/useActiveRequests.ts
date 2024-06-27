// hooks/useActiveRequests.js
import {useQuery} from '@tanstack/react-query';
import {getActiveRequests} from '../service/ago';

const useActiveRequests = () => {
  return useQuery({
    queryKey: ['activeRequests'],
    queryFn: getActiveRequests,
  });
};

export default useActiveRequests;
