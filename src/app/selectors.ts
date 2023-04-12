import {RootState} from "./store";

export const selectStatus = (state:RootState)=>state.app.status
export const selectIsInitialized = (state:RootState)=>state.app.isInitialized