import {todolistAPI, TodolistType} from "../../api/todolists-api";
import {AppThunkType} from "../../app/store";
import {RequestStatusType, SetErrorActionType, setAppStatusAC} from "../../app/app-reducer";
import {handlerServerAppError, handlerServerNetworkError} from "../../utils/error-utils";

const initialState: Array<TodolistsDomainType> = []

export const todolistsReducer = (state: Array<TodolistsDomainType> = initialState, action: TodolistsActionsType): Array<TodolistsDomainType> => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id != action.id);
        case 'ADD-TODOLIST':
            return [{...action.todolist, filter: 'all', entityStatus:'idle'}, ...state]
        case 'CHANGE-TODOLIST-TITLE':
            return state.map(t => t.id === action.id ? {...t, title: action.title} : t)
        case 'CHANGE-TODOLIST-FILTER':
            return state.map(t => t.id === action.id ? {...t, filter: action.filter} : t)
        case 'CHANGE-TODOLIST-ENTITY-STATUS':
            return state.map(t => t.id === action.id ? {...t, entityStatus: action.entityStatus} : t)
        case "SET-TODOLISTS":
            return action.todolists.map(t => ({...t, filter: "all", entityStatus:"idle"}))
        default:
            return state;
    }
}

// Action
export const removeTodolistAC = (todolistId: string) => ({type: 'REMOVE-TODOLIST', id: todolistId}) as const
export const addTodolistAC = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', todolist}) as const
export const changeTodolistTitleAC = (id: string, title: string) =>
    ({type: 'CHANGE-TODOLIST-TITLE', id: id, title: title}) as const
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) =>
    ({type: 'CHANGE-TODOLIST-FILTER', id: id, filter: filter}) as const
export const changeTodolistEntityStatusAC = (id: string, entityStatus: RequestStatusType) =>
    ({type: 'CHANGE-TODOLIST-ENTITY-STATUS', id: id, entityStatus}) as const
export const setTodolistsAC = (todolists: Array<TodolistType>) => ({type: "SET-TODOLISTS", todolists}) as const

// Thunk
// export const fetchTodolistsTC = (): AppThunkType => (dispatch) => {
//     dispatch(setAppStatusAC('loading'))
//     todolistAPI.getTodolists()
//         .then((res) => {
//             dispatch(setTodolistsAC(res.data))
//             dispatch(setAppStatusAC('succeeded'))
//         })
//         .catch((error)=>{
//             handlerServerNetworkError(error,dispatch)
//         })
// }
// export const removeTodolistTC = (todolistId: string): AppThunkType => (dispatch) => {
//     dispatch(setAppStatusAC('loading'))
//     dispatch(changeTodolistEntityStatusAC(todolistId,'loading'))
//     todolistAPI.deleteTodolist(todolistId)
//         .then((res) => {
//             if(res.data.resultCode === 0) {
//                 dispatch(removeTodolistAC(todolistId))
//                 dispatch(setAppStatusAC('succeeded'))
//             } else {
//                 handlerServerAppError(res.data, dispatch)
//             }
//         })
//         .catch((error)=>{
//             handlerServerNetworkError(error,dispatch)
//         })
// }
// export const addTodolistTC = (title: string): AppThunkType => (dispatch) => {
//         dispatch(setAppStatusAC('loading'))
//     todolistAPI.createTodolist(title)
//         .then((res) => {
//             if(res.data.resultCode === 0) {
//             dispatch(addTodolistAC(res.data.data.item))
//                 dispatch(setAppStatusAC('succeeded'))
//             } else {
//                 handlerServerAppError(res.data, dispatch)
//             }
//         })
//         .catch((error)=>{
//             handlerServerNetworkError(error,dispatch)
//         })
// }
// export const changeTodolistTitleTC = (todolistId: string, title: string): AppThunkType => (dispatch) => {
//     dispatch(setAppStatusAC('loading'))
//     todolistAPI.updateTodolistTitle(todolistId, title)
//         .then((res) => {
//             if(res.data.resultCode === 0) {
//             dispatch(changeTodolistTitleAC(todolistId, title))
//             dispatch(setAppStatusAC('succeeded'))
//             } else {
//                 handlerServerAppError(res.data, dispatch)
//             }
//         })
//         .catch((error)=>{
//             handlerServerNetworkError(error,dispatch)
//         })
// }


// Types
export type  AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>

export type TodolistsActionsType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>
    | ReturnType<typeof changeTodolistEntityStatusAC>
    | SetTodolistsActionType
    | SetErrorActionType

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistsDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus:RequestStatusType
}