import React, {FC, useCallback, useEffect} from 'react';
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

export const Todolist = React.memo(({demo = false, ...props}: PropsType) => {

        const {
            changeTodolistFilter,
            removeTodolistTC,
            changeTodolistTitleTC,
        } = useActions(todolistsActions);

        const {
            addTasks,
            updateTask,
            removeTasks,
            fetchTasks
        } = useActions(tasksActions)

        // const changeTaskStatus = useCallback((id: string, status: TaskStatuses, todolistId: string) => {
        //     updateTask({taskId: id, domainModel: {status}, todolistId});
        // }, [])
        // const changeTaskTitle = useCallback((id: string, newTitle: string, todolistId: string) => {
        //     updateTask({taskId: id, domainModel: {title: newTitle}, todolistId});
        // }, [])


        // const dispatch = useAppDispatch()

        useEffect(() => {
            if (demo) {
                return;
            }
            fetchTasks(props.todolist.id)
        }, [])


        const addTaskCallback = useCallback((title: string) => {
            addTasks({title, todolistId: props.todolist.id});
        }, [props.todolist.id])
        const removeTodolist = () => {
            removeTodolistTC(props.todolist.id);
        }
        const changeTodolistTitle = useCallback((title: string) => {
            changeTodolistTitleTC({todolistId: props.todolist.id, title});
        }, [props.todolist.id])
        const onFilterButtonClickHandler = useCallback((filter:FilterValuesType) => changeTodolistFilter({
            filter: filter,
            id: props.todolist.id
        }), [props.todolist.id]);
        // const onAllClickHandler = useCallback(() => changeTodolistFilter({
        //     filter: "all",
        //     id: props.todolist.id
        // }), [props.todolist.id]);
        // const onActiveClickHandler = useCallback(() => changeTodolistFilter({
        //     filter: "active",
        //     id: props.todolist.id
        // }), [props.todolist.id]);
        // const onCompletedClickHandler = useCallback(() => changeTodolistFilter({
        //     filter: "completed",
        //     id: props.todolist.id
        // }), [props.todolist.id]);

        let tasksForTodolist = props.tasks;
        if (props.todolist.filter === "active") {
            tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.New);
        }
        if (props.todolist.filter === "completed") {
            tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.Completed);
        }


        const renderFilterButton = (
            buttonFilter: FilterValuesType,
            color: OverridableStringUnion<
                'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
                ButtonPropsColorOverrides
            >,
            text: string
        ) => {
            return <Button variant={props.todolist.filter === buttonFilter ? 'outlined' : 'text'}
                           onClick={() => onFilterButtonClickHandler(buttonFilter)}
                           color={color}>{text}
            </Button>
        }

        return <div>
            <h3><EditableSpan value={props.todolist.title} onChange={changeTodolistTitle}/>
                <IconButton onClick={removeTodolist} disabled={props.todolist.entityStatus === 'loading'}>
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTaskCallback} disabled={props.todolist.entityStatus === 'loading'}/>
            <div>
                {tasksForTodolist.map(t =>
                    <Task key={t.id}
                          id={props.todolist.id}
                          task={t}
                          // removeTask={removeTasks}
                          // changeTaskStatus={changeTaskStatus}
                          // changeTaskTitle={changeTaskTitle}
                    />
                )}
            </div>
            <div style={{paddingTop: "10px"}}>
                {/*<FilterButton color={'inherit'} buttonFilter={'all'} onClick={onAllClickHandler} selectedFilter={props.todolist.filter} />*/}
                {renderFilterButton('all', 'inherit', 'All')}
                {renderFilterButton('active', 'primary', 'Active')}
                {renderFilterButton('completed', 'secondary', 'Completed')}


                {/*<Button variant={props.todolist.filter === 'all' ? 'outlined' : 'text'}*/}
                {/*        onClick={onAllClickHandler}*/}
                {/*        color={'inherit'}*/}
                {/*>All*/}
                {/*</Button>*/}
                {/*<Button variant={props.todolist.filter === 'active' ? 'outlined' : 'text'}*/}
                {/*        onClick={onActiveClickHandler}*/}
                {/*        color={'primary'}>Active*/}
                {/*</Button>*/}
                {/*<Button variant={props.todolist.filter === 'completed' ? 'outlined' : 'text'}*/}
                {/*        onClick={onCompletedClickHandler}*/}
                {/*        color={'secondary'}>Completed*/}
                {/*</Button>*/}
            </div>
        </div>
    }
)

// const FilterButton:FC<FilterButtonPropsType> = ({onClick, selectedFilter, buttonFilter, color, children})=>{
//     return(
//         <Button variant={selectedFilter === buttonFilter ? 'outlined' : 'text'}
//     onClick={onClick}
//     color={'secondary'}>{children}
//         </Button>
//     )
// }


// Types
// type FilterButtonPropsType = {
//     onClick:()=>void
//     selectedFilter:FilterValuesType
//     buttonFilter:FilterValuesType
//     color:OverridableStringUnion<
//         'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
//         ButtonPropsColorOverrides
//     >
//     // text:string
// }
type PropsType = {
    todolist: TodolistsDomainType
    // id: string
    // title: string
    tasks: Array<TaskType>
    // removeTask: (param: { taskId: string, todolistId: string }) => void
    // changeFilter: (value: FilterValuesType, todolistId: string) => void
    // addTask: (title: string, todolistId: string) => void
    // changeTaskStatus: (id: string, status: TaskStatuses, todolistId: string) => void
    // removeTodolist: (id: string) => void
    // changeTodolistTitle: (id: string, newTitle: string) => void
    // filter: FilterValuesType
    // changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
    demo?: boolean
}
