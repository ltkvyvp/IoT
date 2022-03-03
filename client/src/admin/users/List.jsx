import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { accountService } from '@/_services';

function List({ match }) {
    const { path } = match;
    const [users, setUsers] = useState([]);

    useEffect(() => {
        accountService.getAll().then(x => setUsers(x));
    }, []);

    function deleteUser(id) {
        setUsers(users.map(x => {
            if (x.id === id) { x.isDeleting = true; }
            return x;
        }));
        accountService.delete(id).then(() => {
            setUsers(users => users.filter(x => x.id !== id));
        });
    }

    return (
        <div>
            <h1>Danh sách người dùng</h1>
            <Link to={`${path}/add`} className="btn btn-sm btn-success mb-2">Thêm người dùng</Link>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '5%' }}>Stt</th>
                        <th style={{ width: '20%' }}>Tên</th>
                        <th style={{ width: '25%' }}>Email</th>
                        <th style={{ width: '10%' }}>Role</th>
                        <th style={{ width: '20%' }}>Ngày sinh</th>
                        <th style={{ width: '20%' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {users && users.map((user,index) =>
                        <tr key={user.id}>
                            <td>{index+1}</td>
                            <td>{user.lastName} {user.firstName}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{user.birthday}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <Link to={`${path}/edit/${user.id}`} className="btn btn-sm btn-primary mr-1">Sửa</Link>
                                <button onClick={() => deleteUser(user.id)} className="btn btn-sm btn-danger" style={{ width: '60px' }} disabled={user.isDeleting}>
                                    {user.isDeleting
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Xoá</span>
                                    }
                                </button>
                            </td>
                        </tr>
                    )}
                    {!users &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <span className="spinner-border spinner-border-lg align-center"></span>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    );
}

export { List };