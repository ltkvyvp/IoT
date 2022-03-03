import React, { useState, useEffect } from 'react';
import { NavLink, Route } from 'react-router-dom';

import { Role } from '@/_helpers';
import { accountService } from '@/_services';

function Nav() {
    const [user, setUser] = useState({});

    useEffect(() => {
        const subscription = accountService.user.subscribe(x => setUser(x));
        return subscription.unsubscribe;
    }, []);

    // only show nav when logged in
    if (!user) return null;

    return (
        <div>
            <nav className="navbar navbar-expand navbar-dark bg-dark">
                <div className="navbar-nav">
                    <NavLink exact to="/" className="nav-item nav-link">Trang chủ</NavLink>
                    <NavLink to="/profile" className="nav-item nav-link">Hồ sơ</NavLink>
                    {user.role === Role.Admin &&
                        <NavLink to="/admin" className="nav-item nav-link">Admin</NavLink>
                    }
                    <NavLink to="/device" className=" nav-item nav-link">Thiết bị</NavLink>
                    <a onClick={accountService.logout} className="nav-item nav-link">Đăng xuất</a>
                </div>
            </nav>
            <Route path="/admin" component={AdminNav} />
        </div>
    );
}

function AdminNav({ match }) {
    const { path } = match;

    return (
        <nav className="admin-nav navbar navbar-expand navbar-light">
            <div className="navbar-nav">
                <NavLink to={`${path}/users`} className="nav-item nav-link">Danh sách người dùng</NavLink>
                <NavLink to={`${path}/devices`} className="nav-item nav-link">Danh sách thiết bị</NavLink>
                <NavLink to={`${path}/logs`} className="nav-item nav-link">Lịch sử log</NavLink>
            </div>
        </nav>
    );
}

export { Nav }; 