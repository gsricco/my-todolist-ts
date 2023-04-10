import {setAppStatusAC} from "../../app/app-reducer";
import {handlerServerAppError, handlerServerNetworkError} from "../../utils/error-utils";
import {authAPI, FieldErrorType, LoginParamsType} from "../../api/todolists-api";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {clearTasksAndTodolists} from "../../common/actions/common.actions";
import {Dispatch} from "redux";
import {AxiosError} from "axios";

export const loginTC = createAsyncThunk<undefined, LoginParamsType, {rejectValue: {errors:Array<string>,fieldsErrors?:Array<FieldErrorType>}}>('auth/login', async (param,thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await authAPI.login(param);
        if (res.data.resultCode === 0) {
            // thunkAPI.dispatch(setIsLoggedInAC({value: true}))
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return;
        } else {
            handlerServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({errors:res.data.messages, fieldsErrors:res.data.fieldsErrors})
        }
    } catch (err) {
        const error:AxiosError = err as AxiosError;
        handlerServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({errors:[error.message], fieldsErrors:undefined})
    }
})
export const logoutTC = createAsyncThunk('auth/logout', async (param, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try{
        const res = await authAPI.logout()
            if (res.data.resultCode === 0) {
                        thunkAPI.dispatch(clearTasksAndTodolists({tasks: {}, todolists: []}))
                        thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
                return;
                } else {
                    handlerServerAppError(res.data, thunkAPI.dispatch)
                }
    }catch (e) {
        const error:AxiosError = e as AxiosError;
        handlerServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({errors:[error.message], fieldsErrors:undefined})
    }
})

const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value
        }
    },
    extraReducers: builder => {
        builder.addCase(loginTC.fulfilled, (state, action) => {
            // if (action.payload)
                state.isLoggedIn = true
        });
        builder.addCase(logoutTC.fulfilled, (state, action) => {
                state.isLoggedIn = false
        });

    }
})


export const authReducer = slice.reducer;

export const {
    setIsLoggedInAC
} = slice.actions


//Thunk
// export const loginTC = (data: LoginParamsType) => (dispatch: Dispatch) => {
//     dispatch(setAppStatusAC({status: 'loading'}))
//     authAPI.login(data)
//         .then((res) => {
//             if (res.data.resultCode === 0) {
//                 dispatch(setIsLoggedInAC({value: true}))
//                 dispatch(setAppStatusAC({status: 'succeeded'}))
//             } else {
//                 handlerServerAppError(res.data, dispatch)
//             }
//         })
//         .catch((error) => {
//             handlerServerNetworkError(error, dispatch)
//         })
// }
// export const logoutTC = () => (dispatch: Dispatch) => {
//     dispatch(setAppStatusAC({status: 'loading'}))
//     authAPI.logout()
//         .then((res) => {
//             if (res.data.resultCode === 0) {
//                 dispatch(setIsLoggedInAC({value: false}))
//                 dispatch(clearTasksAndTodolists({tasks: {}, todolists: []}))
//                 // dispatch(clearTasksAndTodolists({},[]))
//                 dispatch(setAppStatusAC({status: 'succeeded'}))
//             } else {
//                 handlerServerAppError(res.data, dispatch)
//             }
//         })
//         .catch((error) => {
//             handlerServerNetworkError(error, dispatch)
//         })
// }


// Types


