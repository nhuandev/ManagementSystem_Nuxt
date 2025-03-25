import { API_ENDPOINTS } from "~/constants/api";
import axios from 'axios'
// Tạo task
export const createTask = async (task: {
    name: string;
    description: string;
    assignedTo: string; // ID của người phụ trách
    projectId: string; // ID của dự án
    status: string;
    priority: string;
    deadline: string;
}) => {
    const payload = {
        name: task.name,
        description: task.description,
        assignedTo: task.assignedTo,
        projectId: task.projectId,
        status: task.status,
        priority: task.priority,
        deadline: task.deadline
    }

    const response = await axios.post(API_ENDPOINTS().API_ADD_TASK, payload, {
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

export const listTasks = async(page: number, limit: number) => {
    const response = await axios.get(API_ENDPOINTS().API_LIST_TASK, {
        params: { page, limit },
        headers: {
            'Content-Type': 'application/json',
          },
        withCredentials: true,
    });

    if(response.data.status == 200){
        return response.data;
    } 

    if(!response || !response.data) {
        return new Error('No response or empty data from API');
    }
    
}