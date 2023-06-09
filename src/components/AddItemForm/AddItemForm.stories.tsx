import React from 'react';
import {ComponentMeta} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {AddItemForm} from "./AddItemForm";

export default {
    title: 'AddItemForm component',
    component: AddItemForm,
} as ComponentMeta<typeof AddItemForm>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

const asyncCallback = async (...params:any[])=>{
    action('Button "+" added title new task')
}


// const callback = action('Button "+" added title new task')
export const AddItemFormBaseExample = ()=>{
    return <AddItemForm addItem={asyncCallback}/>
}

export const AddItemFormDisabledExample = (props:any)=>{
    return <AddItemForm disabled={true} addItem={asyncCallback}/>
}


