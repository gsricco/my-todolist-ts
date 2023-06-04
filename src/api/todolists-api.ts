import axios from "axios";
import {LoginParamsType, TaskType, TodolistType, UpdateTasksModelType, ResponseType, GetTasksResponse} from "./types";

const setting = {
    withCredentials: true,
    headers: {
        'API-KEY': '0a6bf10a-0783-484b-91da-65d7e9fda051'
    }
}
const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    ...setting
})

// API
export const authAPI = {
    login(data: LoginParamsType) {
        return instance.post<ResponseType<{ userId?: number }>>('auth/login', data)
    },
    logout(){
        return instance.delete<ResponseType<{ userId?: number }>>('auth/login')

    },
    me(){
        return instance.get<ResponseType<{ id: number, email:string, login:string }>>('auth/me')
    },
}


export const todolistAPI = {
    getTodolists() {
        return instance.get<Array<TodolistType>>('todo-lists')
    },
    createTodolist(title: string) {
        return instance.post<ResponseType<{ item: TodolistType }>>('todo-lists', {title})
    },
    deleteTodolist(todolistId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}`)
    },
    updateTodolistTitle(todolistId: string, title: string) {
        return instance.put<ResponseType>(`todo-lists/${todolistId}`, {title: title})
    },
    getTasks(todolistId: string) {
        return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`)
    },
    createTask(todolistId: string, title: string) {
        return instance.post<ResponseType<{ item: TaskType }>>(`todo-lists/${todolistId}/tasks`, {title})
    },
    deleteTasks(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTasksModelType) {
        return instance.put<ResponseType<UpdateTasksModelType>>(`todo-lists/${todolistId}/tasks/${taskId}`, {
            title: model.title,
            description: model.description,
            status: model.status,
            priority: model.priority,
            startDate: model.startDate,
            deadline: model.deadline
        })
    }
}

