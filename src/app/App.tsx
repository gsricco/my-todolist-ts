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
import {TodolistsList} from "../features/TodolistsList";
import {ErrorSnackbar} from "../components/ErrorSnackbar";
import {appActions} from "../features/Application";
import {Login, loginAction, loginSelectors} from "../features/Login";
import {Route, Routes} from "react-router-dom";
import {useActions, useAppSelector} from "../utils/redux-utils";
import {selectIsInitialized, selectStatus} from "./selectors";

function App(props: PropsType) {
    const status = useAppSelector(selectStatus)
    const isInitialized = useAppSelector(selectIsInitialized)
    const isLoggedIn = useAppSelector(loginSelectors.selectIsLoggedIn)
    const {logout}=useActions(loginAction)
    const {initializedApp}=useActions(appActions)

    useEffect(() => {
        if(!isInitialized){
           initializedApp()
        }
    }, [])


    const LogoutHandler = useCallback(()=>{
       logout()
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
                <Container maxWidth={false} >
                    <Routes>
                        <Route path='/' element={<TodolistsList demo={false}/>}/>
                        <Route path='/login' element={<Login/>}/>
                        <Route path='*' element={<h1>404: PAGE NOT FOUND</h1>}/>
                    </Routes>

                </Container>
            </div>
    );
}

export default App;

// Types
type PropsType = {}
