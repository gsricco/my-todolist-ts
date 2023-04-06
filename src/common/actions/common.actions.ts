import {createAction, nanoid} from "@reduxjs/toolkit";
import {TasksStateType} from "../../features/TodolistsList/tasks-reducer";
import {TodolistsDomainType} from "../../features/TodolistsList/todolists-reducer";

type ClearTasksAndTodolistsType = {
    tasks: TasksStateType,
    todolists:Array<TodolistsDomainType>

}
export const clearTasksAndTodolists = createAction<ClearTasksAndTodolistsType>('common/clear-tasks-todolists')


// export const clearTasksAndTodolists = createAction('common/clear-tasks-todolists',
//     ( tasks: TasksStateType, todolists:Array<TodolistsDomainType>)=>{
//         let random = 100
//         return{
//             payload:{
//                 tasks,
//                 todolists,
//                 id: random > 90 ? nanoid():Math.random()
//             }
//         }
//     })