import {addTodolistTC, fetchTodolistsTC, removeTodolistTC} from './todolists-reducer';
import {TaskPriorities, TaskStatuses, TaskType, todolistAPI, UpdateTasksModelType} from "../../api/todolists-api";
import {setAppStatusAC} from "../../app/app-reducer";
import {handlerServerAppError, handlerServerNetworkError} from "../../utils/error-utils";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Dispatch} from "redux";
import {RootState} from "../../app/store";
import {clearTasksAndTodolists} from "../../common/actions/common.actions";
import {AxiosError} from "axios";

const initialState: TasksStateType = {}

export const fetchTasksTC = createAsyncThunk('tasks/fetchTasks', async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    try {
        const res = await todolistAPI.getTasks(todolistId);
        thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
        return {tasks: res.data.items, todolistId}
    } catch (err) {
        const error:AxiosError = err as AxiosError;
        handlerServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(error)
    }
})
export const removeTasksTC = createAsyncThunk('tasks/removeTasks',
    async (param: { taskId: string, todolistId: string }, thunkAPI) => {
        thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
        try {
            const res = await todolistAPI.deleteTasks(param.todolistId, param.taskId);
            // dispatch(removeTaskAC({taskId, todolistId}));
            thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
            return {taskId: param.taskId, todolistId: param.todolistId}
        } catch (err) {
            const error:AxiosError = err as AxiosError;
            handlerServerNetworkError(error, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue(error)
        }
    })

export const addTasksTC = createAsyncThunk('tasks/addTasks',  async ( param: { title: string, todolistId: string }, thunkAPI) =>{
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    try {
        const res = await todolistAPI.createTask(param.todolistId, param.title)
                if (res.data.resultCode === 0) {
                    // const action = addTaskAC({task: res.data.data.item});
                    // dispatch(action);
                    thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
                    return {task: res.data.data.item};
                } else {
                    return handlerServerAppError(res.data, thunkAPI.dispatch)
                }
    }catch (e) {
        const error:AxiosError = e as AxiosError;
        handlerServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(error)
    }
})

export const updateTaskTC = createAsyncThunk('tasks/updateTask', async (param:{taskId: string, domainModel: UpdateDomainTasksModelType, todolistId: string},thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: 'loading'}))
    const state = thunkAPI.getState() as RootState
    const task = state.tasks[param.todolistId].find(t => t.id === param.taskId);
    if (!task) {
        // throw new Error('task not found in the state');
        // console.warn('task not found in the state');
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

        try{
            const res = await todolistAPI.updateTask(param.todolistId, param.taskId, apiModel)
            if (res.data.resultCode === 0) {
                thunkAPI.dispatch(setAppStatusAC({status: 'succeeded'}))
                // return {taskId:param.taskId, model: param.domainModel, todolistId:param.todolistId};
                return param;
            } else {
                handlerServerAppError(res.data, thunkAPI.dispatch)
            }
        } catch (e) {
            const error:AxiosError = e as AxiosError;
            handlerServerNetworkError(error, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue(error)
        }
})



