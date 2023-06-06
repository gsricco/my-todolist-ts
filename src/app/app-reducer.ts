const initialState: InitialStateType = {
    status: 'idle',
    error: null,
    isInitialized: false
}


export const appReducer = (state: InitialStateType = initialState, action: AppReducerActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case 'APP/SET-IS-INITIALIZED':
            return {...state, isInitialized:action.value}
        default:
            return state
    }
}

// Action
export const setAppErrorAC = (error: string | null) => ({type: 'APP/SET-ERROR', error}) as const
export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status}) as const
export const setAppInitializedAC = (value: boolean) => ({type: 'APP/SET-IS-INITIALIZED', value}) as const



// Thunk
// export const initializedAppTC = (): AppThunkType => async (dispatch) => {
//    const res = await authAPI.me()
//        if(res.data.resultCode === 0) {
//             dispatch(setIsLoggedInAC(true))
//         } else {
//         }
//         dispatch(setAppInitializedAC(true))
// }

// Types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export type InitialStateType = {
    status: RequestStatusType
    error: string | null
    isInitialized:boolean
}
export type SetErrorActionType = ReturnType<typeof setAppErrorAC>
export type AppReducerActionsType =
    | SetErrorActionType
    | ReturnType<typeof setAppStatusAC>
    | ReturnType<typeof setAppInitializedAC>