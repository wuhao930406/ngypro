import {
  Table, Input, InputNumber, Popconfirm, Form, Divider, Modal, Tree, Button, Row, Col, Icon, Select, Alert, Tag, message, Card, Empty,
  Transfer, Switch
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import SearchBox from '@/components/SearchBox'
import CreateForm from "@/components/CreateForm"

import Abload from '@/components/Abload';
import Link from 'umi/link';
const FormItem = Form.Item;
const Search = Input.Search;
const { TreeNode } = Tree;
const InputGroup = Input.Group;
const { Option } = Select;


@connect(({ sensor, loading }) => ({
  sensor,
  submitting: loading.effects['sensor/devicequeryList'],
  submittings: loading.effects['sensor/sensorqueryNoList'],
  submittingc: loading.effects['sensor/sensorqueryYesList'],
  submittingd: loading.effects['sensor/datagatequery'],
}))
class SensorLink extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      collectionName: "",
      iftype: {
        name: "",
        value: ""
      },
      fv: false,
      /*初始化 main List */
      postData: {
        "pageIndex": 1,                          //（int）页码
        "pageSize": 9,                           //（int）条数
        "status": undefined,                             //（String）设备状态key
        "equipmentTypeId": undefined,  //（int）设备类型id
        "equipmentNo": "",                    //（String）设备编号
        "equipmentName": '',              //（String）设备名称
        "departmentId": undefined      //（int）部门id
      },
      postDatas: {
        "pageIndex": 1,    //当前页码 *
        "pageSize": 9,   // 每页条数 *
        "equipmentId": "",  //设备id *
        "sensorName": "",     // 传感器名称      
        "sensorTypeId": "",   //  传感器类型id 
        "sensorNo": "",  // 传感器编号 
        "sensorMcuNo": ""   // mcu编号 
      },
      postDatac: {
        "pageIndex": 1,    //当前页码 *
        "pageSize": 9,   // 每页条数 *
        "equipmentId": "",  //设备id *
        "sensorName": "",     // 传感器名称      
        "sensorTypeId": "",   //  传感器类型id 
        "sensorNo": "",  // 传感器编号 
        "sensorMcuNo": ""   // mcu编号 
      },
      postDatad: {
        pageIndex: 1,
        pageSize: 9,
        name: null,     // 传感器名称      
        model: null,   //  传感器类型id 
        manufactory: null,  // 传感器编号 
      },
      postUrl: "devicequeryList",
      curitem: {},
      charge: "",
      selectedRowKeys: [],
      selectedRowKeyc: [],
      selectedRowKeyd: [],
      ids: []
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
          if (i == "isUse" && obj.value == "1") {
            fields.sortOrder.requires = true;
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
      fvs: false,
      fields: {}
    });
  }

  /*form 提交*/
  handleCreate = () => {
    const form = this.formRef.props.form;
    let { curitem, iftype, curitemz } = this.state;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      for (let i in values) {
        if (!values[i]) {
          delete values[i];
        } else {

        }
      }
      if (iftype.value == "connectIt") {
        let postData = { ...values, equipmentId: curitem.id, parameterId: curitemz.parameterId, id: curitemz.id };
        this.setNewState("queryAllsave", postData, () => {
          message.success("关联成功！");
          this.handleCancel();
          this.regetdata()
        });
      } else {
        let postData = { ...values, id: curitem.id };
        this.setNewState("equipmentSensorupdate", postData, () => {
          message.success("修改成功！");
          this.handleCancel();
        });
      }

    });
  }


  onSelectChanges = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  onSelectChangec = selectedRowKeys => {
    this.setState({ selectedRowKeyc: selectedRowKeys });
  };

  onSelectChanged = (selectedRowKeys, selectedRow) => {
    this.setState({ selectedRowKeyd: selectedRowKeys, selectedRow });
  };

  resetData() {
    let { postUrl, postData } = this.state;
    this.setNewState(postUrl, postData, () => {
    })
  }

  componentDidMount() {
this.props.ensureDidMount&&this.props.ensureDidMount()
    this.resetData();
    this.setNewState('deviceTypequeryTreeList', null);
    this.setNewState("datagatequery", this.state.postDatad)
  }

  refreshData(ifs) {
    let { ids, selectedRowKeys, selectedRowKeyc, charge, postDatas, postDatac } = this.state;
    let haveId = JSON.parse(JSON.stringify(ids))
    if (ifs) {
      selectedRowKeys.map((item) => {
        haveId.push(item)
      });
    } else {
      haveId = haveId.filter((item) => { return selectedRowKeyc.indexOf(item) == -1 });
    }

    this.setNewState("sensorYeahsave", {
      "equipmentId": charge,
      "haveSenIds": haveId
    }, () => {
      message.success("操作成功");
      this.setNewState("sensorqueryNoList", postDatas);
      this.setNewState("sensorqueryYesList", postDatac, () => {
        let res = this.props.sensor.sensorqueryYesList.list;
        this.setState({
          ids: res ? res[0].ids : [],
          selectedRowKeyc: [],
          selectedRowKeys: []
        }, () => {
          this.resetData();
        })
      });


    })

  }

  handleSearch = (selectedKeys, dataIndex) => {
    let { postUrl } = this.state;
    this.setState({ postData: { ...this.state.postData, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
      this.setNewState(postUrl, this.state.postData)
    });
  };
  handleSearchs = (selectedKeys, dataIndex) => {
    let postUrl = "sensorqueryNoList";
    this.setState({ postDatas: { ...this.state.postDatas, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
      this.setNewState(postUrl, this.state.postDatas)
    });
  };
  handleSearchc = (selectedKeys, dataIndex) => {
    let postUrl = "sensorqueryYesList";
    this.setState({ postDatac: { ...this.state.postDatac, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
      this.setNewState(postUrl, this.state.postDatac)
    });
  };
  handleSearchd = (selectedKeys, dataIndex) => {
    let postUrl = "datagatequery";
    this.setState({ postDatad: { ...this.state.postDatad, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
      this.setNewState(postUrl, this.state.postDatad)
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
  onRefd = (ref) => {
    this.childd = ref;
  }

  regetdata() {
    let { curitem } = this.state, { search, devicequeryList, userList, sensorqueryNoList, sensorqueryYesList, queryByEquipmentId, deviceTypequeryTreeList, sensorType, datagatequery, equipmentSensor } = this.props.sensor;

    this.setNewState("equipmentSensor", { equipmentId: curitem.id }, () => {
    })

    this.setNewState("queryByEquipmentId", { equipmentId: curitem.id }, () => {
      let { queryByEquipmentId } = this.props.sensor;
      console.log(queryByEquipmentId.data)
      this.setState({
        selectedRowKeyd: [queryByEquipmentId.data ? queryByEquipmentId.data.dataGatewayId : null],
        collectionName: queryByEquipmentId.data ? queryByEquipmentId.data.collectionName : null,
        selectedRow: [{
          name: queryByEquipmentId.data ? queryByEquipmentId.data.name : ""
        }]
      })
    })
  }

  render() {
    let { postData, postUrl, fv, fields, iftype, curitem, charge, selectedRowKeys, selectedRowKeyc, selectedRowKeyd, postDatas, postDatac } = this.state,
      { search, devicequeryList, userList, sensorqueryNoList, sensorqueryYesList, queryByEquipmentId, deviceTypequeryTreeList, sensorType, datagatequery, equipmentSensor } = this.props.sensor;
    const rowSelections = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectChanges,
    }
    const rowSelectionc = {
      selectedRowKeys: this.state.selectedRowKeyc,
      onChange: this.onSelectChangec,
    }
    const rowSelectiond = {
      selectedRowKeys: this.state.selectedRowKeyd,
      onChange: this.onSelectChanged,
      type: "radio"
    }

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
    }, gettreeselectbox = (key, option) => {
      if (this.child) {
        return this.child.getColumnTreeSelectProps(key, option)
      } else {
        return null
      }
    }, getsearchboxs = (key) => {
      if (this.childs) {
        return this.childs.getColumnSearchProps(key)
      } else {
        return null
      }
    }, gettreeselectboxs = (key, option) => {
      if (this.childs) {
        return this.childs.getColumnTreeSelectProps(key, option)
      } else {
        return null
      }
    }, getsearchboxc = (key) => {
      if (this.childc) {
        return this.childc.getColumnSearchProps(key)
      } else {
        return null
      }
    }, gettreeselectboxc = (key, option) => {
      if (this.childc) {
        return this.childc.getColumnTreeSelectProps(key, option)
      } else {
        return null
      }
    }, getsearchboxd = (key) => {
      if (this.childd) {
        return this.childd.getColumnSearchProps(key)
      } else {
        return null
      }
    };



    const columns = [
      {
        title: '设备编号',
        dataIndex: 'equipmentNo',
        key: 'equipmentNo',
        ...getsearchbox('equipmentNo')
      },
      {
        title: '设备名称',
        dataIndex: 'equipmentName',
        key: 'equipmentName',
        ...getsearchbox('equipmentName')
      },
      {
        title: '设备位置号',
        dataIndex: 'positionNo',
        key: 'positionNo',
        ...getsearchbox('positionNo')
      },
      {
        title: '设备类型',
        dataIndex: 'equipmentTypeName',
        key: 'equipmentTypeName',
        ...gettreeselectbox('equipmentTypeId', search.equipmentTypeTreeList ? search.equipmentTypeTreeList : []),
      },
      {
        title: '设备状态',
        dataIndex: 'statusName',
        key: 'statusName',
        ...getselectbox('status', search.equipmentStatusList),
        render: (text, record) => <a style={{
          color: record.status == 0 ? "green" :
            record.status == 1 ? "#0e6eb8" :
              record.status == 2 ? "#999" :
                record.status == 5 ? "#ff5000" :
                  "lightred"
        }}>{text}</a>
      },

      {
        title: '设备型号',
        dataIndex: 'equipmentModel',
        key: 'equipmentModel',
      },
      {
        title: '所在部门',
        dataIndex: 'departmentName',
        key: 'departmentName',
        ...gettreeselectbox('departmentId', search.departmentDataList ? search.departmentDataList : [])
      },
      {
        title: '所在车间',
        dataIndex: 'shopName',
        key: 'shopName',
        ...getselectbox('shopId', search.shopList ? search.shopList.map(item => {
          return {
            dicName: item.shopName,
            dicKey: item.id
          }
        }) : [])
      },
      {
        title: '所在分组',
        dataIndex: 'groupName',
        key: 'groupName',
      },
      {
        title: '能耗(kw/h)',
        dataIndex: 'energyConsumption',
        key: 'energyConsumption',
      },
      {
        title: '价值(万元)',
        dataIndex: 'equipmentWorth',
        key: 'equipmentWorth',
      },
      {
        title: '购买日期',
        dataIndex: 'purchaseDate',
        key: 'purchaseDate',
      },
      {
        title: '品牌',
        dataIndex: 'brand',
        key: 'brand',
      },
      {
        title: '参数',
        dataIndex: 'parameters',
        key: 'parameters',
      },
      {
        title: '图片',
        dataIndex: 'pictureUrl',
        key: 'pictureUrl',
        render: (text, record) => (text ? <img onClick={() => {
          Modal.info({
            maskClosable: true,
            title: `预览${record.equipmentName}的图片`,
            okText: "关闭",
            content: (
              <div style={{ width: "100%" }}>
                <img style={{ width: "100%", height: "auto", margin: "20px 0px" }} src={text} onError={(e) => { e.target.src = './images/default.png' }} />
              </div>
            ),
            onOk() { },
          });

        }} style={{ width: 30, height: 30, cursor: "pointer" }} src={text} onError={(e) => { e.target.src = './images/default.png' }} /> : "")
      },
      {
        title: <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          二维码
          <a style={{ color: "#f50" }} onClick={() => {
            this.setState({
              postData: {
                "pageIndex": 1, //（int）页码
                "pageSize": 9, //（int）条数
                "status": undefined, //（String）设备状态key
                "equipmentTypeId": '', //（int）设备类型id
                "equipmentNo": "", //（String）设备编号
                "equipmentName": '', //（String）设备名称
                "departmentId": undefined
              } //（int）部门id}
            }, () => {
              this.setNewState('devicequeryList', this.state.postData);
            })
          }}>
            <Icon type="reload" />
            重置
          </a>
        </span>,
        dataIndex: 'qrCodeUrl',
        key: 'qrCodeUrl',
        render: (text, record) => (text ? <img onClick={() => {
          Modal.info({
            maskClosable: true,
            title: `预览${record.equipmentName}的二维码`,
            okText: "关闭",
            content: (
              <div style={{ width: "100%" }}>
                <img style={{ width: "100%", height: "auto", margin: "20px 0px" }} src={text} onError={(e) => { e.target.src = './images/default.png' }} />
              </div>
            ),
            onOk() { },
          });
        }} style={{ width: 30, height: 30, cursor: "pointer" }} src={text} onError={(e) => { e.target.src = './images/default.png' }} /> : ""),
      }
    ];

    const columnes = [
      {
        title: '传感器名称',
        dataIndex: 'sensorName',
        key: 'sensorName',
        ...getsearchboxs("sensorName")
      },
      {
        title: '传感器类型',
        dataIndex: 'sensorTypeName',
        key: 'sensorTypeName',
        ...gettreeselectboxs("sensorTypeId", sensorType)
      },
      {
        title: '传感器编号',
        dataIndex: 'sensorNo',
        key: 'sensorNo',
        ...getsearchboxs("sensorNo")
      },
      {
        title: 'mcu编号',
        dataIndex: 'sensorMcuNo',
        key: 'sensorMcuNo',
        ...getsearchboxs("sensorMcuNo")
      },
    ]
    const columnec = [
      {
        title: '传感器名称',
        dataIndex: 'sensorName',
        key: 'sensorName',
        ...getsearchboxc("sensorName")
      },
      {
        title: '传感器类型',
        dataIndex: 'sensorTypeName',
        key: 'sensorTypeName',
        ...gettreeselectboxc("sensorTypeId", sensorType)
      },
      {
        title: '传感器编号',
        dataIndex: 'sensorNo',
        key: 'sensorNo',
        ...getsearchboxc("sensorNo")
      },
      {
        title: 'mcu编号',
        dataIndex: 'sensorMcuNo',
        key: 'sensorMcuNo',
        ...getsearchboxc("sensorMcuNo")
      },


    ]
    const columned = [
      {
        title: '网关名',
        dataIndex: 'name',
        key: 'name',
        ...getsearchboxd('name')
      },
      {
        title: '型号',
        dataIndex: 'model',
        key: 'model',
        ...getsearchboxd('model')
      },
      {
        title: '厂家',
        dataIndex: 'manufactory',
        key: 'manufactory',
        ...getsearchboxd('manufactory')
      },
    ]


    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("devicequeryList", this.state.postData);
      })
    }
    let pageChanges = (page) => {
      this.setState({
        postDatas: { ...this.state.postDatas, pageIndex: page }
      }, () => {
        this.setNewState("sensorqueryNoList", this.state.postDatas);
      })
    }
    let pageChangec = (page) => {
      this.setState({
        postDatac: { ...this.state.postDatac, pageIndex: page }
      }, () => {
        this.setNewState("sensorqueryYesList", this.state.postDatac);
      })
    }
    
    let pageChanged = (page) => {
      this.setState({
        postDatad: { ...this.state.postDatad, pageIndex: page }
      }, () => {
        this.setNewState("datagatequery", this.state.postDatad);
      })
    }

    const rowClassNameFn = (record, index) => {
      const { curitem } = this.state;
      if (curitem && curitem.id === record.id) {
        return "selectedRow";
      }
      return null;
    };


    const expandedRowRender = (record) => {
      const columns = [
        {
          title: '物理含义',
          dataIndex: 'physicalMeaning',
          key: 'physicalMeaning',
        },
        {
          title: '数值类型',
          dataIndex: 'valueTypeName',
          key: 'valueTypeName',
        },
        {
          title: '高亮预警值',
          dataIndex: 'earlyWarningValue',
          key: 'earlyWarningValue',
        },
        {
          title: '展示方式',
          dataIndex: 'showTypeName',
          key: 'showTypeName',
        },
        {
          title: '展示顺序',
          dataIndex: 'sortOrder',
          key: 'sortOrder',
        },
        {
          title: '是否启用',
          dataIndex: 'isUse',
          key: 'isUse',
          render: (text) => <span>{text == "1" ? "已启用" : text == "0" ? "未启用" : "未关联"}</span>
        },

        {
          title: '参数',
          dataIndex: 'parameterValueList',
          key: 'parameterValueList',
          render: (text, items) => items.parameterValueList && items.parameterValueList.map(item => <p style={{ marginBottom: 6 }}><span>参数值:{item.value}</span> <Divider type='vertical'></Divider>  <span>物理含义:{item.physicalMeaning}</span></p>)
        },
        {
          title: "关联设备",
          dataIndex: 'action',
          key: 'action',
          render: (text, record) => <a onClick={() => {
            this.setState({
              fields: {
                sortOrder: {
                  value: record.sortOrder && record.sortOrder,
                  type: "inputnumber",
                  title: "展示顺序",
                  keys: "sortOrder",
                  min: 0,
                  requires: true
                },
                showType: {
                  value: record.showType && record.showType.toString(),
                  type: "select",
                  title: "展示方式",
                  keys: "showType",
                  requires: true,
                  option: queryByEquipmentId.showTypeList && queryByEquipmentId.showTypeList.map((item) => {
                    return {
                      name: item.dicName,
                      id: item.dicKey
                    }
                  })
                },
                isUse: {
                  value: record.isUse && record.isUse.toString(),
                  type: "select",
                  title: "是否启用",
                  keys: "isUse",
                  requires: true,
                  option: [
                    {
                      name: "未启用",
                      id: "0"
                    },
                    {
                      name: "已启用",
                      id: "1"
                    },
                  ]
                },


              },
              fvs: true,
              iftype: {
                name: "该参数关联设备",
                value: "connectIt"
              },
              curitemz: record
            })

          }}>关联设备</a>
        }
      ];

      return <Table columns={columns} dataSource={record.secodeParameterList} pagination={false} />;
    };

    let renderAdd = (record) => {
      let data = this.props.sensor.equipmentSensor;
      return <Table
        dataSource={data}
        rowKey='id'
        columns={[
          {
            title: '传感器名称',
            dataIndex: 'sensorName',
            key: 'sensorName',
          },
          {
            title: '传感器编号',
            dataIndex: 'sensorNo',
            key: 'sensorNo',
          },
          {
            title: 'mcu编号',
            dataIndex: 'sensorMcuNo',
            key: 'sensorMcuNo',
          },
          {
            title: '负载范围',
            dataIndex: 'loadRangeUpper',
            key: 'loadRangeUpper',
            render: (text, record) => <span>{record.loadRangeUpper}~{record.loadRangeUnder}</span>
          },
          {
            title: '展示顺序',
            dataIndex: 'sortOrder',
            key: 'sortOrder',
          },
          {
            title: '是否关联',
            dataIndex: 'isUse',
            key: 'isUse',
            render: (text, record) => <Switch checkedChildren="已关联" unCheckedChildren="未关联" checked={text == "1" ? true : false} onChange={(checked, event) => {
              this.setNewState("equipmentSensorupdate", { isUse: checked ? "1" : "0", id: record.id, sortOrder: record.sortOrder }, () => {
                console.log(record)
                this.setNewState("equipmentSensor", { equipmentId: this.props.sensor.equipmentId })
              })
            }} />
          },
          {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (text, item, i) => (
              <a onClick={() => {
                this.setState({
                  fvs: true,
                  iftype: {
                    name: "修改",
                    value: "exchange"
                  },
                  curitem: item,
                  fields: {
                    loadRangeUpper: {
                      value: item.loadRangeUpper,
                      type: "inputnumber",
                      title: "负载范围(上限)",
                      keys: "loadRangeUpper",
                      requires: false
                    },
                    loadRangeUnder: {
                      value: item.loadRangeUnder,
                      type: "inputnumber",
                      title: "负载范围(下限)",
                      keys: "loadRangeUnder",
                      requires: false
                    },
                    isUse: {
                      value: item.isUse,
                      type: "select",
                      title: "是否关联",
                      keys: "isUse",
                      requires: true,
                      option: [{
                        name: "未关联",
                        id: 0
                      }, {
                        name: "已关联",
                        id: 1
                      }]
                    },
                    sortOrder: {
                      value: item.sortOrder,
                      type: "inputnumber",
                      title: "展示顺序",
                      keys: "sortOrder",
                      requires: false
                    },
                  }
                })

              }}>修改</a>
            )
          },
        ]}
        pagination={{
          showTotal: total => `共${total}条`, // 分页
          size: "small",
          pageSize: 10,
          showQuickJumper: true,
        }}
        scroll={{ x: "100%", y: "800px" }}
      >
      </Table>
    }

    return (
      <div>
        <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
        <SearchBox onRef={this.onRefs} handleSearch={this.handleSearchs} postData={this.state.postDatas}></SearchBox>
        <SearchBox onRef={this.onRefc} handleSearch={this.handleSearchc} postData={this.state.postDatac}></SearchBox>
        <SearchBox onRef={this.onRefd} handleSearch={this.handleSearchd} postData={this.state.postDatad}></SearchBox>

        <Card title='设备列表' extra={
          <div style={{ display: "flex", alignItems: "center", userSelect: "none" }}>
            
            <span style={{ display: curitem.id ? "inline-block" : "none" }}>
              <Link to={`/asd/sensor/datagatechart/${curitem.id}/${curitem.equipmentName}`}>
                参数图表
              </Link>
              <Divider type="vertical"></Divider>
            </span>

            <span style={{ display: curitem.id ? "inline-block" : "none" }}>
              <Link to={`/asd/sensor/sensorchart/${curitem.id}/${curitem.equipmentName}`}>
                传感器图表
              </Link>
              <Divider type="vertical"></Divider>
            </span>

            <a style={{ display: curitem.id ? "inline-block" : "none", color: fv && iftype.value == "add" ? "red" : "#0e6eb8", userSelect: "none" }} onClick={() => {
              this.setState({
                iftype: {
                  name: "设备添加传感器",
                  value: "add"
                },
                fv: iftype.value == "add" ? !fv : true
              }, () => {
                this.setNewState("sensorqueryNoList", this.state.postDatas);
                this.setNewState("sensorqueryYesList", this.state.postDatac, () => {
                  let res = this.props.sensor.sensorqueryYesList.list;
                  this.setState({
                    ids: res ? res[0].ids : []
                  })
                });
              })
            }}>{"添加传感器"} <Divider type="vertical"></Divider></a>

            <a style={{ display: curitem.id ? "inline-block" : "none", color: fv && iftype.value == "addzom" ? "red" : "#0e6eb8", userSelect: "none" }} onClick={() => {
              this.setState({
                iftype: {
                  name: "添加网关",
                  value: "addzom"
                },
                fv: iftype.value == "addzom" ? !fv : true
              }, () => {

                this.regetdata()


              })
            }}>{"添加网关"}</a>


          </div>


        }>
          <div style={{ height: fv ? "auto" : 0, overflow: "hidden", transition: "all 0.4s" }}>
            {
              iftype.value == "add" ?
                <div>
                  <p>设备{curitem.equipmentName}：</p>
                  <div style={{ height: charge ? 0 : 700, overflow: "hidden", marginTop: charge ? 0 : 24, transition: "all 0.4s", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Empty description={
                      <span>
                        请先选择 <a>设备<Icon type="arrow-up" /></a>
                      </span>
                    } />
                  </div>
                  <Row gutter={24} style={{ height: charge ? 700 : 0, overflow: "hidden", transition: "all 0.4s" }}>
                    <Col span={11} style={{ height: 700 }}>
                      <Card style={{ height: 640 }} title={<span>未选择的设备 <a style={{ color: "#f50", fontSize: 14 }} onClick={() => {
                        this.setState({
                          postDatas: {
                            ...postDatas,
                            "pageIndex": 1,//int 当前页码*
                            "pageSize": 9,//int 每页条数*
                            "equipmentNo": "",
                            "equipmentName": "",
                            "equipmentTypeId": "",
                            "positionNo": ""
                          }
                        }, () => {
                          this.setNewState('sensorqueryNoList', this.state.postDatas);
                        })
                      }}>
                        <Icon type="reload" style={{ paddingRight: 4, paddingLeft: 8 }} />
                  重置
          </a></span>} extra={<span>选中了<a>{this.state.selectedRowKeys.length}</a>台设备</span>}>
                        <Table size="middle"
                          rowSelection={rowSelections}
                          dataSource={sensorqueryNoList.list ? sensorqueryNoList.list : []}
                          loading={this.props.submittings}
                          pagination={{
                            showTotal: total => `共${total}条`, // 分页
                            size: "small",
                            pageSize: 9,
                            showQuickJumper: true,
                            current: sensorqueryNoList.pageNum ? sensorqueryNoList.pageNum : 1,
                            total: sensorqueryNoList.total ? parseInt(sensorqueryNoList.total) : 1,
                            onChange: pageChanges,
                          }}
                          rowKey='id'
                          columns={columnes}
                        >

                        </Table>

                      </Card>
                    </Col>
                    <Col span={2} style={{ height: 700, display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                      <Button type="primary" shape="circle" icon="double-right" size="small" style={{ marginBottom: 24 }} disabled={selectedRowKeys.length == 0} onClick={() => { this.refreshData(true) }} />
                      <Button type="primary" shape="circle" icon="double-left" size="small" disabled={selectedRowKeyc.length == 0} onClick={() => { this.refreshData(false) }} />
                    </Col>
                    <Col span={11} style={{ height: 700 }}>
                      <Card style={{ height: 640 }} title={<a>已选择的设备
                  <a style={{ color: "#f50", fontSize: 14 }} onClick={() => {
                          this.setState({
                            postDatac: {
                              ...postDatac,
                              "pageIndex": 1,//int 当前页码*
                              "pageSize": 9,//int 每页条数*
                              "equipmentNo": "",
                              "equipmentName": "",
                              "equipmentTypeId": "",
                              "positionNo": ""
                            }
                          }, () => {
                            this.setNewState("sensorqueryYesList", this.state.postDatac, () => {
                              let res = this.props.sensor.sensorqueryYesList.list;
                              this.setState({
                                ids: res ? res[0].ids : []
                              })
                            });
                          })
                        }}>
                          <Icon type="reload" style={{ paddingRight: 4, paddingLeft: 8 }} />
                    重置
                  </a>
                      </a>} extra={<span>选中了<a>{this.state.selectedRowKeyc.length}</a>设备</span>}>
                        <Table size="middle"
                          rowSelection={rowSelectionc}
                          dataSource={sensorqueryYesList.list ? sensorqueryYesList.list : []}
                          loading={this.props.submittingc}
                          pagination={{
                            showTotal: total => `共${total}条`, // 分页
                            size: "small",
                            pageSize: 9,
                            showQuickJumper: true,
                            current: sensorqueryYesList.pageNum ? sensorqueryYesList.pageNum : 1,
                            total: sensorqueryYesList.total ? parseInt(sensorqueryYesList.total) : 1,
                            onChange: pageChangec,
                          }}
                          rowKey='id'
                          columns={columnec}
                        >
                        </Table>
                      </Card>

                    </Col>
                  </Row>
                </div> :
                <div>
                  {renderAdd()}

                  <Row>
                    <Col sm={24} xl={12}>
                      <p>设备{curitem.equipmentName}：</p>
                    </Col>
                    <Col sm={24} xl={12} style={{ display: "flex", justifyContent: "flex-end" }}>
                      {
                        queryByEquipmentId.data ? <a style={{ userSelect: "none" }} onClick={() => {
                          let { queryByEquipmentId } = this.props.sensor
                          this.setNewState("datasave", {
                            collectionName: this.state.collectionName,
                            equipmentId: curitem.id,
                            dataGatewayId: selectedRowKeyd[0],
                            id: queryByEquipmentId.data ? queryByEquipmentId.data.id : null
                          }, () => {
                            message.success("修改成功！");
                            this.setNewState("queryByEquipmentId", { equipmentId: curitem.id })

                          })
                        }}>修改</a> :
                          <a style={{ userSelect: "none", display: selectedRowKeyd.length > 0 ? "inline-block" : "none", color: "red" }} onClick={() => {
                            this.setNewState("datasave", {
                              collectionName: this.state.collectionName,
                              equipmentId: curitem.id,
                              dataGatewayId: selectedRowKeyd[0]
                            }, () => {
                              message.success("添加成功！")
                              this.setNewState("queryByEquipmentId", { equipmentId: curitem.id })
                            })

                          }}>新增</a>
                      }

                    </Col>
                  </Row>
                  <Row style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Col style={{ width: 64 }}><label>网关编号:</label></Col>
                    <Col style={{ flex: 1 }}><Input style={{ marginBottom: 12, marginTop: 12 }} value={this.state.collectionName} onChange={(e) => {
                      this.setState({
                        collectionName: e.target.value
                      })
                    }} placeholder="网关编号"></Input></Col>
                  </Row>


                  <Table size="middle"
                    rowSelection={rowSelectiond}
                    dataSource={datagatequery.list ? datagatequery.list : []}
                    loading={this.props.submittingd}
                    pagination={{
                      showTotal: total => `共${total}条`, // 分页
                      size: "small",
                      pageSize: 9,
                      showQuickJumper: true,
                      current: datagatequery.pageNum ? datagatequery.pageNum : 1,
                      total: datagatequery.total ? parseInt(datagatequery.total) : 1,
                      onChange: pageChanged,
                    }}
                    rowKey='id'
                    columns={columned}
                  >
                  </Table>
                  {
                    this.state.selectedRow ? <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <p style={{ textAlign: "center", padding: 12, backgroundColor: "lightgrey", flex: 1 }}>当前选择：{this.state.selectedRow[0].name}</p>
                    </div> : null
                  }


                  <p style={{ marginTop: 18 }}>参数列表：</p>
                  <Table
                    columns={[
                      {
                        title: '参数类型',
                        dataIndex: 'parameterTypeName',
                        key: 'parameterTypeName',
                      },
                      {
                        title: '二级参数类型',
                        dataIndex: 'secondParameterType',
                        key: 'secondParameterType',
                      },
                      {
                        title: '高亮预警值',
                        dataIndex: 'earlyWarningValue',
                        key: 'earlyWarningValue',
                      },
                      {
                        title: '参数key',
                        dataIndex: 'parameterKey',
                        key: 'parameterKey',
                      },
                      {
                        title: '物理含义',
                        dataIndex: 'physicalMeaning',
                        key: 'physicalMeaning',
                      },
                      {
                        title: '数值类型',
                        dataIndex: 'valueTypeName',
                        key: 'valueTypeName',
                      },
                      {
                        title: '单位',
                        dataIndex: 'unit',
                        key: 'unit',
                      },
                      {
                        title: '展示方式',
                        dataIndex: 'showTypeName',
                        key: 'showTypeName',
                      },
                      {
                        title: '展示顺序',
                        dataIndex: 'sortOrder',
                        key: 'sortOrder',
                      },
                      {
                        title: '是否启用',
                        dataIndex: 'isUse',
                        key: 'isUse',
                        render: (text) => <span>{text == "1" ? "已启用" : text == "0" ? "未启用" : "未关联"}</span>
                      },
                      {
                        title: '参数',
                        dataIndex: 'parameterValueList',
                        key: 'parameterValueList',
                        render: (text, record) => record.parameterValueList && record.parameterValueList.map(item => <p style={{ marginBottom: 6 }}><span>参数值:{item.value}</span> <Divider type='vertical'></Divider>  <span>物理含义:{item.physicalMeaning}</span></p>)
                      },
                      {
                        title: "关联设备",
                        dataIndex: 'action',
                        key: 'action',
                        render: (text, record) => <a onClick={() => {
                          this.setState({
                            fields: {
                              sortOrder: {
                                value: record.sortOrder && record.sortOrder,
                                type: "inputnumber",
                                title: "展示顺序",
                                keys: "sortOrder",
                                min: 0,
                                requires: true
                              },
                              showType: {
                                value: record.showType && record.showType.toString(),
                                type: "select",
                                title: "展示方式",
                                keys: "showType",
                                requires: true,
                                option: queryByEquipmentId.showTypeList && queryByEquipmentId.showTypeList.map((item) => {
                                  return {
                                    name: item.dicName,
                                    id: item.dicKey
                                  }
                                })
                              },
                              isUse: {
                                value: record.isUse && record.isUse.toString(),
                                type: "select",
                                title: "是否启用",
                                keys: "isUse",
                                requires: true,
                                option: [
                                  {
                                    name: "未启用",
                                    id: "0"
                                  },
                                  {
                                    name: "已启用",
                                    id: "1"
                                  },
                                ]
                              },


                            },
                            fvs: true,
                            iftype: {
                              name: "该参数关联设备",
                              value: "connectIt"
                            },
                            curitemz: record
                          })

                        }}>关联设备</a>
                      }

                    ]}
                    dataSource={queryByEquipmentId.parameterList ? queryByEquipmentId.parameterList : []}
                    expandedRowRender={expandedRowRender}
                  ></Table>




                </div>
            }

          </div>
          <div style={{ height: !fv ? "auto" : 0, overflow: "hidden" }}>
            <Table size="middle"
              loading={this.props.submitting}
              onRow={record => {
                return {
                  onClick: event => {
                    this.setState({
                      charge: record.id,
                      curitem: record,
                      postDatas: {
                        ...postDatas, equipmentId: record.id, pageIndex: 1
                      },
                      postDatac: {
                        ...postDatac, equipmentId: record.id, pageIndex: 1
                      }
                    })

                  }, // 点击行
                };
              }}
              rowClassName={(record, index) => rowClassNameFn(record, index)}
              pagination={{
                showTotal: total => `共${total}条`, // 分页
                size: "small",
                pageSize: 9,
                showQuickJumper: true,
                current: devicequeryList.pageNum ? devicequeryList.pageNum : 1,
                total: devicequeryList.total ? parseInt(devicequeryList.total) : 1,
                onChange: pageChange,
              }}
              rowKey='id'
              columns={columns}
              dataSource={devicequeryList.list ? devicequeryList.list : []}
            //expandedRowRender={renderAdd}
            // expandedRowKeys={this.state.secondRowKeys ? this.state.secondRowKeys : []}
            // onExpand={(expanded, record) => {
            //   this.setState({
            //     secondRowKeys: expanded ? [record.id] : [],
            //   }, () => {

            //   })
            // }}

            >
            </Table>
          </div>


          <Modal
            visible={this.state.visible}
            title={this.state.iftype.name}
            onCancel={() => { this.setState({ visible: false }) }}
            onOk={() => {
              this.setNewState("equipmentupdateById", {
                "id": curitem.id,//主键*
                "equipmentId": curitem.equipmentId,//负责人id*
                "chargeType": "1",//负责类型*
                "equipmentId": curitem.equipmentId
              }, () => { this.resetData(); message.success("操作成功"); this.setState({ visible: false }) })
            }}
          >
            <p>选择设备：</p>
            <Select size="large" showSearch filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} style={{ width: "100%" }} allowClear value={curitem.equipmentId}
              onChange={(val) => {
                this.setState({
                  curitem: { ...curitem, equipmentId: val }
                })
              }}
            >
              {
                userList ?
                  userList.map((item) => {
                    return (<Option value={item.id} key={item.id}>{item.userName}</Option>)
                  }) : ""
              }
            </Select>



          </Modal>

          <CreateForm
            width={800}
            style={{ top: 120 }}
            col={{ xs: 24, sm: 24, md: 12, lg: 12, xl: 12, xxl: 12 }}
            fields={this.state.fields}
            iftype={this.state.iftype}
            onChange={this.handleFormChange}
            wrappedComponentRef={this.saveFormRef}
            visible={this.state.fvs}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
          />


        </Card>
      </div>
    )
  }


}

export default SensorLink



