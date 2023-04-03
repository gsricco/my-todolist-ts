import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistsActionType} from './todolists-reducer';
import {TaskPriorities, TaskStatuses, TaskType, todolistAPI, UpdateTasksModelType} from "../../api/todolists-api";
import {AppRootStateType, AppThunkType} from "../../app/store";

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: TasksActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
        return {
            ...state,
            [action.todolistId] : state[action.todolistId].filter(t => t.id != action.taskId)
        }
        case 'ADD-TASK':
        return {
            ...state,
            [action.task.todoListId]:[action.task,...state[action.task.todoListId]]
        }
        case 'UPDATE-TASK':
        return {
            ...state,
            [action.todolistId]:state[action.todolistId].map(t => t.id === action.taskId
                ? {...t, ...action.model}
                : t
        )
        }
        case 'ADD-TODOLIST':
            return {...state, [action.todolist.id]: []}
        case 'REMOVE-TODOLIST': {
            const copyState = {...state};
            delete copyState[action.id];
            return copyState;
        }
        case 'SET-TODOLISTS':{
            const copyState = {...state};
            action.todolists.forEach(t => {
                copyState[t.id] = []
            })
            return copyState
        }
        case "SET-TASKS":
        return {...state, [action.todolistId]:action.tasks}
        default:
            return state;
    }
}

// Action
export const removeTaskAC = (taskId: string, todolistId: string) =>
    ({type: 'REMOVE-TASK', taskId: taskId, todolistId: todolistId}) as const
export const addTaskAC = (task: TaskType) => ({type: 'ADD-TASK', task}) as const
export const updateTaskAC = (taskId: string, model: UpdateDomainTasksModelType, todolistId: string) =>
    ({type: 'UPDATE-TASK', model, taskId, todolistId}) as const
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) =>
    ({type: 'SET-TASKS', tasks, todolistId}) as const

//Thunk
export const fetchTasksTC = (todolistId: string): AppThunkType => (dispatch) => {
    todolistAPI.getTasks(todolistId)
        .then((res) => {
            dispatch(setTasksAC(res.data.items, todolistId))
        })
}
export const removeTasksTC = (taskId: string, todolistId: string): AppThunkType => (dispatch) => {
    todolistAPI.deleteTasks(todolistId, taskId)
        .then(res => {
            const action = removeTaskAC(taskId, todolistId);
            dispatch(action);
        })
}
export const addTasksTC = (title: string, todolistId: string): AppThunkType => (dispatch) => {
    todolistAPI.createTask(todolistId, title)
        .then(res => {
            const action = addTaskAC(res.data.data.item);
            dispatch(action);
        })
}
export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTasksModelType, todolistId: string): AppThunkType => (dispatch, getState: () => AppRootStateType) => {
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

// Types
export type TasksActionsType =
    | ReturnType<typeof removeTaskAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | ReturnType<typeof setTasksAC>

export type UpdateDomainTasksModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

export type TasksStateType = {
    [key: string]: Array<TaskType>
}
