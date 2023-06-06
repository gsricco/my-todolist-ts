import {setAppErrorAC, setAppStatusAC} from "../app/app-reducer";
import {ResponseType} from "../api/todolists-api";
import {AppDispatch} from "../app/store";
import {put} from "redux-saga/effects";

export const  handlerServerAppError = <Here>(data:ResponseType<Here>, dispatch:AppDispatch)=>{
if(data.messages.length) {
    dispatch(setAppErrorAC(data.messages[0]))
}  else {
    dispatch(setAppErrorAC('some error occurred'))
}
dispatch(setAppStatusAC('failed'))
}

export const handlerServerNetworkError = (error: { message:string },dispatch:AppDispatch)=>{
    dispatch(setAppErrorAC(error.message ? error.message : 'Some error occurred'))
    dispatch(setAppStatusAC('failed'))
}
export function*  handlerServerAppErrorSaga <Here>(data:ResponseType<Here>){
    if(data.messages.length) {
        yield put(setAppErrorAC(data.messages[0]))
    }  else {
        yield put(setAppErrorAC('some error occurred'))
    }
    yield put(setAppStatusAC('failed'))
}

export function* handlerServerNetworkErrorSaga (error: { message:string }){
    yield put(setAppErrorAC(error.message ? error.message : 'Some error occurred'))
    yield put(setAppStatusAC('failed'))
}