import {v1} from 'uuid';
import {todolistAPI, TodolistType} from "../api/todolists-api";
import {AnyAction, Dispatch} from "redux";
import {AppActionsType, AppRootStateType, AppThunkType} from "./store";
import {ThunkAction} from "redux-thunk";

export type RemoveTodolistActionType = {
    type: 'REMOVE-TODOLIST',
    id: string
}
export type AddTodolistActionType = {
    type: 'ADD-TODOLIST',
    todolist: TodolistType
}
export type ChangeTodolistTitleActionType = {
    type: 'CHANGE-TODOLIST-TITLE',
    id: string
    title: string
}
export type ChangeTodolistFilterActionType = {
    type: 'CHANGE-TODOLIST-FILTER',
    id: string
    filter: FilterValuesType
}

export type SetTodolistsActionType = {
    type: 'SET-TODOLISTS'
    todolists: Array<TodolistType>
}




export type TodolistsActionsType = RemoveTodolistActionType
    | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType
    | SetTodolistsActionType

const initialState: Array<TodolistsDomainType> =  []

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistsDomainType = TodolistType & {
    filter: FilterValuesType
}

export const todolistsReducer = (state: Array<TodolistsDomainType> = initialState, action: TodolistsActionsType): Array<TodolistsDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id != action.id)
        }
        case 'ADD-TODOLIST': {
            const newTodolist:TodolistsDomainType = {...action.todolist, filter:'all'}
            return [newTodolist, ...state]
        }
        case 'CHANGE-TODOLIST-TITLE': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                // если нашёлся - изменим ему заголовок
                todolist.title = action.title;
            }
            return [...state]
        }
        case 'CHANGE-TODOLIST-FILTER': {
            const todolist = state.find(tl => tl.id === action.id);
            if (todolist) {
                // если нашёлся - изменим ему заголовок
                todolist.filter = action.filter;
            }
            return [...state]
        }
        case "SET-TODOLISTS":{

            return action.todolists.map(t=>{
                return {
                    ...t,
                    filter:"all"
                }
            })
        }
        default:
            return state;
    }
}

export const removeTodolistAC = (todolistId: string): RemoveTodolistActionType => {
    return { type: 'REMOVE-TODOLIST', id: todolistId}
}
export const addTodolistAC = (todolist:TodolistType): AddTodolistActionType => {
    return { type: 'ADD-TODOLIST', todolist}
}
export const changeTodolistTitleAC = (id: string, title: string): ChangeTodolistTitleActionType => {
    return { type: 'CHANGE-TODOLIST-TITLE', id: id, title: title}
}
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType): ChangeTodolistFilterActionType => {
    return { type: 'CHANGE-TODOLIST-FILTER', id: id, filter: filter}
}
export const setTodolistsAC = (todolists:Array<TodolistType>): SetTodolistsActionType => {
    return { type: "SET-TODOLISTS", todolists}
}

export const fetchTodolistsTC =():AppThunkType=> {
    return (dispatch) => {
        todolistAPI.getTodolists()
            .then((res) => {
                dispatch(setTodolistsAC(res.data))
            })
    }
}

export const removeTodolistTC =(todolistId:string):AppThunkType=> {
    return (dispatch) => {
        todolistAPI.deleteTodolist(todolistId)
            .then((res) => {
                dispatch(removeTodolistAC(todolistId))
            })
    }
}
export const addTodolistTC =(title:string):AppThunkType=> {
    return (dispatch) => {
        todolistAPI.createTodolist(title)
            .then((res) => {
                dispatch(addTodolistAC(res.data.data.item))
            })
    }
}

export const changeTodolistTitleTC =(todolistId:string,title:string):AppThunkType=> {
    return (dispatch) => {
        todolistAPI.updateTodolistTitle(todolistId,title)
            .then((res) => {
                dispatch(changeTodolistTitleAC(todolistId,title))
            })
    }
}




