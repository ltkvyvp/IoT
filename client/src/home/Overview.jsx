import React from 'react';
import { Link } from 'react-router-dom';

function Overview({ match }) {
    const { path } = match;

    return (
        <div>
            <p><Link to={`${path}/device`}>Thiết bị</Link></p>
        </div>
    );
}

export { Overview };