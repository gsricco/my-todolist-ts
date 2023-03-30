import React from 'react';
import {ComponentMeta} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {Task} from "./Task";
import {TaskPriorities, TaskStatuses} from "./api/todolists-api";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Task component',
    component: Task,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes

} as ComponentMeta<typeof Task>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

const removeTaskCallback = action('Task title removed')
const changeTaskStatusCallback = action('Task status changed')
const changeTaskTitleCallback = action('Task title changed')
export const TaskBaseExample = () => {
    return <>
        <Task
            id={'todolist1'}
            task={{id: '1', status: TaskStatuses.New, title: 'CSS',todoListId: 'todolist1',
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low}}
            removeTask={removeTaskCallback}
            changeTaskStatus={changeTaskStatusCallback}
            changeTaskTitle={changeTaskTitleCallback}
        />
        <Task
            id={'todolist2'}
            task={{id: '2', status: TaskStatuses.Completed, title: 'Title',todoListId: 'todolist2',
                description: '',
                startDate: '',
                deadline: '',
                addedDate: '',
                order: 0,
                priority: TaskPriorities.Low}}
            removeTask={removeTaskCallback}
            changeTaskStatus={changeTaskStatusCallback}
            changeTaskTitle={changeTaskTitleCallback}
        />
    </>
}


