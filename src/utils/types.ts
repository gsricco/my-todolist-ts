import {store} from '../app/store'
import {FieldErrorType} from "../api/types";
import {rootReducer} from "../app/reducers";

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type RootReducerType = typeof rootReducer
export type ThunkError = {rejectValue: { errors: Array<string>, fieldsErrors?: Array<FieldErrorType> }}