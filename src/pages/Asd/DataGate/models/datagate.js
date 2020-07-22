/**
 * Created by 11485 on 2019/2/28.
 */
import {
    datagatesave, datagatedelete, datagatequery, queryAll, parametersave, parametersaveSecondLevel, queryByEquipmentId,parameterdeleteById
} from '@/services/asd.js'
import {
    devicequeryList, deviceTypequeryTreeList
} from '@/services/ngy.js'

export default {
    namespace: 'datagate',
    state: {
        datagatequery: [],
        queryAll: [],
        queryByEquipmentId: [],
        code: {}
    },
    effects: {
        *parametersave({ payload }, { call, put }) {
            const responese = yield call(parametersave, payload);
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
        *queryAll({ payload }, { call, put }) {
            const responese = yield call(queryAll, payload);
            yield put({
                type: 'updateState',
                payload: { queryAll: responese.data.dataList ? responese.data.dataList : [] }
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
        *datagatequery({ payload }, { call, put }) {
            const responese = yield call(datagatequery, payload);
            yield put({
                type: 'updateState',
                payload: { datagatequery: responese.data.page ? responese.data.page : [] }
            })

            yield put({
                type: 'updateState',
                payload: { queryByEquipmentId: responese.data ? responese.data : [] }
            })

            return responese.code == "0000"
        },
        *datagatesave({ payload }, { call, put }) {
            const responese = yield call(datagatesave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *datagatedelete({ payload }, { call, put }) {
            const responese = yield call(datagatedelete, payload);
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
