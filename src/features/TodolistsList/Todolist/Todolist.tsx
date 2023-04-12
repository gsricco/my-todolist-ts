import React, {useCallback, useEffect} from 'react';
import {AddItemForm} from '../../../components/AddItemForm/AddItemForm';
import {EditableSpan} from '../../../components/EditableSpan/EditableSpan';
import {Button, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {Task} from "./Task/Task";
import {TaskStatuses, TaskType} from "../../../api/todolists-api";
import {FilterValuesType, TodolistsDomainType} from "../todolists-reducer";
import {useActions} from "../../../app/store";
import {tasksActions, todolistsActions} from "../index";
import {OverridableStringUnion} from "@mui/types";
import {ButtonPropsColorOverrides} from "@mui/material/Button/Button";
import {useDispatch} from "react-redux";
import {useAppDispatch} from "../../../hooks/hooks";

export const Todolist = React.memo(({demo = false, ...props}: PropsType) => {

        const {
            changeTodolistFilter,
            removeTodolistTC,
            changeTodolistTitleTC,
        } = useActions(todolistsActions);
        const {
            addTasks,
            fetchTasks
        } = useActions(tasksActions)

    const dispatch = useAppDispatch()

        useEffect(() => {
            if (demo) {
                return;
            }
            fetchTasks(props.todolist.id)
        }, [])

        const addTaskCallback = useCallback(async (title: string) => {
            // addTasks({title, todolistId: props.todolist.id});

            let thunk = tasksActions.addTasks({title, todolistId:props.todolist.id})
            const resultAction = await dispatch(thunk)
            if (tasksActions.addTasks.rejected.match(resultAction)){
                if (resultAction.payload?.fieldsErrors?.length){
                    const errorMessage = resultAction.payload?.fieldsErrors[0]
                    throw new Error(errorMessage?.error)
                } else {
                    throw new Error('Some error')
                }
            }
        }, [props.todolist.id])
        const removeTodolist = () => {
            removeTodolistTC(props.todolist.id);
        }
        const changeTodolistTitle = useCallback((title: string) => {
            changeTodolistTitleTC({todolistId: props.todolist.id, title});
        }, [props.todolist.id])
        const onFilterButtonClickHandler = useCallback((filter: FilterValuesType) => changeTodolistFilter({
            filter: filter,
            id: props.todolist.id
        }), [props.todolist.id]);

        let tasksForTodolist = props.tasks;
        if (props.todolist.filter === "active") {
            tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.New);
        }
        if (props.todolist.filter === "completed") {
            tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.Completed);
        }

        const renderFilterButton = (
            buttonFilter: FilterValuesType,
            color: RenderFilterButtonColorType,
            text: string) => {
            return <Button variant={props.todolist.filter === buttonFilter ? 'outlined' : 'text'}
                           onClick={() => onFilterButtonClickHandler(buttonFilter)}
                           color={color}>{text}
            </Button>
        }

        return <div style={{wordWrap: 'break-word'}}>
            <div style={{display: 'flex', justifyContent: 'space-between',alignItems: 'start'}}>
                <h3 style={{width: '220px'}}>
                    <EditableSpan value={props.todolist.title} onChange={changeTodolistTitle}/>
                </h3>
                <IconButton sx={{mt:1}} onClick={removeTodolist} disabled={props.todolist.entityStatus === 'loading'}>
                    <Delete/>
                </IconButton>
            </div>
            <AddItemForm addItem={addTaskCallback} disabled={props.todolist.entityStatus === 'loading'}/>
            <div>
                {tasksForTodolist.map(t =>
                    <Task key={t.id} id={props.todolist.id} task={t}/>
                )}
                {!tasksForTodolist.length && <div style={{padding:'10px', color:'gray'}}>Create your first task</div>}
            </div>
            <div style={{paddingTop: "10px"}}>
                {renderFilterButton('all', 'inherit', 'All')}
                {renderFilterButton('active', 'primary', 'Active')}
                {renderFilterButton('completed', 'secondary', 'Completed')}
            </div>
        </div>
    }
)

// Types
type RenderFilterButtonColorType = OverridableStringUnion<
    'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
    ButtonPropsColorOverrides>
type PropsType = {
    todolist: TodolistsDomainType
    tasks: Array<TaskType>
    demo?: boolean
}
