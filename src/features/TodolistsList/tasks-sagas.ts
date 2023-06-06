import {call, put, select, takeEvery} from "redux-saga/effects";
import {setAppStatusAC} from "../../app/app-reducer";
import {AxiosResponse} from "axios";
import {GetTasksResponse, ResponseType, TaskType, todolistAPI, UpdateTasksModelType} from "../../api/todolists-api";
import {addTaskAC, removeTaskAC, setTasksAC, UpdateDomainTasksModelType, updateTaskAC} from "./tasks-reducer";
import {AppRootStateType} from "../../app/store";
import {handlerServerAppErrorSaga, handlerServerNetworkErrorSaga} from "../../utils/error-utils";


//Sagas
export function* fetchTasksWorkerSaga(action: ReturnType<typeof fetchTasks>) {
    console.log('fetchTasksWorkerSaga')
    yield put(setAppStatusAC('loading'))
    const res: AxiosResponse<GetTasksResponse> = yield call(todolistAPI.getTasks, action.todolistId)
    const tasks = res.data.items
    yield put(setTasksAC(tasks, action.todolistId))
    yield put(setAppStatusAC('succeeded'))
}

export function* removeTasksWorkerSaga(action: ReturnType<typeof removeTasks>) {
    yield put(setAppStatusAC('loading'))
    const res: AxiosResponse<GetTasksResponse> = yield call(todolistAPI.deleteTasks, action.todolistId, action.taskId)

    yield put(removeTaskAC(action.taskId, action.todolistId));
    yield put(setAppStatusAC('succeeded'))
}

export function* addTasksWorkerSaga(action: ReturnType<typeof addTasks>) {
    yield put(setAppStatusAC('loading'))
    try {
        const res: AxiosResponse<ResponseType<{
            item: TaskType
        }>> = yield call(todolistAPI.createTask, action.todolistId, action.title)
        if (res.data.resultCode === 0) {
            yield put(addTaskAC(res.data.data.item));
            yield put(setAppStatusAC('succeeded'))
        } else {
            yield handlerServerAppErrorSaga(res.data)
        }

    } catch (error) {
        // @ts-ignore
        yield handlerServerNetworkErrorSaga(error)
    }

}

export function* updateTaskWorkerSaga(action: ReturnType<typeof updateTask>) {
    yield put(setAppStatusAC('loading'))
    // const getState= () => AppRootStateType
    const state: AppRootStateType = yield select()

    const task = state.tasks[action.todolistId].find(t => t.id === action.taskId);
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
        ...action.domainModel
    }
    const res: AxiosResponse<ResponseType<UpdateTasksModelType>> = yield call(todolistAPI.updateTask, action.todolistId, action.taskId, apiModel)

    if (res.data.resultCode === 0) {
        yield put(updateTaskAC(action.taskId, action.domainModel, action.todolistId));
        yield put(setAppStatusAC('succeeded'))
    }
}

export const fetchTasks = (todolistId: string) => ({type: 'TASKS/FETCH-TASKS', todolistId})
export const removeTasks = (taskId: string, todolistId: string) => ({type: 'TASKS/REMOVE-TASKS', taskId, todolistId})
export const addTasks = (title: string, todolistId: string) => ({type: 'TASKS/ADD-TASKS', title, todolistId})
export const updateTask = (taskId: string, domainModel: UpdateDomainTasksModelType, todolistId: string) => ({
    type: 'TASKS/UPDATE-TASKS',
    taskId,
    domainModel,
    todolistId
})


export function* tasksWatcherSaga() {
    console.log('watcher')
    yield takeEvery('TASKS/FETCH-TASKS', fetchTasksWorkerSaga)
    yield takeEvery('TASKS/REMOVE-TASKS', removeTasksWorkerSaga)
    yield takeEvery('TASKS/ADD-TASKS', addTasksWorkerSaga)
    yield takeEvery('TASKS/UPDATE-TASKS', updateTaskWorkerSaga)
}