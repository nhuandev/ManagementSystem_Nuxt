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
        API_LIST_USER: `${API_BASE_URL}/user/list`,
        API_DELETE_USER: `${API_BASE_URL}/user/delete`,
        API_DELETE_EDIT: `${API_BASE_URL}/user/edit`,

        // Project
        API_ADD_PROJECT: `${API_BASE_URL}/project/create`,
        API_LIST_PROJECT: `${API_BASE_URL}/project/list`,

        // Depart
        API_ADD_DEPART: `${API_BASE_URL}/depart/create`,
        API_LIST_DEPART: `${API_BASE_URL}/depart/list`,
    };
};






