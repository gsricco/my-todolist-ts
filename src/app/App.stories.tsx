import React from 'react';
import {ComponentMeta} from '@storybook/react';
import App from "./App";
import {ReduxStoreProviderDecorator} from "../stories/ReduxStoreProvider.Decorator";

export default {
    title: 'App stories',
    component: App,
    decorators:[ReduxStoreProviderDecorator]

} as ComponentMeta<typeof App>;


export const AppBaseExample = (props:any) => {
    return <App demo={true}/>
}

