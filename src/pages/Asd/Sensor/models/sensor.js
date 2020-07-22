/**
 * Created by 11485 on 2019/2/28.
 */
import {
    sensorTypequeryList, sensorTypesave, sensorTypedeleteById,
    sensorListqueryList, sensorsave, sensordeleteById,
    sensorqueryNoList, sensorqueryYesList, sensorYeahsave, datagatequery, datasave, parametersave, parameterdeleteById,
    findLeftChart, findUnderChart, findTreeChart, findSpecific,findChartByParameterId, findLocation, queryByEquipmentId, parametersaveSecondLevel,
    equipmentSensor, equipmentSensorupdate, queryAll, findChart,queryAllsave,findCharts
} from '@/services/asd.js'
import {
    devicequeryList, deviceTypequeryTreeList
} from '@/services/ngy.js'

export default {
    namespace: 'sensor',
    state: {
        datagatequery: [],
        sensorTypequeryList: [],
        sensorListqueryList: [],
        unitType: [],
        sensorType: [],
        queryByEquipmentId: [],
        equipmentSensor: [],
        leafSensorType: [],
        devicequeryList: [],
        sensorqueryNoList: [],
        sensorqueryYesList: [],
        deviceTypequeryTreeList: [],
        search: [],
        findChart: [],
        findCharts:{},
        findLeftChart: [],
        findUnderChart: [],
        findTreeChart: [],
        findSpecific: {},
        findChartByParameterId:{},
        findLocation: {},
        queryAll: {},
        equipmentId:"",
        code: {}
    },
    effects: {

        *equipmentSensor({ payload }, { call, put }) {
            const responese = yield call(equipmentSensor, payload);
            yield put({
                type: 'updateState',
                payload: { equipmentSensor: responese.data.dataList ? responese.data.dataList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { equipmentId: responese.data.equipmentId ? responese.data.equipmentId : [] }
            })
            return responese.code == "0000"
        },

        *queryAll({ payload }, { call, put }) {
            const responese = yield call(queryAll, payload);
            yield put({
                type: 'updateState',
                payload: { queryAll: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },

        *queryByEquipmentId({ payload }, { call, put }) {
            const responese = yield call(queryByEquipmentId, payload);
            yield put({
                type: 'updateState',
                payload: { queryByEquipmentId: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },

        *findLocation({ payload }, { call, put }) {//datalist
            const responese = yield call(findLocation, payload);
            yield put({
                type: 'updateState',
                payload: { findLocation: responese.data.data ? responese.data.data : [] }
            })
            return responese.code == "0000"
        },
        *findSpecific({ payload }, { call, put }) {//datalist
            const responese = yield call(findSpecific, payload);
            yield put({
                type: 'updateState',
                payload: { findSpecific: responese.data.data ? responese.data.data : [] }
            })
            return responese.code == "0000"
        },
        *findChartByParameterId({ payload }, { call, put }) {//datalist
            const responese = yield call(findChartByParameterId, payload);
            yield put({
                type: 'updateState',
                payload: { findChartByParameterId: responese.data.data ? responese.data.data : [] }
            })
            return responese.code == "0000"
        },
        *findTreeChart({ payload }, { call, put }) {//datalist
            const responese = yield call(findTreeChart, payload);
            yield put({
                type: 'updateState',
                payload: { findTreeChart: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *findUnderChart({ payload }, { call, put }) {//datalist
            const responese = yield call(findUnderChart, payload);
            yield put({
                type: 'updateState',
                payload: { findUnderChart: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *findLeftChart({ payload }, { call, put }) {//datalist
            const responese = yield call(findLeftChart, payload);
            yield put({
                type: 'updateState',
                payload: { findLeftChart: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *findChart({ payload }, { call, put }) {//datalist
            const responese = yield call(findChart, payload);
            yield put({
                type: 'updateState',
                payload: { findTreeChart: responese.data.data.sensorDataListForChart ? responese.data.data.sensorDataListForChart : [] }
            })
            yield put({
                type: 'updateState',
                payload: { findUnderChart: responese.data.data.parameterDataList ? responese.data.data.parameterDataList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { findLeftChart: responese.data.data.sensorDataList ? responese.data.data.sensorDataList : [] }
            })
            return responese.code == "0000"
        },
        *findCharts({ payload }, { call, put }) {//datalist
            const responese = yield call(findCharts, payload);
            console.log(responese.data.data.parameterDataList)
            yield put({
                type: 'updateState',
                payload: { findTreeChart: responese.data.data.parameterDataListForChart ? responese.data.data.parameterDataListForChart : [] }
            })
            yield put({
                type: 'updateState',
                payload: { findUnderChart: responese.data.data.parameterDataList ? responese.data.data.parameterDataList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { findLeftChart: responese.data.data.sensorDataList ? responese.data.data.sensorDataList : [] }
            })
            return responese.code == "0000"
        },
        *sensorqueryNoList({ payload }, { call, put }) {//datalist
            const responese = yield call(sensorqueryNoList, payload);
            yield put({
                type: 'updateState',
                payload: { sensorqueryNoList: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },

        *sensorqueryYesList({ payload }, { call, put }) {//datalist
            const responese = yield call(sensorqueryYesList, payload);
            yield put({
                type: 'updateState',
                payload: { sensorqueryYesList: responese.data.page ? responese.data.page : [] }
            })
            yield put({
                type: 'updateState',
                payload: { sensorType: responese.data.sensorType ? responese.data.sensorType : [] }
            })
            return responese.code == "0000"
        },


        *devicequeryList({ payload }, { call, put }) {//datalist
            const responese = yield call(devicequeryList, payload);
            yield put({
                type: 'updateState',
                payload: { devicequeryList: responese.data.page ? responese.data.page : [] }
            })
            yield put({
                type: 'updateState',
                payload: { search: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *sensorTypequeryList({ payload }, { call, put }) {
            const responese = yield call(sensorTypequeryList, payload);
            yield put({
                type: 'updateState',
                payload: { sensorTypequeryList: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *datagatequery({ payload }, { call, put }) {
            const responese = yield call(datagatequery, payload);
            yield put({
                type: 'updateState',
                payload: { datagatequery: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *sensorListqueryList({ payload }, { call, put }) {
            const responese = yield call(sensorListqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { sensorListqueryList: responese.data.page ? responese.data.page : [] }
            })
            yield put({//sensorType,unitType
                type: 'updateState',
                payload: { unitType: responese.data.unitType ? responese.data.unitType : [] }
            })
            yield put({//sensorType,unitType
                type: 'updateState',
                payload: { leafSensorType: responese.data.leafSensorType ? responese.data.leafSensorType : [] }
            })
            yield put({
                type: 'updateState',
                payload: { sensorType: responese.data.sensorType ? responese.data.sensorType : [] }
            })

            return responese.code == "0000"
        },
        *sensorsave({ payload }, { call, put }) {
            const responese = yield call(sensorsave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },

        *queryAllsave({ payload }, { call, put }) {
            const responese = yield call(queryAllsave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *datasave({ payload }, { call, put }) {
            const responese = yield call(datasave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *parametersave({ payload }, { call, put }) {
            const responese = yield call(parametersave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *parameterdeleteById({ payload }, { call, put }) {
            const responese = yield call(parameterdeleteById, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *parametersaveSecondLevel({ payload }, { call, put }) {
            const responese = yield call(parametersaveSecondLevel, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *sensordeleteById({ payload }, { call, put }) {
            const responese = yield call(sensordeleteById, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *equipmentSensorupdate({ payload }, { call, put }) {
            const responese = yield call(equipmentSensorupdate, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *deviceTypequeryTreeList({ payload }, { call, put }) {//datalist
            const responese = yield call(deviceTypequeryTreeList, payload);
            yield put({
                type: 'updateState',
                payload: { deviceTypequeryTreeList: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *sensorYeahsave({ payload }, { call, put }) {
            const responese = yield call(sensorYeahsave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *sensorTypesave({ payload }, { call, put }) {
            const responese = yield call(sensorTypesave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *sensorTypedeleteById({ payload }, { call, put }) {
            const responese = yield call(sensorTypedeleteById, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },

    },
    reducers: {
        updateState(state, { payload }) {
            return { ...state, ...payload };
        },
    }
}
