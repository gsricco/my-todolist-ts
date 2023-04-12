import {authAPI} from "../api/todolists-api";
import {handlerServerAppError, handlerServerNetworkError} from "../utils/error-utils";
import {setIsLoggedInAC} from "../features/Login/login-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios/index";

const initialState: InitialStateType = {
    status: 'idle',
    error: null,
    isInitialized: false
}

// Thunk
const initializedAppTC = createAsyncThunk('app/initializedApp', async (param, {dispatch, rejectWithValue}) => {
    try {
        const res = await authAPI.me()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({value: true}))
        } else {
            handlerServerAppError(res.data, dispatch)
        }
    } catch (e) {
        const error: AxiosError = e as AxiosError;
        handlerServerNetworkError(error, dispatch)
        return rejectWithValue({errors: [error.message], fieldsErrors: undefined})
    }
})

export const asyncActions = {
    initializedAppTC
}

const slice = createSlice({
    name: 'app',
    initialState: initialState,
    reducers: {
        setAppErrorAC(state, action: PayloadAction<{ error: string | null }>) {
            state.error = action.payload.error
        },
        setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        },
    },
    extraReducers: builder => {
        builder.addCase(initializedAppTC.fulfilled, (state, action) => {
            state.isInitialized = true;
        });
    }
})

export const appReducer = slice.reducer;

export const {
    setAppErrorAC,
    setAppStatusAC,
} = slice.actions


// Types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed';
export type InitialStateType = {
    status: RequestStatusType
    error: string | null
    isInitialized: boolean
}
