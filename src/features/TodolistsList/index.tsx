
import { TodolistsList } from './TodolistsList'
import {asyncActions as tasksAsyncActions,slice as tasksSlice} from './tasks-reducer'
import {asyncActions as todolistsAsyncActions, slice as todolistsSlice} from './todolists-reducer'

const todolistsActions = {
    ...todolistsAsyncActions,
    ...todolistsSlice.actions,
}

const tasksActions ={
    ...tasksAsyncActions,
    ...todolistsSlice.actions
}

const todolistsReducer = todolistsSlice.reducer
const tasksReducer = tasksSlice.reducer


export {
    tasksActions,
    todolistsActions,
    TodolistsList,
    todolistsReducer,
    tasksReducer
}