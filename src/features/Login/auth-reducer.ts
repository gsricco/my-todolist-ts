import {AppThunkType} from "../../app/store";
import {setAppStatusAC} from "../../app/app-reducer";
import {handlerServerAppError, handlerServerNetworkError} from "../../utils/error-utils";
import {authAPI, LoginParamsType} from "../../api/todolists-api";

const initialState: InitialStateType = {
    isLoggedIn: false
}

export const authReducer = (state: InitialStateType = initialState, action: LoginActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
        return {...state, isLoggedIn:action.value}
        default:
            return state;
    }
}

// Action
export const setIsLoggedInAC = (value:boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value}) as const


//Thunk
export const loginTC = (data:LoginParamsType): AppThunkType => (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.login(data)
        .then((res) => {
            if(res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(true))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handlerServerAppError(res.data, dispatch)
            }
        })
        .catch((error)=>{
            handlerServerNetworkError(error,dispatch)
        })
}
export const logoutTC = (): AppThunkType => (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.logout()
        .then((res) => {
            if(res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(false))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                handlerServerAppError(res.data, dispatch)
            }
        })
        .catch((error)=>{
            handlerServerNetworkError(error,dispatch)
        })
}


// Types
export type LoginActionsType =
    | ReturnType<typeof setIsLoggedInAC>

type InitialStateType={
    isLoggedIn: boolean
}


