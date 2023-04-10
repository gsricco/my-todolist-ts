import {
    addTodolistTC,
    changeTodolistFilterAC,
    changeTodolistTitleTC,
    fetchTodolistsTC,
    FilterValuesType,
    removeTodolistTC
} from "./todolists-reducer";
import {useAppDispatch, useAppSelector} from "../../hooks/hooks";
import React, {useCallback, useEffect} from "react";
import {addTasksTC, removeTasksTC, updateTaskTC} from "./tasks-reducer";
import {TaskStatuses} from "../../api/todolists-api";
import {Grid, Paper} from "@mui/material";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {Todolist} from "./Todolist/Todolist";
import {Navigate} from "react-router-dom";

export const TodolistsList = ({demo = false}: PropsType) => {
    const todolists = useAppSelector(state => state.todolists)
    const tasks = useAppSelector(state => state.tasks)
    const isLoggedIn = useAppSelector(state => state.login.isLoggedIn)


    const dispatch = useAppDispatch();

    useEffect(() => {
        if (demo|| !isLoggedIn) {
            return;
        }
        dispatch(fetchTodolistsTC())
    }, [])


    const removeTask = useCallback((taskId: string, todolistId: string) => {
        dispatch(removeTasksTC({taskId, todolistId}))
    }, [dispatch])
    const addTask = useCallback((title: string, todolistId: string) => {
        dispatch(addTasksTC({title, todolistId}));
    }, [dispatch])
    const changeStatus = useCallback((id: string, status: TaskStatuses, todolistId: string) => {
        dispatch(updateTaskTC({taskId:id, domainModel:{status}, todolistId}));
    }, [dispatch])
    const changeTaskTitle = useCallback((id: string, newTitle: string, todolistId: string) => {
        dispatch(updateTaskTC({taskId:id, domainModel:{title: newTitle}, todolistId}));
    }, [dispatch])
    const changeFilter = useCallback((value: FilterValuesType, todolistId: string) => {
        const action = changeTodolistFilterAC({id:todolistId, filter:value});
        dispatch(action);
    }, [dispatch])
    const removeTodolist = useCallback((id: string) => {
        dispatch(removeTodolistTC(id));
    }, [dispatch])
    const changeTodolistTitle = useCallback((id: string, title: string) => {
        dispatch(changeTodolistTitleTC({todolistId:id, title}));
    }, [dispatch])
    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistTC(title));
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
