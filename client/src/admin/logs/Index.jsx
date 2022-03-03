import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { List } from './List';

function Logs({ match }) {
    const { path } = match;

    return (
        <Switch>
            <Route exact path={path} component={List} />
        </Switch>
    );
}

export { Logs };