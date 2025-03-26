import { API_ENDPOINTS } from "~/constants/api";
import axios from 'axios'


// Tao dự án 
export const createDepart = async (depart: {
  departName: string,
  description: string,
  isActive: boolean
}) => {
  const payload = {
    departName: depart.departName,
    description: depart.description,
    isActive: true
  }

  const response = await axios.post(API_ENDPOINTS().API_ADD_DEPART, payload, {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  if (!response || !response.data) {
    throw new Error('No response or empty data from API');
  }
  return response.data;
}

export const listDepart = async (page: number, limit: number) => {
  try {
    const response = await axios.get(API_ENDPOINTS().API_LIST_DEPART, {
      params: { page, limit },
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    return response.data;
  } catch (e) {
    console.error('Error fetching depart:', e);

    throw createError({
      statusCode: 401,
      statusMessage: 'Chưa được xác thực',
      data: {
        myCustomField: true,
      },
    });
  }
};
export const deleteDepart = async (id: string) => {
  try {
    const response = await axios.post(
      API_ENDPOINTS().API_DELETE_DEPART,
      { id },  // Gửi dữ liệu đúng format (object)
      { withCredentials: true }
    );
    return response.data;
  } catch (e) {
    console.error('Error fetching users:', e);
    throw createError({
      statusCode: 401,
      statusMessage: 'Chưa được xác thực',
      data: { myCustomField: true }
    });
  }
}


export const getDepartById = async (id: string) => {
  return await $fetch(`/api/depart/${id}`);
};

export const updateDepart = async (id: string, data: any) => {
  return await $fetch(`/api/depart/${id}`, {
    method: 'PUT',
    body: data,
  });
};
