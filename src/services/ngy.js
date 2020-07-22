import { stringify } from 'qs';
import request from '@/utils/request';


//登入
export async function fakeAccountLogin(params){
  return request(`/ngy/sysAccount/login`,{
    method: 'POST',
    body: params,
  });
}
//登入
export async function fakeAccountLoginOut(params){
  return request(`/ngy/sysAccount/logout`,{
    method: 'POST',
    body: params,
  });
}


//权限设置 
export async function AdminqueryAll(params){
  return request(`/ngy/sysPermission/queryAll`,{
    method: 'POST',
    body: params,
  });
}

//角色设置列表
export async function AdminqueryList(params){
  return request(`/ngy/sysRole/queryList`,{
    method: 'POST',
    body: params,
  });
}
//新增修改角色
export async function Adminsave(params){
  return request(`/ngy/sysRole/save`,{
    method: 'POST',
    body: params,
  });
}

//删除角色
export async function AdmindeleteById(params){
  return request(`/ngy/sysRole/deleteById`,{
    method: 'POST',
    body: params,
  });
}

//用户列表
export async function AdminuserqueryList(params){
  return request(`/ngy/sysUser/queryList`,{
    method: 'POST',
    body: params,
  });
}
//用户列表
export async function AdminuserqueryAll(params){
  return request(`/ngy/sysUser/queryAll`,{
    method: 'POST',
    body: params,
  });
}
//新增修改用户
export async function Adminusersave(params){
  return request(`/ngy/sysUser/save`,{
    method: 'POST',
    body: params,
  });
}

//删除用户
export async function AdminuserdeleteById(params){
  return request(`/ngy/sysUser/deleteById`,{
    method: 'POST',
    body: params,
  });
}

//查询单位
export async function AdminqueryCompanyList(params){
  return request(`/ngy/sysDepartment/queryCompanyList`,{
    method: 'POST',
    body: params,
  });
}

//查询单位下的部门
export async function AdminqueryLeafListByParentId(params){
  return request(`/ngy/sysDepartment/queryLeafListByParentId`,{
    method: 'POST',
    body: params,
  });
}

//用户-角色
export async function AdmincaqueryAll(params){
  return request(`/ngy/sysUserRole/queryAll`,{
    method: 'POST',
    body: params,
  });
}

//用户-角色
export async function Admincasave(params){
  return request(`/ngy/sysUserRole/save`,{
    method: 'POST',
    body: params,
  });
}
//角色下权限
export async function AdminprqueryAll(params){
  return request(`/ngy/sysRolePermission/queryAll`,{
    method: 'POST',
    body: params,
  });
}
//角色下权限
export async function AdminAppqueryAll(params){
  return request(`/ngy/sysRoleApppermission/queryAll`,{
    method: 'POST',
    body: params,
  });
}
//角色下权限
export async function Adminprsave(params){
  return request(`/ngy/sysRolePermission/save`,{
    method: 'POST',
    body: params,
  });
}
export async function Adminappsave(params){
  return request(`/ngy/sysRoleApppermission/save`,{
    method: 'POST',
    body: params,
  });
}
//restPassword
export async function restPassword(params){
  return request(`/ngy/sysUser/restPassword`,{
    method: 'POST',
    body: params,
  });
}

//queryTreeList数据字典
export async function NoqueryTreeList(params){
  return request(`/ngy/sysDic/queryTreeList`,{
    method: 'POST',
    body: params,
  });
}

//queryTreeList数据字典 删除
export async function NodeleteById(params){
  return request(`/ngy/sysDic/deleteById`,{
    method: 'POST',
    body: params,
  });
}

//queryTreeList数据字典 删除
export async function Nosave(params){
  return request(`/ngy/sysDic/save`,{
    method: 'POST',
    body: params,
  });
}

//设备类型  新增一条记录    修改一条记录
export async function deviceTypesave(params) {
  return request(`/ngy/equipmentType/save`, {
      method: 'POST',
      body: params,
  });
}

//设备类型  根据id删除一条记录
export async function deviceTypedeleteById(params) {
  return request(`/ngy/equipmentType/deleteById`, {
      method: 'POST',
      body: params,
  });
}
//设备类型  查询树结构列表
export async function deviceTypequeryTreeList(params) {
  return request(`/ngy/equipmentType/queryTreeList`, {
      method: 'POST',
      body: params,
  });
}
//设备类型  查询叶子节点列表（select框）
export async function deviceTypequeryLeafList(params) {
  return request(`/ngy/equipmentType/queryLeafList`, {
      method: 'POST',
      body: params,
  });
}
//设备  新增一条记录    修改一条记录
export async function devicesave(params) {
  return request(`/ngy/equipment/save`, {
      method: 'POST',
      body: params,
  });
}

