import * as loginSelectors from './selectors'
import {Login} from './Login'
import {asyncAction, slice} from './login-reducer'

const loginAction = {
    ... asyncAction,
    ...slice.actions
}


export {
    loginSelectors,
    Login,
    loginAction
}