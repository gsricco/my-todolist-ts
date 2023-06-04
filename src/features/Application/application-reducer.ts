import {authAPI} from "../../api/todolists-api";
import {handlerAsyncServerAppError, handlerAsyncServerNetworkError} from "../../utils/error-utils";
import {setIsLoggedIn} from "../Login/login-reducer";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {AxiosError} from "axios";
import {appActions} from "../CommonActions/AplicationCommonActions";

const initialState: InitialStateType = {
    status: 'idle',
    error: null,
    isInitialized: false
}

// Thunk
const initializedApp = createAsyncThunk('application/initializedApp', async (param, thunkAPI) => {
    try {
        const res = await authAPI.me()
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setIsLoggedIn({value: true}))
        } else {
            return handlerAsyncServerAppError(res.data,thunkAPI)
        }
    } catch (e) {
        // const error: AxiosError = e as AxiosError;
        // handlerServerNetworkError(error, dispatch)
        // return rejectWithValue({errors: [error.message], fieldsErrors: undefined})
        return handlerAsyncServerNetworkError(e as AxiosError,thunkAPI)

    }
})

export const asyncActions = {
   initializedApp
}

export const slice = createSlice({
    name: 'app',
    initialState: initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(initializedApp.fulfilled, (state, action) => {
            state.isInitialized = true;
        })
        builder.addCase(appActions.setAppError, (state, action) => {
            state.error = action.payload.error
        })
        builder.addCase(appActions.setAppStatus, (state, action) => {
            state.status = action.payload.status
        })
    }
})


// Types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed';
export type InitialStateType = {
    status: RequestStatusType
    error: string | null
    isInitialized: boolean
}
