import {
  Table, Input, Popconfirm, Form, Modal, Tree, Button, Row, Col, Icon, Select, Popover, Tag, message, Card, InputNumber, Empty
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import CreateForm from "@/components/CreateForm"
import moment from 'moment';
const { Meta } = Card;
const FormItem = Form.Item;
const EditableContext = React.createContext();
const Search = Input.Search;
const { TreeNode } = Tree;
const InputGroup = Input.Group;
const { Option } = Select;

function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

@connect(({ device, global, loading }) => ({
  device, global,
  submitting: loading.effects['device/AdminqueryList'],
  repair: loading.effects['device/repair'],
}))
class DeviceRepair extends React.Component {
  constructor(props) {
    super(props);
    this.columnes = [
      {
        title: '备件名称',
        dataIndex: 'sparePartsName',
        key: 'sparePartsName',
      },
      {
        title: '备件类型',
        dataIndex: 'sparePartsTypeName',
        key: 'sparePartsTypeName',
      },
      {
        title: '备件数量',
        dataIndex: 'availableStock',
        key: 'availableStock',
      },
      {
        title: '消耗数量',
        dataIndex: 'availableStocks',
        key: 'availableStocks',
        render: (text, record) => {
          let vals = this.state.fields.spare.value ? this.state.fields.spare.value : [], res,
            values = this.state.fields.spare.submit ? this.state.fields.spare.submit : [],
            fields = this.state.fields;
          values.map((item, i) => {
            if (item.userSparePartsId == record.id) {
              res = item.consumeCount
            }
          })

          if (vals.indexOf(record.id) == -1) {
            return "请选择"
          } else {
            return <InputNumber min={1} max={record.availableStock} value={res} onChange={(val) => {
              let newvalues = values.map((item, i) => {
                if (item.userSparePartsId == record.id) {
                  item.consumeCount = val
                }
                return item
              })
              fields.spare.submit = newvalues
              this.setState({
                fields
              })
            }} />
          }

        }
      },
    ]
    this.state = {
      collspan: false,
      step: 0,
      fv: false,
      curid: "",
      iftype: {
        name: "",
        value: ""
      }
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
  resetData() {
    this.setNewState("queryByEquipmentId", { id: this.props.match.params.id });
    this.setNewState("queryAllRepair", { id: this.props.match.params.id });
  }

  componentDidMount() {
    this.props.ensureDidMount&&this.props.ensureDidMount()
    this.resetData()
  }

  componentWillReceiveProps(nextProps) {
    let parames = nextProps.match ? nextProps.match.params : {},
        parame = this.props.match ? this.props.match.params : {}
    if (!parames.id || !parame) {
      return
    }
    if (parame.id != parames.id) {
      this.setNewState("queryByEquipmentId", { id: parames.id })
    }
  }

  /*--表单操作 --*/
  onSelectChange = (selectval, name) => {
    let { fields } = this.state;
    fields[name] = { ...fields[name], value: selectval };

    if (name == "spare") {//输入内容
      let Inarr = fields[name].submit ? fields[name].submit.map((item) => {
        return item.userSparePartsId
      }) : []

      function getval(key) {
        let results = ""
        fields[name].submit ? fields[name].submit.map((item) => {
          if (item.userSparePartsId == key) {
            results = item.consumeCount
          }
        }) : null
        return results
      }

      let submit = selectval.map((item) => {
        if (Inarr.indexOf(item) == -1) {
          return {
            "userSparePartsId": item,
            "consumeCount": undefined
          }
        } else {
          return {
            "userSparePartsId": item,
            "consumeCount": getval(item)
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
          if (i == "spare") {
            this.onSelectChange(fields[i].value, i)
          }
          if (i == "mainType") {
            this.setNewState("getChildren", {
              id: obj.value
            }, () => {
              fields.faultType.value = null;
              fields.faultType.option = this.props.device.getChildren ? this.props.device.getChildren.map((item) => {
                return {
                  name: item.faultName,
                  id: item.id
                }
              }) : [];
            })

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
      },
    });
  }

  /*form 提交*/
  handleCreate = () => {
    const form = this.formRef.props.form;
    let { curitem, step, iftype, curid, fields } = this.state;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      for (let i in values) {
        if (!values[i]) {
          values[i] = ''
        } else {
          if (i == "faultTime") {
            values[i] = moment(values[i]).format("YYYY-MM-DD HH:mm:ss");
          }
        }
      }
      if (step == "4") {
        let faultPicUrl = "";
        if (values.faultPicUrl.length > 0) {
          let last = values.faultPicUrl[values.faultPicUrl.length - 1];
          if (last.response) {
            faultPicUrl = last.response.data.dataList[0]
          }
        }
        delete values.mainType;
        let postData = { ...values, faultPicUrl: faultPicUrl, equipmentId: curid, status: 1 };
        this.setNewState("repair", postData, () => {
          message.success("报修成功！");
          if (this.props.match.params.ifs) {
            this.setNewState("checkRepairAfter", { id: this.props.match.params.ifs, handleId: this.props.device.checkRepairAfter })
          }
          this.setState({ fv: false });
          this.resetData();
        });

      } else if (step == 2) {
        let postData = { ...values, spare: fields.spare.submit, id: curid, status: 3 };
        this.setNewState("repair", postData, () => {
          this.setState({ fv: false });
          this.resetData();
          message.success("完成维修成功！");
        });
      } else if (step == 3) {
        let postData = { ...values, id: curid, status: 4 };
        this.setNewState("repair", postData, () => {
          this.setState({ fv: false });
          this.resetData();
          message.success("操作成功！");
        });
      }
    });
  }

  getOption(ls, name, id) {
    let res = this.props.device[ls];
    let result = res.map((item) => {
      return {
        name: name ? item[name] : item.dicName,
        id: id ? item[id] : item.dicKey
      }
    })
    return result
  }

  toNext = (id, step, can) => {
    if (!can) {
      message.warn("不可操作当前步骤！")
      return
    }

    let fields = {};
    switch (step) {
      case 4:
        let userList = this.props.device.queryAllRepair ? this.props.device.queryAllRepair.map((item, i) => {
          return {
            name: item.userName,
            id: item.id
          }
        }) : [];

        fields = {
          mainType: {
            value: null,
            type: "select",
            title: "故障分类",
            keys: "mainType",
            requires: true,
            option: this.getOption("faultTypeList", "faultName", "id"),
          },
          faultType: {
            value: null,
            type: "select",
            title: "故障名称",
            keys: "faultType",
            requires: true,
            option: this.props.device.getChildren ? this.props.device.getChildren.map((item) => {
              return {
                name: item.faultName,
                id: item.id
              }
            }) : []
          },
          repairUserId: {
            value: null,
            type: "select",
            title: "维修人",
            keys: "repairUserId",
            requires: true,
            option: userList
          },
          faultDesc: {
            value: null,
            type: "textarea",
            title: "故障描述",
            keys: "faultDesc",
            requires: false,
          },
          faultPicUrl: {
            value: null,
            type: "upload",
            title: "故障图片",
            uploadtype: "image",
            multiple: false,
            keys: "faultPicUrl",
            requires: false,
          }
        }
        this.setState({
          fv: true,
          iftype: {
            name: "设备报修",
            value: "repair"
          }
        })
        break
      case 1:
        this.setNewState("repair", {
          id,
          status: "2"
        }, () => {
          message.success("开始维修成功!")
          this.resetData()
        })
        break

      case 2:
        fields = {
          faultReason: {
            value: null,
            type: "input",
            title: "故障原因",
            keys: "faultReason",
            requires: true
          }, faultLevel: {
            value: null,
            type: "select",
            title: "故障等级",
            keys: "faultLevel",
            requires: true,
            option: this.getOption("faultLevelList")
          },
          repairType: {
            value: null,
            type: "select",
            title: "维修类型",
            keys: "repairType",
            requires: true,
            option: this.getOption("repairTypeList")
          },
          repairContent: {
            value: null,
            type: "input",
            title: "维修内容",
            keys: "repairContent",
            requires: true
          },
          spare: {
            value: undefined,
            type: "table",
            title: "消耗备件",
            keys: "spare",
            requires: false,
            columns: this.columnes,
            dataSource: "pairqueryPageByUserId",
            dv: "id",
            col: { span: 24 },
            lb: "sparePartsName",
            submit: [],
            hides: !this.props.global.showModule.spare
          },

        }
        this.setState({
          fv: true,
          iftype: {
            name: "完成维修",
            value: "repair"
          }
        })
        break

      case 3:
        fields = {
          confirmIsPass: {
            value: null,
            type: "select",
            title: "是否通过",
            keys: "confirmIsPass",
            requires: true,
            option: [{
              name: "通过",
              id: "1"
            }, {
              name: "不通过",
              id: "2"
            }]
          },
          confirmDesc: {
            value: null,
            type: "textarea",
            title: "说明",
            keys: "confirmDesc",
            requires: true,
          }
        }
        this.setState({
          fv: true
        })
        break
    }
    this.setState({
      fields,
      step,
      curid: id
    })







  }

  render() {
    let { collspan, fields, iftype, fv } = this.state,
      { queryByEquipmentId, repairs, queryAllRepair } = this.props.device;
    let record = queryByEquipmentId;
    const content = (
      <div>
        <img style={{ width: "200px", height: "auto", margin: "20px 0px" }} src={record.qrCodeUrl} onError={(e) => { e.target.src = './images/default.png' }} />
      </div>
    );
    const contents = (
      <div className={styles.limitdiv}>
        <p>设备编号：<span>{record.equipmentNo}</span></p>
        <p>设备位置号：<span>{record.positionNo}</span></p>
        <p>设备名称：<span>{record.equipmentName}</span></p>
        <p>设备型号：<span>{record.equipmentModel}</span></p>
        <p>设备类型：<span>{record.equipmentTypeName}</span></p>
        <p>所在部门：<span>{record.departmentName}</span></p>
        <p>能<i style={{ opacity: 0 }}>所在</i>耗：<span>{record.energyConsumption} kw</span></p>
        <p>价<i style={{ opacity: 0 }}>所在</i>值：<span>{record.equipmentWorth} 万元</span></p>
      </div>
    );

    let col = {
      xs: 24,
      sm: 24,
      md: 24,
      lg: collspan ? 14 : 24,
      xl: collspan ? 15 : 24,
      xxl: collspan ? 16 : 24
    }, cols = {
      xs: collspan ? 24 : 0,
      sm: collspan ? 24 : 0,
      md: collspan ? 24 : 0,
      lg: collspan ? 10 : 0,
      xl: collspan ? 9 : 0,
      xxl: collspan ? 8 : 0
    }

    return (
      <div>
        <div style={{ padding: "0 6px" }}>
          <Row gutter={24}>
            <Col {...col} style={{ padding: 6 }}>
              <Card
                title={<span>设备<span style={{ color: "#0e6eb8" }}>{record.equipmentName}</span>的信息</span>}
                extra={<Button onClick={() => {
                  this.setState({
                    collspan: !collspan
                  })
                }}>{collspan ? "隐藏" : "展示"}维修信息</Button>}
              >
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                  <Card
                    hoverable
                    style={{ width: 400, marginTop: 12 }}
                    title="设备详情"
                    extra={<Button type='danger' style={{ display: record.repairStatus == 1 ? "none" : "none" }} onClick={() => {
                      let _it = this;
                      Modal.confirm({
                        title: '是否终止该维修流程?',
                        content: '终止该维修流程设备将会变成运行中状态',
                        okText: "终止",
                        cancelText: "取消",
                        onOk() {
                          _it.setNewState("stopRepair", { id: record.repairId }, () => {
                            _it.resetData()
                          })
                        },
                        onCancel() {
                        },
                      })
                    }}>中止</Button>}
                    cover={
                      <Popover placement="leftTop" content={content} title="设备二维码">
                        <img onClick={() => {
                          Modal.info({
                            maskClosable: true,
                            title: `预览${record.equipmentName}的图片`,
                            okText: "关闭",
                            content: (
                              <div style={{ width: "100%" }}>
                                <img style={{ width: "100%", height: "auto", margin: "20px 0px" }} src={record.pictureUrl} onError={(e) => { e.target.src = './images/default.png' }} />
                              </div>
                            ),
                            onOk() { },
                          });
                        }} src={record.pictureUrl} onError={(e) => { e.target.src = './images/default.png' }} /></Popover>}
                  >
                    <Popover placement="rightBottom" content={contents} title="设备详情">
                      <Meta title={<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <a>{record.equipmentName}</a>
                        <span style={{
                          color: record.status == 2 ? "#ff2100" :
                            record.status == 3 ? "#ff5000" :
                              record.status == 5 ? "#999" :
                                record.status == 1 || record.status == 0 ? "green" : "#0e6eb8"
                        }}>{record.statusName}</span>
                      </div>}
                        description={
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span>编号：{record.equipmentNo}</span>
                            <span>型号：{record.equipmentModel}</span>
                          </div>
                        } />
                    </Popover>
                  </Card>
                  <ul className={styles.baoxiubox}>
                    <li>
                      <div className={record.repairStatus == 4 ? styles.cur : null} onClick={() => {
                        this.toNext(record.id, 4, record.repairStatus == 4)
                      }}>
                        <img src="./images/baoxiu.png" alt="" />
                        <img src="./images/baoxiu2.png" alt="" />
                      </div>
                      <p>设备报修</p>
                    </li>
                    <li>
                      <div className={record.repairStatus == 1 ? styles.cur : null} onClick={() => {
                        this.toNext(record.repairId, 1, record.repairStatus == 1)
                      }}>
                        <img src="./images/weixiu.png" alt="" />
                        <img src="./images/weixiu2.png" alt="" />
                      </div>
                      <p>开始维修</p>
                    </li>
                    <li>
                      <div className={record.repairStatus == 2 ? styles.cur : null} onClick={() => {
                        this.toNext(record.repairId, 2, record.repairStatus == 2)
                      }}>
                        <img src="./images/wancheng.png" alt="" />
                        <img src="./images/wancheng2.png" alt="" />
                      </div>
                      <p>完成维修</p>
                    </li>
                    <li>
                      <div className={record.repairStatus == 3 ? styles.cur : null} onClick={() => {
                        this.toNext(record.repairId, 3, record.repairStatus == 3)
                      }}>
                        <img src="./images/yanzheng.png" alt="" />
                        <img src="./images/yanzheng2.png" alt="" />
                      </div>
                      <p>维修验证</p>
                    </li>
                  </ul>

                </div>


              </Card>
            </Col>
            <Col {...cols} style={{ padding: 6 }}>
              <Card title={<span style={{ padding: "4px 0px", display: "block" }}>设备<span style={{ color: "#0e6eb8" }}>{record.equipmentName}</span>的维修信息</span>}>
                {
                  repairs.id ?
                    <div className={styles.limitdivc}>
                      <p>
                        <span>故障图片</span>
                        <img onClick={() => {
                          Modal.info({
                            maskClosable: true,
                            title: `预览`,
                            okText: "关闭",
                            content: (
                              <div style={{ width: "100%" }}>
                                <img style={{ width: "100%", height: "auto", margin: "20px 0px" }} src={repairs.faultPicUrl} onError={(e) => { e.target.src = './images/default.png' }} />
                              </div>
                            ),
                            onOk() { },
                          });
                        }} style={{ width: 30, height: 30, marginLeft: 8, cursor: "pointer" }} src={repairs.faultPicUrl} onError={(e) => { e.target.src = './images/default.png' }} />
                      </p>
                      <p>
                        <span>故障等级</span>
                        <span>{repairs.faultLevelName}</span>
                      </p>
                      <p>
                        <span>故障类型</span>
                        <span>{repairs.faultClassifyName}</span>
                      </p>
                      <p>
                        <span>故障名称</span>
                        <span>{repairs.faultTypeName}</span>
                      </p>
                      <p>
                        <span>故障时间</span>
                        <span>{repairs.faultTime}</span>
                      </p>
                      <p>
                        <span>故障描述</span>
                        <span>{repairs.faultDesc}</span>
                      </p>
                      <p>
                        <span>故障原因</span>
                        <span>{repairs.faultReason}</span>
                      </p>
                      <p>
                        <span>报修人名</span>
                        <span>{repairs.applyRepairUserName}</span>
                      </p>
                      <p>
                        <span>报修时间</span>
                        <span>{repairs.applyRepairTime}</span>
                      </p>
                      <p>
                        <span>维修类型</span>
                        <span>{repairs.repairTypeName}</span>
                      </p>
                      <p>
                        <span>维修人名</span>
                        <span>{repairs.repairUserName}</span>
                      </p>
                      <p>
                        <span>维修状态</span>
                        <span>{repairs.statusName}</span>
                      </p>
                      <p>
                        <span>维修内容</span>
                        <span>{repairs.repairContent}</span>
                      </p>

                      <p>
                        <span>维修开始时间</span>
                        <span>{repairs.repairStartTime}</span>
                      </p>
                      <p>
                        <span>维修结束时间</span>
                        <span>{repairs.repairEndTime}</span>
                      </p>
                      <p>
                        <span>验证人名</span>
                        <span>{repairs.confirmUserName}</span>
                      </p>
                      {/* 
                      <p>
                        <span>验证结果</span>
                        <span>{repairs.confirmResult}</span>
                      </p>
                      <p>
                        <span>验证说明</span>
                        <span>{repairs.confirmDesc}</span>
                      </p>
                      <p>
                        <span>验证时间</span>
                        <span>{repairs.confirmTime}</span>
                      </p> */}

                    </div> :
                    <Empty style={{ height: 430, display: "flex", justifyContent: "center", alignContent: "center", flexDirection: "column" }} />
                }

              </Card>
            </Col>
          </Row>
        </div>
        <CreateForm
          tableUrl={[{
            url: "pairqueryPageByUserId",
            post: {
              "pageIndex": 1,
              "pageSize": 9,
            }
          }]}
          confirmLoading={this.props.repair}
          fields={this.state.fields}
          iftype={iftype}
          onChange={this.handleFormChange}
          wrappedComponentRef={this.saveFormRef}
          visible={fv}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          onSelectChange={this.onSelectChange}
        />

      </div>
    )
  }


}

export default DeviceRepair