//设备  根据id删除一条记录
export async function devicedeleteById(params) {
  return request(`/ngy/equipment/deleteById`, {
      method: 'POST',
      body: params,
  });
}
//设备  根据条件查询设备列表（类型，编号，名称，状态，车间）；状态，车间下拉框内容
export async function devicequeryList(params) {
  return request(`/ngy/equipment/queryList`, {
      method: 'POST',
      body: params,
  });
}

//设备  根据条件查询设备列表（类型，编号，名称，状态，车间）；状态，车间下拉框内容
export async function devicestepqueryList(params) {
  return request(`/ngy/sysApprovalProcess/queryList`, {
      method: 'POST',
      body: params,
  });
}
//新增流转流程
export async function devicestepsave(params) {
  return request(`/ngy/sysApprovalProcess/save`, {
      method: 'POST',
      body: params,
  });
}
//新增流转流程
export async function devicestepdeleteById(params) {
  return request(`/ngy/sysApprovalProcess/deleteById`, {
      method: 'POST',
      body: params,
  });
}
//新增流转流程
export async function devicestepnodesave(params) {
  return request(`/ngy/sysApprovalProcessNode/save`, {
      method: 'POST',
      body: params,
  });
}
//新增流转流程
export async function devicestepnodedeleteById(params) {
  return request(`/ngy/sysApprovalProcessNode/deleteById`, {
      method: 'POST',
      body: params,
  });
}

//新增流转流程
export async function goqueryList(params) {
  return request(`/ngy/equipmentApprovalProcess/queryList`, {
      method: 'POST',
      body: params,
  });
}

//新增流转流程
export async function gosave(params) {
  return request(`/ngy/equipmentApprovalProcess/save`, {
      method: 'POST',
      body: params,
  });
}

//查看流转流程详情
export async function godetailqueryById(params) {
  return request(`/ngy/equipmentApprovalProcess/queryById`, {
      method: 'POST',
      body: params,
  });
}

//查看流转流程详情
export async function recallById(params) {
  return request(`/ngy/equipmentApprovalProcess/recallById`, {
      method: 'POST',
      body: params,
  });
}

//查看流转流程进度
export async function recallqueryList(params) {
  return request(`/ngy/equipmentApprovalProcessNode/queryList`, {
      method: 'POST',
      body: params,
  });
}

//查看流转流程进度
export async function approvalProcess(params) {
  return request(`/ngy/equipmentApprovalProcessNode/approvalProcess`, {
      method: 'POST',
      body: params,
  });
}

//日志列表
export async function dataqueryList(params) {
  return request(`/ngy/equipmentLog/queryList`, {
      method: 'POST',
      body: params,
  });
}

//日志列表
export async function dataqueryAll(params) {
  return request(`/ngy/equipmentLogItem/queryAll`, {
      method: 'POST',
      body: params,
  });
}

//维保计划列表
export async function verbqueryList(params) {
  return request(`/ngy/equipmentMaintainPlan/queryList`, {
      method: 'POST',
      body: params,
  });
}

//维保计划列表
export async function verbqueryItemForAdd(params) {
  return request(`/ngy/equipmentMaintainPlan/queryItemForAdd`, {
      method: 'POST',
      body: params,
  });
}
//维保计划列表
export async function verbsave(params) {
  return request(`/ngy/equipmentMaintainPlan/save`, {
      method: 'POST',
      body: params,
  });
}

//维保计划列表
export async function verbupdate(params) {
  return request(`/ngy/equipmentMaintainPlan/update`, {
      method: 'POST',
      body: params,
  });
}

//维保计划列表
export async function verbqueryMaintainItem(params) {
  return request(`/ngy/equipmentMaintainPlan/queryMaintainItem`, {
      method: 'POST',
      body: params,
  });
}
//维保计划列表
export async function verbdeleteById(params) {
  return request(`/ngy/equipmentMaintainPlan/deleteById`, {
      method: 'POST',
      body: params,
  });
}
//维保计划列表
export async function verbqueryByMaintainPlanNo(params) {
  return request(`/ngy/equipmentMaintainPlan/queryByMaintainPlanNo`, {
      method: 'POST',
      body: params,
  });
}

//设备知识库
export async function deviceknqueryList(params) {
  return request(`/ngy/equipmentKnowledgeBase/queryList`, {
      method: 'POST',
      body: params,
  });
}

//设备知识库
export async function deviceknsave(params) {
  return request(`/ngy/equipmentKnowledgeBase/save`, {
      method: 'POST',
      body: params,
  });
}

