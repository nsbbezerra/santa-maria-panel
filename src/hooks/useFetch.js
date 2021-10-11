import useSwr from "swr";
import { api } from "../configs/axios";

export default function useFetch(url) {
  const { data, error, mutate } = useSwr(
    [url],
    async (url) => {
      const response = await api.get(url);
      return response.data;
    },
    {
      revalidateOnReconnect: true,
      refreshInterval: 5000,
      revalidateOnFocus: true,
    }
  );
  return { data, error, mutate };
}
