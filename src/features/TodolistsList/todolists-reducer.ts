import {todolistAPI, TodolistType} from "../../api/todolists-api";
import {RequestStatusType, setAppStatusAC} from "../../app/app-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTasksAndTodolists} from "../../common/actions/common.actions";
// import {addTodolistTC, changeTodolistTitleTC, fetchTodolistsTC, removeTodolistTC} from "./todolists-actions";
import {AxiosError} from "axios/index";
import {handlerServerAppError, handlerServerNetworkError} from "../../utils/error-utils";

const initialState: Array<TodolistsDomainType> = []

const fetchTodolistsTC = createAsyncThunk('todolists/fetchTodolists', async (param, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistAPI.getTodolists()
        dispatch(setAppStatusAC({status: 'succeeded'}))
        return {todolists: res.data};
    } catch (e) {
        const error: AxiosError = e as AxiosError
        handlerServerNetworkError(error, dispatch)
        return rejectWithValue(error)
    }
})
const removeTodolistTC = createAsyncThunk('todolists/removeTodolist', async (todolistId: string, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTodolistEntityStatus({id: todolistId, entityStatus: 'loading'}))
    try {
        const res = await todolistAPI.deleteTodolist(todolistId)
        if (res.data.resultCode === 0) {
            dispatch(setAppStatusAC({status: 'succeeded'}))
            return {todolistId}
        } else {
            handlerServerAppError(res.data, dispatch)
        }
    } catch (e) {
        const error: AxiosError = e as AxiosError
        handlerServerNetworkError(error, dispatch)
        return rejectWithValue(error)
    }
})
const addTodolistTC = createAsyncThunk('todolists/addTodolist', async (title: string, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistAPI.createTodolist(title)
        if (res.data.resultCode === 0) {
            dispatch(setAppStatusAC({status: 'succeeded'}))
            return {todolist: res.data.data.item}
        } else {
            handlerServerAppError(res.data, dispatch)
        }
    } catch (e) {
        const error: AxiosError = e as AxiosError
        handlerServerNetworkError(error, dispatch)
        return rejectWithValue(error)
    }
})
const changeTodolistTitleTC = createAsyncThunk('todolists/changeTodolistTitle', async (param: {
    todolistId: string,
    title: string
}, {dispatch, rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistAPI.updateTodolistTitle(param.todolistId, param.title)
        if (res.data.resultCode === 0) {
            dispatch(setAppStatusAC({status: 'succeeded'}))
            return {id: param.todolistId, title: param.title}
        } else {
            handlerServerAppError(res.data, dispatch)
        }
    } catch (e) {
        const error: AxiosError = e as AxiosError
        handlerServerNetworkError(error, dispatch)
        return rejectWithValue(error)
    }
})

export const asyncActions ={
    fetchTodolistsTC,
    removeTodolistTC,
    addTodolistTC,
    changeTodolistTitleTC
}

export const slice = createSlice({
    name: 'todolists',
    initialState: initialState,
    reducers: {
        changeTodolistFilter(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id);
            if (index > -1) {
                state[index].filter = action.payload.filter;
            }
        },
        changeTodolistEntityStatus(state, action: PayloadAction<{ id: string, entityStatus: RequestStatusType }>) {
            const index = state.findIndex(tl => tl.id === action.payload.id);
            if (index > -1) {
                state[index].entityStatus = action.payload.entityStatus;
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(clearTasksAndTodolists, (state, action) => {
            return action.payload.todolists
        });
        builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
            return action.payload.todolists.map(t => ({...t, filter: "all", entityStatus: "idle"}))
        });
        builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
            // @ts-ignore
            const index = state.findIndex(tl => tl.id === action.payload.todolistId);
            if (index > -1) {
                state.splice(index, 1);
            }
        });
        builder.addCase(addTodolistTC.fulfilled, (state, action) => {
            // @ts-ignore
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
        });
        builder.addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
            if (action.payload) {
                // @ts-ignore
                const index = state.findIndex(tl => tl.id === action.payload.id);
                if (index > -1) {
                    state[index].title = action.payload.title;
                }
            }
        });
    },
})

export const todolistsReducer = slice.reducer;

export const {
    changeTodolistFilter,
    changeTodolistEntityStatus,
} = slice.actions


// Types
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistsDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}