//设备知识库
export async function devicekndeleteById(params) {
  return request(`/ngy/equipmentKnowledgeBase/deleteById`, {
      method: 'POST',
      body: params,
  });
}
//设备知识库
export async function deviceknchildqueryList(params) {
  return request(`/ngy/equipmentKnowledgeBaseVersion/queryList`, {
      method: 'POST',
      body: params,
  });
}
//设备知识库
export async function noticequeryList(params) {
  return request(`/ngy/sysAnnouncement/queryList`, {
      method: 'POST',
      body: params,
  });
}
//设备知识库
export async function repairqueryMyList(params) {
  return request(`/ngy/equipmentRepair/queryMyList`, {
      method: 'POST',
      body: params,
  });
}
//注册列表
export async function sysqueryList(params) {
  return request(`/ngy/sysCompanyApply/queryList`, {
      method: 'POST',
      body: params,
  });
}
//注册列表
export async function syssave(params) {
  return request(`/ngy/sysCompanyAudit/save`, {
      method: 'POST',
      body: params,
  });
}

//注册列表
export async function jgsave(params) {
  return request(`/ngy/sysDepartment/save`, {
      method: 'POST',
      body: params,
  });
}
//注册列表
export async function jgdeleteById(params) {
  return request(`/ngy/sysDepartment/deleteById`, {
      method: 'POST',
      body: params,
  });
}
//注册列表
export async function jgqueryTreeList(params) {
  return request(`/ngy/sysDepartment/queryTreeList`, {
      method: 'POST',
      body: params,
  });
}

//维保项目设置
export async function werbproqueryList(params) {
  return request(`/ngy/equipmentMaintainItem/queryList`, {
      method: 'POST',
      body: params,
  });
}
//维保项目设置
export async function werbprosave(params) {
  return request(`/ngy/equipmentMaintainItem/save`, {
      method: 'POST',
      body: params,
  });
}

//维保项目设置
export async function werbprodeleteById(params) {
  return request(`/ngy/equipmentMaintainItem/deleteById`, {
      method: 'POST',
      body: params,
  });
}
//werbproqueryList,werbprosave,werbprodeleteById


//根据配置类型分页查询列表  post 0维修,1保养
export async function equipmentqueryList(params) {
  return request(`/ngy/userEquipment/queryList`, {
      method: 'POST',
      body: params,
  });
}

//根据配置类型分页查询列表  post 0维修,1保养
export async function equipmentqueryLists(params) {
  return request(`/ngy/equipmentPointCheckItemRel/queryList`, {
      method: 'POST',
      body: params,
  });
}
//维保改负责人
export async function equipmentupdateById(params) {
  return request(`/ngy/userEquipment/updateMaintainById`, {
      method: 'POST',
      body: params,
  });
}
//点检改负责人
export async function equipmentupdateByIds(params) {
  return request(`/ngy/userEquipment/updateCheckById`, {
      method: 'POST',
      body: params,
  });
}
//点检改负责人
export async function myErrorqueryMyList(params) {
  return request(`/ngy/equipmentPointCheckException/queryMyList`, {
      method: 'POST',
      body: params,
  });
}

//验证改负责人
export async function equipmentupdateByIdc(params) {
  return request(`/ngy/userEquipment/updateVerificationById`, {
      method: 'POST',
      body: params,
  });
}

//验证改负责人
export async function equipmentupdateByIdz(params) {
  return request(`/ngy/userEquipment/updateRepairById`, {
      method: 'POST',
      body: params,
  });
}
//维保-删除
export async function equipmentdeleteById(params) {
  return request(`/ngy/userEquipment/deleteMaintainById`, {
      method: 'POST',
      body: params,
  });
}
//点检-删除
export async function equipmentdeleteByIds(params) {
  return request(`/ngy/userEquipment/deleteCheckById`, {
      method: 'POST',
      body: params,
  });
}


//验证-删除
export async function equipmentdeleteByIdc(params) {
  return request(`/ngy/userEquipment/deleteVerificationById`, {
      method: 'POST',
      body: params,
  });
}

//验证-删除*********************
export async function equipmentdeleteByIdz(params) {
  return request(`/ngy/userEquipment/deleteRepairById`, {
      method: 'POST',
      body: params,
  });
}

export async function equipmentqueryNoByUserId(params) {
  return request(`/ngy/userEquipment/queryNoByUserId`, {
      method: 'POST',
      body: params,
  });
}

export async function equipmentqueryByUserId(params) {
  return request(`/ngy/userEquipment/queryByUserId`, {
      method: 'POST',
      body: params,
  });
}
//v
export async function equipmentsave(params) {
  return request(`/ngy/userEquipment/saveMaintain`, {
      method: 'POST',
      body: params,
  });
}
//d
export async function equipmentsaves(params) {
  return request(`/ngy/userEquipment/saveCheck`, {
      method: 'POST',
      body: params,
  });
}
//y
export async function equipmentsavec(params) {
  return request(`/ngy/userEquipment/saveVerification`, {
      method: 'POST',
      body: params,
  });
}
export async function equipmentsavez(params) {
  return request(`/ngy/userEquipment/saveRepair`, {
      method: 'POST',
      body: params,
  });
}

