import {useAppSelector} from "../../hooks/hooks";
import React, {useEffect} from "react";
import {Grid, Paper} from "@mui/material";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {Todolist} from "./Todolist/Todolist";
import {Navigate} from "react-router-dom";
import {selectIsLoggedIn} from "../Login/selectors";
import {useActions} from "../../app/store";
import {tasksActions, todolistsActions} from "./index";

export const TodolistsList = ({demo = false}: PropsType) => {
    const todolists = useAppSelector(state => state.todolists)
    const tasks = useAppSelector(state => state.tasks)
    const isLoggedIn = useAppSelector(selectIsLoggedIn)
    const {removeTasks,
        updateTask,
        // addTasks,
        } = useActions(tasksActions);
    const {addTodolistTC,
        // removeTodolistTC,
        // changeTodolistTitleTC,
        fetchTodolistsTC,
    } = useActions(todolistsActions);

    // const dispatch = useAppDispatch();

    useEffect(() => {
        if (demo|| !isLoggedIn) {
            return;
        }
        fetchTodolistsTC()
    }, [])


    // const removeTask = useCallback((taskId: string, todolistId: string) => {
    //     removeTasks({taskId, todolistId})
    // }, [])
    // const addTask = useCallback((title: string, todolistId: string) => {
    //    addTasks({title, todolistId});
    // }, [])
    // const changeStatus = useCallback((id: string, status: TaskStatuses, todolistId: string) => {
    //     updateTask({taskId:id, domainModel:{status}, todolistId});
    // }, [])
    // const changeTaskTitle = useCallback((id: string, newTitle: string, todolistId: string) => {
    //     updateTask({taskId:id, domainModel:{title: newTitle}, todolistId});
    // }, [])
    // const changeFilter = useCallback((value: FilterValuesType, todolistId: string) => {
    //    changeTodolistFilter({id:todolistId, filter:value});
    // }, [])
    // const removeTodolist = useCallback((id: string) => {
    //     removeTodolistTC(id);
    // }, [])
    // const changeTodolistTitle = useCallback((id: string, title: string) => {
    //     changeTodolistTitleTC({todolistId:id, title});
    // }, [])
    // const addTodolist = useCallback((title: string) => {
    //     addTodolistTC(title);
    // }, [])

    if (!isLoggedIn) {
        return <Navigate to={'/login'}/>
    }

    return <>
        <Grid container style={{padding: "20px"}}>
            <AddItemForm addItem={addTodolistTC}/>
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
                                // removeTask={removeTasks}
                                // addTask={addTask}
                                // changeTaskStatus={changeStatus}
                                // filter={tl.filter}
                                // removeTodolist={removeTodolist}
                                // changeTaskTitle={changeTaskTitle}
                                // changeTodolistTitle={changeTodolistTitle}
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
