/**
 * Created by 11485 on 2019/2/28.
 */
import {
    equipmentqueryList, equipmentupdateByIds, equipmentdeleteByIds, equipmentqueryNoByUserId, equipmentqueryByUserId, equipmentsaves,
    checksave, checkqueryList, checkdeleteById,
    checkmenuqueryList, checkmenudeleteById, checkmenusave, checkmenuqueryAll, queryListOfEquipment, queryWithoutIds,
    queryByDateAndWeekNum, queryItemTaskByDayTaskId,fatequeryListOfEquipment,updatePointCheckUser,queryByEquipId,deviceTypequeryTreeList,equipmentqueryLists,
    queryListError,myErrorqueryMyList,checkIgnore,checkRepair,hisqueryListton,queryHiston,rslgetRepairDetail

} from '@/services/ngy.js'

export default {
    namespace: 'check',
    state: {
        equipmentqueryNoByUserId: [],
        equipmentqueryByUserId: [],
        equipmentqueryList: [],
        equipmentqueryLists:[],
        repairTypeList: [],
        faultTypeList: [],
        checkqueryList: [],
        checkmenuqueryList: [],
        periodType: [],
        checkmenuqueryAll: [],
        queryListOfEquipment: [],
        queryWithoutIds: [],
        haveItemList: [],
        chart: [],
        dataList: [],
        queryByEquipId:[],
        queryByDateAndWeekNum: [],
        queryItemTaskByDayTaskId: [],
        fatequeryListOfEquipment:[],
        code: {},
        deviceTypequeryTreeList:[],
        queryListError:[],
        myErrorqueryMyList:[],
        hisqueryListton:[],
        queryHiston:[],
        rslgetRepairDetail:[]
    },
    effects: {
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
        *queryHiston({ payload }, { call, put }) {//datalist
            const responese = yield call(queryHiston, payload);
            yield put({
                type: 'updateState',
                payload: { queryHiston: responese.data.data ? responese.data.data : [] }
            })
            return responese.code == "0000"
        },
        *queryByEquipId({ payload }, { call, put }) {//datalist
            const responese = yield call(queryByEquipId, payload);
            yield put({
                type: 'updateState',
                payload: { queryByEquipId: responese.data.dataList ? responese.data.dataList : [] }
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
        *fatequeryListOfEquipment({ payload }, { call, put }) {//datalist
            const responese = yield call(fatequeryListOfEquipment, payload);
            yield put({
                type: 'updateState',
                payload: { fatequeryListOfEquipment: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *queryByDateAndWeekNum({ payload }, { call, put }) {//datalist
            const responese = yield call(queryByDateAndWeekNum, payload);
            yield put({
                type: 'updateState',
                payload: { queryByDateAndWeekNum: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *queryListError({ payload }, { call, put }) {//datalist
            const responese = yield call(queryListError, payload);
            yield put({
                type: 'updateState',
                payload: { queryListError: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *myErrorqueryMyList({ payload }, { call, put }) {//datalist
            const responese = yield call(myErrorqueryMyList, payload);
            yield put({
                type: 'updateState',
                payload: { myErrorqueryMyList: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *hisqueryListton({ payload }, { call, put }) {//datalist
            const responese = yield call(hisqueryListton, payload);
            yield put({
                type: 'updateState',
                payload: { hisqueryListton: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *queryItemTaskByDayTaskId({ payload }, { call, put }) {//datalist
            const responese = yield call(queryItemTaskByDayTaskId, payload);
            yield put({
                type: 'updateState',
                payload: { queryItemTaskByDayTaskId: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },


        *queryListOfEquipment({ payload }, { call, put }) {//datalist
            const responese = yield call(queryListOfEquipment, payload);
            yield put({
                type: 'updateState',
                payload: { queryListOfEquipment: responese.data.data ? responese.data.data.pageInfo : [] }
            })
            yield put({
                type: 'updateState',
                payload: { periodType: responese.data.periodType ? responese.data.periodType : [] }
            })
            yield put({
                type: 'updateState',
                payload: { haveItemList: responese.data.data ? responese.data.data.haveItemList : [] }
            })
            return responese.code == "0000"
        },
        *queryWithoutIds({ payload }, { call, put }) {//datalist
            const responese = yield call(queryWithoutIds, payload);
            yield put({
                type: 'updateState',
                payload: { queryWithoutIds: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },


        *checkmenuqueryAll({ payload }, { call, put }) {//datalist
            const responese = yield call(checkmenuqueryAll, payload);
            yield put({
                type: 'updateState',
                payload: { checkmenuqueryAll: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *checkmenuqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(checkmenuqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { checkmenuqueryList: responese.data.page ? responese.data.page : [] }
            })
            yield put({
                type: 'updateState',
                payload: { periodType: responese.data.periodType ? responese.data.periodType : [] }
            })
            return responese.code == "0000"
        },
        *checkqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(checkqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { checkqueryList: responese.data.page ? responese.data.page : [] }
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

        *equipmentqueryLists({ payload }, { call, put }) {//datalist
            const responese = yield call(equipmentqueryLists, payload);
            yield put({
                type: 'updateState',
                payload: { equipmentqueryLists: responese.data.page ? responese.data.page : [] }
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
        *updatePointCheckUser({ payload }, { call, put }) {//datalist
            const responese = yield call(updatePointCheckUser, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *checkdeleteById({ payload }, { call, put }) {//datalist
            const responese = yield call(checkdeleteById, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *checkIgnore({ payload }, { call, put }) {//datalist
            const responese = yield call(checkIgnore, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *checkRepair({ payload }, { call, put }) {//datalist
            const responese = yield call(checkRepair, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *checksave({ payload }, { call, put }) {//datalist
            const responese = yield call(checksave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *equipmentsaves({ payload }, { call, put }) {//datalist
            const responese = yield call(equipmentsaves, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *equipmentupdateByIds({ payload }, { call, put }) {//datalist
            const responese = yield call(equipmentupdateByIds, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *equipmentdeleteByIds({ payload }, { call, put }) {//datalist
            const responese = yield call(equipmentdeleteByIds, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *checkmenudeleteById({ payload }, { call, put }) {//datalist
            const responese = yield call(checkmenudeleteById, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *checkmenusave({ payload }, { call, put }) {//datalist
            const responese = yield call(checkmenusave, payload);
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
