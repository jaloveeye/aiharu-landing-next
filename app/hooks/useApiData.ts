import useSWR from "swr";

export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useApiData<T = any>(url: string | null) {
  const { data, error, isLoading, mutate } = useSWR<T>(url, fetcher);
  return { data, error, isLoading, mutate };
}