//equipmentqueryList,equipmentupdateById,equipmentdeleteById,equipmentqueryNoByUserId,equipmentqueryByUserId,equipmentsave
//维保任务列表
export async function verbmsqueryList(params) {
  return request(`/ngy/equipmentMaintainBillToExecute/queryList`, {
      method: 'POST',
      body: params,
  });
}

//维保任务列表-开始为报
export async function verbmsstartMaintain(params) {
  return request(`/ngy/equipmentMaintainBillToExecute/startMaintain`, {
      method: 'POST',
      body: params,
  });
}

//维保任务列表-完成为报
export async function verbmsfinishMaintain(params) {
  return request(`/ngy/equipmentMaintainBillToExecute/finishMaintain`, {
      method: 'POST',
      body: params,
  });
}

//维保任务列表-关闭为报
export async function verbmscloseMaintain(params) {
  return request(`/ngy/equipmentMaintainBillToExecute/closeMaintain`, {
      method: 'POST',
      body: params,
  });
}

//维保任务列表-关闭为报
export async function verbmsupdateMaintainUser(params) {
  return request(`/ngy/equipmentMaintainBillToExecute/updateMaintainUser`, {
      method: 'POST',
      body: params,
  });
}
//维保任务列表-关闭为报
export async function verbmsqueryById(params) {
  return request(`/ngy/equipmentMaintainBillToExecute/queryById`, {
      method: 'POST',
      body: params,
  });
}

//维保任务列表-查看保养内容
export async function verbmsqueryByBillToExecuteId(params) {
  return request(`/ngy/actualEquipmentMaintainItem/queryByBillToExecuteId`, {
      method: 'POST',
      body: params,
  });
}


//维保任务列表-查看保养内容
export async function verbtoqueryList(params) {
  return request(`/ngy/equipmentMaintainBillExecute/queryList`, {
      method: 'POST',
      body: params,
  });
}
//维保任务列表-查看保养内容
export async function verbtoqueryById(params) {
  return request(`/ngy/equipmentMaintainBillExecute/queryById`, {
      method: 'POST',
      body: params,
  });
}

//维修单列表
export async function repairqueryList(params) {
  return request(`/ngy/equipmentRepair/queryList`, {
      method: 'POST',
      body: params,
  });
}
export async function modifyRepairUser(params) {
  return request(`/ngy/equipmentRepair/modifyRepairUser`, {
      method: 'POST',
      body: params,
  });
}
export async function getRepairDetail(params) {
  return request(`/ngy/equipmentRepair/getRepairDetail`, {
      method: 'POST',
      body: params,
  });
}

//备件列表
export async function sparequeryList(params) {
  return request(`/ngy/spareParts/queryList `, {
      method: 'POST',
      body: params,
  });
} 
//备件列表
export async function sparesave(params) {
  return request(`/ngy/spareParts/save`, {
      method: 'POST',
      body: params,
  });
}
//备件列表
export async function sparedeleteById(params) {
  return request(`/ngy/spareParts/deleteById`, {
      method: 'POST',
      body: params,
  });
}

//备件列表
export async function sparequeryTreeList(params) {
  return request(`/ngy/sparePartsType/queryTreeList`, {
      method: 'POST',
      body: params,
  });
}
//备件列表
export async function spareTreesave(params) {
  return request(`/ngy/sparePartsType/save`, {
      method: 'POST',
      body: params,
  });
}

//备件列表
export async function spareTreedeleteById(params) {
  return request(`/ngy/sparePartsType/deleteById`, {
      method: 'POST',
      body: params,
  });
}

//备件列表
export async function spareRecordsave(params) {
  return request(`/ngy/sparePartsRecord/save`, {
      method: 'POST',
      body: params,
  });
}

//备件列表
export async function spareRecordqueryList(params) {
  return request(`/ngy/sparePartsRecord/queryList`, {
      method: 'POST',
      body: params,
  });
}

//备件列表
export async function spareUsequeryList(params) {
  return request(`/ngy/sparePartsConsume/queryList`, {
      method: 'POST',
      body: params,
  });
}

//备件列表
export async function spareuspqueryList(params) {
  return request(`/ngy/userSpareParts/queryList`, {
      method: 'POST',
      body: params,
  });
}

//设备图表
export async function queryAnalysis(params) {
  return request(`/ngy/equipmentManufactureRecordHis/queryAnalysis`, {
      method: 'POST',
      body: params,
  });
}

