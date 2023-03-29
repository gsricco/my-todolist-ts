import React from 'react';
import {ComponentMeta} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {AddItemForm} from "./AddItemForm";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'AddItemForm component',
    component: AddItemForm,
    // More on argTypes: https://storybook.js.org/docs/react/api/argtypes

} as ComponentMeta<typeof AddItemForm>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args

const callback = action('Button "+" added title new task')
export const AddItemFormBaseExample = ()=>{
    return <AddItemForm addItem={callback}/>
}


