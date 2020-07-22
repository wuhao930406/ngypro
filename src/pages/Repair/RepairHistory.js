import {
  Table, Input, InputNumber, Popconfirm, Form, Divider, Modal, Tree, Button, Row, Col, Icon, Select, Alert, Tag, message, Card, DatePicker, Empty, Tooltip
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import CreateForm from "@/components/CreateForm"
import moment from 'moment'
import ReactEcharts from "echarts-for-react";
import SearchBox from '@/components/SearchBox'
import Link from 'umi/link';

const FormItem = Form.Item;
const EditableContext = React.createContext();
const Search = Input.Search;
const { TreeNode } = Tree;
const InputGroup = Input.Group;
const { Option } = Select;


@connect(({ repair, global, loading }) => ({
  repair,
  global,
  submitting: loading.effects['repair/hisToryqueryList'],
}))
class RepairHistory extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      iftype: {
        name: "",
        value: ""
      },
      fv: false,
      fields: {
        repairUserId: {
          value: null,
          type: "select",
          title: "当班维修工",
          keys: "repairUserId",
          requires: true,
          option: this.props.repair.queryAllRepair.map((item) => {
            return {
              name: item.userName,
              id: item.id
            }
          })
        }
      },
      /*初始化 main List */
      postData: {
        pageIndex: 1,
        pageSize: 9,
        "faultType": "",              //（int）故障名称
        "repairType": "",             //（int）维修类型
        "repairUserName": "",        //（String）维修人姓名
        "startTime": "",     //（String）开始时间
        "endTime": ""        //（String）结束时间
      },
      postDatas: {
        "pageIndex": 1,
        "pageSize": 9,
        "faultId": "",//故障id，必填
        "knowledgeBaseName": "",//文件名，筛选
        "purposeType": "",//用途key，筛选
        "equipmentTypeId": ""//设备类型id
      },
      postDatad: {
        equipmentKnowledgeBaseId: "",
        pageIndex: 1,
        pageSize: 9,
        equipmentId: ""
      },
      postUrl: "hisToryqueryList",
      curitem: {}





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


  resetData() {
    let { postUrl, postData } = this.state;
    this.setNewState(postUrl, postData, () => {
    })
  }

  componentDidMount() {
    this.props.ensureDidMount&&this.props.ensureDidMount()
    this.resetData()
  }



  handleSearch = (selectedKeys, dataIndex, end) => {
    if (end) {
      let start = dataIndex;
      let { postUrl } = this.state;
      this.setState({ postData: { ...this.state.postData, [start]: selectedKeys[0] ? selectedKeys[0] : "", [end]: selectedKeys[1] ? selectedKeys[1] : "" } }, () => {
        this.setNewState(postUrl, this.state.postData)
      });
    } else {
      let { postUrl } = this.state;
      this.setState({ postData: { ...this.state.postData, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
        this.setNewState(postUrl, this.state.postData)
      });
    }

  };
  handleSearchs = (selectedKeys, dataIndex, end) => {
    let postUrl = "KLqueryKnowledgeByFaultId"
    if (end) {
      let start = dataIndex;
      this.setState({ postDatas: { ...this.state.postDatas, [start]: selectedKeys[0] ? selectedKeys[0] : "", [end]: selectedKeys[1] ? selectedKeys[1] : "" } }, () => {
        this.setNewState(postUrl, this.state.postDatas)
      });
    } else {
      this.setState({ postDatas: { ...this.state.postDatas, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
        this.setNewState(postUrl, this.state.postDatas)
      });
    }

  };
  onRef = (ref) => {
    this.child = ref;
  }
  onRefes = (ref) => {
    this.childes = ref;
  }


  getChildTable(record, expanded) {
    this.setState({
      expandedRowKeyes: expanded ? [record.id] : [],
      postDatad: {
        ...this.state.postDatad,
        equipmentKnowledgeBaseId: record.id,
        pageIndex: 1, pageSize: 9,
      }
    }, () => {
      this.setNewState("deviceknchildqueryList", this.state.postDatad, () => {
        this.setState({
          childData: this.props.repair.deviceknchildqueryList
        })

      })
    })

  }
  render() {
    let { postData, postUrl, fv, fields, iftype, curitem, expandedRowKeyes } = this.state,
      { hisToryqueryList, repairTypeList, faultTypeList, chart, hisgetRepairDetail, dataList, KLqueryKnowledgeByFaultId } = this.props.repair;

    let getsearchbox = (key) => {
      if (this.child) {
        return this.child.getColumnSearchProps(key)
      } else {
        return null
      }
    }, getselectbox = (key, option) => {
      if (this.child) {
        return this.child.getColumnSelectProps(key, option)
      } else {
        return null
      }
    }, getdaterangebox = (start, end) => {
      if (this.child) {
        return this.child.getColumnRangeProps(start, end)
      } else {
        return null
      }
    }, getsearchboxs = (key) => {
      if (this.childes) {
        return this.childes.getColumnSearchProps(key)
      } else {
        return null
      }
    }, gettreeselectboxs = (key, option) => {
      if (this.childes) {
        return this.childes.getColumnTreeSelectProps(key, option)
      } else {
        return null
      }
    }, getselectboxs = (key, option) => {
      if (this.childes) {
        return this.childes.getColumnSelectProps(key, option)
      } else {
        return null
      }
    }

    const columns = [
      {
        title: '工单号',
        dataIndex: 'taskNo',
        key: 'taskNo',
        width: 120,
        ellipsis: true,
      },
      {
        title: '故障时间',
        dataIndex: 'faultTime',
        key: 'faultTime',
        ...getdaterangebox("startTime", "endTime"),
        width: 160,
        ellipsis: true,
      },
      {
        title: '报修人',
        dataIndex: 'applyRepairUserName',
        key: 'applyRepairUserName',
        width: 90,
        ellipsis: true,
      },
      {
        title: '维修人',
        dataIndex: 'repairUserName',
        key: 'repairUserName',
        ...getsearchbox('repairUserName'),
        width: 90,
        ellipsis: true,
      },
      {
        title: '确认人',
        dataIndex: 'confirmUserName',
        key: 'confirmUserName',
        width: 90,
        ellipsis: true,
      },
      {
        title: '故障名称',
        dataIndex: 'faultTypeName',
        key: 'faultTypeName',
        render: (text, record) => {
          return (<span>{text}</span>)
        },
        ...getsearchbox("faultTypeName"),
        width: 120,
        ellipsis: true,
      },
      {
        title: '级别',
        dataIndex: 'faultLevelName',
        key: 'faultLevelName',
        render: (text) => <span>{text}</span>,
        width: 90,
        ellipsis: true,
      },
      {
        title: '维修类型',
        width: 110,
        dataIndex: 'repairTypeName',
        key: 'repairTypeName',
        ...getselectbox('repairType', repairTypeList),
        ellipsis: true,
      },
      {
        title: '设备编号',
        dataIndex: 'equipmentNo',
        key: 'equipmentNo',
        width: 100,
        ellipsis: true,
      },
      {
        title: '设备名',
        dataIndex: 'equipmentName',
        key: 'equipmentName',
        width: 90,
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
        title: '维修状态',
        dataIndex: 'statusName',
        key: 'statusName',
        width: 90,
        ellipsis: true,
      },
      {
        title: <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: 90 }}>
          查看
        <a style={{ color: "#f50" }} onClick={() => {
            this.setState({
              postData: {
                ...postData,
                "faultType": "",              //（int）故障名称
                "repairType": "",             //（int）维修类型
                "repairUserName": "",        //（String）维修人姓名
                "startTime": "",     //（String）开始时间
                "endTime": ""        //（String）结束时间
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
        dataIndex: 'action',
        key: 'action',
        width: 110,
        render: (text, record) => {
          return (<div>
            <a onClick={() => {
              this.setNewState("hisgetRepairDetail", { id: record.id }, () => {
                this.setState({
                  visible: true,
                  iftype: {
                    name: `查看工单：${record.taskNo}的详情`,
                    value: "tosee"
                  }
                })
              })
            }}>详情</a>
            <Divider type='vertical'></Divider>
            <a onClick={() => {
              this.setNewState("KLqueryKnowledgeByFaultId", { ...this.state.postDatas, faultId: record.faultType }, () => {
                this.setState({
                  curitem: record,
                  postDatas: { ...this.state.postDatas, faultId: record.faultType },
                  visibles: true,
                  iftype: {
                    name: `知识文件`
                  }
                })
              })
            }}>
              知识文件
          </a>
          </div>)
        }
      },


    ]

    const columnes = [
      {
        title: '备件料号',
        dataIndex: 'sparePartsNo',
        key: 'sparePartsNo',
      },
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
        title: '使用数量',
        dataIndex: 'consumeCount',
        key: 'consumeCount',
      },


    ]

    const columnesc = [
      {
        title: '文件名',
        dataIndex: 'knowledgeBaseName',
        key: 'knowledgeBaseName',
        render: (text, record) => {
          return (record.knowledgeBaseUrl ? <a href={record.knowledgeBaseUrl} target="_blank">{text}</a> : { text })
        }
      },
      {
        title: '设备类型',
        dataIndex: 'equipmentTypeName',
        key: 'equipmentTypeName',
        width: 120,
        ellipsis: true,
      },
      {
        title: '文件编号',
        dataIndex: 'documentNo',
        key: 'documentNo',
        width: 120,
        ellipsis: true,
      },
      {
        title: '用途',
        dataIndex: 'purposeTypeName',
        key: 'purposeTypeName',
        width: 90,
        ellipsis: true,
      },
      {
        title: '描述',
        dataIndex: 'knowledgeBaseDescribe',
        key: 'knowledgeBaseDescribe',
        width: 90,
        ellipsis: true,
      },
      {
        title: '创建日期',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 120,
        ellipsis: true,
      },
      {
        title: '版本',
        dataIndex: 'knowledgeBaseVersion',
        key: 'knowledgeBaseVersion',
        width: 90,
        ellipsis: true,
      },
      {
        title: '上传者',
        dataIndex: 'updateUserName',
        key: 'updateUserName',
        width: 90,
        ellipsis: true,
      },


    ]

    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("hisToryqueryList", this.state.postData);
      })
    }, pageChanges = (page) => {
      this.setState({
        postDatas: { ...this.state.postDatas, pageIndex: page }
      }, () => {
        this.setNewState("KLqueryKnowledgeByFaultId", this.state.postDatas);
      })
    }, pageChanged = (page) => {
      this.setState({
        postDatad: { ...this.state.postDatad, pageIndex: page }
      }, () => {
        this.setNewState("deviceknchildqueryList", this.state.postDatad);
      })
    };

    const rowClassNameFn = (record, index) => {
      const { curitem } = this.state;
      if (curitem && curitem.id === record.id) {
        return "selectedRow";
      }
      return null;
    }, col = {
      xs: 24,
      sm: 24,
      md: 8,
      lg: 8,
      xl: 5,
      xxl: 5
    }, cols = {
      xs: 24,
      sm: 24,
      md: 16,
      lg: 16,
      xl: 4,
      xxl: 4
    }, coler = {
      xs: 24,
      sm: 24,
      md: 12,
      lg: 8,
      xl: 8,
      xxl: 8
    }
    function bodyparse(vals) {
      let val = JSON.parse(JSON.stringify(vals))
      delete val.pageSize;
      delete val.pageIndex;
      let res = ''
      for (let key in val) {
        let value = val[key] ? val[key] : ''

        res += `&${key}=${value}`;
      }
      return res.substr(1)
    }

    const expandedRowRender = () => {
      return <Table size="middle" columns={columnesc} dataSource={this.state.childData ? this.state.childData.list : []}
        pagination={{
          showTotal: total => `共${total}条`, // 分页
          size: "small",
          pageSize: 9,
          showQuickJumper: true,
          current: this.state.childData ? this.state.childData.pageNum : 1,
          total: this.state.childData ? parseInt(this.state.childData.total) : 1,
          onChange: pageChanged,
        }}
      />;
    };
    return (
      <div>
        <Modal
          width={1200}
          title={iftype.name}
          visible={this.state.visibles}
          onCancel={() => {
            this.setState({ visibles: false })
          }}
          footer={false}
        >
          {
            this.state.visibles && <Table
              size="middle"
              dataSource={KLqueryKnowledgeByFaultId.list ? KLqueryKnowledgeByFaultId.list : []}
              pagination={{
                showTotal: total => `共${total}条`, // 分页
                size: "small",
                pageSize: 9,
                showQuickJumper: true,
                current: KLqueryKnowledgeByFaultId.pageNum ? KLqueryKnowledgeByFaultId.pageNum : 1,
                total: KLqueryKnowledgeByFaultId.total ? parseInt(KLqueryKnowledgeByFaultId.total) : 1,
                onChange: pageChanges,
              }}
              rowKey='id'
              columns={[
                {
                  title: '文件名',
                  dataIndex: 'knowledgeBaseName',
                  key: 'knowledgeBaseName',
                  width: 90,
                  ellipsis: true,
                  ...getsearchboxs("knowledgeBaseName"),
                  render: (text, record) => <a href={record.knowledgeBaseUrl} target="_blank">{text}</a>
                },
                {
                  title: '文件编号',
                  dataIndex: 'documentNo',
                  key: 'documentNo',
                  ellipsis: true,
                },
                {
                  title: '设备类型',
                  dataIndex: 'equipmentTypeName',
                  key: 'equipmentTypeName',
                  width: 120,
                  ellipsis: true,
                  ...gettreeselectboxs("equipmentTypeId", this.props.repair.equipmentTypeList)
                },
                {
                  title: '用途',
                  dataIndex: 'purposeTypeName',
                  key: 'purposeTypeName',
                  width: 90,
                  ellipsis: true,
                  ...getselectboxs("purposeType", this.props.repair.purposeTypeList && this.props.repair.purposeTypeList)
                },
                {
                  title: '描述',
                  dataIndex: 'knowledgeBaseDescribe',
                  key: 'knowledgeBaseDescribe',
                  width: 120,
                  ellipsis: true,
                },
                {
                  title: '更新时间',
                  dataIndex: 'updateTime',
                  key: 'updateTime',
                  width: 160,
                  ellipsis: true,
                },
                {
                  title: '上传者',
                  dataIndex: 'createUserName',
                  key: 'createUserName',
                  width: 100,
                  ellipsis: true,
                },
                {
                  title: '版本',
                  dataIndex: 'knowledgeBaseVersion',
                  key: 'knowledgeBaseVersion',
                  width: 90,
                  ellipsis: true,
                },
              ]}
              onExpand={(expanded, record) => { this.getChildTable(record, expanded) }}
              expandedRowRender={expandedRowRender}
              expandedRowKeys={expandedRowKeyes}
            >

            </Table>

          }

        </Modal>


        <Modal
          style={{ top: 30, maxWidth: "90%" }}
          width={1000}
          visible={this.state.visible}
          title={iftype.name}
          onCancel={() => { this.setState({ visible: false }) }}
          footer={null}
        >
          <Card style={{ marginBottom: 12 }} title='设备信息'>
            <div className={styles.limitdiv}>
              <Row gutter={24}>
                <Col {...coler}>
                  <p>
                    <span>
                      设备编号：
                      </span>
                    <span>
                      {
                        hisgetRepairDetail.equipmentNo
                      }
                    </span>
                  </p>
                </Col>
                <Col {...coler}>
                  <p>
                    <span>
                      设备型号：
                      </span>
                    <span>
                      {
                        hisgetRepairDetail.equipmentModel
                      }
                    </span>
                  </p>
                </Col>
                <Col {...coler}>
                  <p style={{ marginBottom: -10 }}>
                    <span>
                      设备名：
                      </span>
                    <span>
                      {
                        hisgetRepairDetail.equipmentName
                      }
                    </span>
                  </p>
                </Col>
              </Row>
            </div>
          </Card>
          <Card style={{ marginBottom: 12 }} title='故障信息'>
            <div className={styles.limitdiv}>
              <Row gutter={24}>
                <Col {...coler}>
                  <p>
                    <span>
                      故障等级：
                      </span>
                    <span>
                      {
                        hisgetRepairDetail.faultLevelName
                      }
                    </span>
                  </p>
                </Col>
                <Col {...coler}>
                  <p>
                    <span>
                      故障类型：
                      </span>
                    <span>
                      {
                        hisgetRepairDetail.faultClassifyName
                      }
                    </span>
                  </p>
                </Col>
                <Col {...coler}>
                  <p>
                    <span>
                      故障名称：
                      </span>
                    <span>
                      {
                        hisgetRepairDetail.faultTypeName
                      }
                    </span>
                  </p>
                </Col>
                <Col {...coler}>
                  <p>
                    <span>
                      故障时间：
                      </span>
                    <span>
                      {
                        hisgetRepairDetail.faultTime
                      }
                    </span>
                  </p>
                </Col>
                <Col {...coler}>
                  <p>
                    <span>
                      故障原因：
                      </span>
                    <span>
                      {
                        hisgetRepairDetail.faultReason
                      }
                    </span>
                  </p>
                </Col>
                <Col {...coler}>
                  <p>
                    <span>
                      故障图片：
                      </span>
                    <span>
                      <img onClick={() => {
                        Modal.info({
                          maskClosable: true,
                          title: `预览`,
                          okText: "关闭",
                          content: (
                            <div style={{ width: "100%" }}>
                              <img style={{ width: "100%", height: "auto", margin: "20px 0px" }} src={hisgetRepairDetail.faultPicUrl} onError={(e) => { e.target.src = './images/default.png' }} />
                            </div>
                          ),
                          onOk() { },
                        });

                      }} style={{ width: 30, height: 30, cursor: "pointer" }} src={hisgetRepairDetail.faultPicUrl} onError={(e) => { e.target.src = './images/default.png' }} />
                    </span>
                  </p>
                </Col>
                <Col span={24}>
                  <p>
                    <span>
                      故障描述：
                      </span>
                    <span>
                      {
                        hisgetRepairDetail.faultDesc
                      }
                    </span>
                  </p>
                </Col>

              </Row>
            </div>
          </Card>

          <Card style={{ marginBottom: 12 }} title="报修信息">
            <div className={styles.limitdiv}>
              <Row gutter={24}>
                <Col {...coler}>
                  <p>
                    <span>
                      报修人：
                      </span>
                    <span>
                      {
                        hisgetRepairDetail.applyRepairUserName
                      }
                    </span>
                  </p>
                </Col>
                <Col {...coler}>
                  <p>
                    <span>
                      报修时间：
                      </span>
                    <span>
                      {
                        hisgetRepairDetail.applyRepairTime
                      }
                    </span>
                  </p>
                </Col>

              </Row>
            </div>
          </Card>
          <Card style={{ marginBottom: 12 }} title='维修信息'>
            <div className={styles.limitdiv}>
              <Row gutter={24}>
                <Col {...coler}>
                  <p>
                    <span>
                      维修类型：
                      </span>
                    <span>
                      {
                        hisgetRepairDetail.repairTypeName
                      }
                    </span>
                  </p>
                </Col>
                <Col {...coler}>
                  <p>
                    <span>
                      维修人：
                      </span>
                    <span>
                      {
                        hisgetRepairDetail.repairUserName
                      }
                    </span>
                  </p>
                </Col>
                <Col {...coler}>
                  <p>
                    <span>
                      维修状态：
                      </span>
                    <span>
                      {
                        hisgetRepairDetail.statusName
                      }
                    </span>
                  </p>
                </Col>
                <Col {...coler}>
                  <p>
                    <span>
                      维修开始时间：
                      </span>
                    <span>
                      {
                        hisgetRepairDetail.repairStartTime
                      }
                    </span>
                  </p>
                </Col>

                <Col {...coler}>
                  <p>
                    <span>
                      维修结束时间：
                      </span>
                    <span>
                      {
                        hisgetRepairDetail.repairEndTime
                      }
                    </span>
                  </p>
                </Col>

                <Col {...coler}>
                  <p>
                    <span>
                      维修内容：
                      </span>
                    <span>
                      {
                        hisgetRepairDetail.repairContent
                      }
                    </span>
                  </p>
                </Col>
                {
                  this.props.global.showModule.spare && <Col span={24}>
                    <p>
                      消耗的备件列表：
                    </p>
                    <Table size="middle" dataSource={dataList} columns={columnes}>
                    </Table>
                  </Col>
                }

              </Row>
            </div>
          </Card>
          <Card style={{ marginBottom: 12 }} title='验证信息'>
            <div className={styles.limitdiv}>
              <Row gutter={24}>
                <Col {...coler}>
                  <p>
                    <span>
                      确认人：
                      </span>
                    <span>
                      {
                        hisgetRepairDetail.confirmUserName
                      }
                    </span>
                  </p>
                </Col>
                <Col {...coler}>
                  <p>
                    <span>
                      确认时间：
                      </span>
                    <span>
                      {
                        hisgetRepairDetail.confirmTime
                      }
                    </span>
                  </p>
                </Col>
                <Col span={24}>
                  <p>
                    <span>
                      确认结果：
                      </span>
                    <span>
                      {
                        hisgetRepairDetail.confirmResult
                      }
                    </span>
                  </p>
                </Col>
                <Col span={24}>
                  <p>
                    <span>
                      确认描述：
                      </span>
                    <span>
                      {
                        hisgetRepairDetail.confirmDesc
                      }
                    </span>
                  </p>
                </Col>
              </Row>
            </div>
          </Card>
        </Modal>
        <SearchBox onRef={this.onRefes} handleSearch={this.handleSearchs} postData={this.state.postDatas}></SearchBox>

        <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
        <Card title='历史维修单列表' extra={
          <span style={{ textAlign: "right" }}>
            <a onClick={() => {
              message.loading("正在导出文件...")
            }} href={`/ngy/equipmentRepairHis/exportExcel?${bodyparse(this.state.postData)}`} target="_blank">
              导出维修历史单
            </a>
          </span>
        }>
          <Table size="middle"
            scroll={{ x: 1660 }}
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
              current: hisToryqueryList.pageNum ? hisToryqueryList.pageNum : 1,
              total: hisToryqueryList.total ? parseInt(hisToryqueryList.total) : 1,
              onChange: pageChange,
            }}
            rowKey='id'
            columns={columns}
            dataSource={hisToryqueryList.list ? hisToryqueryList.list : []}
          >
          </Table>



        </Card>
      </div>
    )
  }


}

export default RepairHistory



