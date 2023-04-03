import React from 'react';
import {ComponentMeta} from '@storybook/react';
import App from "./App";
import {ReduxStoreProviderDecorator} from "../stories/ReduxStoreProvider.Decorator";

export default {
    title: 'App component',
    component: App,
    decorators:[ReduxStoreProviderDecorator]

} as ComponentMeta<typeof App>;


export const AppBaseExample = () => {
    return <App/>
}

