import { InitialStateType} from "./application-reducer";
import {appActions} from "../CommonActions/AplicationCommonActions";
import {appReducer} from './index'
import {useActions} from "../../utils/redux-utils";

let startState: InitialStateType;

const {setAppError,setAppStatus}=useActions(appActions)

beforeEach(() => {
    startState = {
        status:"idle",
        error:null,
        isInitialized:false
    }
})

test('correct error message should be set', () => {
    const endState = appReducer(startState, setAppError({error:'some error'}))
    expect(endState.error).toBe('some error');
});
test('correct status should be set', () => {
    const endState = appReducer(startState, setAppStatus({status:'loading'}))
    expect(endState.status).toBe('loading');
});
