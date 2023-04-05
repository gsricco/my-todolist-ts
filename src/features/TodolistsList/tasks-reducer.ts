import {addTodolistAC, removeTodolistAC, setTodolistsAC, TodolistsDomainType} from './todolists-reducer';
import {TaskPriorities, TaskStatuses, TaskType, todolistAPI, UpdateTasksModelType} from "../../api/todolists-api";
import {setAppStatusAC} from "../../app/app-reducer";
import {handlerServerAppError, handlerServerNetworkError} from "../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Dispatch} from "redux";
import {RootState} from "../../app/store";

const initialState: TasksStateType = {}

const slice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {
        removeTaskAC(state, action: PayloadAction<{ taskId: string, todolistId: string }>) {
            const index = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskId);
            if (index > -1) {
                state[action.payload.todolistId].splice(index, 1)
            }
        },
        addTaskAC(state, action: PayloadAction<{ task: TaskType }>) {
            state[action.payload.task.todoListId].unshift(action.payload.task)
        },
        updateTaskAC(state, action: PayloadAction<{
            taskId: string,
            model: UpdateDomainTasksModelType,
            todolistId: string
        }>) {
            const index = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskId);
            if (index > -1) {
                state[action.payload.todolistId][index] = {...state[action.payload.todolistId][index], ...action.payload.model}
            }
        },
        setTasksAC(state, action: PayloadAction<{ tasks: Array<TaskType>, todolistId: string }>) {
            state[action.payload.todolistId] = action.payload.tasks
        },
    },
        extraReducers: (builder) => {
            builder.addCase(addTodolistAC, (state, action) => {
                state[action.payload.todolist.id] = []
            });
            builder.addCase(removeTodolistAC, (state, action) => {
                delete state[action.payload.todolistId]
            });
            builder.addCase(setTodolistsAC, (state, action) => {
                action.payload.todolists.forEach(tl => {
                    state[tl.id] = []
                })
            });
        },

})

export const tasksReducer = slice.reducer;

export const {
    removeTaskAC,
    addTaskAC,
    updateTaskAC,
    setTasksAC,
} = slice.actions


// export const tasksReducer = (state: TasksStateType = initialState, action: TasksActionsType): TasksStateType => {
//     switch (action.type) {
//         case 'REMOVE-TASK':
//             return {
//                 ...state,
//                 [action.todolistId]: state[action.todolistId].filter(t => t.id != action.taskId)
//             }
//         case 'ADD-TASK':
//             return {
//                 ...state,
//                 [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]
//             }
//         case 'UPDATE-TASK':
//             return {
//                 ...state,
//                 [action.todolistId]: state[action.todolistId].map(t => t.id === action.taskId
//                     ? {...t, ...action.model}
//                     : t
//                 )
//             }
//         case 'ADD-TODOLIST':
//             return {...state, [action.todolist.id]: []}
//         case 'REMOVE-TODOLIST': {
//             const copyState = {...state};
//             delete copyState[action.id];
//             return copyState;
//         }
//         case 'SET-TODOLISTS': {
//             const copyState = {...state};
//             action.todolists.forEach(t => {
//                 copyState[t.id] = []
//             })
//             return copyState
//         }
//         case "SET-TASKS":
//             return {...state, [action.todolistId]: action.tasks}
//         default:
//             return state;
//     }
// }

// Action
// export const removeTaskAC = (taskId: string, todolistId: string) =>
//     ({type: 'REMOVE-TASK', taskId: taskId, todolistId: todolistId}) as const
// export const addTaskAC = (task: TaskType) => ({type: 'ADD-TASK', task}) as const
// export const updateTaskAC = (taskId: string, model: UpdateDomainTasksModelType, todolistId: string) =>
//     ({type: 'UPDATE-TASK', model, taskId, todolistId}) as const
// export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) =>
//     ({type: 'SET-TASKS', tasks, todolistId}) as const

//Thunk
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistAPI.getTasks(todolistId)
        .then((res) => {
            dispatch(setTasksAC({tasks: res.data.items, todolistId}))
            dispatch(setAppStatusAC({status: 'succeeded'}))
        })
        .catch((error) => {
            handlerServerNetworkError(error, dispatch)
        })
}
export const removeTasksTC = (taskId: string, todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistAPI.deleteTasks(todolistId, taskId)
        .then(res => {
            dispatch(removeTaskAC({taskId, todolistId}));
            dispatch(setAppStatusAC({status: 'succeeded'}))
        })
        .catch((error) => {
            handlerServerNetworkError(error, dispatch)
        })
}
export const addTasksTC = (title: string, todolistId: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    todolistAPI.createTask(todolistId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                const action = addTaskAC({task: res.data.data.item});
                dispatch(action);
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handlerServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handlerServerNetworkError(error, dispatch)
        })
}
export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTasksModelType, todolistId: string) => (dispatch: Dispatch, getState: () => RootState) => {
    dispatch(setAppStatusAC({status: 'loading'}))
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
            if (res.data.resultCode === 0) {
                dispatch(updateTaskAC({taskId, model: domainModel, todolistId}));
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handlerServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handlerServerNetworkError(error, dispatch)
        })
}

// Types
// export type TasksActionsType =
//     | ReturnType<typeof removeTaskAC>
//     | AddTodolistActionType
//     | RemoveTodolistActionType
//     | SetTodolistsActionType
//     | ReturnType<typeof addTaskAC>
//     | ReturnType<typeof updateTaskAC>
//     | ReturnType<typeof setTasksAC>

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
