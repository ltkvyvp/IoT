import React from 'react';
import { Link } from 'react-router-dom';

function Overview({ match }) {
    const { path } = match;

    return (
        <div>
            <p><Link to={`${path}/users`}>Quản lí người dùng</Link></p>
            <p><Link to={`${path}/devices`}>Quản lí thiết bị</Link></p>
            <p><Link to={`${path}/logs`}>Lịch sử log</Link></p>
        </div>
    );
}

export { Overview };