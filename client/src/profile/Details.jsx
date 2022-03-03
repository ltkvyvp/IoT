import React from 'react';
import { Link } from 'react-router-dom';

import { accountService } from '@/_services';

function Details({ match }) {
    const { path } = match;
    const user = accountService.userValue;
    return (
        <div>
            <h2>Thông tin cá nhân</h2>
            <p>
                <strong>Tên : </strong>{user.lastName} {user.firstName}<br />
                <strong>Giới tính : </strong>{user.gender === "Male" ? "Nam"
                    : user.gender === "Female" ? "Nữ" : "Khác"}<br />
                <strong>Ngày sinh : </strong>{user.birthday}<br />
                <strong>Email: </strong> {user.email}
            </p>
            <p><Link to={`${path}/update`}>Cập nhật thông tin</Link></p>
        </div>
    );
}

export { Details };