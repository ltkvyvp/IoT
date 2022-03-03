import React from 'react';
import { accountService } from '@/_services';
import Stats from '../containers/Stats';

function Home({ }) {
    const user = accountService.userValue;
    return (
        <div className="p-4">
            <div className="container">
                <Stats/>
            </div>
        </div>
    );
}

export { Home };