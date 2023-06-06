import {TasksActionsType, tasksReducer} from '../features/TodolistsList/tasks-reducer';
import {TodolistsActionsType, todolistsReducer} from '../features/TodolistsList/todolists-reducer';
import {applyMiddleware, combineReducers, legacy_createStore as createStore} from 'redux';
import thunkMiddleware, {ThunkAction, ThunkDispatch} from "redux-thunk";
import {appReducer, AppReducerActionsType} from "./app-reducer";
import {authReducer, LoginActionsType} from "../features/Login/auth-reducer";
import createSagaMiddleware from 'redux-saga'
import {
    addTasksWorkerSaga,
    fetchTasksWorkerSaga,
    removeTasksWorkerSaga, updateTaskWorkerSaga,
} from "../features/TodolistsList/tasks-sagas";
import {appSaga} from "./app-saga";
import {takeEvery} from "redux-saga/effects";
import {
    addTodolistWorkerSaga, changeTodolistTitleWorkerSaga,
    fetchTodolistsWorkerSaga,
    removeTodolistWorkerSaga
} from "../features/TodolistsList/todolists-sagas";


// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    login: authReducer
})

const sagaMiddleware = createSagaMiddleware()

// непосредственно создаём store
export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware,sagaMiddleware));

export type RootState = ReturnType<typeof store.getState>

// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>

// все виды action для всего App
export type AppActionsType =
    | TasksActionsType
    | TodolistsActionsType
    | AppReducerActionsType
    | LoginActionsType

export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AppActionsType>
// export type AppDispatch = typeof store.dispatch

export type AppThunkType<ReturnType = void> = ThunkAction<ReturnType, AppRootStateType, unknown, AppActionsType>


sagaMiddleware.run(rootWatcher)

function* rootWatcher(){
    // alert('SAGA-rootWatcher')
    yield takeEvery('APP/INITIALIZE-APP', appSaga)

    yield takeEvery('TASKS/FETCH-TASKS', fetchTasksWorkerSaga)
    yield takeEvery('TASKS/REMOVE-TASKS', removeTasksWorkerSaga)
    yield takeEvery('TASKS/ADD-TASKS', addTasksWorkerSaga)
    yield takeEvery('TASKS/UPDATE-TASKS', updateTaskWorkerSaga)

    yield takeEvery('TODOLISTS/FETCH-TODOLISTS', fetchTodolistsWorkerSaga)
    yield takeEvery('TODOLISTS/REMOVE-TODOLISTS', removeTodolistWorkerSaga)
    yield takeEvery('TODOLISTS/ADD-TODOLISTS', addTodolistWorkerSaga)
    yield takeEvery('TODOLISTS/CHANGE-TITLE-TODOLISTS', changeTodolistTitleWorkerSaga)


    // yield appWatcherSaga()
    // yield tasksWatcherSaga()




}
// function* rootWorker(){
//     // alert('SAGA-rootWorker')
// }

// setTimeout(()=>{
//     // @ts-ignore
//     store.dispatch({type:'APP/INITIALIZE-APP'})
// }, 2000)


// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;
