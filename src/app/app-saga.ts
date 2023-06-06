//Saga
import {AxiosResponse} from "axios";
import {authAPI, ResponseType} from "../api/todolists-api";
import {call, put, takeEvery} from "redux-saga/effects";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";
import {setAppInitializedAC} from "./app-reducer";

export function* appSaga() {
    const res: AxiosResponse<ResponseType<{ id: number, email: string, login: string }>> = yield call(authAPI.me)
    if (res.data.resultCode === 0) {
        yield put(setIsLoggedInAC(true))
    } else {
    }
    yield put(setAppInitializedAC(true))
}

export const initializeApp = () => ({type: 'APP/INITIALIZE-APP'})

export function* appWatcherSaga(){
    yield takeEvery('APP/INITIALIZE-APP', appSaga)
}