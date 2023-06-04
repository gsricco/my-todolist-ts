import {tasksReducer, todolistsReducer} from '../features/TodolistsList';
import {combineReducers} from 'redux';
import thunkMiddleware from "redux-thunk";
import {appReducer} from "../features/Application";
import {loginReducer} from "../features/Login";
import {configureStore} from "@reduxjs/toolkit";

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
export const rootReducer = combineReducers({
    app: appReducer,
    login: loginReducer,
    tasks: tasksReducer,
    todolists: todolistsReducer,
})

// непосредственно создаём store
export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().prepend(thunkMiddleware)
})


// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;


