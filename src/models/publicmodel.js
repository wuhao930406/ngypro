/**
 * Created by 11485 on 2019/2/28.
 */
import {
    devicequeryList, queryPageList, verbqueryItemForAdd, outqueryList, pairqueryPageByUserId, queryApplyReapairList,
    uploadsysUser, uploaduserEquipment, uploadequipment, uploadequipmentFaultType, uploadspareParts, uploadequipmentMaintainPlan,
    KLqueryAll, replysave,replydeleteById,queryListByKnowledgeId,queryListByParentIds
} from '@/services/ngy'

export default {
    namespace: 'publicmodel',
    state: {
        queryPageList: [],
        verbqueryItemForAdd: [],
        outqueryList: [],
        pairqueryPageByUserId: [],
        itemIds: [],
        devicequeryList: [],
        queryApplyReapairList: [],
        key: "1",
        KLqueryAll: [],
        equipmentTypeList: [],
        purposeTypeList: [],
        queryListByKnowledgeId:{},
        queryListByParentIds:[],
        code: {}
    },
    effects: {
        *quanbu({ payload }, { call, put }) {//datalist
            yield put({
                type: 'updateState',
                payload: { key: payload.key ? payload.key : "1" }
            })
            return true
        },
        *queryListByKnowledgeId({ payload }, { call, put }) {//datalist
            const responese = yield call(queryListByKnowledgeId, payload);
            yield put({
                type: 'updateState',
                payload: { queryListByKnowledgeId: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *queryListByParentIds({ payload }, { call, put }) {//datalist
            const responese = yield call(queryListByParentIds, payload);
            yield put({
                type: 'updateState',
                payload: { queryListByParentIds: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *KLqueryAll({ payload }, { call, put }) {//datalist
            const responese = yield call(KLqueryAll, payload);
            yield put({
                type: 'updateState',
                payload: { KLqueryAll: responese.data.dataList ? responese.data.dataList : [] }
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
        *devicequeryList({ payload }, { call, put }) {//datalist
            const responese = yield call(devicequeryList, payload);
            yield put({
                type: 'updateState',
                payload: { devicequeryList: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *devicequeryList({ payload }, { call, put }) {//datalist
            const responese = yield call(devicequeryList, payload);
            yield put({
                type: 'updateState',
                payload: { devicequeryList: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *pairqueryPageByUserId({ payload }, { call, put }) {//datalist
            const responese = yield call(pairqueryPageByUserId, payload);
            yield put({
                type: 'updateState',
                payload: { pairqueryPageByUserId: responese.data.page }
            })
            return responese.code == "0000"
        },
        *uploadsysUser({ payload }, { call, put }) {//datalist
            const responese = yield call(uploadsysUser, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : {} }
            })
            return responese.code == "0000"
        },
        *uploaduserEquipment({ payload }, { call, put }) {//datalist
            const responese = yield call(uploaduserEquipment, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : {} }
            })
            return responese.code == "0000"
        },
        *uploadequipment({ payload }, { call, put }) {//datalist
            const responese = yield call(uploadequipment, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : {} }
            })
            return responese.code == "0000"
        },
        *uploadequipmentFaultType({ payload }, { call, put }) {//datalist
            const responese = yield call(uploadequipmentFaultType, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : {} }
            })
            return responese.code == "0000"
        },
        *uploadspareParts({ payload }, { call, put }) {//datalist
            const responese = yield call(uploadspareParts, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : {} }
            })
            return responese.code == "0000"
        },
        *uploadequipmentMaintainPlan({ payload }, { call, put }) {//datalist
            const responese = yield call(uploadequipmentMaintainPlan, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : {} }
            })
            return responese.code == "0000"
        },
        *outqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(outqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { outqueryList: responese.data.page }
            })
            return responese.code == "0000"
        },
        *queryApplyReapairList({ payload }, { call, put }) {//datalist
            const responese = yield call(queryApplyReapairList, payload);
            yield put({
                type: 'updateState',
                payload: { queryApplyReapairList: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *queryPageList({ payload }, { call, put }) {//datalist
            const responese = yield call(queryPageList, payload);
            yield put({
                type: 'updateState',
                payload: { queryPageList: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *replysave({ payload }, { call, put }) {//datalist
            const responese = yield call(replysave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *replydeleteById({ payload }, { call, put }) {//datalist
            const responese = yield call(replydeleteById, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },

        *verbqueryItemForAdd({ payload }, { call, put }) {//datalist
            const responese = yield call(verbqueryItemForAdd, payload);
            yield put({
                type: 'updateState',
                payload: { verbqueryItemForAdd: responese.data.page ? responese.data.page : [] }
            })
            yield put({
                type: 'updateState',
                payload: { itemIds: responese.data.itemIds ? responese.data.itemIds : [] }
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
