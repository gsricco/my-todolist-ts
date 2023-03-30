import React from 'react'
import { Provider } from 'react-redux'
import { combineReducers, createStore } from 'redux'
import { v1 } from 'uuid'
import {TaskPriorities, TaskStatuses} from '../api/todolists-api'
import { AppRootStateType } from '../state/store'
import { tasksReducer } from '../state/tasks-reducer'
import { todolistsReducer } from '../state/todolists-reducer'


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})

const initialGlobalState = {
    todolists: [
        {id: 'todolistId1', title: 'What to learn', addedDate: '', order: 0, filter: "all"},
        {id: 'todolistId2', title: 'What to buy', addedDate: '', order: 0, filter: "all"}
    ],
    tasks: {
        ['todolistId1']: [
            {id: v1(), title: 'HTML&CSS', todoListId: 'todolistId1',
                status: TaskStatuses.Completed,
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low},
            {id: v1(), title: 'JS', todoListId: 'todolistId1',
                status: TaskStatuses.New,
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low}
        ],
        ['todolistId2']: [
            {id: v1(), title: 'Milk', todoListId: 'todolistId2',
                status: TaskStatuses.New,
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low},
            {id: v1(), title: 'React Book', todoListId: 'todolistId2',
                status: TaskStatuses.Completed,
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low}
        ]
    }
}

export const storyBookStore = createStore(rootReducer, initialGlobalState as AppRootStateType)

export const ReduxStoreProviderDecorator = (story:any) => {
    return <Provider store={storyBookStore}>{story()}</Provider>

}
