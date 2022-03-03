import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { deviceService, accountService } from '@/_services';

function List({ match }) {
    const { path } = match;
    const [devices, setDevices] = useState(null);
    const userId = accountService.userValue.id;

    useEffect(() => {
        deviceService.getByUserId(userId).then(x => setDevices(x));
    }, []);
    return (
        <div>
            <h1>Danh sách thiết bị</h1>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '20%' }}>Stt</th>
                        <th style={{ width: '20%' }}>Tên</th>
                        <th style={{ width: '20%' }}>Mã thiết bị</th>
                        <th style={{ width: '20%' }}>Topic</th>
                        <th style={{ width: '20%' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {devices && devices.map((device,index) =>
                        <tr key={device.id}>
                            <td>{index + 1}</td>
                            <td>{device.name}</td>
                            <td>{device.code}</td>
                            <td>{device.topic}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <Link to={`${path}/details/${device.id}`} className="btn btn-sm btn-primary mr-1">Xem</Link>
                            </td>
                        </tr>
                    )}
                    {!devices &&
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