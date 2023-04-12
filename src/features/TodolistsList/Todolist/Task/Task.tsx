import React, {ChangeEvent, useCallback} from 'react';
import {Checkbox, IconButton} from "@mui/material";
import {EditableSpan} from "../../../../components/EditableSpan/EditableSpan";
import {Delete} from "@mui/icons-material";
import {TaskStatuses, TaskType} from "../../../../api/todolists-api";
import {useActions} from "../../../../app/store";
import {tasksActions, todolistsActions} from "../../index";

export const Task = React.memo((props: PropsType) => {

    const {updateTask,removeTasks} = useActions(tasksActions);

    // const changeTaskStatus = useCallback((id: string, status: TaskStatuses, todolistId: string) => {
    //     updateTask({taskId: id, domainModel: {status}, todolistId});
    // }, [])
    // const changeTaskTitle = useCallback((id: string, newTitle: string, todolistId: string) => {
    //     updateTask({taskId: id, domainModel: {title: newTitle}, todolistId});
    // }, [])

    const onClickHandler = useCallback(() => removeTasks({taskId:props.task.id,todolistId:props.id}), [props.task.id,props.id])
    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        // let newIsDoneValue = e.currentTarget.checked;
        // changeTaskStatus(props.task.id, newIsDoneValue? TaskStatuses.Completed:TaskStatuses.New, props.id);
        updateTask({
            taskId:props.task.id,
            domainModel:{status:e.currentTarget.checked? TaskStatuses.Completed:TaskStatuses.New},
            todolistId:props.id
        })
    },[props.task.id,props.id])
    const onTitleChangeHandler = useCallback((newValue: string) => {
        // changeTaskTitle(props.task.id, newValue, props.id);
        updateTask({taskId: props.task.id, domainModel: {title: newValue}, todolistId:props.id});
    },[props.task.id, props.id])


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
    // removeTask: (param:{taskId: string, todolistId: string}) => void
    // changeTaskStatus: (id: string, status: TaskStatuses, todolistId: string) => void
    // changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
}