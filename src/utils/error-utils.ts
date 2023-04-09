import {setAppErrorAC, setAppStatusAC} from "../app/app-reducer";
import {ResponseType} from "../api/todolists-api";
import {AppDispatch} from "../app/store";
import {Dispatch} from "redux";

export const  handlerServerAppError = <Here>(data:ResponseType<Here>, dispatch:Dispatch)=>{
if(data.messages.length) {
    dispatch(setAppErrorAC({error:data.messages[0]}))
}  else {
    dispatch(setAppErrorAC({error:'some error occurred'}))
}
dispatch(setAppStatusAC({status:'failed'}))
}

export const handlerServerNetworkError = (error: { message:string },dispatch:Dispatch)=>{
    dispatch(setAppErrorAC({error:error.message ? error.message : 'Some error occurred'}))
    dispatch(setAppStatusAC({status:'failed'}))
}