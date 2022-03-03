import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { List } from './List';
import { Details } from './Details';


function Device({ match }) {
    const { path } = match;

    return (
        <Switch>
            <Route exact path={path} component={List} />
            <Route path={`${path}/details/:id`} component={Details} />
        </Switch>
    );
}

export { Device };