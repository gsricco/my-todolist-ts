import {useActions, useAppDispatch, useAppSelector} from "../../utils/redux-utils";
import React, {useCallback, useEffect} from "react";
import {Grid, Paper} from "@mui/material";
import {AddItemForm} from "../../components/AddItemForm";
import {Todolist} from "./Todolist/Todolist";
import {Navigate} from "react-router-dom";
import {selectIsLoggedIn} from "../Login/selectors";
import {todolistsActions} from "./index";

export const TodolistsList = ({demo = false}: PropsType) => {
    const todolists = useAppSelector(state => state.todolists)
    const tasks = useAppSelector(state => state.tasks)
    const isLoggedIn = useAppSelector(selectIsLoggedIn)
    const {addTodolistTC, fetchTodolistsTC} = useActions(todolistsActions);
    const dispatch = useAppDispatch()

    const addTodolistCallback = useCallback(async (title: string) => {
        let thunk = todolistsActions.addTodolistTC(title)
        const resultAction = await dispatch(thunk);
        if (todolistsActions.addTodolistTC.rejected.match(resultAction)){
            if (resultAction.payload?.fieldsErrors?.length){
                const errorMessage = resultAction.payload?.fieldsErrors[0]
                throw new Error(errorMessage?.error)
            } else {
                throw new Error('Some error')
            }
        }


    }, [])

    useEffect(() => {
        if (demo|| !isLoggedIn) {
            return;
        }
        if(!todolists.length){
            fetchTodolistsTC()
        }
    }, [])

    if (!isLoggedIn) {
        return <Navigate to={'/login'}/>
    }

    return <>
        <Grid container style={{padding: "20px"}}>
            <AddItemForm addItem={addTodolistCallback}/>
        </Grid>
        <Grid container spacing={3} style={{flexWrap:'nowrap', overflowX:'scroll', paddingBottom:'40px'}}>
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
