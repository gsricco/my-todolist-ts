import React, {ChangeEvent, useCallback} from 'react';
import {Checkbox, IconButton} from "@mui/material";
import {EditableSpan} from "../../../../components/EditableSpan/EditableSpan";
import {Delete} from "@mui/icons-material";
import {TaskStatuses, TaskType} from "../../../../api/todolists-api";

export const Task = React.memo((props: PropsType) => {
    const onClickHandler = () => props.removeTask(props.task.id, props.id)
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked;
        props.changeTaskStatus(props.task.id, newIsDoneValue? TaskStatuses.Completed:TaskStatuses.New, props.id);
    }
    const onTitleChangeHandler = useCallback((newValue: string) => {
        props.changeTaskTitle(props.task.id, newValue, props.id);
    },[props.changeTaskTitle,props.task.id, props.id])


    return <div key={props.task.id} className={props.task.status===TaskStatuses.Completed ? "is-done" : ""}>
        <Checkbox
            checked={props.task.status===TaskStatuses.Completed}
            color="primary"
            onChange={onChangeHandler}
        />
        <EditableSpan value={props.task.title} onChange={onTitleChangeHandler} />
        <IconButton onClick={onClickHandler}>
            <Delete />
        </IconButton>
    </div>
})

// Types
type PropsType = {
    id: string
    task: TaskType
    removeTask: (taskId: string, todolistId: string) => void
    changeTaskStatus: (id: string, status: TaskStatuses, todolistId: string) => void
    changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
}