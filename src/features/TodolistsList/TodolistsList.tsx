import {useAppSelector} from "../../hooks/hooks";
import React, {useCallback, useEffect} from "react";
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
    const {removeTasks} = useActions(tasksActions);
    const {addTodolistTC, fetchTodolistsTC} = useActions(todolistsActions);

    const addTodolistCallback = useCallback(async (title: string) => {
        addTodolistTC(title);
    }, [])

    useEffect(() => {
        if (demo|| !isLoggedIn) {
            return;
        }
        fetchTodolistsTC()
    }, [])

    if (!isLoggedIn) {
        return <Navigate to={'/login'}/>
    }

    return <>
        <Grid container style={{padding: "20px"}}>
            <AddItemForm addItem={addTodolistCallback}/>
        </Grid>
        <Grid container spacing={3} style={{flexWrap:'nowrap', overflowX:'scroll'}}>
            {
                todolists.map(tl => {
                    let allTodolistTasks = tasks[tl.id];
                    let tasksForTodolist = allTodolistTasks;

                    return <Grid item key={tl.id}>
                        <Paper style={{padding: "10px", width:'280px'}}>
                            <Todolist
                                todolist={tl}
                                tasks={tasksForTodolist}
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
