import {useQuery} from '@tanstack/react-query';
import {getData} from '../service/ago';

const useGetTextData = () => {
  return useQuery({
    queryKey: ['getTestData'],
    queryFn: getData,
  });
};

export default useGetTextData;
