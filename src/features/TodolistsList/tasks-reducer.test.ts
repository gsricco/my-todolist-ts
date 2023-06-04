import {slice,TasksStateType} from './tasks-reducer';
import {TaskPriorities, TaskStatuses} from "../../api/types";
import {todolistsActions} from "./index";
import {tasksActions} from "./index";

const {reducer:tasksReducer}=slice


let startState: TasksStateType = {};
beforeEach(() => {
    startState = {
        "todolistId1": [
            {
                id: "1", status: TaskStatuses.New, title: 'CSS', todoListId: 'todolist1',
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low
            },
            {
                id: "2", title: "JS", status: TaskStatuses.New, todoListId: 'todolist1',
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low
            },
            {
                id: "3", title: "React", status: TaskStatuses.New, todoListId: 'todolist1',
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low
            }
        ],
        "todolistId2": [
            {
                id: "1", title: "bread", status: TaskStatuses.New, todoListId: 'todolist2',
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low
            },
            {
                id: "2", title: "milk", status: TaskStatuses.New, todoListId: 'todolist2',
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low
            },
            {
                id: "3", title: "tea", status: TaskStatuses.New, todoListId: 'todolist2',
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low
            }
        ]
    };
});

test('correct task should be deleted from correct array', () => {
    const action = tasksActions.removeTasks.fulfilled({taskId: "2", todolistId: "todolistId2"}, 'requestId', {
        taskId: "2",
        todolistId: "todolistId2"
    });
    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(2);
    expect(endState["todolistId2"].every(t => t.id != "2")).toBeTruthy();
});
test('correct task should be added to correct array', () => {
    const payload = {
        task: {
            id: "id exists", status: TaskStatuses.New, title: 'juice', todoListId: 'todolistId2',
            description: '',
            startDate: '',
            deadline: '',
            addedDate: '',
            order: 0,
            priority: TaskPriorities.Low
        }
    }
    const action = tasksActions.addTasks.fulfilled(payload, 'requestId', {title: 'juice', todolistId: 'todolistId2'});
    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(4);
    expect(endState["todolistId2"][0].id).toBeDefined();
    expect(endState["todolistId2"][0].title).toBe("juice");
    expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New);
});
test('status of specified task should be changed', () => {
    const payload = {taskId: "2", domainModel: {status: TaskStatuses.Completed}, todolistId: "todolistId2"}
    const action = tasksActions.updateTask.fulfilled(payload, 'requestId', {
        taskId: "2",
        domainModel: {status: TaskStatuses.Completed},
        todolistId: "todolistId2"
    });
    const endState = tasksReducer(startState, action);

    expect(endState["todolistId1"][1].status).toBe(TaskStatuses.New);
    expect(endState["todolistId2"][1].status).toBe(TaskStatuses.Completed);
});
test('title of specified task should be changed', () => {
    const action = tasksActions.updateTask.fulfilled({
        taskId: "2",
        domainModel: {title: "yogurt"},
        todolistId: "todolistId2"
    }, 'requestId', {taskId: "2", domainModel: {title: "yogurt"}, todolistId: "todolistId2"});
    const endState = tasksReducer(startState, action)

    expect(endState["todolistId1"][1].title).toBe("JS");
    expect(endState["todolistId2"][1].title).toBe("yogurt");
    expect(endState["todolistId2"][0].title).toBe("bread");
});
test('new array should be added when new todolist is added', () => {
    const payload = {todolist: {id: 'todolistId3', title: 'title', addedDate: '', order: 0,}}
    const action = todolistsActions.addTodolistTC.fulfilled(payload, '', 'title');
    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState);
    const newKey = keys.find(k => k != "todolistId1" && k != "todolistId2");
    if (!newKey) {
        throw Error("new key should be added")
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
});
test('property with todolistId should be deleted', () => {
    const action = todolistsActions.removeTodolistTC.fulfilled({todolistId: "todolistId2"}, 'requestId', "todolistId2");
    const endState = tasksReducer(startState, action);
    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState["todolistId2"]).not.toBeDefined();
});
test('empty arrays should be added when we set todolists', () => {
    const action = todolistsActions.fetchTodolistsTC.fulfilled(
        {
            todolists: [
                {id: '1', title: 'title 1', order: 0, addedDate: ''},
                {id: '2', title: 'title 2', order: 0, addedDate: ''}
            ]
        },  'requestId',  undefined);
    const endState = tasksReducer({}, action)

    const keys = Object.keys(endState);

    expect(keys.length).toBe(2);
    expect(endState["1"]).toStrictEqual([]);
    expect(endState["2"]).toStrictEqual([]);
});
test('tasks should be added for todolist', () => {
    const action = tasksActions.fetchTasks.fulfilled({
        tasks: startState['todolistId1'],
        todolistId: 'todolistId1'
    }, 'requestId', 'todolistId1');
    const endState = tasksReducer({
        'todolistId2': [],
        'todolistId1': []
    }, action)

    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(0);
});
