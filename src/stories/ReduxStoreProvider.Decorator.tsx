import React from 'react'
import {Provider} from 'react-redux'
import {applyMiddleware, combineReducers, legacy_createStore as createStore} from 'redux'
import {v1} from 'uuid'
import {TaskPriorities, TaskStatuses} from '../api/todolists-api'
import {AppRootStateType} from '../app/store'
import {tasksReducer} from '../features/TodolistsList/tasks-reducer'
import {todolistsReducer} from '../features/TodolistsList/todolists-reducer'
import {appReducer} from "../app/app-reducer";
import thunkMiddleware from "redux-thunk";


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer
})

const initialGlobalState: AppRootStateType = {
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
        status: 'idle',
        error: null
    }
}

export const storyBookStore = createStore(rootReducer, initialGlobalState, applyMiddleware(thunkMiddleware))

export const ReduxStoreProviderDecorator = (story: any) => {
    return <Provider store={storyBookStore}>{story()}</Provider>

}
