import {ActionCreatorsMapObject, bindActionCreators} from "redux";
import {useMemo} from "react";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "./types";



export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export function useActions<Her extends ActionCreatorsMapObject<any>>(actions:Her){
    const dispatch = useAppDispatch()

    const boundActions = useMemo(()=>{
        return bindActionCreators(actions,dispatch)
    },[])
    return boundActions
}
