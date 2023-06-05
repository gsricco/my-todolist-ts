import {combineReducers} from "redux";
import {appReducer} from "../features/Application";
import {loginReducer} from "../features/Login";
import {tasksReducer, todolistsReducer} from "../features/TodolistsList";




// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
export const rootReducer = combineReducers({
    app: appReducer,
    login: loginReducer,
    tasks: tasksReducer,
    todolists: todolistsReducer,
})