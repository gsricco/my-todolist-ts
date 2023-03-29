import React, {useEffect, useState} from 'react'
import axios from "axios";
import {todolistAPI} from "../api/todolists-api";

export default {
    title: 'API'
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        // здесь мы будем делать запрос и ответ закидывать в стейт.
        // который в виде строки будем отображать в div-ке
       todolistAPI.getTodolists()
        .then(res => {
            setState(res.data)
        })
    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
    let count = Math.floor(Math.random() * 100)
    useEffect(() => {
        todolistAPI.createTodolist(`Create: Title ${count}`)
            .then(res => {
                setState(res.data.data.item);
            })
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    const todolistId:string = '416a8df2-dd79-4ccb-9073-2e6f702ba37b';
    useEffect(() => {
        todolistAPI.deleteTodolist(todolistId)
            .then(res=>setState(res.data))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)
    let count = Math.floor(Math.random() * 100)
    const todolistId:string = '4250d331-9e64-4bd9-9f21-e077c04cbb2b';
    useEffect(() => {
        todolistAPI.updateTodolistTitle(todolistId, `Rename: new Title ${count}`)
            .then(res=>setState(res.data))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}

