import {
  Table, Input, InputNumber, Popconfirm, Form, Divider, Modal, Tree, Button, Row, Col, Icon, Select, Alert, Tag, message, Card, Menu, Dropdown, Steps, Popover, Radio,Tooltip
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import CreateForm from "@/components/CreateForm"
import moment from "moment"
import { node } from 'prop-types';
import SearchBox from '@/components/SearchBox'


const { Step } = Steps;

const FormItem = Form.Item;
const EditableContext = React.createContext();
const Search = Input.Search;
const { TreeNode } = Tree;
const InputGroup = Input.Group;
const { Option } = Select;



@connect(({ device, publicmodel, loading }) => ({
  device,
  publicmodel,
  submitting: loading.effects['device/goqueryList'],
}))

class DeviceGo extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '设备编号',
        dataIndex: 'equipmentNo',
        key: 'equipmentNo',
        width: 100,
        ellipsis: true,
      },
      {
        title: '设备名称',
        dataIndex: 'equipmentName',
        key: 'equipmentName',
        ellipsis: true,
      },
      {
        title: '设备型号',
        dataIndex: 'equipmentModel',
        key: 'equipmentModel',
        width: 100,
        ellipsis: true,
      },
      {
        title: '所在车间',
        dataIndex: 'equipmentWorkshop',
        key: 'equipmentWorkshop',
        width: 100,
        ellipsis: true,
      },
      {
        title: '设备类型',
        dataIndex: 'equipmentTypeName',
        key: 'equipmentTypeName',
        width: 100,
        ellipsis: true,
      },
      {
        title: '部门名称',
        dataIndex: 'departmentName',
        key: 'departmentName',
        width: 100,
        ellipsis: true,
      },
    ]
    this.state = {
      postpoint: {
        radio: "",
        textarea: ""
      },
      iftype: {
        name: "",
        value: ""
      },
      fv: false,
      fields: {
        approvalProcessType: {
          value: null,
          type: "select",
          title: "流转类型",
          keys: "approvalProcessType",
          requires: true,
          hides: false,
        },
        transferReason: {
          value: null,
          type: "input",
          title: "调拨原因",
          keys: "transferReason",
          requires: false,
          hides: true,
        },
        acceptDepartmentId: {
          value: null,
          type: "select",
          title: "接收部门",
          keys: "acceptDepartmentId",
          requires: false,
          hides: true,
        },
        loanOutDepartmentId: {
          value: null,
          type: "select",
          title: "借出部门",
          keys: "loanOutDepartmentId",
          requires: false,
          hides: true,
        },
        loanOutTime: {
          value: null,
          type: "datepicker",
          title: "借出时间",
          keys: "loanOutTime",
          requires: false,
          hides: true,
        },
        loanInDepartmentId: {
          value: null,
          type: "select",
          title: "借入部门",
          keys: "loanInDepartmentId",
          requires: false,
          hides: true,
        },
        scarpReason: {
          value: null,
          type: "input",
          title: "报废原因",
          keys: "scarpReason",
          requires: false,
          hides: true,
        },
        scarpDeal: {
          value: null,
          type: "input",
          title: "报废处理",
          keys: "scarpDeal",
          requires: false,
          hides: true,
        },
        scarpDealUserId: {
          value: null,
          type: "select",
          title: "报废处理人",
          keys: "scarpDealUserId",
          requires: false,
          hides: true,
        },
        telephone: {
          value: null,
          type: "input",
          title: "联系电话",
          keys: "telephone",
          requires: false,
          hides: true,
        },
        remark: {
          value: null,
          type: "textarea",
          title: "备注",
          col: { span: 24 },
          keys: "remark",
          requires: false,
          hides: false,
        },
        equipmentIds: {
          value: undefined,
          type: "table",
          title: "设备",
          keys: "equipmentIds",
          requires: true,
          columns: this.columns,
          dataSource: "devicequeryList",
          hides: false,
          dv: "id",
          col: { span: 24 },
          lb: "equipmentName"
        },
      },
      /*初始化 main List */
      postData: {
        "pageIndex": "1",
        "pageSize": "9",
        "workOrderNo": "",
        "approvalProcessType": "",
        "applyUserId": ""
      },
      postUrl: "goqueryList",
      curitem: {}
    }
  }

  //设置新状态
  setNewState(type, values, fn) {
    const { dispatch } = this.props;
    dispatch({
      type: 'device/' + type,
      payload: values
    }).then((res) => {
      if (res) {
        fn ? fn() : null;
      }
    });
  }

  getOption(res) {
    let reses = this.props.device[res]
    let result = reses.map((item) => {
      if (res == "userList") {
        return {
          name: item.userName,
          id: item.id
        }
      } else if (res == "transferType") {
        return {
          name: item.dicName,
          id: item.dicKey
        }
      } else if (res == "departmentList") {
        return {
          name: item.departmentName,
          id: item.id
        }

      }
    })
    return result
  }

  resetData() {
    let { postUrl, postData } = this.state;
    this.setNewState(postUrl, postData, () => {
      this.handleCancel()
    })
  }

  componentDidMount() {
this.props.ensureDidMount&&this.props.ensureDidMount()
    this.resetData()
  }

  onSelectChange = (selectval) => {
    let { fields } = this.state;
    fields["equipmentIds"] = { ...fields["equipmentIds"], value: selectval };
    this.setState({
      fields
    })
  }

  getrequires(name, key, defaults) {
    if (name == "transferReason" || name == "acceptDepartmentId") {
      return key == 0
    } else if (name == "loanOutDepartmentId" || name == "loanOutTime" || name == "loanInDepartmentId") {
      return key == 2
    } else if (name == "scarpReason" || name == "scarpDeal" || name == "scarpDealUserId" || name == "telephone") {
      return key == 3
    } else {
      return defaults
    }
  }
  gethides(name, key, defaults) {
    if (name == "transferReason" || name == "acceptDepartmentId") {
      return key == 0
    } else if (name == "loanOutDepartmentId" || name == "loanOutTime" || name == "loanInDepartmentId") {
      return key == 2
    } else if (name == "scarpReason" || name == "scarpDeal" || name == "scarpDealUserId" || name == "telephone") {
      return key == 3
    } else {
      return !defaults
    }
  }

  //表单改变
  handleFormChange = (changedFields) => {
    let fields = this.state.fields, obj;
    const form = this.formRef.props.form;
    let approvalProcessType = form.getFieldsValue().approvalProcessType;
    for (let i in changedFields) {
      obj = changedFields[i]
    }
    if (obj) {
      for (let i in fields) {
        if (i == obj.name) {
          fields[i].value = obj.value
          fields[i].name = obj.name
          fields[i].dirty = obj.dirty
          fields[i].errors = obj.errors
          fields[i].touched = obj.touched
          fields[i].validating = obj.validating
          if (i == "equipmentIds") {
            fields[i].dirty = fields[i].value
          }
          if (i == "loanOutDepartmentId") {
            fields.equipmentIds.value = [];
            this.childs.changedData("devicequeryList", {
              "pageIndex": 1,                          //（int）页码
              "pageSize": 9,                           //（int）条数
              "status": '',                             //（String）设备状态key
              "equipmentTypeId": '',  //（int）设备类型id
              "equipmentNo": "",                    //（String）设备编号
              "equipmentName": '',              //（String）设备名称
              "departmentId": obj.value    //（int）部门id
            }, 0)
          }

        }
        fields[i].requires = this.getrequires(i, approvalProcessType, fields[i].requires);
        fields[i].hides = !this.gethides(i, approvalProcessType, fields[i].hides);
      }
      this.setState({
        fields: fields,
      })
    }

  }

  /*绑定form*/
  saveFormRef = (formRef) => {
    this.formRef = formRef;
  }

  /*关闭*/
  handleCancel = () => {
    this.setState({
      fv: false,
      fields: {
        approvalProcessType: {
          value: null,
          type: "select",
          title: "流转类型",
          keys: "approvalProcessType",
          requires: true,
          option: this.getOption("transferType"),
          hides: false,
        },
        transferReason: {
          value: null,
          type: "input",
          title: "调拨原因",
          keys: "transferReason",
          requires: false,
          hides: true,
        },
        acceptDepartmentId: {
          value: null,
          type: "select",
          title: "接收部门",
          keys: "acceptDepartmentId",
          requires: false,
          option: this.getOption("departmentList"),
          hides: true,
        },
        loanOutDepartmentId: {
          value: null,
          type: "select",
          title: "借出部门",
          keys: "loanOutDepartmentId",
          requires: false,
          option: this.getOption("departmentList"),
          hides: true,
        },
        loanOutTime: {
          value: null,
          type: "datepicker",
          title: "借出时间",
          keys: "loanOutTime",
          requires: false,
          hides: true,
        },
        loanInDepartmentId: {
          value: null,
          type: "select",
          title: "借入部门",
          keys: "loanInDepartmentId",
          requires: false,
          option: this.getOption("departmentList"),
          hides: true,
        },
        scarpReason: {
          value: null,
          type: "input",
          title: "报废原因",
          keys: "scarpReason",
          requires: false,
          hides: true,
        },
        scarpDeal: {
          value: null,
          type: "input",
          title: "报废处理",
          keys: "scarpDeal",
          requires: false,
          hides: true,
        },
        scarpDealUserId: {
          value: null,
          type: "select",
          title: "报废处理人",
          keys: "scarpDealUserId",
          requires: false,
          option: this.getOption("userList"),
          hides: true,
        },
        telephone: {
          value: null,
          type: "input",
          title: "联系电话",
          keys: "telephone",
          requires: false,
          hides: true,
        },
        remark: {
          value: null,
          type: "textarea",
          title: "备注",
          keys: "remark",
          requires: false,
          col: { span: 24 },
          hides: false,
        },
        equipmentIds: {
          value: undefined,
          type: "table",
          title: "设备",
          keys: "equipmentIds",
          requires: true,
          col: { span: 24 },
          columns: this.columns,
          dataSource: "devicequeryList",
          hides: false,
          dv: "id",
          lb: "equipmentName"
        },
      },
    });
  }

  /*form 提交*/
  handleCreate = () => {
    const form = this.formRef.props.form;
    let { curitem, iftype } = this.state;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      for (let i in values) {
        if (!values[i]) {
          values[i] = ""
        } else if (i == "loanOutTime") {
          values[i] = moment(values[i]).format("YYYY-MM-DD");
        }


      }
      let postData = { ...values };
      this.setNewState("gosave", postData, () => {
        message.success("新增成功！");
        this.setState({ visibleform: false });
        this.resetData();
      });

    });
  }

  handleSearch = (selectedKeys, dataIndex) => {
    let { postUrl } = this.state;
    this.setState({ postData: { ...this.state.postData, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
      this.setNewState(postUrl, this.state.postData)
    });
  };

  onRefc = (ref) => {
    this.child = ref;
  }

  onRef = (ref) => {
    this.childs = ref;
  }


  render() {
    let { postData, postUrl, fv, fields, iftype, curitem } = this.state,
      { goqueryList, transferType, userList, godetailqueryById, relList, recallqueryList } = this.props.device;

    let getsearchbox = (key) => {
      if (this.child) {
        return this.child.getColumnSearchProps(key)
      } else {
        return null
      }
    }, getselectbox = (key, option, lb, vl) => {
      if (this.child) {
        return this.child.getColumnSelectProps(key, option)
      } else {
        return null
      }
    }

    const customDot = (dot, { status, index }, nodeList, id) => (
      <Popover content={
        nodeList[index].status == 0 ?
          <span>
            <a onClick={() => {
              let _it = this;
              Modal.confirm({
                style: { top: "25%" },
                title: `审批${nodeList[index].nodeName}`,
                content: <div>
                  <Radio.Group onChange={(e) => {
                    let val = e.target.value;
                    _it.setState({
                      postpoint: {
                        ..._it.state.postpoint,
                        radio: val
                      }
                    });
                  }}>
                    <Radio value={0}>不通过</Radio>
                    <Radio value={1}>通过</Radio>
                  </Radio.Group>
                  <p style={{ marginTop: 18 }}>审批意见:</p>
                  <Input.TextArea onChange={(e) => {
                    let val = e.target.value;
                    _it.setState({
                      postpoint: {
                        ..._it.state.postpoint,
                        textarea: val
                      }
                    });
                  }} />

                </div>,
                okText: "提交",
                cancelText: "取消",
                onOk() {
                  let arr = [0, 1]
                  if (arr.indexOf(_it.state.postpoint.radio) == -1) {
                    message.warn("请选择是否通过")
                    return
                  }

                  _it.setNewState("approvalProcess", {
                    "id": nodeList[index].id,
                    "equipmentApprovalProcessId": id,
                    "isPass": _it.state.postpoint.radio,
                    "auditOpinion": _it.state.postpoint.textarea
                  }, () => {
                    message.success("操作成功");
                    _it.setNewState("recallqueryList", { id: id })
                  })
                  _it.setState({
                    postpoint: {
                      radio: undefined,
                      textarea: undefined
                    }
                  })
                },
                onCancel() {
                  _it.setState({
                    postpoint: {
                      radio: undefined,
                      textarea: undefined
                    }
                  })
                },
              })
            }}>审批</a>
          </span> : <span>
            已审批
          </span>
      }
      >
        {dot}
      </Popover>
    );
    const customDots = (dot, { status, index }) => (
      <Popover content={
        <span>
          无法操作
        </span>
      }
      >
        {dot}
      </Popover>

    );
    const getDetail = () => {
      return (<div style={{ width: "100%" }} className={styles.tosee}>
        <h2 style={{ backgroundColor: "#737373", padding: 12, color: "#fff", fontSize: 16, marginTop: 0 }}>流转详情</h2>
        <p>
          流转类型: <span>{godetailqueryById.approvarProceesName ? godetailqueryById.approvarProceesName : ""}</span>
        </p>
        <p>
          工单号: <span>{godetailqueryById.workOrderNo ? godetailqueryById.workOrderNo : ""}</span>
        </p>
        <p>
          当前审批节点: <span>{godetailqueryById.nodeName ? godetailqueryById.nodeName : ""}</span>
        </p>
        <p>
          申请人名: <span>{godetailqueryById.applyUserName}</span>
        </p>
        <p>
          申请时间: <span>{godetailqueryById.applyTime ? godetailqueryById.applyTime : ""}</span>
        </p>
        <p>
          状态: <span style={{ color: godetailqueryById.status == 0 ? "#666" : godetailqueryById.status == 1 ? "#0e6eb8" : godetailqueryById.status == 2 ? "green" : godetailqueryById.status == 4 ? "#ff2100" : "" }}>{godetailqueryById.status == 0 ? "待审批" : godetailqueryById.status == 1 ? "审批中" : godetailqueryById.status == 2 ? "已审批" : godetailqueryById.status == 4 ? "撤回" : ""}</span>
        </p>
        <p>
          调拨原因: <span>{godetailqueryById.transferReason ? godetailqueryById.transferReason : ""}</span>
        </p>
        <p>
          接收部门: <span>{godetailqueryById.acceptDepartmentName ? godetailqueryById.acceptDepartmentName : ""}</span>
        </p>
        <p>
          借出部门: <span>{godetailqueryById.loanOutDepartmentName ? godetailqueryById.loanOutDepartmentName : ""}</span>
        </p>
        <p>
          借入部门: <span>{godetailqueryById.loanInDepartmentName ? godetailqueryById.loanInDepartmentName : ""}</span>
        </p>
        <p>
          借出时间: <span>{godetailqueryById.loanOutTime ? godetailqueryById.loanOutTime : ""}</span>
        </p>
        <p>
          报废原因: <span>{godetailqueryById.scarpReason ? godetailqueryById.scarpReason : ""}</span>
        </p>
        <p>
          报废处理: <span>{godetailqueryById.scarpDeal ? godetailqueryById.scarpDeal : ""}</span>
        </p>
        <p>
          报废处理人: <span>{godetailqueryById.scarpDealUserName ? godetailqueryById.scarpDealUserName : ""}</span>
        </p>
        <p>
          联系人电话: <span>{godetailqueryById.telephone ? godetailqueryById.telephone : ""}</span>
        </p>
        <p>
          备注: <span>{godetailqueryById.remark ? godetailqueryById.remark : ""}</span>
        </p>
        <h2 style={{ backgroundColor: "#737373", padding: 12, color: "#fff", fontSize: 16 }}>调拨设备列表</h2>
        <Table size="middle"   dataSource={relList ? relList : []} columns={[
          {
            title: "设备名",
            dataIndex: "equipmentName",
            key: "equipmentName"
          }, {
            title: "设备编号",
            dataIndex: "equipmentNo",
            key: "equipmentNo"
          }, {
            title: "设备型号",
            dataIndex: "equipmentModel",
            key: "equipmentModel"
          }
        ]}></Table>
      </div>
      )
    }

    const getprog = (record) => {
      let nodeList = recallqueryList.sort((a, b) => {
        return a.level - b.level
      })

      return (<div style={{ width: "100%" }} className={styles.tosee}>
        <h2 style={{ backgroundColor: "#737373", padding: 12, color: "#fff", fontSize: 16 }}>{record.status == 4 || record.status == 2 ? "查看审批内容" : "鼠标移至点上操作"}</h2>
        <Steps current={10} direction="vertical" size="small"
          progressDot={(dot, { status, index }) => {
            if (record.status == 4 || record.status == 2) {
              return customDots(dot, { status, index })
            } else {
              return customDot(dot, { status, index }, nodeList, record.id)
            }
          }}>
          {
            nodeList.map((item, n) => {
              return <Step key={n} title={item.nodeName} description={<div className={styles.limitdiv}>
                <p>审批状态: <span style={{ color: item.status == 0 ? "#666" : item.status == 2 ? "#0e6eb8" : "transparent" }}>{item.status == 0 ? "待审批" : item.status == 2 ? "已审批" : ""}</span></p>
                <p>是否通过:  <span style={{ color: item.isPass == 0 ? "#ff2100" : item.isPass == 1 ? "#0e6eb8" : "transparent" }}>{item.isPass == 0 ? "不通过" : item.isPass == 1 ? "通过" : ""}</span></p>
                <p>审批人: <span>{item.auditUserName}</span> </p>
                <p>审批时间: <span>{item.auditTime}</span></p>
                <p>审批意见: <span>{item.auditOpinion}</span></p>


              </div>} />
            })
          }
        </Steps>

      </div>
      )
    }


    const menu = () => {
      let record = curitem;
      return record.id ? (
        <div style={{ display: "flex",alignItems:"center"}}>{
          record.status == 4 ? null : <span style={{marginLeft:8}}>
            <Popconfirm
              okText="确认"
              cancelText="取消"
              placement="bottomRight"
              title={"确认撤回该流程？"}
              onConfirm={() => {
                this.setNewState("recallById", { id: record.id }, () => {
                  let total = this.props.device.goqueryList.total,
                    page = this.props.device.goqueryList.pageNum;
                  if ((total - 1) % 9 == 0) {
                    page = page - 1
                  }
                  this.setState({
                    postData: { ...this.state.postData, pageIndex: page }
                  }, () => {
                    this.setNewState("goqueryList", postData, () => {
                      message.success("撤回成功！");
                    });
                  })
                })
              }}>
              <a style={{ color: "#ff4800" }}>撤回</a>
            </Popconfirm>

          </span>
        }
          <Divider style={{marginTop:6}} type="vertical"></Divider>

          <a style={{color:"#666"}} onClick={() => {
            this.setNewState("godetailqueryById", { id: record.id }, () => {
              this.setState({
                visible: true,
                curitem: record,
                iftype: {
                  name: `查看工单：${record.workOrderNo}的详情`,
                  value: "seedetail"
                }
              })
            })
          }}>
            流转详情
          </a>
          <a style={{color:"#666",marginLeft:8}} onClick={() => {
            this.setNewState("recallqueryList", { id: record.id }, () => {
              this.setState({
                visible: true,
                curitem: record,
                iftype: {
                  name: `工单：${record.workOrderNo}的审批进度`,
                  value: "seeprog"
                }
              })

            })
          }}>
            {record.status == 4 || record.status == 2 ? "审批进度" : "审批"}
          </a>
        </div>
      ) : null
    };

    const columns = [
      {
        title: '工单号',
        dataIndex: 'workOrderNo',
        key: 'workOrderNo',
        ellipsis: true,
        ...getsearchbox('workOrderNo')
      },
      {
        title: '流转类型',
        dataIndex: 'approvarProceesName',
        key: 'approvarProceesName',
        ellipsis: true,
        ...getselectbox('approvalProcessType', transferType)
      },
      {
        title: '申请人',
        ellipsis: true,
        dataIndex: 'applyUserName',
        key: 'applyUserName',
        ...getselectbox('applyUserId', userList ? userList.map((item) => {
          return {
            dicKey: item.id,
            dicName: item.userName
          }
        }) : [])
      },
      {
        title: '申请时间',
        dataIndex: 'applyTime',
        key: 'applyTime',
        ellipsis: true,
      },
      {
        title: '当前审批节点',
        dataIndex: 'nodeName',
        key: 'nodeName',
        ellipsis: true,
      },
      {
        title: <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",width:80 }}>
          状态
    <a style={{ color: "#f50" }} onClick={() => {
            this.setState({
              postData: {
                "pageIndex": "1",
                "pageSize": "9",
                "workOrderNo": "",
                "approvalProcessType": "",
                "applyUserId": ""
              }
            }, () => {
              this.setNewState(this.state.postUrl, this.state.postData)
            })


          }}>
            <Tooltip title='重置'>
              <Icon type="reload" />
            </Tooltip>
            
    </a>
        </div>,
        dataIndex: 'status',
        key: 'status',
        width: 100,
        ellipsis: true,
        render: (text) => (<span style={{ color: text == 0 ? "#666" : text == 1 ? "#0e6eb8" : text == 2 ? "green" : text == 4 ? "#ff2100" : "" }}>{text == 0 ? "待审批" : text == 1 ? "审批中" : text == 2 ? "已审批" : text == 4 ? "撤回" : ""}</span>)
      },


    ]

    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("goqueryList", this.state.postData);
      })
    }
    const rowClassNameFn = (record, index) => {
      const { curitem } = this.state;
      if (curitem && curitem.id === record.id) {
        return "selectedRow";
      }
      return null;
    };
    return (
      <div>
        <SearchBox onRef={this.onRefc} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
        <Card title='设备流转列表' extra={
          <div style={{ display: "flex", alignItems: "center" }}>
            <a onClick={() => {
              this.setState({
                iftype: {
                  name: "新增设备流转",
                  value: "add"
                },
                fv: true
              })
            }}>新增</a>
            {
              menu()
            }

          </div>
        }>
          <Table
            size="middle" 
            
            onRow={record => {
              return {
                onClick: event => {
                  this.setState({ curitem: record });
                }, // 点击行
              };
            }}
            rowClassName={(record, index) => rowClassNameFn(record, index)}
            loading={this.props.submitting}
            pagination={{ showTotal:total=>`共${total}条`, // 分页
              size: "small",
              pageSize: 9,
              showQuickJumper: true,
              current: goqueryList.pageNum ? goqueryList.pageNum : 1,
              total: goqueryList.total ? parseInt(goqueryList.total) : 1,
              onChange: pageChange,
            }}
            rowKey='id'
            columns={columns}
            dataSource={goqueryList.list ? goqueryList.list : []}
          >
          </Table>

          <Modal
            title={this.state.iftype.name}
            style={{ maxWidth: "90%" }}
            width={800}
            visible={this.state.visible}
            onOk={() => {
              this.setState({
                visible: false,
              });
            }}
            onCancel={() => {
              this.setState({
                visible: false,
              });
            }}
            footer={null}
          >
            {
              this.state.iftype.value == "seedetail" ?
                getDetail() :
                this.state.iftype.value == "seeprog" ?
                  getprog(curitem) : null
            }

          </Modal>

          <CreateForm
            onRef={this.onRef}
            tableUrl={[
              {
                url: "devicequeryList",
                post: {
                  "pageIndex": 1,                          //（int）页码
                  "pageSize": 9,                           //（int）条数
                  "status": '',                             //（String）设备状态key
                  "equipmentTypeId": '',  //（int）设备类型id
                  "equipmentNo": "",                    //（String）设备编号
                  "equipmentName": '',              //（String）设备名称
                  "departmentId": ""     //（int）部门id
                }
              }]} /*配置该页面表格数据 */
            width={800}
            col={{ xs: 24, sm: 24, md: 12, lg: 12, xl: 8, xxl: 8 }}
            fields={this.state.fields}
            iftype={iftype}
            onChange={this.handleFormChange}
            wrappedComponentRef={this.saveFormRef}
            visible={fv}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
            onSelectChange={this.onSelectChange}
          />

        </Card>
      </div>
    )
  }


}

export default DeviceGo



