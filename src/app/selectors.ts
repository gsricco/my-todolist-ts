import {RootState} from "../utils/types";

export const selectStatus = (state:RootState)=>state.app.status
export const selectIsInitialized = (state:RootState)=>state.app.isInitialized