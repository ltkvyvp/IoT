import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { deviceService } from '@/_services';

function List({ match }) {
    const { path } = match;
    const [devices, setDevices] = useState(null);

    useEffect(() => {
        deviceService.getAll().then(x => setDevices(x));
    }, []);

    function deleteDevice(id) {
        setDevices(devices.map(x => {
            if (x.id === id) { x.isDeleting = true; }
            return x;
        }));
        deviceService.delete(id).then(() => {
            setDevices(devices => devices.filter(x => x.id !== id));
        });
    }

    return (
        <div>
            <h1>Danh sách thiết bị</h1>
            <Link to={`${path}/add`} className="btn btn-sm btn-success mb-2">Thêm thiết bị</Link>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '10%' }}>Số thứ tự</th>
                        <th style={{ width: '30%' }}>Tên</th>
                        <th style={{ width: '30%' }}>Mã thiết bị</th>
                        <th style={{ width: '30%' }}>Loại thiết bị</th>
                    </tr>
                </thead>
                <tbody>
                    {devices && devices.map((device,index) =>
                        <tr key={device.id}>
                            <td>{index+1}</td>
                            <td>{device.name}</td>
                            <td>{device.code}</td>
                            <td>{device.type}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <Link to={`${path}/edit/${device.id}`} className="btn btn-sm btn-primary mr-1">Sửa</Link>
                                <button onClick={() => deleteDevice(device.id)} className="btn btn-sm btn-danger" style={{ width: '60px' }} disabled={device.isDeleting}>
                                    {device.isDeleting
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Xoá</span>
                                    }
                                </button>
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