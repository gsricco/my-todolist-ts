import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../app/store";
import {
    changeTodolistFilterAC,
    FilterValuesType,
    TodolistsDomainType
} from "./todolists-reducer";
import {useAppDispatch} from "../../hooks/hooks";
import React, {useCallback, useEffect} from "react";
import {TasksStateType} from "./tasks-reducer";
import {TaskStatuses} from "../../api/todolists-api";
import {Grid, Paper} from "@mui/material";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {Todolist} from "./Todolist/Todolist";
import {Navigate} from "react-router-dom";
import {addTasks, removeTasks,updateTask} from "./tasks-sagas";
import {fetchTodolists, removeTodolistSaga, changeTodolistTitleSaga, addTodolistSaga} from "./todolists-sagas";

export const TodolistsList = ({demo = false}: PropsType) => {
    const todolists = useSelector<AppRootStateType, Array<TodolistsDomainType>>(state => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.login.isLoggedIn)


    const dispatch = useAppDispatch();
    const dispatchSaga = useDispatch()

    useEffect(() => {
        if (demo|| !isLoggedIn) {
            return;
        }
        dispatchSaga(fetchTodolists())
    }, [])


    const removeTask = useCallback((id: string, todolistId: string) => {
        dispatchSaga(removeTasks(id, todolistId))
    }, [])
    const addTask = useCallback((title: string, todolistId: string) => {
        dispatchSaga(addTasks(title, todolistId));
    }, [])
    const changeStatus = useCallback((id: string, status: TaskStatuses, todolistId: string) => {
        dispatchSaga(updateTask(id, {status}, todolistId));
    }, [dispatch])
    const changeTaskTitle = useCallback((id: string, newTitle: string, todolistId: string) => {
        dispatchSaga(updateTask(id, {title: newTitle}, todolistId));
    }, [dispatch])
    const changeFilter = useCallback((value: FilterValuesType, todolistId: string) => {
        const action = changeTodolistFilterAC(todolistId, value);
        dispatch(action);
    }, [dispatch])
    const removeTodolist = useCallback((id: string) => {
        dispatchSaga(removeTodolistSaga(id));
    }, [dispatch])
    const changeTodolistTitle = useCallback((id: string, title: string) => {
        dispatchSaga(changeTodolistTitleSaga(id, title));
    }, [dispatch])
    const addTodolist = useCallback((title: string) => {
        dispatchSaga(addTodolistSaga(title));
    }, [dispatch])


    if (!isLoggedIn) {
        return <Navigate to={'/login'}/>
    }

    return <>
        <Grid container style={{padding: "20px"}}>
            <AddItemForm addItem={addTodolist}/>
        </Grid>
        <Grid container spacing={3}>
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id];
                    let tasksForTodolist = allTodolistTasks;

                    return <Grid item key={tl.id}>
                        <Paper style={{padding: "10px"}}>
                            <Todolist
                                todolist={tl}
                                // id={tl.id}
                                // title={tl.title}
                                tasks={tasksForTodolist}
                                removeTask={removeTask}
                                changeFilter={changeFilter}
                                addTask={addTask}
                                changeTaskStatus={changeStatus}
                                // filter={tl.filter}
                                removeTodolist={removeTodolist}
                                changeTaskTitle={changeTaskTitle}
                                changeTodolistTitle={changeTodolistTitle}
                                demo={demo}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}

// Types
type PropsType = {
    demo?: boolean
}
