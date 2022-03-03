import React, { useState, useEffect } from 'react';
import { deviceService, logService } from '@/_services';

function Details({ match }) {
    const { id } = match.params;
    const [logs, setLogs] = useState([]);
    // console.log(id);
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [topic, setTopic] = useState('');
    const [type, setType] = useState('');

    useEffect(() => {
        deviceService.getById(id).then(device => {
            setName(device['name']);
            setCode(device['code']);
            setTopic(device['topic']);
            setType(device['type']);
        });
        logService.getByDeviceId(id).then(logs => {
            setLogs(logs);
            console.log(logs);
        })
    }, [])

    function convertData(logs) {
        let result = logs && logs.map((log,index) => {
            let obj = {};
            for (let x of log.data) {
                obj[x.attributeName] = x.value;
            }
            obj.createdAt = log.createdAt;
            obj.updatedAt = log.updatedAt;
            return obj;
        })
        return result;
    }

    return (
        <div>
            <h2>Thông tin thiết bị</h2>
            <p>
                <strong>Tên : </strong>{name}<br />
                <strong>Mã thiết bị : </strong>{code}<br />
                <strong>Topic : </strong>{topic}<br />
                <strong>Loại thiết bị: </strong> {type}
            </p>
            <h2>Log</h2>
            {logs && logs?.length > 0 && convertData(logs).map((log,index) =>{
                return (
                    <p key={index}>
                        {JSON.stringify(log)}
                    </p>
                )
            })}
        </div>
    );
}

export { Details };