import React from 'react';
import {ComponentMeta} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {EditableSpan} from './EditableSpan';

export default {
    title: 'EditableSpan component',
    component: EditableSpan,

} as ComponentMeta<typeof EditableSpan>;


const callback = action('Title "Start value" was changed')
export const EditableSpanBaseExample = ()=>{
    return <EditableSpan value={'Start value'} onChange={callback}/>
}


