import request from '@/utils/request';

//传感器类型 sensorTypequeryList,sensorTypesave,sensorTypedeleteById
export async function sensorTypequeryList(params) {
    return request(`/asd/sensorType/queryList`, {
        method: 'POST',
        body: params,
    });
}

export async function sensorTypesave(params) {
    return request(`/asd/sensorType/save`, {
        method: 'POST',
        body: params,
    });
}

export async function sensorTypedeleteById(params) {
    return request(`/asd/sensorType/deleteById`, {
        method: 'POST',
        body: params,
    });
}

//传感器列表 sensorListqueryList,sensorsave,sensordeleteById
export async function sensorListqueryList(params) {
    return request(`/asd/sensor/queryList`, {
        method: 'POST',
        body: params,
    });
}

export async function sensorsave(params) {
    return request(`/asd/sensor/save`, {
        method: 'POST',
        body: params,
    });
}

export async function findCharts(params) {
    return request(`/asd/dataStatistics/findParameterChart`, {
        method: 'POST',
        body: params,
    });
}


export async function sensordeleteById(params) {
    return request(`/asd/sensor/deleteById`, {
        method: 'POST',
        body: params,
    });
}
//sensorqueryNoList,sensorqueryYesList,sensorYeahsave
export async function sensorqueryNoList(params) {
    return request(`/asd/equipmentSensor/queryNoList`, {
        method: 'POST',
        body: params,
    });
}

export async function sensorqueryYesList(params) {
    return request(`/asd/equipmentSensor/queryYesList`, {
        method: 'POST',
        body: params,
    });
}

export async function sensorYeahsave(params) {
    return request(`/asd/equipmentSensor/save`, {
        method: 'POST',
        body: params,
    });
}
export async function findChart(params) {
    return request(`/asd/dataStatistics/findChart`, {
        method: 'POST',
        body: params,
    });
}
export async function findChartByParameterId(params) {
    return request(`/asd/dataStatistics/findChartByParameterId`, {
        method: 'POST',
        body: params,
    });
}

export async function findLeftChart(params) {
    return request(`/asd/chart/findLeftChart`, {
        method: 'POST',
        body: params,
    });
}

export async function findUnderChart(params) {
    return request(`/asd/chart/findUnderChart`, {
        method: 'POST',
        body: params,
    });
}

export async function findTreeChart(params) {
    return request(`/asd/chart/findTreeChart`, {
        method: 'POST',
        body: params,
    });
}

export async function findSpecific(params) {
    return request(`/asd/dataStatistics/findChartBySensorNo`, {
        method: 'POST',
        body: params,
    });
}

export async function findLocation(params) {
    return request(`/asd/chart/findLocation`, {
        method: 'POST',
        body: params,
    });
}

//datagatesave,datagatedelete,datagatequery
export async function datagatesave(params) {
    return request(`/asd/dataGateway/save`, {
        method: 'POST',
        body: params,
    });
}

export async function datagatedelete(params) {
    return request(`/asd/dataGateway/deleteById`, {
        method: 'POST',
        body: params,
    });
}

export async function datagatequery(params) {
    return request(`/asd/dataGatewayRel/queryDataGatewayList`, {
        method: 'POST',
        body: params,
    });
}

export async function queryByEquipmentId(params) {
    return request(`/asd/dataGatewayRel/queryDataGateway`, {
        method: 'POST',
        body: params,
    });
}

export async function queryAllByDataGatewayId(params) {
    return request(`/asd/equipmentParameter/queryAllByDataGatewayId`, {
        method: 'POST',
        body: params,
    });
}

export async function datasave(params) {
    return request(`/asd/dataGatewayRel/save`, {
        method: 'POST',
        body: params,
    });
}

export async function parametersave(params) {
    return request(`/asd/parameter/save`, {
        method: 'POST',
        body: params,
    });
}

export async function parameterdeleteById(params) {
    return request(`/asd/parameter/deleteById`, {
        method: 'POST',
        body: params,
    });
}

export async function parametersaveSecondLevel(params) {
    return request(`/asd/parameter/saveSecondLevel`, {
        method: 'POST',
        body: params,
    });
}



export async function equipmentSensor(params) {
    return request(`/asd/equipmentSensor/queryByEquipmentId`, {
        method: 'POST',
        body: params,
    });
}


export async function equipmentSensorupdate(params) {
    return request(`/asd/equipmentSensor/update`, {
        method: 'POST',
        body: params,
    });
}

export async function queryAll(params) {
    return request(`/asd/parameter/queryAll`, {
        method: 'POST',
        body: params,
    });
}


export async function queryAllsave(params) {
    return request(`/asd/equipmentParameter/save`, {
        method: 'POST',
        body: params,
    });
}

