//设备图表 
export async function getCapacityAnalysis(params) {
  return request(`/ngy/equipment/getCapacityAnalysis`, {
      method: 'POST',
      body: params,
  });
}


//设备图表 
export async function queryListByParentId(params) {
  return request(`/ngy/sysDepartment/queryListByParentId`, {
      method: 'POST',
      body: params,
  });
}


//备件申请
export async function getqueryList(params) {
  return request(`/ngy/sparePartsApply/queryList`, {
      method: 'POST',
      body: params,
  });
}

//备件申请
export async function outqueryList(params) {
  return request(`/ngy/sparePartsApply/queryApplyInfo`, {
      method: 'POST',
      body: params,
  });
}

//备件申请
export async function getsave(params) {
  return request(`/ngy/sparePartsApply/save`, {
      method: 'POST',
      body: params,
  });
}

//备件申请
export async function getqueryListAndApplyInfo(params) {
  return request(`/ngy/saprePartsApplyDetail/queryListAndApplyInfo`, {
      method: 'POST',
      body: params,
  });
}

//备件申请
export async function getaudit(params) {
  return request(`/ngy/sparePartsApply/audit`, {
      method: 'POST',
      body: params,
  });
}

//备件申请
export async function getrecall(params) {
  return request(`/ngy/sparePartsApply/recall`, {
      method: 'POST',
      body: params,
  });
}

//备件申请
export async function queryDiagram(params) {
  return request(`/ngy/equipmentRepairHis/queryDiagram`, {
      method: 'POST',
      body: params,
  });
}


//班次列表-分页
export async function getShiftPage(params) {
  return request(`/ngy/sysShift/queryList`, {
      method: 'POST',
      body: params,
  });
}
//班次列表-分页
export async function insertShift(params) {
  return request(`/ngy/sysShift/save`, {
      method: 'POST',
      body: params,
  });
}
//班次列表-分页
export async function deleteShifts(params) {
  return request(`/ngy/sysShift/deleteById`, {
      method: 'POST',
      body: params,
  });
}
//班次列表-分页
export async function getScheduleList(params) {
  return request(`/ngy/sysShiftSchedule/queryThreeMonthsList`, {
      method: 'POST',
      body: params,
  });
}
//班次列表-分页
export async function insertSchedule(params) {
  return request(`/ngy/sysShiftSchedule/save`, {
      method: 'POST',
      body: params,
  });
}
//班次列表-分页
export async function queryAllRepair(params) {
  return request(`/ngy/sysShift/queryAllRepair`, {
      method: 'POST',
      body: params,
  });
}

//班次列表-分页
export async function rslmodifyRepairUser(params) {
  return request(`/ngy/equipmentRepair/modifyRepairUser`, {
      method: 'POST',
      body: params,
  });
}


//班次列表-分页
export async function rslgetRepairDetail(params) {
  return request(`/ngy/equipmentRepair/getRepairDetail`, {
      method: 'POST',
      body: params,
  });
}
//班次列表-分页
export async function hisgetRepairDetail(params) {
  return request(`/ngy/equipmentRepairHis/getRepairDetail`, {
      method: 'POST',
      body: params,
  });
}

//班次列表-分页
export async function taskqueryList(params) {
  return request(`/ngy/taskNotice/queryList`, {
      method: 'POST',
      body: params,
  });
}

//班次列表-分页
export async function tasksave(params) {
  return request(`/ngy/taskNotice/save`, {
      method: 'POST',
      body: params,
  });
}

//班次列表-分页
export async function taskdeleteById(params) {
  return request(`/ngy/taskNotice/deleteById`, {
      method: 'POST',
      body: params,
  });
}

//点检增/改
export async function checksave(params) {
  return request(`/ngy/equipmentPointCheckItem/save`, {
      method: 'POST',
      body: params,
  });
}

//点检增/改 
export async function checkqueryList(params) {
  return request(`/ngy/equipmentPointCheckItem/queryList`, {
      method: 'POST',
      body: params,
  });
}

//点检增/改
export async function checkdeleteById(params) {
  return request(`/ngy/equipmentPointCheckItem/deleteById`, {
      method: 'POST',
      body: params,
  });
}

//点检设置
export async function checkmenuqueryList(params) {
  return request(`/ngy/equipmentPointCheckItemRel/queryList`, {
      method: 'POST',
      body: params,
  });
}

//点检设置 
export async function checkmenudeleteById(params) {
  return request(`/ngy/equipmentPointCheckItemRel/deleteById`, {
      method: 'POST',
      body: params,
  });
}

//点检设置
export async function checkmenuqueryAll(params) {
  return request(`/ngy/equipmentPointCheckItem/queryAll`, {
      method: 'POST',
      body: params,
  });
}

