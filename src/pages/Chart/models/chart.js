/**
 * Created by 11485 on 2019/2/28.
 */
import {
    deviceTypequeryTreeList, queryDiagram, queryOEE, queryJIA, queryMTTR, queryMTBF, queryTimeChart
} from '@/services/ngy.js'

export default {
    namespace: 'chart',
    state: {
        deviceTypequeryTreeList: [],
        queryDiagram: [],
        companyDepartList: [],
        queryOEE: [],
        queryJIA: [],
        queryMTTR: [],
        queryMTBF: [],
        shopList: [],
        departmentList: [],
        queryTimeChart: [],
        code: {}
    },
    effects: {
        *queryOEE({ payload }, { call, put }) {//datalist
            const responese = yield call(queryOEE, payload);
            yield put({
                type: 'updateState',
                payload: { queryOEE: responese.data.moee ? responese.data.moee : [] }
            })
            yield put({
                type: 'updateState',
                payload: { shopList: responese.data.shopList ? responese.data.shopList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { departmentList: responese.data.departmentList ? responese.data.departmentList : [] }
            })
            return responese.code == "0000"
        },
        *queryJIA({ payload }, { call, put }) {//datalist
            const responese = yield call(queryJIA, payload);
            yield put({
                type: 'updateState',
                payload: { queryJIA: responese.data.jia ? responese.data.jia : [] }
            })
            yield put({
                type: 'updateState',
                payload: { shopList: responese.data.shopList ? responese.data.shopList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { departmentList: responese.data.departmentList ? responese.data.departmentList : [] }
            })
            return responese.code == "0000"
        },
        *queryMTTR({ payload }, { call, put }) {//datalist
            const responese = yield call(queryMTTR, payload);
            yield put({
                type: 'updateState',
                payload: { queryMTTR: responese.data.mttr ? responese.data.mttr : [] }
            })
            yield put({
                type: 'updateState',
                payload: { shopList: responese.data.shopList ? responese.data.shopList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { departmentList: responese.data.departmentList ? responese.data.departmentList : [] }
            })
            return responese.code == "0000"
        },
        *queryMTBF({ payload }, { call, put }) {//datalist
            const responese = yield call(queryMTBF, payload);
            yield put({
                type: 'updateState',
                payload: { queryMTBF: responese.data.mtbf ? responese.data.mtbf : [] }
            })
            yield put({
                type: 'updateState',
                payload: { shopList: responese.data.shopList ? responese.data.shopList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { departmentList: responese.data.departmentList ? responese.data.departmentList : [] }
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

        *queryDiagram({ payload }, { call, put }) {//datalist
            const responese = yield call(queryDiagram, payload);
            yield put({
                type: 'updateState',
                payload: { queryDiagram: responese.data ? responese.data : [] }
            })
            yield put({
                type: 'updateState',
                payload: { companyDepartList: responese.data.DEPARTLIST ? responese.data.DEPARTLIST : [] }
            })

            return responese.code == "0000"
        },
        *queryTimeChart({ payload }, { call, put }) {//datalist
            const responese = yield call(queryTimeChart, payload);
            yield put({
                type: 'updateState',
                payload: { queryTimeChart: responese.data ? responese.data : [] }
            })
            yield put({
                type: 'updateState',
                payload: { companyDepartList: responese.data.DEPARTLIST ? responese.data.DEPARTLIST : [] }
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
