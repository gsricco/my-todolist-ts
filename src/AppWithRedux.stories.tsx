import React from 'react';
import {ComponentMeta} from '@storybook/react';
import AppWithRedux from "./AppWithRedux";
import {Provider} from "react-redux";
import {store} from "./state/store";
import {ReduxStoreProviderDecorator} from "./stories/ReduxStoreProvider.Decorator";

export default {
    title: 'AppWithRedux component',
    component: AppWithRedux,
    decorators:[ReduxStoreProviderDecorator]

} as ComponentMeta<typeof AppWithRedux>;


export const AppWithReduxBaseExample = () => {
    return <AppWithRedux/>
}

