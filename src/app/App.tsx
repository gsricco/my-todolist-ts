import React, {useCallback, useEffect} from 'react';
import './App.css';
import {
    AppBar,
    Button,
    CircularProgress,
    Container,
    IconButton,
    LinearProgress,
    Toolbar,
    Typography
} from "@mui/material";
import {Menu} from "@mui/icons-material";
import {TodolistsList} from "../features/TodolistsList/TodolistsList";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";
import {useSelector} from "react-redux";
import {initializedAppTC, RequestStatusType} from "./app-reducer";
import {Login} from "../features/Login/Login";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../hooks/hooks";
import {logoutTC} from "../features/Login/auth-reducer";

function App({demo = false}: PropsType) {
    const status = useAppSelector(state => state.app.status)
    const isInitialized = useAppSelector(state => state.app.isInitialized)
    const isLoggedIn = useAppSelector(state => state.login.isLoggedIn)

    const dispatch = useAppDispatch()

    useEffect(() => {
        if(!demo){
            dispatch(initializedAppTC())
        }
    }, [])



    const LogoutHandler = useCallback(()=>{
        dispatch(logoutTC())
    },[])

    if (!isInitialized) {
        return <div style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    return (
            <div className="App">
                <ErrorSnackbar/>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="menu">
                            <Menu/>
                        </IconButton>
                        <Typography variant="h6">
                            News
                        </Typography>
                        {isLoggedIn && <Button color="inherit" onClick={LogoutHandler}>Log out</Button>}
                    </Toolbar>
                    {status === 'loading' && <LinearProgress/>}
                </AppBar>
                <Container fixed>
                    <Routes>
                        <Route path='/' element={<TodolistsList demo={demo}/>}/>
                        <Route path='/login' element={<Login/>}/>
                        <Route path='*' element={<h1>404: PAGE NOT FOUND</h1>}/>
                    </Routes>

                </Container>
            </div>
    );
}

export default App;

// Types
type PropsType = {
    demo?: boolean
}
