import {todolistAPI, TodolistType} from "../../api/todolists-api";
import {RequestStatusType, setAppStatusAC} from "../../app/app-reducer";
import {handlerServerAppError, handlerServerNetworkError} from "../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Dispatch} from "redux";

const initialState: Array<TodolistsDomainType> = []

const slice = createSlice({
    name: 'todolists',
    initialState: initialState,
    reducers: {
        removeTodolistAC(state, action: PayloadAction<{ todolistId: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId);
            if (index > -1) {
                state.splice(index, 1);
            }
        },
        addTodolistAC(state, action: PayloadAction<{ todolist: TodolistType }>) {
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
        },
        changeTodolistTitleAC(state, action: PayloadAction<{ id: string, title: string }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id);
            if (index > -1) {
                state[index].title = action.payload.title;
            }
        },
        changeTodolistFilterAC(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id);
            if (index > -1) {
                state[index].filter = action.payload.filter;
            }
        },
        changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string, entityStatus: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id);
            if (index > -1) {
                state[index].entityStatus = action.payload.entityStatus;
            }
        },
        setTodolistsAC(state, action: PayloadAction<{ todolists: Array<TodolistType> }>) {
            return action.payload.todolists.map(t => ({...t, filter: "all", entityStatus: "idle"}))
        },
    }
})

export const todolistsReducer = slice.reducer;

export const {
    removeTodolistAC,
    addTodolistAC,
    changeTodolistTitleAC,
    changeTodolistFilterAC,
    changeTodolistEntityStatusAC,
    setTodolistsAC
} = slice.actions


/*
// export const todolistsReducer = (state: Array<TodolistsDomainType> = initialState, action: TodolistsActionsType): Array<TodolistsDomainType> => {
//     switch (action.type) {
//         // case 'REMOVE-TODOLIST':
        //     return state.filter(tl => tl.id != action.id);
        // case 'ADD-TODOLIST':
        //     return [{...action.todolist, filter: 'all', entityStatus: 'idle'}, ...state]
        // case 'CHANGE-TODOLIST-TITLE':
        //     return state.map(t => t.id === action.id ? {...t, title: action.title} : t)
        // case 'CHANGE-TODOLIST-FILTER':
        //     return state.map(t => t.id === action.id ? {...t, filter: action.filter} : t)
        // case 'CHANGE-TODOLIST-ENTITY-STATUS':
        //     return state.map(t => t.id === action.id ? {...t, entityStatus: action.entityStatus} : t)
        // case "SET-TODOLISTS":
        // return
//             action.todolists.map(t => ({...t, filter: "all", entityStatus: "idle"}))
//         default:
//             return state;
//     }
// }

// Action
// export const removeTodolistAC = (todolistId: string) => ({type: 'REMOVE-TODOLIST', id: todolistId}) as const
// export const addTodolistAC = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', todolist}) as const
// export const changeTodolistTitleAC = (id: string, title: string) =>
//     ({type: 'CHANGE-TODOLIST-TITLE', id: id, title: title}) as const
// export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) =>
//     ({type: 'CHANGE-TODOLIST-FILTER', id: id, filter: filter}) as const
// export const changeTodolistEntityStatusAC = (id: string, entityStatus: RequestStatusType) =>
//     ({type: 'CHANGE-TODOLIST-ENTITY-STATUS', id: id, entityStatus}) as const
// export const setTodolistsAC = (todolists: Array<TodolistType>) => ({type: "SET-TODOLISTS", todolists}) as const
*/

// Thunk
export const fetchTodolistsTC = () => (dispatch:Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistAPI.getTodolists()
        .then((res) => {
            dispatch(setTodolistsAC({todolists: res.data}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        })
        .catch((error) => {
            handlerServerNetworkError(error, dispatch)
        })
}
export const removeTodolistTC = (todolistId: string) => (dispatch:Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTodolistEntityStatusAC({id:todolistId, entityStatus:'loading'}))
    todolistAPI.deleteTodolist(todolistId)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(removeTodolistAC({todolistId}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handlerServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handlerServerNetworkError(error, dispatch)
        })
}
export const addTodolistTC = (title: string) => (dispatch:Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistAPI.createTodolist(title)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(addTodolistAC({todolist:res.data.data.item}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handlerServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handlerServerNetworkError(error, dispatch)
        })
}
export const changeTodolistTitleTC = (todolistId: string, title: string) => (dispatch:Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistAPI.updateTodolistTitle(todolistId, title)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(changeTodolistTitleAC({id:todolistId, title}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handlerServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handlerServerNetworkError(error, dispatch)
        })
}


// Types
export type  AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>

// export type TodolistsActionsType =
//     | RemoveTodolistActionType
//     | AddTodolistActionType
//     | ReturnType<typeof changeTodolistTitleAC>
//     | ReturnType<typeof changeTodolistFilterAC>
//     | ReturnType<typeof changeTodolistEntityStatusAC>
//     | SetTodolistsActionType
// | SetErrorActionType

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistsDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}