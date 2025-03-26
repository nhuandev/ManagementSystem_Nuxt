import axios from 'axios'
import { API_ENDPOINTS } from '~/constants/api';

// Tạo tài khoản người dùng (ADMIN hoặc MEMBER hoặc MANAGER )
export const createUser = async (userData: { userName: string; email: string; password: string; role: string; departmentId: string }) => {
  try {
    if (!userData.userName || userData.userName.trim() === '') {
      throw new Error('Username is required');
    }
    if (!userData.email || userData.email.trim() === '') {
      throw new Error('Email is required');
    }
    if (!userData.password || userData.password.trim() === '') {
      throw new Error('Password is required');
    }
    if (!userData.role) {
      throw new Error('Role must be either ADMIN or MANAGER or MEMBER ');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error('Invalid email format');
    }

    const payload = {
      username: userData.userName,
      email: userData.email,
      password: userData.password,
      role: userData.role,
      departmentId: userData.departmentId,
    };

    const response = await axios.post(API_ENDPOINTS().API_ADD_USER, payload, {
      withCredentials: true,
    });

    if (!response || !response.data) {
      throw new Error('No response or empty data from API');
    }

    return response.data;
  } catch (error: any) {
    console.error('Error creating user:', error.message || error);
    throw new Error(error.message || 'Failed to create user');
  }
};


// Danh sách người dùng
export const listUser = async (page: number, limit: number) => {
  try {
    const response = await axios.get(API_ENDPOINTS().API_LIST_USER, {
      params: { page, limit },
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
   
      return response.data;
  
  } catch (e) {
    console.error('Error fetching users:', e);

    throw createError({
      statusCode: 401,
      statusMessage: 'Chưa được xác thực',
      data: {
        myCustomField: true,
      },
    });
  }
};

// Xóa tài khoản
export const deleteUser = async (userName: string) => {
  try {
    const response = await axios.post(API_ENDPOINTS().API_DELETE_USER, userName, {
      withCredentials: true,
    });
    return response.data;
  } catch (e) {
    console.error('Error fetching users:', e);
    throw createError({
      statusCode: 401,
      statusMessage: 'Chưa được xác thực',
      data: {
        myCustomField: true
      }
    })
  }
}

// Cập nhật thông tin user
export const updateUser = async (id: string, updateData: Record<string, any>) => {
  const response = await axios.put(API_ENDPOINTS().API_UPDATE_USER, updateData, {
    params : {id},
    withCredentials: true,
  })
  return response.data
}

