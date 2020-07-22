import {
  Table, Input, InputNumber, Popconfirm, Form, Divider, Modal, Tree, Button, Row, Col, Icon, Select, Alert, Tag, message, Card, Empty,
  Transfer,Tooltip
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import SearchBox from '@/components/SearchBox'
import Abload from '@/components/Abload';
const FormItem = Form.Item;
const Search = Input.Search;
const { TreeNode } = Tree;
const InputGroup = Input.Group;
const { Option } = Select;

@connect(({ repair, loading }) => ({
  repair,
  submitting: loading.effects['repair/equipmentqueryList'],
  submittings: loading.effects['repair/equipmentqueryNoByUserId'],
  submittingc: loading.effects['repair/equipmentqueryByUserId'],
}))
class RepairDuty extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      iftype: {
        name: "",
        value: ""
      },
      fv: false,
      /*初始化 main List */
      postData: {
        "pageIndex": 1,//int 当前页面*
        "pageSize": 9,//int 页面条数*
        "chargeType": "3",//string 负责类型*(0维修,1保养)
        "userId": "",//Long 负责人id
        "equipmentNo": "",//string 设备编号
        "equipmentName": ""//string 设备名称
      },
      postDatas: {
        "pageIndex": 1,//int 当前页码*
        "pageSize": 9,//int 每页条数*
        "chargeType": "3",//string 负责类型*(0维修,1保养)
        "userId": ""//Long 负责人id*
      },
      postDatac: {
        "pageIndex": 1,//int 当前页码*
        "pageSize": 9,//int 每页条数*
        "chargeType": "3",//string 负责类型*(0维修,1保养)
        "userId": ""//Long 负责人id*
      },
      postUrl: "equipmentqueryList",
      curitem: {},
      charge: "",
      selectedRowKeys: [],
      selectedRowKeyc: [],
      haveIds: []
    }
  }

  //设置新状态
  setNewState(type, values, fn) {
    const { dispatch } = this.props;
    dispatch({
      type: 'repair/' + type,
      payload: values
    }).then((res) => {
      if (res) {
        fn ? fn() : null;
      }
    });
  }

  onSelectChanges = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  onSelectChangec = selectedRowKeys => {
    this.setState({ selectedRowKeyc: selectedRowKeys });
  };


  resetData() {
    let { postUrl, postData } = this.state;
    this.setNewState(postUrl, postData)
  }

  componentDidMount() {
    this.props.ensureDidMount&&this.props.ensureDidMount()
    this.resetData();
    this.setNewState('deviceTypequeryTreeList', null);
  }

  refreshData(ifs) {
    let { haveIds, selectedRowKeys, selectedRowKeyc, charge, postDatas, postDatac } = this.state;
    let haveId = JSON.parse(JSON.stringify(haveIds))

    if (ifs) {
      selectedRowKeys.map((item) => {
        haveId.push(item)
      });
    } else {
      haveId = haveId.filter((item) => { return selectedRowKeyc.indexOf(item) == -1 });
    }

    this.setNewState("equipmentsavez", {
      "userId": charge,
      "chargeType": "3",
      "equipIds": haveId
    }, () => {
      message.success("操作成功");
      this.setNewState("equipmentqueryNoByUserId", postDatas);
      this.setNewState("equipmentqueryByUserId", postDatac, () => {
        let res = this.props.repair.equipmentqueryByUserId.list;
        this.setState({
          haveIds: res ? res[0].haveIds : [],
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
    let postUrl = "equipmentqueryNoByUserId";
    this.setState({ postDatas: { ...this.state.postDatas, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
      this.setNewState(postUrl, this.state.postDatas)
    });
  };
  handleSearchc = (selectedKeys, dataIndex) => {
    let postUrl = "equipmentqueryByUserId";
    this.setState({ postDatac: { ...this.state.postDatac, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
      this.setNewState(postUrl, this.state.postDatac)
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

  render() {
    let { postData, postUrl, fv, fields, iftype, curitem, charge, selectedRowKeys, selectedRowKeyc, postDatas, postDatac } = this.state,
      { equipmentqueryList, userList, equipmentqueryNoByUserId, equipmentqueryByUserId, deviceTypequeryTreeList } = this.props.repair;
    const rowSelections = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectChanges,
    }
    const rowSelectionc = {
      selectedRowKeys: this.state.selectedRowKeyc,
      onChange: this.onSelectChangec,
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
        title: '负责人',
        dataIndex: 'userName',
        key: 'userName',
        ...getselectbox('userId', userList ? userList.map((item) => {
          return {
            dicName: item.userName,
            dicKey: item.id
          }
        }) : [])
      },
      {
        title: '联系电话',
        dataIndex: 'telephone',
        key: 'telephone',
      },
      {
        title: <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",width: 90 }}>
          所在部门
        <a style={{ color: "#f50" }} onClick={() => {
            this.setState({
              postData: {
                ...postData,
                equipmentName: "",
                equipmentNo: "",
                userId: ""
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
        dataIndex: 'departmentName',
        key: 'departmentName',
      },


    ]

    const columnes = [
      {
        title: '设备编号',
        dataIndex: 'equipmentNo',
        key: 'equipmentNo',
        ...getsearchboxs("equipmentNo")
      },
      {
        title: '位置号',
        dataIndex: 'positionNo',
        key: 'positionNo',
        ...getsearchboxs("positionNo")
      },
      {
        title: '设备名称',
        dataIndex: 'equipmentName',
        key: 'equipmentName',
        ...getsearchboxs("equipmentName")
      },
      {
        title: '设备类型',
        dataIndex: 'equipmentTypeName',
        key: 'equipmentTypeName',
        ...gettreeselectboxs('equipmentTypeId', deviceTypequeryTreeList),
      },
    ]
    const columnec = [
      {
        title: '设备编号',
        dataIndex: 'equipmentNo',
        key: 'equipmentNo',
        ...getsearchboxc("equipmentNo")
      },
      {
        title: '位置号',
        dataIndex: 'positionNo',
        key: 'positionNo',
        ...getsearchboxc("positionNo")
      },
      {
        title: '名称',
        dataIndex: 'equipmentName',
        key: 'equipmentName',
        ...getsearchboxc("equipmentName")
      },
      {
        title: '类型',
        dataIndex: 'equipmentTypeName',
        key: 'equipmentTypeName',
        ...gettreeselectboxc('equipmentTypeId', deviceTypequeryTreeList),
      },


    ]



    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("equipmentqueryList", this.state.postData);
      })
    }

    let pageChanges = (page) => {
      this.setState({
        postDatas: { ...this.state.postDatas, pageIndex: page }
      }, () => {
        this.setNewState("equipmentqueryNoByUserId", this.state.postDatas);
      })
    }
    let pageChangec = (page) => {
      this.setState({
        postDatac: { ...this.state.postDatac, pageIndex: page }
      }, () => {
        this.setNewState("equipmentqueryByUserId", this.state.postDatac);
      })
    }
    let col = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 7,
      xl: 7,
      xxl: 7
    }, cols = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 3,
      xl: 3,
      xxl: 3
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
        <SearchBox onRef={this.onRefs} handleSearch={this.handleSearchs} postData={this.state.postDatas}></SearchBox>
        <SearchBox onRef={this.onRefc} handleSearch={this.handleSearchc} postData={this.state.postDatac}></SearchBox>
        <Card title='维修负责人' extra={
          <div style={{ display: "flex", alignItems: "center" }}>
            <Abload reload={() => {
              this.resetData()
            }} data={null} postName="uploaduserEquipment" left={0} filePath="http://47.100.234.193:8888/download/nguserequipment.xlsx"></Abload>
            <Divider style={{ marginTop: 6 }} type="vertical"></Divider>
            <a onClick={() => {
              this.setState({
                iftype: {
                  name: "新增维修负责人设置",
                  value: "add"
                },
                fv: !fv
              })
            }}>{fv ? "返回" : "新增"}</a>
            <Divider style={{ display: curitem.id ? "block" : "none", marginTop: 6 }} type="vertical"></Divider>
            <a style={{ display: curitem.id ? "block" : "none" }} onClick={() => {
              this.setState({
                visible: true,
                iftype: {
                  name: `修改设备${curitem.equipmentName}的维修负责人`,
                  value: "edit"
                },
                curitem: curitem,
              })
            }}>修改</a>
            <Divider style={{ display: curitem.id ? "block" : "none", marginTop: 6 }} type="vertical"></Divider>
            <Popconfirm
              okText="确认"
              cancelText="取消"
              placement="bottomRight"
              title={"确认删除该维修负责人设置？"}
              onConfirm={() => {
                this.setNewState("equipmentdeleteByIdz", { id: curitem.id }, () => {
                  let total = this.props.repair.equipmentqueryList.total,
                    page = this.props.repair.equipmentqueryList.pageNum;
                  if ((total - 1) % 9 == 0) {
                    page = page - 1
                  }

                  this.setState({
                    postData: { ...this.state.postData, pageIndex: page }
                  }, () => {
                    this.setNewState("equipmentqueryList", postData, () => {
                      message.success("删除成功！");
                    });
                  })
                })
              }}>
              <a style={{ display: curitem.id ? "block" : "none", color: "#ff4800" }}>删除</a>
            </Popconfirm>



          </div>

        }>
          <div style={{ height: fv ? "auto" : 0, overflow: "hidden", transition: "all 0.4s" }}>
            <p>维修负责人：</p>
            <Select size="large" showSearch filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} style={{ width: "100%" }} allowClear value={charge}
              onChange={(val) => {
                this.setState({
                  charge: val,
                  postDatas: {
                    ...postDatas, userId: val, pageIndex: 1
                  },
                  postDatac: {
                    ...postDatac, userId: val, pageIndex: 1
                  }
                }, () => {
                  this.setNewState("equipmentqueryNoByUserId", this.state.postDatas);
                  this.setNewState("equipmentqueryByUserId", this.state.postDatac, () => {
                    let res = this.props.repair.equipmentqueryByUserId.list;
                    this.setState({
                      haveIds: res ? res[0].haveIds : []
                    })
                  });
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
            <div style={{ height: charge ? 0 : 700, overflow: "hidden", marginTop: charge ? 0 : 24, transition: "all 0.4s", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Empty description={
                <span>
                  请先选择 <a>维修负责人<Icon type="arrow-up" /></a>
                </span>
              } />
            </div>

            <Row gutter={24} style={{ height: charge ? 700 : 0, overflow: "hidden", marginTop: charge ? 24 : 0, transition: "all 0.4s" }}>
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
                    this.setNewState('equipmentqueryNoByUserId', this.state.postDatas);
                  })
                }}>
                  <Icon type="reload" style={{ paddingRight: 4, paddingLeft: 8 }} />
                    重置
                  </a></span>} extra={<span>选中了<a>{this.state.selectedRowKeys.length}</a>台设备</span>}>
                  <Table size="middle"
                    rowSelection={rowSelections}
                    dataSource={equipmentqueryNoByUserId.list ? equipmentqueryNoByUserId.list : []}
                    loading={this.props.submittings}
                    pagination={{
                      showTotal: total => `共${total}条`, // 分页
                      size: "small",
                      pageSize: 9,
                      showQuickJumper: true,
                      current: equipmentqueryNoByUserId.pageNum ? equipmentqueryNoByUserId.pageNum : 1,
                      total: equipmentqueryNoByUserId.total ? parseInt(equipmentqueryNoByUserId.total) : 1,
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
                      this.setNewState("equipmentqueryByUserId", this.state.postDatac, () => {
                        let res = this.props.repair.equipmentqueryByUserId.list;
                        this.setState({
                          haveIds: res ? res[0].haveIds : []
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
                    dataSource={equipmentqueryByUserId.list ? equipmentqueryByUserId.list : []}
                    loading={this.props.submittingc}
                    pagination={{
                      showTotal: total => `共${total}条`, // 分页
                      size: "small",
                      pageSize: 9,
                      showQuickJumper: true,
                      current: equipmentqueryByUserId.pageNum ? equipmentqueryByUserId.pageNum : 1,
                      total: equipmentqueryByUserId.total ? parseInt(equipmentqueryByUserId.total) : 1,
                      onChange: pageChangec,
                    }}
                    rowKey='id'
                    columns={columnec}
                  >
                  </Table>
                </Card>

              </Col>




            </Row>








          </div>
          <div style={{ height: !fv ? "auto" : 0, overflow: "hidden" }}>
            <Table size="middle"
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
                current: equipmentqueryList.pageNum ? equipmentqueryList.pageNum : 1,
                total: equipmentqueryList.total ? parseInt(equipmentqueryList.total) : 1,
                onChange: pageChange,
              }}
              rowKey='id'
              columns={columns}
              dataSource={equipmentqueryList.list ? equipmentqueryList.list : []}
            >
            </Table>
          </div>
          <Modal
            visible={this.state.visible}
            title={this.state.iftype.name}
            onCancel={() => { this.setState({ visible: false }) }}
            onOk={() => {
              this.setNewState("equipmentupdateByIdz", {
                "id": curitem.id,//主键*
                "userId": curitem.userId,//负责人id*
                "chargeType": "3",//负责类型*
                "equipmentId": curitem.equipmentId
              }, () => { this.resetData(); message.success("操作成功"); this.setState({ visible: false }) })
            }}
          >
            <p>维修负责人：</p>
            <Select size="large" showSearch filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} style={{ width: "100%" }} allowClear value={curitem.userId}
              onChange={(val) => {
                this.setState({
                  curitem: { ...curitem, userId: val }
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
        </Card>
      </div>
    )
  }


}

export default RepairDuty



