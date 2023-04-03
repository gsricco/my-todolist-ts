import {setAppErrorAC, setAppStatusAC} from "../app/app-reducer";
import {ResponseType} from "../api/todolists-api";
import {AppDispatch} from "../app/store";

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