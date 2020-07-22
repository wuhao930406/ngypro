import {
  Table, Input, InputNumber, Popconfirm, Form, Divider, Modal, Tree, Button, Row, Col, Icon, Select, Alert, Tag, message, Card
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import CreateForm from "@/components/CreateForm"
import SearchBox from '@/components/SearchBox'


@connect(({ sensor, loading }) => ({
  sensor,
  submitting: loading.effects['sensor/sensorListqueryList'],
}))
class SensorList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      iftype: {
        name: "",
        value: ""
      },
      fv: false,
      fields: {},
      /*初始化 main List */
      postData: {
        pageIndex: 1,
        pageSize: 9,
        sensorName: null,     // 传感器名称      
        sensorTypeId: null,   //  传感器类型id 
        sensorNo: null,  // 传感器编号 
        sensorMcuNo: null,   // mcu编号 
        uintName: null     // 单位类型的key 
      },
      postUrl: "sensorListqueryList",
      curitem: {}





    }
  }

  //设置新状态
  setNewState(type, values, fn) {
    const { dispatch } = this.props;
    dispatch({
      type: 'sensor/' + type,
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
this.props.ensureDidMount&&this.props.ensureDidMount()
    this.resetData()
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
        sensorName: {
          value: null,
          type: "input",
          title: "传感器名称",
          keys: "sensorName",
          requires: true
        },
        sensorTypeId: {
          value: null,
          type: "select",
          title: "传感器类型",
          keys: "sensorTypeId",
          requires: true,
          option: this.props.sensor.leafSensorType ? this.props.sensor.leafSensorType.map((item)=>{
            return {
              name:item.sensorTypeName,
              id:item.id
            }
          }) : []
        },
        sensorNo: {
          value: null,
          type: "input",
          title: "传感器编号",
          keys: "sensorNo",
          requires: true,
        },
        measuringRangeUpper: {
          value: null,
          type: "inputnumber",
          title: "测量范围上限",
          keys: "measuringRangeUpper",
          min:0,
          requires: true,
        },
        measuringRangeUnder: {
          value: null,
          type: "inputnumber",
          title: "测量范围下限",
          min:0,
          keys: "measuringRangeUnder",
          requires: true,
        },
        sensorMcuNo: {
          value: null,
          type: "input",
          title: "mcu编号",
          keys: "sensorMcuNo",
          requires: true,
        },
        sensorModel: {
          value: null,
          type: "input",
          title: "传感器型号",
          keys: "sensorModel",
          requires: true,
        },
        coefficient: {
          value: null,
          type: "inputnumber",
          title: "传感器系数",
          keys: "coefficient",
          requires: false,
        },
        uintName: {
          value: null,
          type: "input",
          title: "单位类型",
          keys: "uintName",
          requires: false,
        },
        observeObj: {
          value: null,
          type: "input",
          title: "测量对象",
          keys: "observeObj",
          requires: false,
        },
        channelNum: {
          value: null,
          type: "inputnumber",
          title: "通道数",
          keys: "channelNum",
          requires: false,
        },
        pictureUrl: {
          value: null,
          type: "upload",
          title: "传感器图片",
          keys: "pictureUrl",
          uploadtype: "image",
          
          requires: false,
          col: { span: 24 }
        },
        detailParams: {
          value: null,
          type: "textarea",
          title: "详细参数",
          keys: "detailParams",
          requires: false,
          col: { span: 24 }
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
          delete values[i];
        } else {
          if (i == "pictureUrl") {
            let last = values.pictureUrl[values.pictureUrl.length - 1];
            if (last.response) {
              values.pictureUrl = last.response.data.dataList[0] ? last.response.data.dataList[0] : ""
            } else {
              values.pictureUrl = null
            }
          }
        }
      }
      if (iftype.value == "edit") {
        let postData = { ...values, id: curitem.id };
        this.setNewState("sensorsave", postData, () => {
          message.success("修改成功！");
          this.resetData();
        });
      } else if (iftype.value == "add") {
        let postData = { ...values };
        this.setNewState("sensorsave", postData, () => {
          message.success("新增成功！");
          this.resetData();
        });
      }

    });
  }

  handleSearch = (selectedKeys, dataIndex) => {
    let { postUrl } = this.state;
    this.setState({ postData: { ...this.state.postData, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
      this.setNewState(postUrl, this.state.postData)
    });

  };

  onRefs = (ref) => {
    this.childs = ref;
  }


  render() {
    let { postData, postUrl, fv, fields, iftype, curitem } = this.state,
      { sensorListqueryList, sensorType, unitType } = this.props.sensor;

    let getsearchbox = (key) => {
      if (this.childs) {
        return this.childs.getColumnSearchProps(key)
      } else {
        return null
      }
    }, getselectbox = (key, option) => {
      if (this.childs) {
        return this.childs.getColumnSelectProps(key, option)
      } else {
        return null
      }
    }, gettreeselectbox = (key, option) => {
      if (this.childs) {
        return this.childs.getColumnTreeSelectProps(key, option)
      } else {
        return null
      }
    }

    const columns = [
      {
        title: '传感器名称',
        dataIndex: 'sensorName',
        key: 'sensorName',
        ...getsearchbox('sensorName')
      },
      {
        title: '传感器图片',
        dataIndex: 'pictureUrl',
        key: 'pictureUrl',
        render:(text)=> (text ? <img onClick={() => {
          Modal.info({
            maskClosable: true,
            title: `预览图片`,
            okText: "关闭",
            content: (
              <div style={{ width: "100%" }}>
                <img style={{ width: "100%", height: "auto", margin: "20px 0px" }} src={text} onError={(e) => { e.target.src = './images/default.png' }} />
              </div>
            ),
            onOk() { },
          });
        }} style={{ width: 30, height: 30, cursor: "pointer" }} src={text} onError={(e) => { e.target.src = './images/default.png' }} /> : <img onClick={() => {
          Modal.info({
            maskClosable: true,
            title: `预览图片`,
            okText: "关闭",
            content: (
              <div style={{ width: "100%" }}>
                <img style={{ width: "100%", height: "auto", margin: "20px 0px" }} src={'./images/default.png'} />
              </div>
            ),
            onOk() { },
          });
        }} style={{ width: 30, height: 30, cursor: "pointer" }} src={'./images/default.png'}/>)
      },
      {
        title: '传感器类型',
        dataIndex: 'sensorTypeName',
        key: 'sensorTypeName',
        ...gettreeselectbox('sensorTypeId', sensorType ? sensorType : [])
      },
      {
        title: '传感器编号',
        dataIndex: 'sensorNo',
        key: 'sensorNo',
        ...getsearchbox('sensorNo')
      },
      {
        title: 'mcu编号',
        dataIndex: 'sensorMcuNo',
        key: 'sensorMcuNo',
        ...getsearchbox('sensorMcuNo')
      },
      {
        title: '传感器型号',
        dataIndex: 'sensorModel',
        key: 'sensorModel',
      },
      {
        title: '测量范围上限',
        dataIndex: 'measuringRangeUpper',
        key: 'measuringRangeUpper',
      },
      {
        title: '测量范围下限',
        dataIndex: 'measuringRangeUnder',
        key: 'measuringRangeUnder',
      },
      {
        title: '系数',
        dataIndex: 'coefficient',
        key: 'coefficient',
      },
      {
        title: '单位类型名称',
        dataIndex: 'uintName',
        key: 'uintName',
      },
      {
        title: '测量对象',
        dataIndex: 'observeObj',
        key: 'observeObj',
      },
      {
        title: '详细参数',
        dataIndex: 'detailParams',
        key: 'detailParams',
      },
      {
        title: <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          通道数
        <a style={{ color: "#f50" }} onClick={() => {
            this.setState({
              postData: {
                pageIndex: 1,
                pageSize: 9,
                sensorName: null,     // 传感器名称      
                sensorTypeId: null,   //  传感器类型id 
                sensorNo: null,  // 传感器编号 
                sensorMcuNo: null,   // mcu编号 
                uintName: null     // 单位类型的key 
              }
            }, () => {
              this.resetData()
            })
          }}>
            <Icon type="reload" />
            重置
        </a>
        </span>,
        dataIndex: 'channelNum',
        key: 'channelNum',
      },


    ]

    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("sensorListqueryList", this.state.postData);
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
        <SearchBox onRef={this.onRefs} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
        <Card title='传感器列表' extra={
          <div>
            <a onClick={() => {
              this.setState({
                iftype: {
                  name: "新增",
                  value: "add"
                },
                fv: true
              })
            }}>新增</a>
            <span style={{ display: curitem.id ? "inline-block" : "none" }}>
              <Divider type="vertical"></Divider>
              <a onClick={() => {
                 let arrurl = curitem.pictureUrl ? curitem.pictureUrl.split(".") : ["demo", "png"];
                this.setState({
                  fv: true,
                  iftype: {
                    name: "修改传感器",
                    value: "edit"
                  },
                  fields: {
                    sensorName: {
                      ...fields.sensorName,
                      value: curitem.sensorName,
                    },
                    sensorTypeId: {
                      ...fields.sensorTypeId,
                      value: curitem.sensorTypeId,
                    },
                    sensorNo: {
                      ...fields.sensorNo,
                      value: curitem.sensorNo,
                    },
                    measuringRangeUpper: {
                      ...fields.measuringRangeUpper,
                      value: curitem.measuringRangeUpper,
                    },
                    measuringRangeUnder: {
                      ...fields.measuringRangeUnder,
                      value: curitem.measuringRangeUnder,
                    },
                    sensorMcuNo: {
                      ...fields.sensorMcuNo,
                      value: curitem.sensorMcuNo,
                    },
                    sensorModel: {
                      ...fields.sensorModel,
                      value: curitem.sensorModel,
                    },
                    coefficient: {
                      ...fields.coefficient,
                      value: curitem.coefficient,
                    },
                    uintName: {
                      ...fields.uintName,
                      value: curitem.uintName,
                    },
                    observeObj: {
                      ...fields.observeObj,
                      value: curitem.observeObj,
                    },
                    channelNum: {
                      ...fields.channelNum,
                      value: curitem.channelNum,
                    },
                    pictureUrl: {
                      ...fields.pictureUrl,
                      defaultval: curitem.pictureUrl ? [{
                        url: curitem.pictureUrl,
                        name: curitem.sensorName + "." + arrurl[arrurl.length - 1]
                      }] : "",
                      value: [{
                        "uid": "rc-upload-1564018868008-19",
                        "lastModified": 1560823806880,
                        "name": "demos.png",
                        "size": 2817,
                        "type": "image/png",
                        "percent": 100,
                        "originFileObj": {
                          "uid": "rc-upload-1564018868008-19"
                        },
                        "status": "done",
                        "response": {
                          "code": "0000",
                          "msg": "成功",
                          "data": {
                            "dataList": curitem.pictureUrl ? [curitem.pictureUrl] : ""
                          }
                        }
                      }]
                    },
                    detailParams: {
                      ...fields.detailParams,
                      value: curitem.detailParams,
                    }
                  },
                })
              }}>修改</a>
              <Divider type="vertical"></Divider>
              <Popconfirm
                okText="确认"
                cancelText="取消"
                placement="bottomRight"
                title={"确认删除该传感器？"}
                onConfirm={() => {
                  this.setNewState("sensordeleteById", { id: curitem.id }, () => {
                    let total = this.props.sensor.sensorListqueryList.total,
                      page = this.props.sensor.sensorListqueryList.pageNum;
                    if ((total - 1) % 9 == 0) {
                      page = page - 1
                    }

                    this.setState({
                      postData: { ...this.state.postData, pageIndex: page }
                    }, () => {
                      this.setNewState("sensorListqueryList", postData, () => {
                        message.success("删除成功！");
                      });
                    })
                  })
                }}>
                <a style={{ color: "#ff4800" }}>删除</a>
              </Popconfirm>
            </span>
          </div>
        }>
          <Table size="middle" 
            
            loading={this.props.submitting}
            onRow={record => {
              return {
                onClick: event => {
                  this.setState({ curitem: record });
                }, // 点击行
              };
            }}
            rowClassName={(record, index) => rowClassNameFn(record, index)}
            pagination={{ showTotal:total=>`共${total}条`, // 分页
              size: "small",
              pageSize: 9,
              showQuickJumper: true,
              current: sensorListqueryList.pageNum ? sensorListqueryList.pageNum : 1,
              total: sensorListqueryList.total ? parseInt(sensorListqueryList.total) : 1,
              onChange: pageChange,
            }}
            rowKey='id'
            columns={columns}
            dataSource={sensorListqueryList.list ? sensorListqueryList.list : []}
          >
          </Table>

          <CreateForm
            width={1000}
            col={{ xs: 24, sm: 24, md: 12, lg: 12, xl: 12, xxl: 12 }}
            fields={fields}
            iftype={iftype}
            onChange={this.handleFormChange}
            wrappedComponentRef={this.saveFormRef}
            visible={fv}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
          />

        </Card>
      </div>
    )
  }


}

export default SensorList



