import axios from "axios";
import {UpdateTodolistTitle} from "../stories/todolists-api.stories";


const setting = {
    withCredentials: true,
    headers: {
        'API-KEY': '0a6bf10a-0783-484b-91da-65d7e9fda051'
    }
}
const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    // withCredentials: true,
    // headers: {
    //     'API-KEY': '0a6bf10a-0783-484b-91da-65d7e9fda051'
    // }
    ...setting
})

export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}
/*type _CreateTodolistResponseType = {
    resultCode: number
    messages: string[],
    data: {
        item: TodolistType
    }
}
type _DeleteTodolistResponseType = {
    resultCode: number
    messages: Array<string>,
    data: {}
}
type _UpdateTodolistResponseType = {
    resultCode: number
    messages: Array<string>,
    data: {}
}*/
type ResponseType<TypeHere = {}> = {
    resultCode: number
    messages: string[],
    data: TypeHere
}
export type TaskType = {

    description: string
    title: string
    status: number
    priority: number
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}

type GetTasksResponse = {
    error: string | null
    totalCount: number
    items: TaskType[]
}
type UpdateTasksModelType = {
    title: string
    description: string|null
    status: number
    priority: number
    startDate: string|null
    deadline: string|null
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
        return instance.post<ResponseType<{items: TaskType[]}>>(`todo-lists/${todolistId}/tasks`, {title})
    },

    deleteTasks(todolistId: string, taskId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
    },

    updateTask(todolistId: string, taskId: string,  model: UpdateTasksModelType) {
        return instance.put<UpdateTasksModelType>(`todo-lists/${todolistId}/tasks/${taskId}`, {title: model.title, description: model.description, status: model.status, priority: model.priority, startDate: model.startDate, deadline: model.deadline})
    }

}