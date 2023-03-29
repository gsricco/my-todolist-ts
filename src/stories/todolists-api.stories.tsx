import React, {useEffect, useState} from 'react'
import axios from "axios";
import {todolistAPI} from "../api/todolists-api";

export default {
    title: 'API'
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null);
    const getTodolists = () => {
        todolistAPI.getTodolists()
            .then(res => {
                setState(res.data)
            })
    }

    return <div>{JSON.stringify(state)}
        <div>
            <button onClick={getTodolists}>GET TODOLISTS</button>
        </div>
    </div>

}
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    const [title, setTitle] = useState<string>('');

    const createTodolist = () => {
        todolistAPI.createTodolist(title)
            .then(res => {
                setState(res.data);
            })
    }

    return <div>{JSON.stringify(state)}
        <div>
            <input type="text" placeholder={'title'} value={title} onChange={(e) => setTitle(e.currentTarget.value)}/>
            <button onClick={createTodolist}>CREATE TODOLIST</button>
        </div>
    </div>
}
export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState<string>('');
    const deleteTodolist = () => {
        todolistAPI.deleteTodolist(todolistId)
            .then(res => setState(res.data))
    }

    return <div>{JSON.stringify(state)}
        <div>
            <input type="text" placeholder={'todolistId'} value={todolistId}
                   onChange={(e) => setTodolistId(e.currentTarget.value)}/>
            <button onClick={deleteTodolist}>DELETE TODOLIST</button>
        </div>
    </div>
}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null);
    const [title, setTitle] = useState<string>('');
    const [todolistId, setTodolistId] = useState<string>('');


    const updateTodolist = () => {
        todolistAPI.updateTodolistTitle(todolistId, title)
            .then(res => setState(res.data))
    }

    return <div>{JSON.stringify(state)}
        <div>
            <input type="text" placeholder={'todolistId'} value={todolistId}
                   onChange={(e) => setTodolistId(e.currentTarget.value)}/>
            <input type="text" placeholder={'title'} value={title} onChange={(e) => setTitle(e.currentTarget.value)}/>
            <button onClick={updateTodolist}>UPDATE TODOLIST</button>
        </div>
    </div>
}

export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    const [todolistId, setTodolistId] = useState<string>('');

    const getTasks = () => {
        todolistAPI.getTasks(todolistId)
            .then(res => {
                setState(res.data.items);
            })
    }

    return <div>{JSON.stringify(state)}
        <div>
            <input type="text" placeholder={'todolistId'} value={todolistId}
                   onChange={(e) => setTodolistId(e.currentTarget.value)}/>
            <button onClick={getTasks}>GET TASKS</button>
        </div>
    </div>
}

export const DeleteTasks = () => {
    const [state, setState] = useState<any>(null);
    const [taskId, setTaskId] = useState<string>('');
    const [todolistId, setTodolistId] = useState<string>('');

    const deleteTask = () => {
        todolistAPI.deleteTasks(todolistId, taskId)
            .then(res => {
                setState(res.data);
            })
    }

    return <div>{JSON.stringify(state)}
        <div>
            <input type="text" placeholder={'todolistId'} value={todolistId}
                   onChange={(e) => setTodolistId(e.currentTarget.value)}/>
            <input type="text" placeholder={'taskId'} value={taskId}
                   onChange={(e) => setTaskId(e.currentTarget.value)}/>
            <button onClick={deleteTask}>DELETE TASK</button>
        </div>
    </div>
}
export const CreateTask = () => {
    const [state, setState] = useState<any>(null);
    const [title, setTitle] = useState<string>('');
    const [todolistId, setTodolistId] = useState<string>('');

    const createTask = () => {
        todolistAPI.createTask(todolistId, title)
            .then(res => {
                setState(res.data);
            })
    }

    return <div>{JSON.stringify(state)}
        <div>
            <input type="text" placeholder={'todolistId'} value={todolistId}
                   onChange={(e) => setTodolistId(e.currentTarget.value)}/>
            <input type="text" placeholder={'title'} value={title} onChange={(e) => setTitle(e.currentTarget.value)}/>
            <button onClick={createTask}>CREATE TASK</button>
        </div>
    </div>
}

export const UpdateTask = () => {
    const [state, setState] = useState<any>(null);
    const [title, setTitle] = useState<string>('');
    const [todolistId, setTodolistId] = useState<string>('');
    const [taskId, setTaskId] = useState<string>('');

    const updateTask = () => {
        let date = new Date();

        date.toISOString()
        todolistAPI.updateTask(todolistId, taskId, {
            title: title,
            description: null,
            status: 0,
            priority: 1,
            startDate: date.toISOString(),
            deadline: null
        })
            .then(res => {
                setState(res.data);
            })
    }

    return <div>{JSON.stringify(state)}
        <div>
            <input type="text" placeholder={'todolistId'} value={todolistId}
                   onChange={(e) => setTodolistId(e.currentTarget.value)}/>
            <input type="text" placeholder={'taskId'} value={taskId}
                   onChange={(e) => setTaskId(e.currentTarget.value)}/>
            <input type="text" placeholder={'title'} value={title} onChange={(e) => setTitle(e.currentTarget.value)}/>
            <button onClick={updateTask}>UPDATE TASK</button>
        </div>
    </div>
}

