import {createAction} from "@reduxjs/toolkit";
import {TasksStateType} from "../../features/TodolistsList/tasks-reducer";
import {TodolistsDomainType} from "../../features/TodolistsList/todolists-reducer";

type ClearTasksAndTodolistsType = {
    tasks: TasksStateType,
    todolists:Array<TodolistsDomainType>

}
export const clearTasksAndTodolists = createAction<ClearTasksAndTodolistsType>('common/clear-tasks-todolists')
