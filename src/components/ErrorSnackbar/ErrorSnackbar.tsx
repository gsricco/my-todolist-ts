import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, {AlertProps} from '@mui/material/Alert';
import {useActions, useAppSelector} from "../../utils/redux-utils";
import {appActions} from "../../features/CommonActions/AplicationCommonActions";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});



export const  ErrorSnackbar=() => {
    const {setAppError}=useActions(appActions)

    const error = useAppSelector(state=>state.app.error)
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setAppError({error:null})
    };


    return (
            <Snackbar  anchorOrigin={{ vertical:'bottom', horizontal:'center' }}  open={error!==null} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" style={{width:'800px', fontSize:'18px', fontWeight:'bold'}}>
                 {error}
                </Alert>
            </Snackbar>
    );
}