/**
 * Created by 11485 on 2019/2/28.
 */
import {
    queryHome, queryTaskCount, queryMyList, fbqueryMyList, queryMessage, fqueryDetaila, fqueryDetailb, missionsave, missionsubmit, missionaudit, missiondeleteById, queryOEE, queryJIA, queryMTTR, queryMTBF, queryExecuteRate,deviceknqueryList,deviceknchildqueryList,noticequeryList,
    GGsave,queryRepair


} from '@/services/ngy.js'

export default {
    namespace: 'home',
    state: {
        queryHome: [],
        queryTaskCount: [],
        queryMyList: [],
        fbqueryMyList: [],
        queryMessage: [],
        fqueryDetaila: {},
        fqueryDetailb: [],
        queryExecuteRate: [],
        queryOEE: [],
        queryJIA: [],
        queryMTTR: [],
        queryMTBF: [],
        shopList: [],
        deviceknqueryList:[],
        noticequeryList:[],
        deviceknchildqueryList:{},
        departmentList: [],
        queryRepair:[]
    },
    effects: {
        *queryRepair({ payload }, { call, put }) {//datalist
            const responese = yield call(queryRepair, payload);
            yield put({
                type: 'updateState',
                payload: { queryRepair: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *noticequeryList({ payload }, { call, put }) {//datalist
            const responese = yield call(noticequeryList, payload);
            yield put({
                type: 'updateState',
                payload: { noticequeryList: responese.data.page ? responese.data.page : {} }
            })
            return responese.code == "0000"
        },
        *deviceknchildqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(deviceknchildqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { deviceknchildqueryList: responese.data.page ? responese.data.page : {} }
            })
            return responese.code == "0000"
        },
        *deviceknqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(deviceknqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { deviceknqueryList: responese.data.page ? responese.data.page : [] }
            })
            yield put({
                type: 'updateState',
                payload: { equipmentNoList: responese.data.equipmentNoList ? responese.data.equipmentNoList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { equipmentTypeList: responese.data.equipmentTypeList ? responese.data.equipmentTypeList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { purposeTypeList: responese.data.purposeTypeList ? responese.data.purposeTypeList : [] }
            })
            return responese.code == "0000"
        },
        
        *queryExecuteRate({ payload }, { call, put }) {//datalist
            const responese = yield call(queryExecuteRate, payload);
            yield put({
                type: 'updateState',
                payload: { queryExecuteRate: responese.data.data ? responese.data.data : [] }
            })
            return responese.code == "0000"
        },
        *GGsave({ payload }, { call, put }) {//datalist
            const responese = yield call(GGsave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
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
        *fqueryDetailb({ payload }, { call, put }) {//datalist
            const responese = yield call(fqueryDetailb, payload);
            yield put({
                type: 'updateState',
                payload: { fqueryDetailb: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *fqueryDetaila({ payload }, { call, put }) {//datalist
            const responese = yield call(fqueryDetaila, payload);
            yield put({
                type: 'updateState',
                payload: {
                    fqueryDetaila: responese.data.data ? responese.data.data : {
                        publish: {},
                        myWork: {}
                    }
                }
            })
            return responese.code == "0000"
        },

        *queryHome({ payload }, { call, put }) {//datalist
            const responese = yield call(queryHome, payload);
            yield put({
                type: 'updateState',
                payload: { queryHome: responese.data.data ? responese.data.data : [] }
            })
            return responese.code == "0000"
        },
        *queryTaskCount({ payload }, { call, put }) {//datalist
            const responese = yield call(queryTaskCount, payload);
            yield put({
                type: 'updateState',
                payload: { queryTaskCount: responese.data.data ? responese.data.data : [] }
            })
            return responese.code == "0000"
        },
        *fbqueryMyList({ payload }, { call, put }) {//datalist
            const responese = yield call(fbqueryMyList, payload);
            yield put({
                type: 'updateState',
                payload: { fbqueryMyList: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *queryMessage({ payload }, { call, put }) {//datalist
            const responese = yield call(queryMessage, payload);
            yield put({
                type: 'updateState',
                payload: { queryMessage: responese.data.dataList ? responese.data.dataList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { shopList: responese.data.shopList ? responese.data.shopList : [] }
            })
            return responese.code == "0000"
        },
        *queryMyList({ payload }, { call, put }) {//datalist
            const responese = yield call(queryMyList, payload);
            yield put({
                type: 'updateState',
                payload: { queryMyList: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *missionsave({ payload }, { call, put }) {//datalist
            const responese = yield call(missionsave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *missionsubmit({ payload }, { call, put }) {//datalist
            const responese = yield call(missionsubmit, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *missionaudit({ payload }, { call, put }) {//datalist
            const responese = yield call(missionaudit, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *missiondeleteById({ payload }, { call, put }) {//datalist
            const responese = yield call(missiondeleteById, payload);
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
