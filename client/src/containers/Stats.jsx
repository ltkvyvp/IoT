import React, { useState, useEffect } from "react";
import DataChart from './DataChart';
import Weather from "./Weather";
import {connect} from "../api/socket";
import { deviceService, logService, accountService } from '@/_services';

const COLOR_LIST = ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"];

const initTemperatureData = {
    "value": [],
    "sensorName": '',
    "color": COLOR_LIST[0]
};

function Stats () {
    const [state, setState] = useState({
        temperature: [],
        humidity: [],
        soilMoisture: [],
        timestamp: [],
        listAllDevice: [],
        listAllLog: []
    })
    const [flag, setFlag] = useState(0);

    const userId = accountService.userValue.id;
    const {temperature, humidity, timestamp, soilMoisture, listAllDevice} = state;

    useEffect(() => {
        deviceService.getByUserId(userId).then(devices => {
            if (devices && devices.length > 0) {
                setState({
                    ...state,
                    listAllDevice: devices? devices: [],
                    temperature: [{...initTemperatureData,sensorName: devices[0].name}],
                    humidity: [{...initTemperatureData,sensorName: devices[0].name}],
                    soilMoisture: [{...initTemperatureData,sensorName: devices[0].name}],
                })
            }
        })
        const interval = setInterval(() => {
                setFlag(flag => 1 - flag);
            }, 5000);
            return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        handleDataChange();
    }, [flag]);

    const convertData = (logs) => {
        if( logs && Array.isArray(logs) && logs.length > 0) {
            let temperature = [];
            let humidity = [];
            let soilMoisture = [];
            let timestamp = [];
            let temp = logs.map((log,index) => {
                let obj = {};
                for (let x of log.data) {
                    obj[x.attributeName] = x.value;
                }
                obj.createdAt = log.createdAt;
                obj.updatedAt = log.updatedAt;
                return obj;
            })

            temp = temp.sort((a,b) => {
                let d1 = new Date(a.createdAt);
                let d2 = new Date(b.createdAt);
                return d1 - d2;
            })
            temp = temp.slice(-10);
            for (let i = 0; i < listAllDevice.length; i++){
                let temperature1 = {
                    "value": [],
                    "sensorName": listAllDevice[i].name,
                    "color": COLOR_LIST[i]
                };
                let soilMoisture1 = {
                    "value": [],
                    "sensorName": listAllDevice[i].name,
                    "color": COLOR_LIST[i]
                };
                let humidity1 = {
                    "value": [],
                    "sensorName": listAllDevice[i].name,
                    "color": COLOR_LIST[i]
                };
                for (let j =0;j <temp.length; j++){
                    if (listAllDevice[i].name === temp[j].name) {
                        temp[j].temperature && temperature1.value.push(temp[j].temperature);
                        temp[j].soilMoisture && soilMoisture1.value.push(temp[j].soilMoisture);
                        temp[j].humidity && humidity1.value.push(temp[j].humidity)
                    }
                }
                temperature.push(temperature1);
                soilMoisture.push(soilMoisture1);
                humidity.push(humidity1);
            }
            temp.forEach(x => {
                timestamp.push(x.createdAt);
            })
            return {
                temperature: temperature,
                humidity: humidity,
                soilMoisture: soilMoisture,
                timestamp: timestamp
            };
        }
        else return {
            temperature: [],
            humidity: [],
            soilMoisture: [],
            timestamp: []
        }
    }

    const handleDataChange = () => {
        if (listAllDevice && listAllDevice.length > 0) {
            logService.getByUserId(userId).then(logs => {
                let data = convertData(logs);
                setState(state => {
                    return {
                        ...state,
                        temperature: data?.temperature? data.temperature: [],
                        humidity: data?.humidity? data.humidity: [],
                        soilMoisture: data?.soilMoisture? data.soilMoisture: [],
                        timestamp: data?.timestamp? data.timestamp:[]
                    }
                })
            })
        }
    }

    return (
      <div className="tab-container">
        <Weather/>
        {temperature && temperature.length>0 && <DataChart header="Temperature" data={temperature} timestamp={timestamp} />}
        {humidity && humidity.length>0 && <DataChart header="Humidity" data={humidity} timestamp={timestamp} />}
        {soilMoisture && soilMoisture.length > 0 && <DataChart header="SoilMoisture" data={soilMoisture} timestamp={timestamp} />}
      </div>
    );
}

export default Stats;
