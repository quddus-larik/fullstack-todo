import useSWR from "swr";


export function useUser() {
    const { data, error, isLoading } = useSWR('me/', (url) => api.get(url).then(res => res.data));
    return {
        user: data,
        isError: error,
        isUserLoading: isLoading
    };
}

export function useTasks() {
    // SWR uses the global fetcher from RootLayout
    const { data, error, mutate } = useSWR('/tasks/');

    return {
        tasks: data?.results || data || [],
        isLoading: !error && !data,
        isError: error,
        mutateTasks: mutate
    };
}
export function useFriendRequest(){
    const { data, error, mutate } = useSWR('/friendships/requests/');
    return { 
        requests: data?.results || data || [], // Fallback to empty array
        isLoading: !error && !data, 
        isError: error, 
        mutateRequests: mutate 
    };
}

export function useFriends(){
    const { data, error, mutate } = useSWR('/friendships/accepted_friends/');
    // 🚩 FIX: Don't just do data?.data. 
    // If your backend returns { data: [...] }, this works. 
    // But we add || [] to prevent the .map() crash.
    return { 
        friends: data?.data || data?.results || data || [], 
        isLoading: !error && !data, 
        isError: error, 
        mutateFriends: mutate 
    };
}
export function useGroups() {
  const { data, error, mutate } = useSWR('/groups/');
  
  return {
    groups: data?.data.results || data || [],
    isLoading: !error && !data,
    isError: error,
    mutateGroups: mutate
  };
}