/**
 * Created by 11485 on 2019/2/28.
 */
import {
    equipmentqueryList,
    equipmentsavec, equipmentupdateByIdc, equipmentdeleteByIdc,
    equipmentsavez, equipmentupdateByIdz, equipmentdeleteByIdz,
    queryYes, queryNo,
    equipmentqueryNoByUserId, equipmentqueryByUserId,
    repairqueryList, repairqueryMyList,
    modifyRepairUser, getRepairDetail, queryAllRepair, rslmodifyRepairUser, rslgetRepairDetail, TroublequeryTreeList,
    Troublesave, TroubledeleteById, hisToryqueryList, hisgetRepairDetail, deviceTypequeryTreeList,
    KLqueryKnowledgeByFaultId, KLremove, deviceknchildqueryList
} from '@/services/ngy.js'

export default {
    namespace: 'repair',
    state: {
        equipmentqueryNoByUserId: [],
        equipmentqueryByUserId: [],
        equipmentqueryList: [],
        repairqueryList: {},
        repairqueryMyList: {},
        repairTypeList: [],
        faultTypeList: [],
        TroublequeryTreeList: {},
        chart: [],
        deviceknchildqueryList: [],
        dataList: [],
        hisToryqueryList: [],
        queryAllRepair: [],
        rslgetRepairDetail: [],
        hisgetRepairDetail: [],
        equipmentTypeList: [],
        KLqueryKnowledgeByFaultId: [],
        purposeTypeList: [],
        code: {},
        queryIfs: {},
        deviceTypequeryTreeList: [],

    },
    effects: {
        *deviceknchildqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(deviceknchildqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { deviceknchildqueryList: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *KLremove({ payload }, { call, put }) {//datalist
            const responese = yield call(KLremove, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *KLqueryKnowledgeByFaultId({ payload }, { call, put }) {//datalist
            const responese = yield call(KLqueryKnowledgeByFaultId, payload);
            yield put({
                type: 'updateState',
                payload: { KLqueryKnowledgeByFaultId: responese.data.page ? responese.data.page : [] }
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

        *queryYes({ payload }, { call, put }) {//datalist
            const responese = yield call(queryYes, payload);
            yield put({
                type: 'updateState',
                payload: { queryIfs: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *queryNo({ payload }, { call, put }) {//datalist
            const responese = yield call(queryNo, payload);
            yield put({
                type: 'updateState',
                payload: { queryIfs: responese.data.page ? responese.data.page : [] }
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
        *hisToryqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(hisToryqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { hisToryqueryList: responese.data.page ? responese.data.page : [] }
            })

            return responese.code == "0000"
        },

        *TroublequeryTreeList({ payload }, { call, put }) {//datalist
            const responese = yield call(TroublequeryTreeList, payload);
            yield put({
                type: 'updateState',
                payload: { TroublequeryTreeList: responese.data.page ? responese.data.page : [] }
            })

            yield put({
                type: 'updateState',
                payload: { equipmentTypeList: responese.data.equipmentTypeList ? responese.data.equipmentTypeList : [] }
            })
            return responese.code == "0000"
        },


        *queryAllRepair({ payload }, { call, put }) {//datalist
            const responese = yield call(queryAllRepair, payload);
            yield put({
                type: 'updateState',
                payload: { queryAllRepair: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *rslgetRepairDetail({ payload }, { call, put }) {//datalist
            const responese = yield call(rslgetRepairDetail, payload);
            yield put({
                type: 'updateState',
                payload: { rslgetRepairDetail: responese.data.data ? responese.data.data : [] }
            })
            yield put({
                type: 'updateState',
                payload: { dataList: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *hisgetRepairDetail({ payload }, { call, put }) {//datalist
            const responese = yield call(hisgetRepairDetail, payload);
            yield put({
                type: 'updateState',
                payload: { hisgetRepairDetail: responese.data.data ? responese.data.data : [] }
            })
            yield put({
                type: 'updateState',
                payload: { dataList: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *repairqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(repairqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { repairqueryList: responese.data.page ? responese.data.page : [] }
            })
            yield put({
                type: 'updateState',
                payload: { repairTypeList: responese.data.repairTypeList ? responese.data.repairTypeList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { faultTypeList: responese.data.faultTypeList ? responese.data.faultTypeList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { chart: responese.data.chart ? responese.data.chart : [] }
            })

            return responese.code == "0000"
        },
        *repairqueryMyList({ payload }, { call, put }) {//datalist
            const responese = yield call(repairqueryMyList, payload);
            yield put({
                type: 'updateState',
                payload: { repairqueryMyList: responese.data.page ? responese.data.page : [] }
            })
            yield put({
                type: 'updateState',
                payload: { repairTypeList: responese.data.repairTypeList ? responese.data.repairTypeList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { faultTypeList: responese.data.faultTypeList ? responese.data.faultTypeList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { chart: responese.data.chart ? responese.data.chart : [] }
            })

            return responese.code == "0000"
        },



        *equipmentqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(equipmentqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { equipmentqueryList: responese.data.page ? responese.data.page : [] }
            })
            yield put({
                type: 'updateState',
                payload: { userList: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *equipmentqueryByUserId({ payload }, { call, put }) {//datalist
            const responese = yield call(equipmentqueryByUserId, payload);
            yield put({
                type: 'updateState',
                payload: { equipmentqueryByUserId: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *equipmentqueryNoByUserId({ payload }, { call, put }) {//datalist
            const responese = yield call(equipmentqueryNoByUserId, payload);
            yield put({
                type: 'updateState',
                payload: { equipmentqueryNoByUserId: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },

        *equipmentsavec({ payload }, { call, put }) {//datalist
            const responese = yield call(equipmentsavec, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *rslmodifyRepairUser({ payload }, { call, put }) {//datalist
            const responese = yield call(rslmodifyRepairUser, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *equipmentupdateByIdc({ payload }, { call, put }) {//datalist
            const responese = yield call(equipmentupdateByIdc, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *Troublesave({ payload }, { call, put }) {//datalist
            const responese = yield call(Troublesave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *TroubledeleteById({ payload }, { call, put }) {//datalist
            const responese = yield call(TroubledeleteById, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *equipmentdeleteByIdc({ payload }, { call, put }) {//datalist
            const responese = yield call(equipmentdeleteByIdc, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *equipmentsavez({ payload }, { call, put }) {//datalist
            const responese = yield call(equipmentsavez, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *equipmentupdateByIdz({ payload }, { call, put }) {//datalist
            const responese = yield call(equipmentupdateByIdz, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },

        *equipmentdeleteByIdz({ payload }, { call, put }) {//datalist
            const responese = yield call(equipmentdeleteByIdz, payload);
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
