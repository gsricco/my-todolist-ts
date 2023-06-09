import {appActions} from "../features/CommonActions";
import {ResponseType} from "../api/types";
import {AxiosError} from "axios";

export const handlerAsyncServerAppError = <Here>(data: ResponseType<Here>, thunkAPI:ThunkAPIType,  showError = true) => {
    if (showError) {
        thunkAPI.dispatch(appActions.setAppError({error:data.messages.length? data.messages[0]: 'some error occurred'}))
    }
    thunkAPI.dispatch(appActions.setAppStatus({status: 'failed'}))
    return thunkAPI.rejectWithValue({errors: data.messages, fieldsErrors: data.fieldsErrors})

}

export const handlerAsyncServerNetworkError = (error:AxiosError, thunkAPI:ThunkAPIType, showError = true) => {
    if(showError){
        thunkAPI.dispatch(appActions.setAppError({error: error.message ? error.message : 'Some error occurred'}))
    }
    thunkAPI.dispatch(appActions.setAppStatus({status: 'failed'}))

    return thunkAPI.rejectWithValue({error:[error.message], fieldsErrors:undefined})
}

type ThunkAPIType ={
    dispatch:(action:any)=>any
    rejectWithValue:Function
}