//点检设置
export async function queryListOfEquipment(params) {
  return request(`/ngy/equipmentPointCheckItemRel/queryListOfEquipment`, {
      method: 'POST',
      body: params,
  });
}
//点检设置
export async function queryWithoutIds(params) {
  return request(`/ngy/equipmentPointCheckItem/queryWithoutIds`, {
      method: 'POST',
      body: params,
  });
}

//点检设置
export async function checkmenusave(params) {
  return request(`/ngy/equipmentPointCheckItemRel/save`, {
      method: 'POST',
      body: params,
  });
}

//公司老板
export async function adminqueryList(params) {
  return request(`/ngy/sysCompany/queryList`, {
      method: 'POST',
      body: params,
  });
}

//公司老板 adminqueryList,adminupdate
export async function adminupdate(params) {
  return request(`/ngy/sysCompany/update`, {
      method: 'POST',
      body: params,
  });
}

//设备维修
export async function queryByEquipmentId(params) {
  return request(`/ngy/equipmentRepair/queryByEquipmentId`, {
      method: 'POST',
      body: params,
  });
}

//设备维修
export async function repair(params) {
  return request(`/ngy/equipmentRepair/repair`, {
      method: 'POST',
      body: params,
  });
}

//设备维修
export async function queryByCompanyId(params) {
  return request(`/ngy/equipment/queryByCompanyId`, {
      method: 'POST',
      body: params,
  });
}

//设备维修
export async function queryByDateAndWeekNum(params) {
  return request(`/ngy/equipmentPointCheckItemDayTask/queryByDateAndWeekNum`, {
      method: 'POST',
      body: params,
  });
}

//设备维修 
export async function queryItemTaskByDayTaskId(params) {
  return request(`/ngy/equipmentPointCheckItemDayTask/queryItemTaskByDayTaskId`, {
      method: 'POST',
      body: params,
  });
}

//设备维修
export async function fatequeryListOfEquipment(params) {
  return request(`/ngy/equipmentPointCheckTask/queryListOfEquipment`, {
      method: 'POST',
      body: params,
  });
}

//设备维修
export async function pairqueryPageByUserId(params) {
  return request(`/ngy/userSpareParts/queryPageByUserId`, {
      method: 'POST',
      body: params,
  });
}
//设备维修
export async function queryByEquipId(params) {
  return request(`/ngy/userEquipment/queryByEquipId`, {
      method: 'POST',
      body: params,
  });
}

//设备维修
export async function queryQrCode(params) {
  return request(`/ngy/equipment/queryQrCode`, {
      method: 'POST',
      body: params,
  });
}

//adden
export async function SETqueryList(params) {
  return request(`/ngy/sysSpareReplace/queryList`, {
      method: 'POST',
      body: params,
  });
}

//adden
export async function queryEquipmentAndSpareParts(params) {
  return request(`/ngy/sysSpareReplace/queryEquipmentAndSpareParts`, {
      method: 'POST',
      body: params,
  });
}
//auden
export async function SETsave(params) {
  return request(`/ngy/sysSpareReplace/save`, {
      method: 'POST',
      body: params,
  });
}

//auden
export async function SETdeleteById(params) {
  return request(`/ngy/sysSpareReplace/deleteById`, {
      method: 'POST',
      body: params,
  });
}

//auden
export async function UndoqueryList(params) {
  return request(`/ngy/equipmentSparePartsReplace/queryList`, {
      method: 'POST',
      body: params,
  });
}

//auden
export async function queryChangePerson(params) {
  return request(`/ngy/equipmentSparePartsReplace/queryChangePerson`, {
      method: 'POST',
      body: params,
  });
}

//auden
export async function saveChangePerson(params) {
  return request(`/ngy/equipmentSparePartsReplace/saveChangePerson`, {
      method: 'POST',
      body: params,
  });
}

//auden
export async function DonequeryList(params) {
  return request(`/ngy/equipmentSparePartsReplaceHis/queryList`, {
      method: 'POST',
      body: params,
  });
}

//fate
export async function queryOfMonth(params) {
  return request(`/ngy/equipmentMaintainBillToExecute/queryOfMonth`, {
      method: 'POST',
      body: params,
  });
}

//fate
export async function updatePointCheckUser(params) {
  return request(`/ngy/equipmentPointCheckItemDayTask/updatePointCheckUser`, {
      method: 'POST',
      body: params,
  });
}


//fate
export async function TroublequeryTreeList(params) {
  return request(`/ngy/equipmentFaultType/queryTreeList`, {
      method: 'POST',
      body: params,
  });
}

//fate
export async function Troublesave(params) {
  return request(`/ngy/equipmentFaultType/save`, {
      method: 'POST',
      body: params,
  });
}

