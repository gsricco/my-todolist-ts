import {rootReducer, store} from '../app/store'
import {FieldErrorType} from "../api/types";

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type RootReducerType = typeof rootReducer
export type ThunkError = {rejectValue: { errors: Array<string>, fieldsErrors?: Array<FieldErrorType> }}