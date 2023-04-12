import {
    changeTodolistEntityStatus,
    changeTodolistFilter,
    FilterValuesType,
    TodolistsDomainType,
    todolistsReducer
} from './todolists-reducer';
import {v1} from 'uuid';
import {RequestStatusType} from "../../app/app-reducer";
import {todolistsActions} from "./index";

let todolistId1: string;
let todolistId2: string;
let startState: Array<TodolistsDomainType> = [];

beforeEach(() => {
    todolistId1 = v1();
    todolistId2 = v1();
    startState = [
        {id: todolistId1, title: "What to learn", addedDate: '', order: 0, filter: "all", entityStatus: 'idle'},
        {id: todolistId2, title: "What to buy", addedDate: '', order: 0, filter: "all", entityStatus: 'idle'}
    ]
})

test('correct todolist should be removed', () => {
    const endState = todolistsReducer(startState, todolistsActions.removeTodolistTC.fulfilled({todolistId: todolistId1}, 'requestId', todolistId1))

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});
test('correct todolist should be added', () => {
    let newTodolistTitle = "New Todolist";
    const payload = {todolist: {id: 'todolistId1', title: newTodolistTitle, addedDate: '', order: 0,}}
    const endState = todolistsReducer(startState, todolistsActions.addTodolistTC.fulfilled(payload, 'requestId', 'title'))

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe(newTodolistTitle);
    expect(endState[0].filter).toBe("all");
});
test('correct todolist should change its name', () => {
    let newTodolistTitle = "New Todolist";
    const payload = {id: todolistId2, title: newTodolistTitle}
    const action = todolistsActions.changeTodolistTitleTC.fulfilled(payload, 'requestId', {
        todolistId: todolistId2,
        title: newTodolistTitle
    });
    const endState = todolistsReducer(startState, action);

    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe(newTodolistTitle);
});
test('correct filter of todolist should be changed', () => {
    let newFilter: FilterValuesType = "completed";
    const action = changeTodolistFilter({id: todolistId2, filter: newFilter});
    const endState = todolistsReducer(startState, action);

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(newFilter);
});
test('todolist should be set to the state', () => {
    const action = todolistsActions.fetchTodolistsTC.fulfilled({todolists: startState}, 'requestId');
    const endState = todolistsReducer([], action);

    expect(endState.length).toBe(2);
});
test('correct status of todolist should be changed', () => {
    let newStatus: RequestStatusType = "loading";
    const action = changeTodolistEntityStatus({id: todolistId2, entityStatus: newStatus});
    const endState = todolistsReducer(startState, action);

    expect(endState[0].entityStatus).toBe("idle");
    expect(endState[1].entityStatus).toBe(newStatus);
});