//fate
export async function TroubledeleteById(params) {
  return request(`/ngy/equipmentFaultType/deleteById`, {
      method: 'POST',
      body: params,
  });
}

//fate
export async function getChildren(params) {
  return request(`/ngy/equipmentFaultType/getChildren`, {
      method: 'POST',
      body: params,
  });
}

//fate
export async function hisToryqueryList(params) {
  return request(`/ngy/equipmentRepairHis/queryList`, {
      method: 'POST',
      body: params,
  });
}
//fate
export async function replysave(params) {
  return request(`/ngy/equipmentForumComment/save`, {
      method: 'POST',
      body: params,
  });
}

//fate
export async function replydeleteById(params) {
  return request(`/ngy/equipmentForumComment/deleteById`, {
      method: 'POST',
      body: params,
  });
}

//fate
export async function queryListByKnowledgeId(params) {
  return request(`/ngy/equipmentForumComment/queryListByForumId`, {
      method: 'POST',
      body: params,
  });
}

//fate
export async function queryListByParentIds(params) {
  return request(`/ngy/equipmentForumComment/queryListByParentId`, {
      method: 'POST',
      body: params,
  });
}
//fate
export async function queryPageList(params) {
  return request(`/ngy/equipment/queryPageList`, {
      method: 'POST',
      body: params,
  });
}

//fate
export async function queryUseList(params) {
  return request(`/ngy/equipment/queryUseList`, {
      method: 'POST',
      body: params,
  });
}

//homejs
export async function queryHome(params) {
  return request(`/ngy/equipment/queryHome`, {
      method: 'POST',
      body: params,
  });
}

//homejs
export async function queryUserByRoleId(params) {
  return request(`/ngy/sysRole/queryUserByRoleId`, {
      method: 'POST',
      body: params,
  });
}

//partsqueryList,partsqueryById,partsdeleteById,partssave
export async function partsqueryList(params) {
  return request(`/ngy/sysShop/queryList`, {
      method: 'POST',
      body: params,
  });
}

export async function partsqueryById(params) {
  return request(`/ngy/sysShop/queryById`, {
      method: 'POST',
      body: params,
  });
}

export async function partsdeleteById(params) {
  return request(`/ngy/sysShop/deleteById`, {
      method: 'POST',
      body: params,
  });
}

export async function partssave(params) {
  return request(`/ngy/sysShop/save`, {
      method: 'POST',
      body: params,
  });
}

//groupqueryList,groupsave,groupdeleteById,groupqueryById
export async function groupqueryList(params) {
  return request(`/ngy/sysGroup/queryList`, {
      method: 'POST',
      body: params,
  });
}

export async function groupsave(params) {
  return request(`/ngy/sysGroup/save`, {
      method: 'POST',
      body: params,
  });
}

export async function groupdeleteById(params) {
  return request(`/ngy/sysGroup/deleteById`, {
      method: 'POST',
      body: params,
  });
}

export async function groupqueryById(params) {
  return request(`/ngy/sysGroup/queryById`, {
      method: 'POST',
      body: params,
  });
}

export async function queryByShopId(params) {
  return request(`/ngy/sysGroup/queryByShopId`, {
      method: 'POST',
      body: params,
  });
}
export async function queryApplyReapairList(params) {
  return request(`/ngy/equipment/queryApplyReapairList`, {
      method: 'POST',
      body: params,
  });
}

export async function uploadsysUser(params) {
  return request(`/ngy/sysUser/importUser`, {
      method: 'POST',
      body: params,
  });
}
export async function uploaduserEquipment(params) {
  return request(`/ngy/userEquipment/importUserEquip `, {
      method: 'POST',
      body: params,
  });
}

export async function uploadequipment(params) {
  return request(`/ngy/equipment/importExcel `, {
      method: 'POST',
      body: params,
  });
}

export async function uploadequipmentFaultType(params) {
  return request(`/ngy/equipmentFaultType/importExcel `, {
      method: 'POST',
      body: params,
  });
}

export async function uploadspareParts(params) {
  return request(`/ngy/spareParts/importExcel `, {
      method: 'POST',
      body: params,
  });
}

export async function uploadequipmentMaintainPlan(params) {
  return request(`/ngy/equipmentMaintainPlan/importMaintainPlan`, {
      method: 'POST',
      body: params,
  });
}

export async function queryOEE(params) {
  return request(`/ngy/equipmentRepairHis/queryOEE`, {
      method: 'POST',
      body: params,
  });
}


export async function queryJIA(params) {
  return request(`/ngy/equipmentRepairHis/queryJIA`, {
      method: 'POST',
      body: params,
  });
}

export async function queryMTTR(params) {
  return request(`/ngy/equipmentRepairHis/queryMTTR`, {
      method: 'POST',
      body: params,
  });
}

