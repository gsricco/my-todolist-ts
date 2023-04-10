import {todolistAPI, TodolistType} from "../../api/todolists-api";
import {RequestStatusType, setAppStatusAC} from "../../app/app-reducer";
import {handlerServerAppError, handlerServerNetworkError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Dispatch} from "redux";
import {clearTasksAndTodolists} from "../../common/actions/common.actions";
import {AxiosError} from "axios/index";

const initialState: Array<TodolistsDomainType> = []


// Thunk
export const fetchTodolistsTC = createAsyncThunk('todolists/fetchTodolists', async (param, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    const res = await todolistAPI.getTodolists()
    try {
        // dispatch(setTodolistsAC({todolists: res.data}))
        dispatch(setAppStatusAC({status: 'succeeded'}))
        return {todolists: res.data};
    } catch (e) {
        const error: AxiosError = e as AxiosError
        handlerServerNetworkError(error, dispatch)
        return rejectWithValue(error)
    }
})


export const removeTodolistTC = createAsyncThunk('todolists/removeTodolist', async (todolistId: string, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    dispatch(changeTodolistEntityStatusAC({id: todolistId, entityStatus: 'loading'}))
    const res = await todolistAPI.deleteTodolist(todolistId)
    try {
        if (res.data.resultCode === 0) {
            // dispatch(removeTodolistAC({todolistId}))
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
export const addTodolistTC = createAsyncThunk('todolists/addTodolist', async (title: string, {
    dispatch,
    rejectWithValue
}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    const res = await todolistAPI.createTodolist(title)
    try {
        if (res.data.resultCode === 0) {
            // dispatch(addTodolistAC({todolist: res.data.data.item}))
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


export const changeTodolistTitleTC = createAsyncThunk('todolists/changeTodolistTitle', async (param:{todolistId: string, title: string}, {dispatch,rejectWithValue}) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    const res = await todolistAPI.updateTodolistTitle(param.todolistId, param.title)
    try {
        if (res.data.resultCode === 0) {
            // dispatch(changeTodolistTitleAC({id: todolistId, title}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
            return {id: param.todolistId, title:param.title}
        } else {
            handlerServerAppError(res.data, dispatch)
        }
    }catch (e) {
        const error: AxiosError = e as AxiosError
        handlerServerNetworkError(error, dispatch)
        return rejectWithValue(error)
    }
})





const slice = createSlice({
    name: 'todolists',
    initialState: initialState,
    reducers: {
        // removeTodolistAC(state, action: PayloadAction<{ todolistId: string }>) {
        //     const index = state.findIndex(tl => tl.id === action.payload.todolistId);
        //     if (index > -1) {
        //         state.splice(index, 1);
        //     }
        // },
        // addTodolistAC(state, action: PayloadAction<{ todolist: TodolistType }>) {
        //     state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
        // },
        // changeTodolistTitleAC(state, action: PayloadAction<{ id: string, title: string }>) {
        //     const index = state.findIndex(tl => tl.id === action.payload.id);
        //     if (index > -1) {
        //         state[index].title = action.payload.title;
        //     }
        // },
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
        // setTodolistsAC(state, action: PayloadAction<{ todolists: Array<TodolistType> }>) {
        //     return action.payload.todolists.map(t => ({...t, filter: "all", entityStatus: "idle"}))
        // },
        // clearTodolists: () => {return []}

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
    // removeTodolistAC,
    // addTodolistAC,
    // changeTodolistTitleAC,
    changeTodolistFilterAC,
    changeTodolistEntityStatusAC,
    // setTodolistsAC,
} = slice.actions


// Types
// export type  AddTodolistActionType = ReturnType<typeof addTodolistAC>
// export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
// export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistsDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}