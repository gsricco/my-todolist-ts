import {TaskPriorities, TaskStatuses, TaskType, todolistAPI, UpdateTasksModelType} from "../../api/todolists-api";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {clearTasksAndTodolists} from "../../common/actions/common.actions";
import {setAppStatusAC} from "../../app/app-reducer";
import {AxiosError} from "axios";
import {handlerServerAppError, handlerServerNetworkError} from "../../utils/error-utils";
import {RootState} from "../../app/store";
import {asyncActions as asyncTodolistsActions} from "./todolists-reducer";

const initialState: TasksStateType = {}

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    try {
        const res = await todolistAPI.getTasks(todolistId);
        thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
        return {tasks: res.data.items, todolistId}
    } catch (err) {
        const error: AxiosError = err as AxiosError;
        handlerServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(error)
    }
})
export const removeTasks = createAsyncThunk('tasks/removeTasks',
    async (param: { taskId: string, todolistId: string }, thunkAPI) => {
        thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
        try {
            const res = await todolistAPI.deleteTasks(param.todolistId, param.taskId);
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return {taskId: param.taskId, todolistId: param.todolistId}
        } catch (err) {
            const error: AxiosError = err as AxiosError;
            handlerServerNetworkError(error, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue(error)
        }
    })
export const addTasks = createAsyncThunk('tasks/addTasks', async (param: {
    title: string,
    todolistId: string
}, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistAPI.createTask(param.todolistId, param.title)
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return {task: res.data.data.item};
        } else {
            return handlerServerAppError(res.data, thunkAPI.dispatch)
        }
    } catch (e) {
        const error: AxiosError = e as AxiosError;
        handlerServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(error)
    }
})
export const updateTask = createAsyncThunk('tasks/updateTask', async (param: {
    taskId: string,
    domainModel: UpdateDomainTasksModelType,
    todolistId: string
}, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}));
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
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return param;
        } else {
            handlerServerAppError(res.data, thunkAPI.dispatch)
        }
    } catch (e) {
        const error: AxiosError = e as AxiosError;
        handlerServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(error)
    }
})

export const asyncActions = {
    fetchTasks,
    removeTasks,
    addTasks,
    updateTask
}


const slice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(asyncTodolistsActions.addTodolistTC.fulfilled, (state, action) => {
            // @ts-ignore
            state[action.payload.todolist.id] = []
        });
        builder.addCase(asyncTodolistsActions.removeTodolistTC.fulfilled, (state, action) => {
            // @ts-ignore
            delete state[action.payload.todolistId]
        });
        builder.addCase(asyncTodolistsActions.fetchTodolistsTC.fulfilled, (state, action) => {
            action.payload.todolists.forEach(tl => {
                state[tl.id] = []
            })
        });
        builder.addCase(fetchTasks.fulfilled, (state, action) => {
            state[action.payload.todolistId] = action.payload.tasks
        });
        builder.addCase(clearTasksAndTodolists, (state, action) => {
            return action.payload.tasks
        });
        builder.addCase(removeTasks.fulfilled, (state, action) => {
            const index = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskId);
            if (index > -1) {
                state[action.payload.todolistId].splice(index, 1)
            }
        });
        builder.addCase(addTasks.fulfilled, (state, action) => {
            if (action.payload)
                state[action.payload.task.todoListId].unshift(action.payload.task)
        });
        builder.addCase(updateTask.fulfilled, (state, action) => {
            if (action.payload) {
                const tasks = state[action.payload.todolistId]
                // @ts-ignore
                const index = tasks.findIndex(t => t.id === action.payload.taskId);
                if (index > -1) {
                    tasks[index] = {...tasks[index], ...action.payload.domainModel}
                }
            }
        });
    },
})

export const tasksReducer = slice.reducer;

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