export async function queryMTBF(params) {
  return request(`/ngy/equipmentRepairHis/queryMTBF`, {
      method: 'POST',
      body: params,
  });
}
export async function stopRepair(params) {
  return request(`/ngy/equipmentRepair/stopRepair`, {
      method: 'POST',
      body: params,
  });
}
export async function queryTaskCount(params) {
  return request(`/ngy/taskBill/queryTaskCount `, {
      method: 'POST',
      body: params,
  });
}

export async function missiondeleteById(params) {
  return request(`/ngy/sysAssignment/deleteById`, {
      method: 'POST',
      body: params,
  });
}

export async function fbqueryMyList(params) {
  return request(`/ngy/sysAssignment/queryMyList`, {
      method: 'POST',
      body: params,
  });
}
export async function queryMessage(params) {
  return request(`/ngy/sysUser/queryMessage`, {
      method: 'POST',
      body: params,
  });
}
export async function queryMyList(params) {
  return request(`/ngy/assignmentUserExecute/queryMyList`, {
      method: 'POST',
      body: params,
  });
}
//工单执行率
export async function queryExecuteRate(params) {
  return request(`/ngy/equipmentRepair/queryExecuteRate`, {
      method: 'POST',
      body: params,
  });
}

export async function GGsave(params) {
  return request(`/ngy/sysAnnouncement/save`, {
    method: 'POST',
    body: params,
  });
}

export async function queryRepair(params) {
  return request(`/ngy/equipmentForum/queryList`, {
    method: 'POST',
    body: params,
  });
}
export async function lunsave(params) {
  return request(`/ngy/equipmentForum/save`, {
    method: 'POST',
    body: params,
  });
}
export async function lundeleteById(params) {
  return request(`/ngy/equipmentForum/deleteById`, {
    method: 'POST',
    body: params,
  });
}

export async function fqueryDetaila(params) {
  return request(`/ngy/assignmentUserExecute/queryDetail`, {
      method: 'POST',
      body: params,
  });
}

export async function fqueryDetailb(params) {
  return request(`/ngy/sysAssignment/queryDetail`, {
      method: 'POST',
      body: params,
  });
}


export async function missionsave(params) {
  return request(`/ngy/sysAssignment/save`, {
      method: 'POST',
      body: params,
  });
}


//missionsubmit,missionaudit
export async function missionsubmit(params) {
  return request(`/ngy/assignmentUserExecute/submit`, {
      method: 'POST',
      body: params,
  });
}

export async function missionaudit(params) {
  return request(`/ngy/assignmentUserExecute/audit`, {
      method: 'POST',
      body: params,
  });
}

export async function queryYes(params) {
  return request(`/ngy/automaticRepairLog/queryYes`, {
      method: 'POST',
      body: params,
  });
}

export async function queryNo(params) {
  return request(`/ngy/automaticRepairLog/queryNo`, {
      method: 'POST',
      body: params,
  });
}

export async function queryTimeChart(params) {
  return request(`/ngy/equipmentRepairHis/queryTimeChart`, {
      method: 'POST',
      body: params,
  });
}

export async function queryListError(params) {
  return request(`/ngy/equipmentPointCheckException/queryList`, {
      method: 'POST',
      body: params,
  });
}

export async function checkIgnore(params) {
  return request(`/ngy/equipmentPointCheckException/checkIgnore`, {
      method: 'POST',
      body: params,
  });
}

export async function checkRepair(params) {
  return request(`/ngy/equipmentPointCheckException/checkRepair`, {
      method: 'POST',
      body: params,
  });
}

export async function checkRepairAfter(params) {
  return request(`/ngy/equipmentPointCheckException/checkRepairAfter`, {
      method: 'POST',
      body: params,
  });
}

export async function hisqueryListton(params) {
  return request(`/ngy/equipmentPointCheckItemDayTask/queryList`, {
      method: 'POST',
      body: params,
  });
}


export async function queryHiston(params) {
  return request(`/ngy/equipmentPointCheckItemTask/queryHis`, {
      method: 'POST',
      body: params,
  });
}

//知识库
export async function KLqueryAll(params) {
  return request(`/ngy/equipmentKnowledgeBase/queryAll`, {
      method: 'POST',
      body: params,
  });
}

//查询关联知识库

export async function KLqueryKnowledgeByFaultId(params) {
  return request(`/ngy/equipmentKnowledgeBase/queryKnowledgeByFaultId`, {
      method: 'POST',
      body: params,
  });
}


export async function KLremove(params) {
  return request(`/ngy/equipmentFaultTypeKnowledge/remove`, {
      method: 'POST',
      body: params,
  });
}


export async function showModule(params) {
  return request(`/ngy/sysDic/showModule`, {
      method: 'POST',
      body: params,
  });
}













































