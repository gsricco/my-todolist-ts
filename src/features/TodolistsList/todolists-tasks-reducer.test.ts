import {TodolistsDomainType} from './todolists-reducer';
import {TasksStateType} from './tasks-reducer';
import {TodolistType} from "../../api/types";
import {todolistsActions,tasksReducer,todolistsReducer} from "./index";

test('ids should be equals', () => {
    const startTasksState: TasksStateType = {};
    const startTodolistsState: Array<TodolistsDomainType> = [];

    let todolist: TodolistType = {
        title: 'new Todolist',
        id: 'any id',
        order: 0,
        addedDate: ''
    }

    const action = todolistsActions.addTodolistTC.fulfilled({todolist}, '', 'new Todolist');
    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;

    expect(idFromTasks).toBe(action.payload.todolist.id);
    expect(idFromTodolists).toBe(action.payload.todolist.id);
});
