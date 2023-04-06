import {setAppStatusAC} from "../../app/app-reducer";
import {handlerServerAppError, handlerServerNetworkError} from "../../utils/error-utils";
import {authAPI, LoginParamsType} from "../../api/todolists-api";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Dispatch} from "redux";
import {clearTasksAndTodolists} from "../../common/actions/common.actions";

const initialState = {
    isLoggedIn: false
}

const slice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value
        }
    }
})


export const authReducer = slice.reducer;
//     (state: InitialStateType = initialState, action: LoginActionsType): InitialStateType => {
//     switch (action.type) {
//         case 'login/SET-IS-LOGGED-IN':
//         return {...state, isLoggedIn:action.value}
//         default:
//             return state;
//     }
// }
// Action
// export const setIsLoggedInAC = (value: boolean) =>
//     ({type: 'login/SET-IS-LOGGED-IN', value}) as const

// export const setIsLoggedInAC = slice.actions.setIsLoggedInAC
export const {setIsLoggedInAC} = slice.actions


//Thunk
export const loginTC = (data: LoginParamsType) => (dispatch:Dispatch) => {
    dispatch(setAppStatusAC({status:'loading'}))
    authAPI.login(data)
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value:true}))
                dispatch(setAppStatusAC({status:'succeeded'}))
            } else {
                handlerServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handlerServerNetworkError(error, dispatch)
        })
}
export const logoutTC = () => (dispatch:Dispatch) => {
    dispatch(setAppStatusAC({status:'loading'}))
    authAPI.logout()
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value:false}))
                dispatch(clearTasksAndTodolists({tasks:{},todolists:[]}))
                // dispatch(clearTasksAndTodolists({},[]))
                dispatch(setAppStatusAC({status:'succeeded'}))
            } else {
                handlerServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handlerServerNetworkError(error, dispatch)
        })
}


// Types
// export type LoginActionsType =
//     | ReturnType<typeof setIsLoggedInAC>
//
// type InitialStateType = {
//     isLoggedIn: boolean
// }


