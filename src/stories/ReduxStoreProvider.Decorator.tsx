import React from 'react'
import {Provider} from 'react-redux'
import {combineReducers} from 'redux'
import {v1} from 'uuid'
import {TaskPriorities, TaskStatuses} from '../api/types'
import {tasksReducer, todolistsReducer} from '../features/TodolistsList'
import {appReducer} from "../features/Application";
import thunkMiddleware from "redux-thunk";
import {loginReducer} from "../features/Login/login-reducer";
import {RootReducerType, RootState} from "../utils/types";
import {configureStore} from "@reduxjs/toolkit";
import {HashRouter} from "react-router-dom";


const rootReducer: RootReducerType = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    login: loginReducer
})

const initialGlobalState: RootState = {
    todolists: [
        {id: 'todolistId1', title: 'What to learn', addedDate: '', order: 0, filter: "all", entityStatus: 'idle'},
        {id: 'todolistId2', title: 'What to buy', addedDate: '', order: 0, filter: "all", entityStatus: 'loading'}
    ],
    tasks: {
        ['todolistId1']: [
            {
                id: v1(), title: 'HTML&CSS', todoListId: 'todolistId1',
                status: TaskStatuses.Completed,
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low
            },
            {
                id: v1(), title: 'JS', todoListId: 'todolistId1',
                status: TaskStatuses.New,
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low
            }
        ],
        ['todolistId2']: [
            {
                id: v1(), title: 'Milk', todoListId: 'todolistId2',
                status: TaskStatuses.New,
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low
            },
            {
                id: v1(), title: 'React Book', todoListId: 'todolistId2',
                status: TaskStatuses.Completed,
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low
            }
        ]
    },
    app: {
        status: 'succeeded',
        error: null,
        isInitialized:true
    },
    login:{
        isLoggedIn: true
    },
}

export const storyBookStore = configureStore({
    reducer: rootReducer,
    preloadedState: initialGlobalState,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().prepend(thunkMiddleware)
})


export const ReduxStoreProviderDecorator = (story: any) => {
    return <Provider store={storyBookStore}>{story()}</Provider>
}

export const BrowserRouterDecorator = (story: any) => {
    return <HashRouter>{story()}</HashRouter>
}

