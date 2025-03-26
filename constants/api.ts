export const useConfig = () => {
    const config = useRuntimeConfig();
    return {
        API_BASE_URL: config.public.API_BASE_URL,
    };
};

export const API_ENDPOINTS = () => {
    const { API_BASE_URL } = useConfig();
    return {
        // User
        API_ADD_USER: `${API_BASE_URL}/user/register`,
        API_LOGIN: `${API_BASE_URL}/user/login`,
        API_LIST_USER: `${API_BASE_URL}/user/list`,
        API_DELETE_USER: `${API_BASE_URL}/user/delete`,
        API_UPDATE_USER: `${API_BASE_URL}/user/update`,
        API_PROFILE_USER: `${API_BASE_URL}/user/profile`,

        // Project
        API_ADD_PROJECT: `${API_BASE_URL}/project/create`,
        API_LIST_PROJECT: `${API_BASE_URL}/project/list`,

        // Depart
        API_ADD_DEPART: `${API_BASE_URL}/depart/create`,
        API_LIST_DEPART: `${API_BASE_URL}/depart/list`,
        API_DELETE_DEPART: `${API_BASE_URL}/depart/delete`,

        // Task
        API_ADD_TASK: `${API_BASE_URL}/task/create`,
        API_LIST_TASK: `${API_BASE_URL}/task/list`,
    };
};






