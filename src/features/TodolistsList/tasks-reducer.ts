import {TaskPriorities, TaskStatuses, TaskType, UpdateTasksModelType} from "../../api/types";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {clearTasksAndTodolists} from "../../common/actions/common.actions";
import {appActions} from "../CommonActions";
import {AxiosError} from "axios";
import {handlerAsyncServerAppError, handlerAsyncServerNetworkError} from "../../utils/error-utils";
import {RootState, ThunkError} from "../../utils/types";
import {asyncActions as asyncTodolistsActions} from "./todolists-reducer";
import {todolistAPI} from "../../api/todolists-api";

const initialState: TasksStateType = {}

export const fetchTasks = createAsyncThunk<{
    tasks: TaskType[],
    todolistId: string
}, string, ThunkError>('tasks/fetchTasks', async (todolistId, thunkAPI) => {
    thunkAPI.dispatch(appActions.setAppStatus({status: "loading"}))
    try {
        const res = await todolistAPI.getTasks(todolistId);
        thunkAPI.dispatch(appActions.setAppStatus({status: "succeeded"}))
        return {tasks: res.data.items, todolistId}
    } catch (e) {
        return handlerAsyncServerNetworkError(e as AxiosError, thunkAPI)
    }
})
export const removeTasks = createAsyncThunk<{ taskId: string, todolistId: string }, {
    taskId: string,
    todolistId: string
}, ThunkError>('tasks/removeTasks',
    async (param, thunkAPI) => {
        thunkAPI.dispatch(appActions.setAppStatus({status: 'loading'}))
        try {
            const res = await todolistAPI.deleteTasks(param.todolistId, param.taskId);
            thunkAPI.dispatch(appActions.setAppStatus({status: 'succeeded'}))
            return {taskId: param.taskId, todolistId: param.todolistId}
        } catch (e) {
            return handlerAsyncServerNetworkError(e as AxiosError, thunkAPI)
        }
    })
export const addTasks = createAsyncThunk<{ task: TaskType },
    { title: string, todolistId: string },
    ThunkError
>('tasks/addTasks', async (param, thunkAPI) => {
    thunkAPI.dispatch(appActions.setAppStatus({status: 'loading'}))
    try {
        const res = await todolistAPI.createTask(param.todolistId, param.title)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(appActions.setAppStatus({status: 'succeeded'}))
            return {task: res.data.data.item};
        } else {
            return handlerAsyncServerAppError(res.data, thunkAPI)
        }
    } catch (e) {
        return handlerAsyncServerNetworkError(e as AxiosError, thunkAPI)
    }
})
export const updateTask = createAsyncThunk('tasks/updateTask', async (param: {
    taskId: string,
    domainModel: UpdateDomainTasksModelType,
    todolistId: string
}, thunkAPI) => {
    thunkAPI.dispatch(appActions.setAppStatus({status: 'loading'}));
    const state = thunkAPI.getState() as RootState;
    const task = state.tasks[param.todolistId].find(t => t.id === param.taskId);
    if (!task) {
        return thunkAPI.rejectWithValue('task not found in the state');
    }
    const apiModel: UpdateTasksModelType = {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        startDate: task.startDate,
        deadline: task.deadline,
        ...param.domainModel
    }
    try {
        const res = await todolistAPI.updateTask(param.todolistId, param.taskId, apiModel)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(appActions.setAppStatus({status: 'succeeded'}))
            return param;
        } else {
            return handlerAsyncServerAppError(res.data, thunkAPI)
        }
    } catch (e) {
        return handlerAsyncServerNetworkError(e as AxiosError, thunkAPI)
    }
})

export const asyncActions = {
    fetchTasks,
    removeTasks,
    addTasks,
    updateTask
}


export const slice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(asyncTodolistsActions.addTodolistTC.fulfilled, (state, action) => {
                state[action.payload.todolist.id] = []
            })
            .addCase(asyncTodolistsActions.removeTodolistTC.fulfilled, (state, action) => {
                // @ts-ignore
                delete state[action.payload.todolistId]
            })
            .addCase(asyncTodolistsActions.fetchTodolistsTC.fulfilled, (state, action) => {
                action.payload.todolists.forEach(tl => {
                    state[tl.id] = []
                })
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks
            })
            .addCase(clearTasksAndTodolists, (state, action) => {
                return action.payload.tasks
            })
            .addCase(removeTasks.fulfilled, (state, action) => {
                const index = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskId);
                if (index > -1) {
                    state[action.payload.todolistId].splice(index, 1)
                }
            })
            .addCase(addTasks.fulfilled, (state, action) => {
                if (action.payload)
                    state[action.payload.task.todoListId].unshift(action.payload.task)
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                if (action.payload) {
                    const tasks = state[action.payload.todolistId]
                    const index = tasks.findIndex(t => t.id === action.payload.taskId);
                    if (index > -1) {
                        tasks[index] = {...tasks[index], ...action.payload.domainModel}
                    }
                }
            });
    },
})

export const {} = slice.actions

// Types
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
