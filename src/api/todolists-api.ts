import axios from "axios";
import {UpdateTodolistTitle} from "../stories/todolists-api.stories";


const setting = {
    withCredentials: true,
    'API-KEY': '0a6bf10a-0783-484b-91da-65d7e9fda051'
}

export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}
type _CreateTodolistResponseType = {
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
}
type ResponseType<TypeHere> = {
    resultCode: number
    messages: string[],
    data: TypeHere
}
export const todolistAPI = {
    getTodolists() {
        return axios.get<Array<TodolistType>>('https://social-network.samuraijs.com/api/1.1/todo-lists', setting)
    },

    createTodolist(title: string) {

        return axios.post<ResponseType<{ item: TodolistType }>>('https://social-network.samuraijs.com/api/1.1/todo-lists', {title}, setting)
    },

    deleteTodolist(todolistId: string) {
        return axios.delete<ResponseType<{}>>(`https://social-network.samuraijs.com/api/1.1/todo-lists/${todolistId}`, setting)
    },

    updateTodolistTitle(todolistId: string, title: string) {
        return axios.put<ResponseType<{}>>(`https://social-network.samuraijs.com/api/1.1/todo-lists/${todolistId}`, {title: title}, setting)
    }


}