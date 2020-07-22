import {
  Table, Input, InputNumber, Popconfirm, Form, Tooltip, Divider, Modal, Tree, Button, Row, Col, Icon, Select, Alert, Tag, message, Card
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import CreateForm from "@/components/CreateForm"
import moment from 'moment';
import SearchBox from '@/components/SearchBox'

const FormItem = Form.Item;
const EditableContext = React.createContext();
const Search = Input.Search;
const { TreeNode } = Tree;
const InputGroup = Input.Group;
const { Option } = Select;


@connect(({ verb, loading }) => ({
  verb,
  submitting: loading.effects['verb/verbqueryList'],
}))
class VerbPlan extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '设备编号',
        dataIndex: 'equipmentNo',
        key: 'equipmentNo',
      },
      {
        title: '设备名称',
        dataIndex: 'equipmentName',
        key: 'equipmentName',
      },
      {
        title: '设备位置号',
        dataIndex: 'positionNo',
        key: 'positionNo',
      },
      {
        title: '设备类型',
        dataIndex: 'equipmentTypeName',
        key: 'equipmentTypeName',
      },
    ]
    this.columnes = [
      {
        title: '保养项目',
        dataIndex: 'maintainItem',
        key: 'maintainItem',
      },
      {
        title: '保养内容',
        dataIndex: 'maintainContent',
        key: 'maintainContent',
      },
      {
        title: '费用',
        dataIndex: 'maintainCost',
        key: 'maintainCost',
        render: (text, record) => {
          let vals = this.state.fields.maintainItemRelList.value ? this.state.fields.maintainItemRelList.value : [], res,
            values = this.state.fields.maintainItemRelList.submit ? this.state.fields.maintainItemRelList.submit : [],
            fields = this.state.fields;
          values.map((item, i) => {
            if (item.equipmentMaintainItemId == record.id) {
              res = item.maintainCost
            }
          })

          if (vals.indexOf(record.id) == -1) {
            return "请选择"
          } else {
            return <Input value={res} onChange={(e) => {
              let val = e.target.value;
              let newvalues = values.map((item, i) => {
                if (item.equipmentMaintainItemId == record.id) {
                  item.maintainCost = val
                }
                return item
              })
              fields.maintainItemRelList.submit = newvalues
              this.setState({
                fields
              })
            }} />
          }

        }
      },
    ]
    this.state = {
      ifshow: false,
      iftype: {
        name: "",
        value: ""
      },
      fv: false,
      fields: {},
      /*初始化 main List */
      postData: {
        "pageIndex": 1,    //第几页
        "pageSize": 9,     //每页大小
        "maintainPlanType": "",    //维保类型
        "maintainPlanNo": "",    //计划编号
        "equipmentName": ""      //设备名称
      },
      postDatac: {
        pageIndex: 1,    //第几页
        pageSize: 9,     //每页大小
        maintainItem: "",
        id: ""
      },
      postDataz: {
        pageIndex: 1,    //第几页
        pageSize: 9,     //每页大小
        equipmentNo: "",//编号
        equipmentName: "",//设备名
        positionNo: "",//位置编号
        equipmentTypeId: "",//类型
      },
      postUrl: "verbqueryList",
      curitem: {}





    }
  }

  //设置新状态
  setNewState(type, values, fn) {
    const { dispatch } = this.props;
    dispatch({
      type: 'verb/' + type,
      payload: values
    }).then((res) => {
      if (res) {
        fn ? fn() : null;
      }
    });
  }
  setNewStates(type, values, fn) {
    const { dispatch } = this.props;
    dispatch({
      type: 'publicmodel/' + type,
      payload: values
    }).then((res) => {
      if (res) {
        fn ? fn() : null;
      }
    });
  }

  resetData() {
    let { postUrl, postData } = this.state;
    this.setNewState(postUrl, postData, () => {
      this.handleCancel()
    })
  }

  componentDidMount() {
    this.props.ensureDidMount && this.props.ensureDidMount()
    this.resetData();
    this.setNewState('deviceTypequeryTreeList', null);
  }

  onSelectChange = (selectval, name) => {
    let { fields } = this.state;
    fields[name] = { ...fields[name], value: selectval };

    if (name == "maintainItemRelList") {//输入内容
      let Inarr = fields[name].submit ? fields[name].submit.map((item) => {
        return item.equipmentMaintainItemId
      }) : []

      function getval(key) {
        let results = ""
        fields[name].submit ? fields[name].submit.map((item) => {
          if (item.equipmentMaintainItemId == key) {
            results = item.maintainCost
          }
        }) : null

        return results
      }

      let submit = selectval.map((item) => {
        if (Inarr.indexOf(item) == -1) {
          return {
            "equipmentMaintainItemId": item,
            "maintainCost": undefined
          }
        } else {
          return {
            "equipmentMaintainItemId": item,
            "maintainCost": getval(item)
          }
        }

      })
      fields[name] = { ...fields[name], value: selectval, submit };
    }


    this.setState({
      fields
    })
  }


  //表单改变
  handleFormChange = (changedFields) => {
    let fields = this.state.fields, obj;
    const form = this.formRef.props.form;
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

          if (i == "maintainItemRelList") {
            this.onSelectChange(fields[i].value, i)
          }

          if (i == "planType") {
            if (fields.planType.value == 0) {
              fields.maintainPeriod.requires = true;
              fields.maintainPeriod.hides = false;
            } else {
              fields.maintainPeriod.requires = false;
              fields.maintainPeriod.hides = true;
            }

          }
        }
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
        maintainItemRelList: {
          value: undefined,
          type: "table",
          title: "保养项目",
          keys: "maintainItemRelList",
          requires: true,
          columns: this.columnes,
          dataSource: "verbqueryItemForAdd",
          hides: false,
          dv: "id",
          lb: "maintainItem",
          submit: []
        },
        equipmentIds: {
          value: undefined,
          type: "table",
          title: "选择设备",
          keys: "equipmentIds",
          requires: true,
          columns: this.columns,
          dataSource: "queryPageList",
          hides: false,
          dv: "id",
          lb: "equipmentName"
        },
        planMaintainDate: {
          value: undefined,
          type: "datepicker",
          title: "计划开始时间",
          keys: "planMaintainDate",
          requires: true,
          col: { span: 24 }
        },
        planType: {
          value: undefined,
          type: "select",
          title: "计划类型",
          keys: "planType",
          requires: true,
          option: this.props.verb.planType.map((item) => {
            return {
              name: item.dicName,
              id: item.dicKey
            }
          })
        },
        maintainPeriod: {
          value: null,
          type: "inputnumber",
          title: "保养周期(天)",
          keys: "maintainPeriod",
          requires: false
        },
        maintainPlanType: {
          value: undefined,
          type: "select",
          title: "维保类型",
          keys: "maintainPlanType",
          requires: true,
          option: this.props.verb.maintainPlanType.map((item) => {
            return {
              name: item.dicName,
              id: item.dicKey
            }
          })
        },

        maintainHours: {
          value: undefined,
          type: "inputnumber",
          title: "保养用时(小时)",
          keys: "maintainHours",
          requires: true,
        },
      }
    });
  }

  /*form 提交*/
  handleCreate = () => {
    const form = this.formRef.props.form;
    let { curitem, iftype, fields } = this.state;
    let submit = fields.maintainItemRelList.submit;
    message.destroy();
    if (submit.length == 0) {
      message.warn("请选择保养项目")
      return
    }
    let arrs = submit.filter((item) => { return !item.maintainCost })
    if (arrs.length > 0) {
      message.warn("请完善保养项目")
      return
    }


    form.validateFields((err, values) => {
      if (err) {
        message.warn("请补全必填项")
        return;
      }

      for (let i in values) {
        if (!values[i]) {
          values[i] = ""
        } else if (i == "planMaintainDate") {
          values[i] = moment(values[i]).format("YYYY-MM-DD");
        }
      }

      if (iftype.value == "edit") {
        let postData = { ...values, id: curitem.id, maintainItemRelList: submit };
        this.setNewState("verbupdate", postData, () => {
          message.success("修改成功！");
          this.setState({ visibleform: false });
          this.resetData();
        });
      } else if (iftype.value == "add") {
        let postData = { ...values, maintainItemRelList: submit };
        this.setNewState("verbsave", postData, () => {
          message.success("新增成功！");
          this.setState({ visibleform: false });
          this.resetData();
        });
      } else {
        //ELSE TO DO
      }

    });
  }

  handleSearch = (selectedKeys, dataIndex) => {
    let { postUrl } = this.state;
    this.setState({ postData: { ...this.state.postData, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
      this.setNewState(postUrl, this.state.postData)
    });
  };

  handleSearchc = (selectedKeys, dataIndex) => {
    let postUrl = "verbqueryItemForAdd"
    this.setState({ postDatac: { ...this.state.postDatac, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
      this.setNewStates(postUrl, this.state.postDatac)
    });
  };
  handleSearchz = (selectedKeys, dataIndex) => {
    let postUrl = "queryPageList"
    this.setState({ postDataz: { ...this.state.postDataz, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
      this.setNewStates(postUrl, this.state.postDataz)
    });
  };
  onRef = (ref) => {
    this.child = ref;
  }

  onRefs = (ref) => {
    this.childs = ref;
  }

  onRefc = (ref) => {
    this.childc = ref;
  }

  onRefz = (ref) => {
    this.childz = ref;
  }
  render() {
    let { postData, postUrl, fv, fields, iftype, curitem, ifshow } = this.state,
      { verbqueryList, maintainPlanType, planType, verbqueryByMaintainPlanNo, deviceTypequeryTreeList } = this.props.verb;
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
    }, getsearchboxc = (key) => {
      if (this.childc) {
        return this.childc.getColumnSearchProps(key)
      } else {
        return null
      }
    }, getsearchboxz = (key) => {
      if (this.childz) {
        return this.childz.getColumnSearchProps(key)
      } else {
        return null
      }
    }, gettreeselectboxz = (key, option) => {
      if (this.childz) {
        return this.childz.getColumnTreeSelectProps(key, option)
      } else {
        return null
      }
    };

    this.columns = [
      {
        title: '设备编号',
        dataIndex: 'equipmentNo',
        key: 'equipmentNo',
        width: 110,
        ellipsis: true,
        ...getsearchboxz("equipmentNo")
      },
      {
        title: '设备名称',
        dataIndex: 'equipmentName',
        key: 'equipmentName',
        width: 110,
        ellipsis: true,
        ...getsearchboxz("equipmentName")
      },
      {
        title: '设备位置号',
        dataIndex: 'positionNo',
        key: 'positionNo',
        width: 120,
        ellipsis: true,
        ...getsearchboxz("positionNo")
      },
      {
        title: '设备类型',
        dataIndex: 'equipmentTypeName',
        key: 'equipmentTypeName',
        width: 110,
        ellipsis: true,
        ...gettreeselectboxz('equipmentTypeId', deviceTypequeryTreeList),
      },
    ]


    this.columnes = [
      {
        title: '保养项目',
        dataIndex: 'maintainItem',
        key: 'maintainItem',
        width: 110,
        ellipsis: true,
        ...getsearchboxc("maintainItem")
      },
      {
        title: '保养内容',
        dataIndex: 'maintainContent',
        key: 'maintainContent',
        ellipsis: true,
      },
      {
        title: '费用',
        dataIndex: 'maintainCost',
        key: 'maintainCost',
        width: 110,
        ellipsis: true,
        render: (text, record) => {
          let vals = this.state.fields.maintainItemRelList.value ? this.state.fields.maintainItemRelList.value : [], res,
            values = this.state.fields.maintainItemRelList.submit ? this.state.fields.maintainItemRelList.submit : [],
            fields = this.state.fields;
          values.map((item, i) => {
            if (item.equipmentMaintainItemId == record.id) {
              res = item.maintainCost
            }
          })

          if (vals.indexOf(record.id) == -1) {
            return "请选择"
          } else {
            return <Input value={res} onChange={(e) => {
              let val = e.target.value;
              let newvalues = values.map((item, i) => {
                if (item.equipmentMaintainItemId == record.id) {
                  item.maintainCost = val
                }
                return item
              })
              fields.maintainItemRelList.submit = newvalues
              this.setState({
                fields
              })
            }} />
          }

        }
      },
    ]

    const columns = [
      {
        title: '设备名',
        dataIndex: 'equipmentName',
        key: 'equipmentName',
        width: 110,
        ellipsis: true,
        ...getsearchbox('equipmentName')
      },
      {
        title: '计划编号',
        dataIndex: 'maintainPlanNo',
        key: 'maintainPlanNo',
        width: 110,
        ellipsis: true,
        ...getsearchbox('maintainPlanNo')
      },
      {
        title: '维保类型',
        dataIndex: 'maintainPlanTypeName',
        key: 'maintainPlanTypeName',
        width: 110,
        ellipsis: true,
        ...getselectbox('maintainPlanType', maintainPlanType)
      },
      {
        title: '设备型号',
        dataIndex: 'equipmentModel',
        key: 'equipmentModel',
        width: 110,
        ellipsis: true,
      },
      {
        title: '设备编号',
        dataIndex: 'equipmentNo',
        key: 'equipmentNo',
        width: 110,
        ellipsis: true,
      },
      {
        title: '计划类型',
        dataIndex: 'planTypeName',
        key: 'planTypeName',
        width: 110,
        ellipsis: true,
      },
      {
        title: '周期',
        dataIndex: 'maintainPeriod',
        key: 'maintainPeriod',
        width: 110,
        ellipsis: true,
      },
      {
        title: '计划开始时间',
        dataIndex: 'planMaintainDate',
        key: 'planMaintainDate',
        width: 120,
        ellipsis: true,
      },
      {
        title: '下次保养时间',
        dataIndex: 'nextMaintainDate',
        key: 'nextMaintainDate',
        width: 160,
        ellipsis: true,
      },
      {
        title: '保养用时(小时)',
        dataIndex: 'maintainHours',
        key: 'maintainHours',
        width: 140,
        ellipsis: true,
      },
      {
        title: '总费用',
        dataIndex: 'totalBudget',
        key: 'totalBudget',
        width: 90,
        ellipsis: true,
      },
      {
        title: <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: 90 }}>
          备注
      <a style={{ color: "#f50" }} onClick={() => {
            this.setState({
              postData: {
                "pageIndex": 1,    //第几页
                "pageSize": 9,     //每页大小
                "maintainPlanType": "",    //维保类型
                "maintainPlanNo": "",    //计划编号
                "equipmentName": ""      //设备名称
              }
            }, () => {
              this.resetData()
            })
          }}>
            <Tooltip title='重置'>
              <Icon type="reload" />
            </Tooltip>
          </a>
        </div>,
        width: 110,
        dataIndex: 'remark',
        key: 'remark',
      },

    ]

    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("verbqueryList", this.state.postData);
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
        <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
        <SearchBox onRef={this.onRefz} handleSearch={this.handleSearchz} postData={this.state.postDataz}></SearchBox>
        <SearchBox onRef={this.onRefc} handleSearch={this.handleSearchc} postData={this.state.postDatac}></SearchBox>

        <Card title='维保设置列表' extra={
          <div style={{ display: "flex", alignItems: "center" }}>
            <a onClick={() => {
              this.setState({
                ifshow: !ifshow
              })
            }}>{ifshow ? "取消" : "新增"}</a>
            {
              curitem.id && <div style={{ display: "flex", alignItems: "center" }}>
                <Divider style={{ marginTop: 6 }} type="vertical"></Divider>
                <a onClick={() => {
                  this.childs.changedData("verbqueryItemForAdd", {
                    "pageIndex": 1,                          //（int）页码
                    "pageSize": 9,                           //（int）条数
                    "id": curitem.id,
                    "maintainItem": ""
                  }, 1, () => {

                    this.setNewState("verbqueryMaintainItem", { id: curitem.id }, () => {
                      let { verbqueryMaintainItem } = this.props.verb
                      this.setState({
                        postDatac: {
                          "pageIndex": 1,                          //（int）页码
                          "pageSize": 9,                           //（int）条数
                          "id": curitem.id,
                          "maintainItem": ""
                        },
                        fv: true,
                        iftype: {
                          name: "修改维保设置",
                          value: "edit"
                        },
                        curitem: curitem,
                        fields: {
                          maintainItemRelList: {
                            value: verbqueryMaintainItem.map((item) => { return item.equipmentMaintainItemId }),
                            type: "table",
                            title: "保养项目",
                            keys: "maintainItemRelList",
                            requires: true,
                            columns: this.columnes,
                            dataSource: "verbqueryItemForAdd",
                            hides: false,
                            dv: "id",
                            col: { span: 24 },
                            lb: "maintainItem",
                            submit: verbqueryMaintainItem.map((item) => {
                              return {
                                "equipmentMaintainItemId": item.equipmentMaintainItemId,
                                "maintainCost": item.maintainCost
                              }
                            })
                          },
                          planType: {
                            value: curitem.planType,
                            type: "select",
                            title: "计划类型",
                            keys: "planType",
                            requires: true,
                            option: this.props.verb.planType.map((item) => {
                              return {
                                name: item.dicName,
                                id: item.dicKey
                              }
                            })
                          },
                          maintainPeriod: {
                            value: curitem.maintainPeriod,
                            type: "inputnumber",
                            title: "保养周期(天)",
                            keys: "maintainPeriod",
                            requires: curitem.planType == 0,
                            hides: curitem.planType == 1
                          },
                          maintainPlanType: {
                            value: curitem.maintainPlanType,
                            type: "select",
                            title: "维保类型",
                            keys: "maintainPlanType",
                            requires: true,
                            option: this.props.verb.maintainPlanType.map((item) => {
                              return {
                                name: item.dicName,
                                id: item.dicKey
                              }
                            })
                          },
                          planMaintainDate: {
                            value: curitem.planMaintainDate ? moment(curitem.planMaintainDate) : undefined,
                            type: "datepicker",
                            title: "计划开始时间",
                            keys: "planMaintainDate",
                            requires: true,
                          },
                          maintainHours: {
                            value: curitem.maintainHours,
                            type: "inputnumber",
                            title: "保养用时(小时)",
                            keys: "maintainHours",
                            requires: true,
                          },


                        }
                      })

                    })
                  })




                }}>修改</a>
                <Divider style={{ marginTop: 6 }} type="vertical"></Divider>
                <Popconfirm
                  okText="确认"
                  cancelText="取消"
                  placement="bottomRight"
                  title={"确认删除该计划？"}
                  onConfirm={() => {
                    this.setNewState("verbdeleteById", { id: curitem.id }, () => {
                      let total = this.props.verb.verbqueryList.total,
                        page = this.props.verb.verbqueryList.pageNum;
                      if ((total - 1) % 9 == 0) {
                        page = page - 1
                      }
                      this.setState({
                        postData: { ...this.state.postData, pageIndex: page }
                      }, () => {
                        this.setNewState("verbqueryList", postData, () => {
                          message.success("删除成功！");
                        });
                      })
                    })
                  }}>
                  <a style={{ color: "#ff4800" }}>删除</a>
                </Popconfirm>

              </div>
            }

          </div>
        }>
          <Row gutter={24} >
            <Col xs={24} sm={12} md={12} lg={7} xl={7} xxl={7} style={{ backgroundColor: ifshow ? "#f0f0f0" : "transparent", padding: ifshow ? "12px" : 0, height: ifshow ? 56 : 0, opacity: ifshow ? 1 : 0, cursor: "default", overflow: "hidden", transition: "all 0.4s" }}>
              <Button style={{ width: "100%" }} type="primary" onClick={() => {
                this.setState({
                  iftype: {
                    name: "新增维保设置",
                    value: "add"
                  },
                  fv: true
                })
              }}>普通新增</Button>
            </Col>
            <Col xs={24} sm={12} md={12} lg={17} xl={17} xxl={17} style={{ backgroundColor: ifshow ? "#f0f0f0" : "transparent", padding: ifshow ? "12px" : 0, height: ifshow ? 56 : 0, opacity: ifshow ? 1 : 0, cursor: "default", display: "flex", alignItems: "center", overflow: "hidden", transition: "all 0.4s" }}>
              <Input placeholder="复制计划编号" style={{ marginRight: 12 }} ref="input1"></Input>
              <Button type="primary" onClick={() => {
                let doc = this.refs.input1;
                let val = doc ? doc.input.value : "";
                this.setNewState("verbqueryByMaintainPlanNo", { maintainPlanNo: val }, () => {
                  let record = this.props.verb.verbqueryByMaintainPlanNo;
                  if (record) {
                    this.setNewState("verbqueryMaintainItem", { id: record.id }, () => {
                      let { verbqueryMaintainItem } = this.props.verb
                      this.setState({
                        fv: true,
                        iftype: {
                          name: "新增维保设置",
                          value: "add"
                        },
                        curitem: record,
                        fields: {
                          maintainItemRelList: {
                            value: verbqueryMaintainItem.map((item) => { return item.equipmentMaintainItemId }),
                            type: "table",
                            title: "保养项目",
                            keys: "maintainItemRelList",
                            requires: true,
                            columns: this.columnes,
                            dataSource: "verbqueryItemForAdd",
                            hides: false,
                            dv: "id",
                            lb: "maintainItem",
                            submit: verbqueryMaintainItem.map((item) => {
                              return {
                                "equipmentMaintainItemId": item.equipmentMaintainItemId,
                                "maintainCost": item.maintainCost
                              }
                            })
                          },
                          equipmentIds: {
                            value: undefined,
                            type: "table",
                            title: "选择设备",
                            keys: "equipmentIds",
                            requires: true,
                            columns: this.columns,
                            dataSource: "queryPageList",
                            hides: false,
                            dv: "id",
                            lb: "equipmentName"
                          },
                          planMaintainDate: {
                            value: record.planMaintainDate ? moment(record.planMaintainDate) : undefined,
                            type: "datepicker",
                            title: "计划开始时间",
                            keys: "planMaintainDate",
                            requires: true,
                            col: { span: 24 }
                          },
                          planType: {
                            value: record.planType,
                            type: "select",
                            title: "计划类型",
                            keys: "planType",
                            requires: true,
                            option: this.props.verb.planType.map((item) => {
                              return {
                                name: item.dicName,
                                id: item.dicKey
                              }
                            })
                          },
                          maintainPeriod: {
                            value: record.maintainPeriod,
                            type: "inputnumber",
                            title: "保养周期(天)",
                            keys: "maintainPeriod",
                            requires: false,
                            requires: curitem.planType == 0,
                            hides: curitem.planType == 1
                          },
                          maintainPlanType: {
                            value: record.maintainPlanType,
                            type: "select",
                            title: "维保类型",
                            keys: "maintainPlanType",
                            requires: true,
                            option: this.props.verb.maintainPlanType.map((item) => {
                              return {
                                name: item.dicName,
                                id: item.dicKey
                              }
                            })
                          },

                          maintainHours: {
                            value: record.maintainHours,
                            type: "inputnumber",
                            title: "保养用时(小时)",
                            keys: "maintainHours",
                            requires: true,
                          },


                        }
                      })

                    })


                  }
                })


              }}>复制新增</Button>
            </Col>
          </Row>
          <Table size="middle"
            scroll={{ x: 1500 }}
            onRow={record => {
              return {
                onClick: event => {
                  this.setState({ curitem: record });
                }, // 点击行
              };
            }}
            rowClassName={(record, index) => rowClassNameFn(record, index)}
            loading={this.props.submitting}
            pagination={{
              showTotal: total => `共${total}条`, // 分页
              size: "small",
              pageSize: 9,
              showQuickJumper: true,
              current: verbqueryList.pageNum ? verbqueryList.pageNum : 1,
              total: verbqueryList.total ? parseInt(verbqueryList.total) : 1,
              onChange: pageChange,
            }}
            rowKey='id'
            columns={columns}
            dataSource={verbqueryList.list ? verbqueryList.list : []}
          >
          </Table>

          <CreateForm
            tableUrl={[{
              url: "queryPageList",
              post: this.state.postDataz
            }, {
              url: "verbqueryItemForAdd",
              post: this.state.postDatac
            }]}/*配置页面表格数据*/
            width={"98%"}
            fields={this.state.fields}
            col={{ xs: 24, sm: 24, md: 12, lg: 12, xl: 12, xxl: 12 }}
            iftype={iftype}
            onChange={this.handleFormChange}
            wrappedComponentRef={this.saveFormRef}
            visible={fv}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
            onRef={this.onRefs}
            onSelectChange={this.onSelectChange}
          />

        </Card>
      </div>
    )
  }


}

export default VerbPlan



