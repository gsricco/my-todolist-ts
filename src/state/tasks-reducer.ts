// import {TaskType} from '../Todolist';
import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistsActionType} from './todolists-reducer';
import {TaskPriorities, TaskStatuses, TaskType, todolistAPI, UpdateTasksModelType} from "../api/todolists-api";
import {TasksStateType} from "../AppWithReducers";
import {AppRootStateType, AppThunkType} from "./store";

export type RemoveTaskActionType = {
    type: 'REMOVE-TASK',
    todolistId: string
    taskId: string
}

export type AddTaskActionType = {
    type: 'ADD-TASK',
    task: TaskType
}

// export type ChangeTaskStatusActionType = {
//     type: 'CHANGE-TASK-STATUS',
//     todolistId: string
//     taskId: string
//     status: TaskStatuses
// }
export type UpdateTaskActionType = {
    type: 'UPDATE-TASK',
    todolistId: string
    taskId: string
    model: UpdateDomainTasksModelType

}

// export type ChangeTaskTitleActionType = {
//     type: 'CHANGE-TASK-TITLE',
//     todolistId: string
//     taskId: string
//     title: string
// }

export type SetTasksActionType = {
    type: 'SET-TASKS'
    tasks: Array<TaskType>
    todolistId: string
}


export type TasksActionsType = RemoveTaskActionType | AddTaskActionType
    // | ChangeTaskStatusActionType
    // | ChangeTaskTitleActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | SetTasksActionType
    | UpdateTaskActionType

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: TasksActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK': {
            const stateCopy = {...state}
            const tasks = stateCopy[action.todolistId];
            const newTasks = tasks.filter(t => t.id != action.taskId);
            stateCopy[action.todolistId] = newTasks;
            return stateCopy;
        }
        case 'ADD-TASK': {
            const stateCopy = {...state}
            const newTask = action.task
            const tasks = stateCopy[newTask.todoListId];
            const newTasks = [newTask, ...tasks];
            stateCopy[newTask.todoListId] = newTasks;
            return stateCopy;
        }
        case 'UPDATE-TASK': {
            let todolistTasks = state[action.todolistId];
            state[action.todolistId] = todolistTasks.map(
                t => t.id === action.taskId
                    ? {...t, ...action.model}
                    : t
            )
            return ({...state});
        }

        /*

                case 'CHANGE-TASK-STATUS': {
                    let todolistTasks = state[action.todolistId];
                    state[action.todolistId] = todolistTasks.map(
                        t => t.id === action.taskId
                            ? {...t, status: action.status}
                            : t
                    )
                    // // найдём нужную таску:
                    // let task = todolistTasks.find(t => t.id === action.taskId);
                    // //изменим таску, если она нашлась
                    // if (task) {
                    //     let newTask = {...task, isDone: action.isDone}
                    //     // task.isDone = action.isDone;
                    // }
                    // state[action.todolistId] = [...todolistTasks]
                    return ({...state});
                }
                case 'CHANGE-TASK-TITLE': {
                    let todolistTasks = state[action.todolistId];
                    state[action.todolistId] = todolistTasks.map(
                        t => t.id === action.taskId
                            ? {...t, title: action.title}
                            : t
                    )

                    return ({...state});
                }*/
        case 'ADD-TODOLIST': {
            return {
                ...state,
                [action.todolist.id]: []
            }
        }
        case 'REMOVE-TODOLIST': {
            const copyState = {...state};
            delete copyState[action.id];
            return copyState;
        }
        case 'SET-TODOLISTS': {
            const copyState = {...state};
            action.todolists.forEach(t => {
                copyState[t.id] = []
            })
            return copyState
        }
        case "SET-TASKS": {
            const copyState = {...state}
            copyState[action.todolistId] = action.tasks
            return copyState
        }

        default:
            return state;
    }
}

export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskActionType => {
    return {type: 'REMOVE-TASK', taskId: taskId, todolistId: todolistId}
}
export const addTaskAC = (task: TaskType): AddTaskActionType => {
    return {type: 'ADD-TASK', task}
}

export const updateTaskAC = (taskId: string, model: UpdateDomainTasksModelType, todolistId: string): UpdateTaskActionType => {
    return {type: 'UPDATE-TASK', model, taskId, todolistId}
}

/*export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string): ChangeTaskStatusActionType => {
    return {type: 'CHANGE-TASK-STATUS', status, todolistId, taskId}
}
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string): ChangeTaskTitleActionType => {
    return {type: 'CHANGE-TASK-TITLE', title, todolistId, taskId}
}*/

export const setTasksAC = (tasks: Array<TaskType>, todolistId: string): SetTasksActionType => {
    return {type: 'SET-TASKS', tasks, todolistId}
}

export const fetchTasksTC = (todolistId: string): AppThunkType => {
    return (dispatch) => {
        todolistAPI.getTasks(todolistId)
            .then((res) => {
                dispatch(setTasksAC(res.data.items, todolistId))
            })
    }
}

export const removeTasksTC = (taskId: string, todolistId: string): AppThunkType => {
    return (dispatch) => {
        todolistAPI.deleteTasks(todolistId, taskId)
            .then(res => {
                const action = removeTaskAC(taskId, todolistId);
                dispatch(action);
            })
    }
}

export const addTasksTC = (title: string, todolistId: string): AppThunkType => {
    return (dispatch) => {
        todolistAPI.createTask(todolistId, title)
            .then(res => {
                const action = addTaskAC(res.data.data.item);
                dispatch(action);
            })
    }
}

export type UpdateDomainTasksModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTasksModelType, todolistId: string): AppThunkType => {
    return (dispatch, getState: () => AppRootStateType) => {
        const state = getState()
        const task = state.tasks[todolistId].find(t => t.id === taskId);
        if (!task) {
            throw new Error('task not found in the state');
            console.warn('task not found in the state');
            return;
        }
        const apiModel: UpdateTasksModelType = {
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
            ...domainModel
        }
        todolistAPI.updateTask(todolistId, taskId, apiModel)
            .then(res => {
                dispatch(updateTaskAC(taskId, domainModel, todolistId));
            })
    }
}
/*

export const changeTaskTitleTC = (taskId: string, newTitle: string, todolistId: string): AppThunkType => {
    return (dispatch, getState:()=>AppRootStateType) => {
        const state = getState()
        const task = state.tasks[todolistId].find(t=>t.id===taskId);
        if (!task){
            throw new Error('task not found in the state');
            console.warn('task not found in the state');
            return;
        }
        const model:UpdateTasksModelType = {
            title: newTitle,
            description: task.description,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline
        }
        todolistAPI.updateTask(todolistId,taskId, model)
            .then(res => {
                const action = changeTaskTitleAC(taskId,newTitle,todolistId);
                dispatch(action);
            })
    }
}

export const changeTaskStatusTC = (taskId: string, status: TaskStatuses, todolistId: string): AppThunkType => {
    return (dispatch,getState:()=>AppRootStateType) => {
        const state = getState();
        const task = state.tasks[todolistId].find(t=>t.id===taskId);
        if (!task){
            throw new Error('task not found in the state');
            console.warn('task not found in the state');
            return;
        }

        const model:UpdateTasksModelType = {
            title: task.title,
            description: task.description,
            status: status,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline
        }
        todolistAPI.updateTask(todolistId,taskId, model)
            .then(res => {
                const action = changeTaskStatusAC(taskId,status,todolistId);
                dispatch(action);
            })
    }
}
*/

