import {handlerAsyncServerAppError, handlerAsyncServerNetworkError} from "../../utils/error-utils";
import {authAPI} from "../../api/todolists-api";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTasksAndTodolists} from "../../common/actions/common.actions";
import {AxiosError} from "axios";
import {FieldErrorType, LoginParamsType} from "../../api/types";
import {appActions} from "../CommonActions/AplicationCommonActions";

const {setAppStatus} = appActions

//Thunk
const login = createAsyncThunk<undefined, LoginParamsType, {
    rejectValue: { errors: Array<string>, fieldsErrors?: Array<FieldErrorType> }
}>('auth/login', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: 'loading'}))
    try {
        const res = await authAPI.login(param);
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
            return;
        } else {
            return handlerAsyncServerAppError(res.data, thunkAPI)

        }
    } catch (e) {
        // const error: AxiosError = err as AxiosError;
        // handlerServerNetworkError(error, thunkAPI.dispatch)
        // return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined})
        return handlerAsyncServerNetworkError(e as AxiosError, thunkAPI)

    }
})
const logout = createAsyncThunk('auth/logout', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: 'loading'}))
    try {
        const res = await authAPI.logout()
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(clearTasksAndTodolists({tasks: {}, todolists: []}))
            thunkAPI.dispatch(setAppStatus({status: 'succeeded'}))
            return;
        } else {
            return handlerAsyncServerAppError(res.data, thunkAPI)
        }
    } catch (e) {
        // const error: AxiosError = e as AxiosError;
        // handlerServerNetworkError(error, thunkAPI.dispatch)
        // return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined})
        return handlerAsyncServerNetworkError(e as AxiosError, thunkAPI)

    }
})

export const asyncAction = {
    login,
    logout
}


export const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setIsLoggedIn(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value
        }
    },
    extraReducers: builder => {
        builder.addCase(login.fulfilled, (state, action) => {
            state.isLoggedIn = true
        });
        builder.addCase(logout.fulfilled, (state, action) => {
            state.isLoggedIn = false
        });
    }
})

export const loginReducer = slice.reducer;

export const {setIsLoggedIn} = slice.actions




