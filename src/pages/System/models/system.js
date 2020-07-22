/**
 * Created by 11485 on 2019/2/28.
 */
import {
    AdminqueryAll, AdminqueryList, Adminsave, AdmindeleteById,
    AdminuserqueryList, Adminusersave, AdminuserdeleteById, AdminqueryCompanyList,
    AdminqueryLeafListByParentId, AdmincaqueryAll, Admincasave, AdminprqueryAll, Adminprsave,Adminappsave,
    restPassword, NoqueryTreeList, NodeleteById, Nosave, sysqueryList, syssave,
    jgqueryTreeList, jgdeleteById, jgsave, queryListByParentId,
    getShiftPage, insertShift, deleteShifts, getScheduleList, insertSchedule, queryUserByRoleId,
    partsqueryList, partsqueryById, partsdeleteById, partssave,AdminAppqueryAll,
    groupqueryList, groupsave, groupdeleteById, groupqueryById, queryByShopId, AdminuserqueryAll


} from '@/services/ngy.js'

export default {
    namespace: 'system',
    state: {
        AdminqueryAll: [],
        AdminqueryAllmb: [],
        AdminqueryAllapp: [],
        AdminqueryList: [],
        AdminuserqueryList: [],
        banci: [],
        departmentList: [],
        AdminqueryCompanyList: [],
        AdminqueryLeafListByParentId: [],
        queryListByParentId: [],
        AdmincaqueryAll: [],
        AdminprqueryAll: [],
        AdminAppqueryAll:[],
        NoqueryTreeList: [],
        jgqueryTreeList: [],
        sysqueryList: [],
        queryUserByRoleId: [],
        getShiftPage: [],
        getScheduleList: [],
        getShiftList: [],
        partsqueryList: [],
        partsqueryById: [],
        nodeList: [],
        groupqueryList: [],
        shopList: [],
        groupqueryById: [],
        queryByShopId: [],
        AdminuserqueryAll: [],
        code: {}
    },
    effects: {
        *AdminuserqueryAll({ payload }, { call, put }) {//datalist
            const responese = yield call(AdminuserqueryAll, payload);
            yield put({
                type: 'updateState',
                payload: { AdminuserqueryAll: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *queryByShopId({ payload }, { call, put }) {//datalist
            const responese = yield call(queryByShopId, payload);
            yield put({
                type: 'updateState',
                payload: { queryByShopId: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *groupqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(groupqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { groupqueryList: responese.data.page ? responese.data.page : [] }
            })
            yield put({
                type: 'updateState',
                payload: { shopList: responese.data.shopList ? responese.data.shopList : [] }
            })
            return responese.code == "0000"
        },
        *partsqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(partsqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { partsqueryList: responese.data.page ? responese.data.page : [] }
            })
            yield put({
                type: 'updateState',
                payload: { nodeList: responese.data.nodeList ? responese.data.nodeList : [] }
            })
            return responese.code == "0000"
        },
        *groupqueryById({ payload }, { call, put }) {//datalist
            const responese = yield call(groupqueryById, payload);
            yield put({
                type: 'updateState',
                payload: { groupqueryById: responese.data.data ? responese.data.data : [] }
            })
            return responese.code == "0000"
        },
        *partsqueryById({ payload }, { call, put }) {//datalist
            const responese = yield call(partsqueryById, payload);
            yield put({
                type: 'updateState',
                payload: { partsqueryById: responese.data.data ? responese.data.data : [] }
            })
            return responese.code == "0000"
        },
        *queryUserByRoleId({ payload }, { call, put }) {//datalist
            const responese = yield call(queryUserByRoleId, payload);
            yield put({
                type: 'updateState',
                payload: { queryUserByRoleId: responese.data.page ? responese.data.page : [] }
            })
            yield put({
                type: 'updateState',
                payload: { queryListByParentId: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *getShiftPage({ payload }, { call, put }) {//datalist
            const responese = yield call(getShiftPage, payload);
            yield put({
                type: 'updateState',
                payload: { getShiftPage: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *getScheduleList({ payload }, { call, put }) {//datalist   
            const responese = yield call(getScheduleList, payload);
            yield put({
                type: 'updateState',
                payload: { getScheduleList: responese.data.sysShiftScheduleList ? responese.data.sysShiftScheduleList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { getShiftList: responese.data.sysShiftList ? responese.data.sysShiftList : [] }
            })
            return responese.code == "0000"
        },
        *jgqueryTreeList({ payload }, { call, put }) {//datalist
            const responese = yield call(jgqueryTreeList, payload);
            yield put({
                type: 'updateState',
                payload: { jgqueryTreeList: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *sysqueryList({ payload }, { call, put }) {//datalist
            const responese = yield call(sysqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { sysqueryList: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *NoqueryTreeList({ payload }, { call, put }) {//datalist
            const responese = yield call(NoqueryTreeList, payload);
            yield put({
                type: 'updateState',
                payload: { NoqueryTreeList: responese.data.page ? responese.data.page : [] }
            })
            return responese.code == "0000"
        },
        *AdminprqueryAll({ payload }, { call, put }) {//datalist
            const responese = yield call(AdminprqueryAll, payload);
            yield put({
                type: 'updateState',
                payload: { AdminprqueryAll: responese.data.data ? responese.data.data : [] }
            })
            return responese.code == "0000"
        },
        *AdminAppqueryAll({ payload }, { call, put }) {//datalist
            const responese = yield call(AdminAppqueryAll, payload);
            yield put({
                type: 'updateState',
                payload: { AdminAppqueryAll: responese.data.data ? responese.data.data : [] }
            })
            return responese.code == "0000"
        },

        *AdmincaqueryAll({ payload }, { call, put }) {//datalist
            const responese = yield call(AdmincaqueryAll, payload);
            yield put({
                type: 'updateState',
                payload: { AdmincaqueryAll: responese.data.data ? responese.data.data : [] }
            })
            return responese.code == "0000"
        },
        *queryListByParentId({ payload }, { call, put }) {//datalist
            const responese = yield call(queryListByParentId, payload);
            yield put({
                type: 'updateState',
                payload: { queryListByParentId: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *AdminqueryLeafListByParentId({ payload }, { call, put }) {//datalist
            const responese = yield call(AdminqueryLeafListByParentId, payload);
            yield put({
                type: 'updateState',
                payload: { AdminqueryLeafListByParentId: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *AdminqueryCompanyList({ payload }, { call, put }) {//datalist
            const responese = yield call(AdminqueryCompanyList, payload);
            yield put({
                type: 'updateState',
                payload: { AdminqueryCompanyList: responese.data.dataList ? responese.data.dataList : [] }
            })
            return responese.code == "0000"
        },
        *AdminqueryAll({ payload }, { call, put }) {//datalist
            const responese = yield call(AdminqueryAll, payload);
            yield put({
                type: 'updateState',
                payload: { AdminqueryAll: responese.data.dataList ? responese.data.dataList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { AdminqueryAllmb: responese.data.data ? responese.data.data : [] }
            })
            yield put({
                type: 'updateState',
                payload: { AdminqueryAllapp: responese.data.appList ? responese.data.appList : [] }
            })
            return responese.code == "0000"
        },

        *AdminuserqueryList({ payload }, { call, put }) {//page
            const responese = yield call(AdminuserqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { AdminuserqueryList: responese.data.page ? responese.data.page : [] }
            })
            yield put({
                type: 'updateState',
                payload: { banci: responese.data.data ? responese.data.data : [] }
            })
            yield put({
                type: 'updateState',
                payload: { departmentList: responese.data.dataList ? responese.data.dataList : [] }
            })
            yield put({
                type: 'updateState',
                payload: { shopList: responese.data.shopList ? responese.data.shopList : [] }
            })

            return responese.code == "0000"
        },
        *restPassword({ payload }, { call, put }) {//data
            const responese = yield call(restPassword, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *Adminprsave({ payload }, { call, put }) {//data
            const responese = yield call(Adminprsave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *Adminappsave({ payload }, { call, put }) {//data
            const responese = yield call(Adminappsave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *jgdeleteById({ payload }, { call, put }) {//data
            const responese = yield call(jgdeleteById, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *jgsave({ payload }, { call, put }) {//data
            const responese = yield call(jgsave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *insertShift({ payload }, { call, put }) {//data
            const responese = yield call(insertShift, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },

        *deleteShifts({ payload }, { call, put }) {//data
            const responese = yield call(deleteShifts, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },

        *insertSchedule({ payload }, { call, put }) {//data
            const responese = yield call(insertSchedule, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },

        *Admincasave({ payload }, { call, put }) {//data
            const responese = yield call(Admincasave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *Nosave({ payload }, { call, put }) {//data
            const responese = yield call(Nosave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *groupdeleteById({ payload }, { call, put }) {//data
            const responese = yield call(groupdeleteById, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *groupsave({ payload }, { call, put }) {//data
            const responese = yield call(groupsave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },

        *partsdeleteById({ payload }, { call, put }) {//data
            const responese = yield call(partsdeleteById, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *partssave({ payload }, { call, put }) {//data
            const responese = yield call(partssave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *syssave({ payload }, { call, put }) {//data
            const responese = yield call(syssave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *Adminusersave({ payload }, { call, put }) {//data
            const responese = yield call(Adminusersave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *AdminuserdeleteById({ payload }, { call, put }) {//data
            const responese = yield call(AdminuserdeleteById, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *NodeleteById({ payload }, { call, put }) {//data
            const responese = yield call(NodeleteById, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },

        *AdminqueryList({ payload }, { call, put }) {//page
            const responese = yield call(AdminqueryList, payload);
            yield put({
                type: 'updateState',
                payload: { AdminqueryList: responese.data.page ? responese.data.page : [] }
            })

            return responese.code == "0000"
        },

        *Adminsave({ payload }, { call, put }) {//data
            const responese = yield call(Adminsave, payload);
            yield put({
                type: 'updateState',
                payload: { code: responese.data ? responese.data : [] }
            })
            return responese.code == "0000"
        },
        *AdmindeleteById({ payload }, { call, put }) {//data
            const responese = yield call(AdmindeleteById, payload);
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
