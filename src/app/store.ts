import {tasksReducer} from '../features/TodolistsList/tasks-reducer';
import {todolistsReducer} from '../features/TodolistsList/todolists-reducer';
import {combineReducers} from 'redux';
import thunkMiddleware from "redux-thunk";
import {appReducer} from "./app-reducer";
import {authReducer} from "../features/Login/auth-reducer";
import {configureStore} from "@reduxjs/toolkit";

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    login: authReducer
})
// непосредственно создаём store
// export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().prepend(thunkMiddleware)
})

export type RootState = ReturnType<typeof store.getState>

// определить автоматически тип всего объекта состояния
// export type AppRootStateType = ReturnType<typeof rootReducer>

// все виды action для всего App
// export type AppActionsType =
    // | TasksActionsType
    // | TodolistsActionsType
    // | AppReducerActionsType
    // | LoginActionsType

// export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AppActionsType>
export type AppDispatch = typeof store.dispatch

// export type AppThunkType<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AppActionsType>


// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;
