import React, {useReducer, useState} from 'react';
import './App.css';
import {Todolist} from './Todolist';
import {v1} from 'uuid';
import {AddItemForm} from './AddItemForm';

import {
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC, FilterValuesType,
    removeTodolistAC,
    todolistsReducer
} from './state/todolists-reducer';
import {addTaskAC, removeTaskAC, tasksReducer, updateTaskAC} from './state/tasks-reducer';
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@mui/material";
import {Menu} from "@mui/icons-material";
import {TaskPriorities, TaskStatuses, TaskType, TodolistType} from "./api/todolists-api";

// export type TodolistType = {
//     id: string
//     title: string
//     filter: FilterValuesType
// }

export type TasksStateType = {
    [key: string]: Array<TaskType>
}


function AppWithReducers() {
    let todolistId1 = v1();
    let todolistId2 = v1();

    let [todolists, dispatchToTodolists] = useReducer(todolistsReducer, [
        {id: todolistId1, title: "What to learn", addedDate: '', order: 0, filter: "all"},
        {id: todolistId2, title: "What to buy", addedDate: '', order: 0, filter: "all"}
    ])

    let [tasks, dispatchToTasks] = useReducer(tasksReducer, {
        [todolistId1]: [
            {id: v1(),
                title: "HTML&CSS",
                todoListId: todolistId1,
                status: TaskStatuses.Completed,
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low},
            {id: v1(), title: "JS", todoListId: todolistId1,
                status: TaskStatuses.Completed,
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,}
        ],
        [todolistId2]: [
            {id: v1(), title: "Milk", todoListId: todolistId2,
                status: TaskStatuses.Completed,
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,},
            {id: v1(), title: "React Book", todoListId: todolistId2,
                status: TaskStatuses.Completed,
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low,}
        ]
    });

    function removeTask(id: string, todolistId: string) {
        const action = removeTaskAC(id, todolistId);
        dispatchToTasks(action);
    }

    function addTask(title: string, todolistId: string) {
        const action = addTaskAC({ id: "1", status: TaskStatuses.New, title,todoListId:todolistId,
            description: '',
            startDate: '',
            deadline: '',
            addedDate: '',
            order: 0,
            priority: TaskPriorities.Low });
        dispatchToTasks(action);
    }

    function changeStatus(id: string, status: TaskStatuses, todolistId: string) {
        const action = updateTaskAC(id, {status}, todolistId);
        dispatchToTasks(action);
    }

    function changeTaskTitle(id: string, newTitle: string, todolistId: string) {
        const action = updateTaskAC(id, {title:newTitle}, todolistId);
        dispatchToTasks(action);
    }

    function changeFilter(value: FilterValuesType, todolistId: string) {
        const action = changeTodolistFilterAC(todolistId, value);
        dispatchToTodolists(action);
    }

    function removeTodolist(id: string) {
        const action = removeTodolistAC(id);
        dispatchToTasks(action);
        dispatchToTodolists(action);
    }

    function changeTodolistTitle(id: string, title: string) {
        const action = changeTodolistTitleAC(id, title);
        dispatchToTodolists(action);
    }

    function addTodolist(title:string) {
        const action = addTodolistAC({id: todolistId1, title: 'title', addedDate: '', order: 0, });
        dispatchToTasks(action);
        dispatchToTodolists(action);
    }

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: "20px"}}>
                    <AddItemForm addItem={addTodolist}/>
                </Grid>
                <Grid container spacing={3}>
                    {
                        todolists.map(tl => {
                            let allTodolistTasks = tasks[tl.id];
                            let tasksForTodolist = allTodolistTasks;

                            if (tl.filter === "active") {
                                tasksForTodolist = allTodolistTasks.filter(t => t.status === TaskStatuses.New);
                            }
                            if (tl.filter === "completed") {
                                tasksForTodolist = allTodolistTasks.filter(t => t.status === TaskStatuses.Completed);
                            }

                            return <Grid key={tl.id} item>
                                <Paper style={{padding: "10px"}}>
                                    <Todolist
                                        key={tl.id}
                                        id={tl.id}
                                        title={tl.title}
                                        tasks={tasksForTodolist}
                                        removeTask={removeTask}
                                        changeFilter={changeFilter}
                                        addTask={addTask}
                                        changeTaskStatus={changeStatus}
                                        filter={tl.filter}
                                        removeTodolist={removeTodolist}
                                        changeTaskTitle={changeTaskTitle}
                                        changeTodolistTitle={changeTodolistTitle}
                                    />
                                </Paper>
                            </Grid>
                        })
                    }
                </Grid>
            </Container>
        </div>
    );
}

export default AppWithReducers;
