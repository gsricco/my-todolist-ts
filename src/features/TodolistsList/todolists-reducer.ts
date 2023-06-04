import {TodolistType} from "../../api/types";
import {RequestStatusType} from "../Application";
import {appActions} from "../CommonActions";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTasksAndTodolists} from "../../common/actions/common.actions";
import {AxiosError} from "axios";
import {handlerAsyncServerAppError, handlerAsyncServerNetworkError} from "../../utils/error-utils";
import {ThunkError} from "../../utils/types";
import {todolistAPI} from "../../api/todolists-api";

const initialState: Array<TodolistsDomainType> = []

const {setAppStatus}= appActions

const fetchTodolistsTC = createAsyncThunk<{todolists:TodolistType[]}, undefined, ThunkError>('todolists/fetchTodolists', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: 'loading'}))
    try {
        const res = await todolistAPI.getTodolists()
        thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
        return {todolists: res.data};
    } catch (e) {
        return handlerAsyncServerNetworkError(e as AxiosError,thunkAPI)
    }
})
const removeTodolistTC = createAsyncThunk<{todolistId:string},string, ThunkError>('todolists/removeTodolist', async (todolistId, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: 'loading'}))
    thunkAPI.dispatch(changeTodolistEntityStatus({id: todolistId, entityStatus: 'loading'}))
    try {
        const res = await todolistAPI.deleteTodolist(todolistId)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
            return {todolistId}
        } else {
            return handlerAsyncServerAppError(res.data,thunkAPI)
        }
    } catch (e) {
        return handlerAsyncServerNetworkError(e as AxiosError,thunkAPI)
    }
})
const addTodolistTC = createAsyncThunk<
    {todolist:TodolistType},
    string,
    ThunkError
>
('todolists/addTodolist', async (title, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: 'loading'}))
    try {
        const res = await todolistAPI.createTodolist(title)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
            return {todolist: res.data.data.item}
        } else {
            return handlerAsyncServerAppError(res.data,thunkAPI)
        }
    } catch (e) {
        return handlerAsyncServerNetworkError(e as AxiosError,thunkAPI)
    }
})
const changeTodolistTitleTC = createAsyncThunk<{id: string, title:string},{todolistId: string,title: string}, ThunkError >('todolists/changeTodolistTitle', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: 'loading'}))
    try {
        const res = await todolistAPI.updateTodolistTitle(param.todolistId, param.title)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
            return {id: param.todolistId, title: param.title}
        } else {
            return handlerAsyncServerAppError(res.data,thunkAPI)
        }
    } catch (e) {
        return handlerAsyncServerNetworkError(e as AxiosError,thunkAPI)
    }
})

export const asyncActions = {
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
        builder
            .addCase(clearTasksAndTodolists, (state, action) => {
            return action.payload.todolists
        })
            .addCase(fetchTodolistsTC.fulfilled, (state, action) => {
            return action.payload.todolists.map(t => ({...t, filter: "all", entityStatus: "idle"}))
        })
            .addCase(removeTodolistTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.todolistId);
            if (index > -1) {
                state.splice(index, 1);
            }
        })
            .addCase(addTodolistTC.fulfilled, (state, action) => {
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
        })
            .addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
            if (action.payload) {
                const index = state.findIndex(tl => tl.id === action.payload.id);
                if (index > -1) {
                    state[index].title = action.payload.title;
                }
            }
        });
    },
})

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