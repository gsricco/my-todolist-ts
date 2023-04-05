import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, {AlertProps} from '@mui/material/Alert';
import {useDispatch, useSelector} from "react-redux";
import {setAppErrorAC} from "../../app/app-reducer";
import {useAppDispatch, useAppSelector} from "../../hooks/hooks";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const  ErrorSnackbar=() => {
    const error = useAppSelector(state=>state.app.error)
    const dispatch=useAppDispatch()
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch(setAppErrorAC({error:null}))
    };


    return (
            <Snackbar open={error!==null} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" >
                 {error}
                </Alert>
            </Snackbar>
    );
}