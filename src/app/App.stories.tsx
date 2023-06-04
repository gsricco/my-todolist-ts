import React from 'react';
import {ComponentMeta} from '@storybook/react';
import App from "./App";
import {BrowserRouterDecorator, ReduxStoreProviderDecorator} from "../stories/ReduxStoreProvider.Decorator";

export default {
    title: 'Application stories',
    component: App,
    decorators:[ReduxStoreProviderDecorator,BrowserRouterDecorator]

} as ComponentMeta<typeof App>;


export const AppBaseExample = (props:any) => {
    return <App demo={true}/>
}

