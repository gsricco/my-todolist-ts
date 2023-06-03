import {setAppErrorAC, setAppStatusAC} from "../app/app-reducer";
import {ResponseType} from "../api/todolists-api";
import {AppDispatch, ThunkError} from "../app/store";
import {Dispatch} from "redux";
import {BaseThunkAPI} from "@reduxjs/toolkit/dist/createAsyncThunk";
import axios from "axios";
import {AxiosError} from "axios";

export const handlerServerAppError = <Here>(data: ResponseType<Here>, dispatch: Dispatch, showError = true) => {
    if (showError) {
        dispatch(setAppErrorAC({error:data.messages.length? data.messages[0]: 'some error occurred'}))
    }
    dispatch(setAppStatusAC({status: 'failed'}))
}

export const handlerServerNetworkError = (error: { message: string }, dispatch: Dispatch, showError = true) => {
    if(showError){
        dispatch(setAppErrorAC({error: error.message ? error.message : 'Some error occurred'}))
    }
    dispatch(setAppStatusAC({status: 'failed'}))
}

export const handlerAsyncServerAppError = <Here>(data: ResponseType<Here>, thunkAPI:ThunkAPIType,  showError = true) => {
    if (showError) {
        thunkAPI.dispatch(setAppErrorAC({error:data.messages.length? data.messages[0]: 'some error occurred'}))
    }
    thunkAPI.dispatch(setAppStatusAC({status: 'failed'}))
    return thunkAPI.rejectWithValue({errors: data.messages, fieldsErrors: data.fieldsErrors})

}

export const handlerAsyncServerNetworkError = (error:AxiosError, thunkAPI:ThunkAPIType, showError = true) => {
    if(showError){
        thunkAPI.dispatch(setAppErrorAC({error: error.message ? error.message : 'Some error occurred'}))
    }
    thunkAPI.dispatch(setAppStatusAC({status: 'failed'}))

    return thunkAPI.rejectWithValue({error:[error.message], fieldsErrors:undefined})
}

type ThunkAPIType ={
    dispatch:(action:any)=>any
    rejectWithValue:Function
}