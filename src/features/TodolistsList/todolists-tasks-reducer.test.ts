import {addTodolistTC, TodolistsDomainType, todolistsReducer} from './todolists-reducer';
import {tasksReducer, TasksStateType} from './tasks-reducer';
import {TodolistType} from "../../api/todolists-api";

test('ids should be equals', () => {
    const startTasksState: TasksStateType = {};
    const startTodolistsState: Array<TodolistsDomainType> = [];

    let todolist:TodolistType = {
        title:'new Todolist',
        id:'any id',
        order:0,
        addedDate:''
    }

    const action = addTodolistTC.fulfilled({todolist}, '', 'new Todolist');

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;

    // @ts-ignore
    expect(idFromTasks).toBe(action.payload.todolist.id);
    // @ts-ignore
    expect(idFromTodolists).toBe(action.payload.todolist.id);
});
