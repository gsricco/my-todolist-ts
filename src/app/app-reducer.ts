import {authAPI} from "../api/todolists-api";
import {handlerServerAppError, handlerServerNetworkError} from "../utils/error-utils";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";
import {Dispatch} from "redux";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: InitialStateType = {
    status: 'idle',
    error: null,
    isInitialized: false
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
        setAppInitializedAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isInitialized = action.payload.value
        },
    }
})

export const appReducer = slice.reducer;

export const {setAppErrorAC,setAppStatusAC,setAppInitializedAC} = slice.actions




// export const appReducer = (state: InitialStateType = initialState, action: AppReducerActionsType): InitialStateType => {
//     switch (action.type) {
//         case 'APP/SET-STATUS':
//             return {...state, status: action.status}
//         case 'APP/SET-ERROR':
//             return {...state, error: action.error}
//         case 'APP/SET-IS-INITIALIZED':
//             return {...state, isInitialized:action.value}
//         default:
//             return state
//     }
// }
//
// // Action
// export const setAppErrorAC = (error: string | null) => ({type: 'APP/SET-ERROR', error}) as const
// export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status}) as const
// export const setAppInitializedAC = (value: boolean) => ({type: 'APP/SET-IS-INITIALIZED', value}) as const

// Thunk
export const initializedAppTC = () => (dispatch:Dispatch) => {
    authAPI.me().then(res=>{
        if(res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({value:true}))
        } else {
            handlerServerAppError(res.data, dispatch)
        }
        dispatch(setAppInitializedAC({value:true}))
    })
        .catch((error)=>{
            handlerServerNetworkError(error,dispatch)
        })
}

// Types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type InitialStateType = {
    status: RequestStatusType
    error: string | null
    isInitialized:boolean
}
// export type SetErrorActionType = ReturnType<typeof setAppErrorAC>
// export type AppReducerActionsType =
//     | SetErrorActionType
//     | ReturnType<typeof setAppStatusAC>
//     | ReturnType<typeof setAppInitializedAC>