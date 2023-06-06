import {call, put, takeEvery} from "redux-saga/effects";
import {setAppStatusAC} from "../../app/app-reducer";
import {AxiosResponse} from "axios";
import {ResponseType, todolistAPI, TodolistType} from "../../api/todolists-api";
import {
    addTodolistAC,
    changeTodolistEntityStatusAC,
    changeTodolistTitleAC,
    removeTodolistAC,
    setTodolistsAC
} from "./todolists-reducer";


//Sagas
export function* fetchTodolistsWorkerSaga(action: ReturnType<typeof fetchTodolists>) {
    yield put(setAppStatusAC('loading'))
    const res: AxiosResponse<Array<TodolistType>> = yield call(todolistAPI.getTodolists)
    yield put(setTodolistsAC(res.data))
    yield put(setAppStatusAC('succeeded'))
}

export function* removeTodolistWorkerSaga(action: ReturnType<typeof removeTodolistSaga>) {
    yield put(setAppStatusAC('loading'))
    yield put(changeTodolistEntityStatusAC(action.todolistId, 'loading'))
    const res: AxiosResponse<ResponseType> = yield call(todolistAPI.deleteTodolist, action.todolistId)
    if (res.data.resultCode === 0) {
        yield put(removeTodolistAC(action.todolistId))
        yield put(setAppStatusAC('succeeded'))
    }
}

export function* addTodolistWorkerSaga(action: ReturnType<typeof addTodolistSaga>) {
    yield put(setAppStatusAC('loading'))
    const res: AxiosResponse<ResponseType<{
        item: TodolistType
    }>> = yield call(todolistAPI.createTodolist, action.title)
    if (res.data.resultCode === 0) {
        yield put(addTodolistAC(res.data.data.item))
        yield put(setAppStatusAC('succeeded'))
    }
}

export function* changeTodolistTitleWorkerSaga(action: ReturnType<typeof changeTodolistTitleSaga>) {
    yield put(setAppStatusAC('loading'))
    const res: AxiosResponse<ResponseType> = yield call(todolistAPI.updateTodolistTitle, action.todolistId, action.title)
    if (res.data.resultCode === 0) {
        yield put(changeTodolistTitleAC(action.todolistId, action.title))
        yield put(setAppStatusAC('succeeded'))
    }
}

export const fetchTodolists = () => ({type: 'TODOLISTS/FETCH-TODOLISTS'})
export const removeTodolistSaga = (todolistId: string) => ({type: 'TODOLISTS/REMOVE-TODOLISTS', todolistId})
export const addTodolistSaga = (title: string) => ({type: 'TODOLISTS/ADD-TODOLISTS', title})
export const changeTodolistTitleSaga = (todolistId: string, title: string) => ({type: 'TODOLISTS/CHANGE-TITLE-TODOLISTS',todolistId,title})


export function* tasksWatcherSaga() {
    yield takeEvery('TODOLISTS/FETCH-TODOLISTS', fetchTodolistsWorkerSaga)
    yield takeEvery('TODOLISTS/REMOVE-TODOLISTS', removeTodolistWorkerSaga)
    yield takeEvery('TODOLISTS/ADD-TODOLISTS', addTodolistWorkerSaga)
    yield takeEvery('TODOLISTS/CHANGE-TITLE-TODOLISTS', changeTodolistTitleWorkerSaga)

}