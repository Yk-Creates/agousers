import {useQuery} from '@tanstack/react-query';
import {getData, getRates} from '../service/ago';

const useGetCabRates = () => {
  return useQuery({
    queryKey: ['getCabRates'],
    queryFn: getRates,
  });
};

export default useGetCabRates;