const slice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {
        // removeTaskAC(state, action: PayloadAction<{ taskId: string, todolistId: string }>) {
        //     const index = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskId);
        //     if (index > -1) {
        //         state[action.payload.todolistId].splice(index, 1)
        //     }
        // },
        // addTaskAC(state, action: PayloadAction<{ task: TaskType }>) {
        //     state[action.payload.task.todoListId].unshift(action.payload.task)
        // },
        // updateTaskAC(state, action: PayloadAction<{
        //     taskId: string,
        //     model: UpdateDomainTasksModelType,
        //     todolistId: string
        // }>) {
        //     const index = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskId);
        //     if (index > -1) {
        //         state[action.payload.todolistId][index] = {...state[action.payload.todolistId][index], ...action.payload.model}
        //     }
        // },
        // setTasksAC(state, action: PayloadAction<{ tasks: Array<TaskType>, todolistId: string }>) {
        //     state[action.payload.todolistId] = action.payload.tasks
        // },
    },
    extraReducers: (builder) => {
        builder.addCase(addTodolistTC.fulfilled, (state, action) => {
            // @ts-ignore
            state[action.payload.todolist.id] = []
        });
        builder.addCase(removeTodolistTC.fulfilled, (state, action) => {
            // @ts-ignore
            delete state[action.payload.todolistId]
        });
        builder.addCase(fetchTodolistsTC.fulfilled, (state, action) => {
            action.payload.todolists.forEach(tl => {
                state[tl.id] = []
            })
        });
        builder.addCase(fetchTasksTC.fulfilled, (state, action) => {
            state[action.payload.todolistId] = action.payload.tasks
        });
        builder.addCase(clearTasksAndTodolists, (state, action) => {
            return action.payload.tasks
        });
        builder.addCase(removeTasksTC.fulfilled, (state, action) => {
            const index = state[action.payload.todolistId].findIndex(t => t.id === action.payload.taskId);
            if (index > -1) {
                state[action.payload.todolistId].splice(index, 1)
            }
        });
        builder.addCase(addTasksTC.fulfilled, (state, action) => {
            if(action.payload)
            state[action.payload.task.todoListId].unshift(action.payload.task)
        });
        builder.addCase(updateTaskTC.fulfilled, (state, action) => {
            if(action.payload) {
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

export const {
    // removeTaskAC,
    // addTaskAC,
    // updateTaskAC,
    // setTasksAC,
} = slice.actions


//Thunk
// export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
//     dispatch(setAppStatusAC({status: 'loading'}))
//     todolistAPI.getTasks(todolistId)
//         .then((res) => {
//             dispatch(setTasksAC({tasks: res.data.items, todolistId}))
//             dispatch(setAppStatusAC({status: 'succeeded'}))
//         })
//         .catch((error) => {
//             handlerServerNetworkError(error, dispatch)
//         })
// }
// export const removeTasksTC = (taskId: string, todolistId: string) => (dispatch: Dispatch) => {
//     dispatch(setAppStatusAC({status: 'loading'}))
//     todolistAPI.deleteTasks(todolistId, taskId)
//         .then(res => {
//             dispatch(removeTaskAC({taskId, todolistId}));
//             dispatch(setAppStatusAC({status: 'succeeded'}))
//         })
//         .catch((error) => {
//             handlerServerNetworkError(error, dispatch)
//         })
// }
// export const addTasksTC_ = (title: string, todolistId: string) => (dispatch: Dispatch) => {
//     dispatch(setAppStatusAC({status: 'loading'}))
//     todolistAPI.createTask(todolistId, title)
//         .then(res => {
//             if (res.data.resultCode === 0) {
//                 const action = addTaskAC({task: res.data.data.item});
//                 dispatch(action);
//                 dispatch(setAppStatusAC({status: 'succeeded'}))
//             } else {
//                 handlerServerAppError(res.data, dispatch)
//             }
//         })
//         .catch((error) => {
//             handlerServerNetworkError(error, dispatch)
//         })
// }
// export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTasksModelType, todolistId: string) => (dispatch: Dispatch, getState: () => RootState) => {
//     dispatch(setAppStatusAC({status: 'loading'}))
//     const state = getState()
//     const task = state.tasks[todolistId].find(t => t.id === taskId);
//     if (!task) {
//         throw new Error('task not found in the state');
//         console.warn('task not found in the state');
//         return;
//     }
//     const apiModel: UpdateTasksModelType = {
//         title: task.title,
//         description: task.description,
//         status: task.status,
//         priority: task.priority,
//         startDate: task.startDate,
//         deadline: task.deadline,
//         ...domainModel
//     }
//     todolistAPI.updateTask(todolistId, taskId, apiModel)
//         .then(res => {
//             if (res.data.resultCode === 0) {
//                 dispatch(updateTaskAC({taskId, model: domainModel, todolistId}));
//                 dispatch(setAppStatusAC({status: 'succeeded'}))
//             } else {
//                 handlerServerAppError(res.data, dispatch)
//             }
//         })
//         .catch((error) => {
//             handlerServerNetworkError(error, dispatch)
//         })
// }

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
