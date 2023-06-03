import React, {ChangeEvent, useCallback} from 'react';
import {Checkbox, IconButton} from "@mui/material";
import {EditableSpan} from "../../../../components/EditableSpan/EditableSpan";
import {Delete} from "@mui/icons-material";
import {TaskStatuses, TaskType} from "../../../../api/todolists-api";
import {useActions} from "../../../../app/store";
import {tasksActions, todolistsActions} from "../../index";

export const Task = React.memo((props: PropsType) => {

    const {updateTask, removeTasks} = useActions(tasksActions);

    const onClickHandler = useCallback(() => removeTasks({
        taskId: props.task.id,
        todolistId: props.id
    }), [props.task.id, props.id])
    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        updateTask({
            taskId: props.task.id,
            domainModel: {status: e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New},
            todolistId: props.id
        })
    }, [props.task.id, props.id])
    const onTitleChangeHandler = useCallback((newValue: string) => {
        updateTask({taskId: props.task.id, domainModel: {title: newValue}, todolistId: props.id});
    }, [props.task.id, props.id])


    return <div key={props.task.id} style={{display: 'flex', justifyContent:'space-between', alignItems:'start'}}
                className={props.task.status === TaskStatuses.Completed ? "is-done" : ""}>
        <div style={{display: 'flex', width: '160px', alignItems:'baseline'}}>
            <Checkbox
                checked={props.task.status === TaskStatuses.Completed}
                color="primary"
                onChange={onChangeHandler}
            />
            <EditableSpan value={props.task.title} onChange={onTitleChangeHandler}/>
        </div>
        <IconButton sx={{mt:1}} onClick={onClickHandler}>
            <Delete fontSize={"small"}/>
        </IconButton>
    </div>
})


// Types
type PropsType = {
    id: string
    task: TaskType
    // removeTask: (param:{taskId: string, todolistId: string}) => void
    // changeTaskStatus: (id: string, status: TaskStatuses, todolistId: string) => void
    // changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
}