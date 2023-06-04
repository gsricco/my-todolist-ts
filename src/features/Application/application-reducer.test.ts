import {InitialStateType} from "./application-reducer";
import {appActions} from "../CommonActions";
import {appReducer} from './'

let startState: InitialStateType;

const {setAppError, setAppStatus} = appActions

beforeEach(() => {
    startState = {
        status: "idle",
        error: null,
        isInitialized: false
    }
})

test('correct error message should be set', () => {
    const endState = appReducer(startState, setAppError({error: 'some error'}))
    expect(endState.error).toBe('some error');
});
test('correct status should be set', () => {
    const endState = appReducer(startState, setAppStatus({status: 'loading'}))
    expect(endState.status).toBe('loading');
});
