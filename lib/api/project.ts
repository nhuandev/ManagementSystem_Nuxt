import axios from 'axios'
import { API_ENDPOINTS } from '~/constants/api';

// Tao dự án 
export const createProject = async (project: {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
    managerId: Object;
    teamMembers: Object[]
}) => {
    const payload = {
        name: project.name,
        description: project.description,
        startDate: project.startDate,
        endDate: project.endDate,
        status: project.status,
        managerId: project.managerId,
        teamMembers: project.teamMembers
    }

    const response = await axios.post(API_ENDPOINTS().API_ADD_PROJECT, payload, {
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

// Danh sách dự án 
export const listProject = async (page: number, limit: number) => {
  try {
    const response = await axios.get(API_ENDPOINTS().API_LIST_PROJECT, {
      params: { page, limit },
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    return response.data;
  } catch (e) {
    console.error('Error fetching project:', e);

    throw createError({
      statusCode: 401,
      statusMessage: 'Chưa được xác thực',
      data: {
        myCustomField: true,
      },
    });
  }
};

