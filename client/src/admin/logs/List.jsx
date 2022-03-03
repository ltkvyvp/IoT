import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { logService } from '@/_services';

function List({ match }) {
    const { path } = match;
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        logService.getAll().then(x => setLogs(x));
    }, []);

    function deleteLog(id) {
        setLogs(logs.map(x => {
            if (x.id === id) { x.isDeleting = true; }
            return x;
        }));
        logService.delete(id).then(() => {
            setLogs(logs => logs.filter(x => x.id !== id));
        });
    }

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

export { List };