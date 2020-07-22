import {
  Table, Input, InputNumber, Popconfirm, Form, Divider, Modal, Tree, Button, Row, Col, Icon, Select, Alert, Tag, message, Card, Skeleton, Tooltip
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import ReactEcharts from "echarts-for-react";
import SearchBox from '@/components/SearchBox'

const FormItem = Form.Item;
const EditableContext = React.createContext();
const Search = Input.Search;
const { TreeNode } = Tree;
const InputGroup = Input.Group;
const { Option } = Select;


@connect(({ verb, loading, global }) => ({
  verb, global,
  submitting: loading.effects['verb/verbtoqueryList'],
  submittings: loading.effects['verb/verbtoqueryById'],
}))
class VerbMissionSee extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      iftype: {
        name: "",
        value: ""
      },
      /*初始化 main List */
      postData: {
        pageIndex: 1,
        pageSize: 9,
        "taskNo": "",       // 工单号
        "equipmentName": "",    // 设备名称
        "status": "",             // 状态   3：已执行，4：关闭
        "maintainPlanType": ""    // 维保类型
      },
      postUrl: "verbtoqueryList",
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


  resetData() {
    let { postUrl, postData } = this.state;
    this.setNewState(postUrl, postData, () => {
    })
  }

  componentDidMount() {
    this.props.ensureDidMount && this.props.ensureDidMount()
    this.resetData()
  }

  getOption(key) {
    let chartMap = this.props.verb.chartMap;

    if (key == "line") {
      let line = chartMap.totalBudgetChart ? chartMap.totalBudgetChart : [];
      return {
        title: {
          text: '设备保养费用',
          subtext: '',
          x: '0'
        },
        xAxis: {
          type: 'category',
          data: line.map((item) => { return item.name })
        },
        yAxis: {
          type: 'value',
          name: '费用(元)',
          axisLabel: {
            formatter: '{value} 元'
          }
        },
        series: [{
          data: line.map((item) => { return item.value }),
          type: 'line',
          label: {
            normal: {
              formatter: '{c}元',
              show: true
            },
          },
          smooth: true
        }]
      };
    } else {
      let pie = chartMap.maintainPlanTypeChart ? chartMap.maintainPlanTypeChart : [];
      return {
        title: {
          text: '维保类型分布',
          subtext: '',
          x: 'left'
        },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          y: 30,
          data: pie.map((item) => { return item.name })
        },
        series: [
          {
            name: '维保类型',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              normal: {
                formatter: '{b}: {c} ({d}%) ',
                show: true
              },
            },
            data: pie
          }
        ]
      };
    }

  }

  handleSearch = (selectedKeys, dataIndex) => {
    let { postUrl } = this.state;
    this.setState({ postData: { ...this.state.postData, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
      this.setNewState(postUrl, this.state.postData)
    });
  };

  onRef = (ref) => {
    this.child = ref;
  }


  render() {
    let { postData, postUrl, iftype, curitem } = this.state,
      { verbtoqueryList, maintainPlanType, verbtoqueryById, actualItemList, sparePartsConsumeList } = this.props.verb;
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

    const columns = [
      {
        title: '工单号',
        dataIndex: 'taskNo',
        key: 'taskNo',
        width: 110,
        ellipsis: true,
        ...getsearchbox('taskNo')
      },
      {
        title: '设备名',
        dataIndex: 'equipmentName',
        key: 'equipmentName',
        width: 110,
        ellipsis: true,
        ...getsearchbox('equipmentName')
      },
      {
        title: '设备编号',
        dataIndex: 'equipmentNo',
        key: 'equipmentNo',
        width: 110,
        ellipsis: true,
      },
      {
        title: '任务状态',
        dataIndex: 'status',
        key: 'status',
        width: 110,
        ellipsis: true,
        render: (text, render) => (<span style={{ color: text == 3 ? "#0e6eb8" : text == 4 ? "#ff5000" : "transparent" }}>{text == 3 ? "已执行" : text == 4 ? "关闭" : ""}</span>),
        ...getselectbox('status', [
          { dicKey: "3", dicName: "已执行" },
          { dicKey: "4", dicName: "关闭" },
        ], "label", "value")
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
        title: '计划开始日期',
        dataIndex: 'startMaintainDate',
        key: 'startMaintainDate',
        width: 130,
        ellipsis: true,
      },
      {
        title: '开始时间',
        dataIndex: 'startMaintainTime',
        key: 'startMaintainTime',
        width: 160,
        ellipsis: true,
      },
      {
        title: '结束时间',
        dataIndex: 'endMaintainTime',
        key: 'endMaintainTime',
        width: 160,
        ellipsis: true,
      },
      {
        title: '执行人',
        dataIndex: 'maintainUserName',
        key: 'maintainUserName',
        width: 90,
        ellipsis: true,
      },
      {
        title: <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: 90 }}>
          查看
        <a style={{ color: "#f50" }} onClick={() => {
            this.setState({
              postData: {
                ...this.state.postData,
                pageIndex: 1,
                "taskNo": "",       // 工单号
                "equipmentName": "",    // 设备名称
                "status": "",             // 状态   3：已执行，4：关闭
                "maintainPlanType": ""    // 维保类型
              }
            }, () => { this.resetData() })
          }}>
            <Tooltip title='重置'>
              <Icon type="reload" />
            </Tooltip>
          </a>
        </div>,
        width: 110,
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => {
          return (<div>
            <a onClick={() => {
              this.setState({
                visible: true,
                iftype: {
                  name: `查看工单：${record.taskNo}的详情`,
                  value: "tosee"
                }
              }, () => {
                this.setNewState("verbtoqueryById", { id: record.id })
              })
            }}>查看详情</a>
          </div>)

        }
      },
    ]

    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("verbtoqueryList", this.state.postData);
      })
    }
    let col = {
      xs: 24,
      sm: 24,
      md: 12,
      lg: 12,
      xl: 12,
      xxl: 12
    }, cols = {
      xs: 24,
      sm: 24,
      md: 16,
      lg: 16,
      xl: 4,
      xxl: 4
    }, coles = {
      xs: 24,
      sm: 24,
      md: 24,
      lg: 12,
      xl: 12,
      xxl: 12
    }

    return (
      <div>
        <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
        <Card title='已完成维保任务列表'>
          <Table size="middle"
            loading={this.props.submitting}
            pagination={{
              showTotal: total => `共${total}条`, // 分页
              size: "small",
              pageSize: 9,
              showQuickJumper: true,
              current: verbtoqueryList.pageNum ? verbtoqueryList.pageNum : 1,
              total: verbtoqueryList.total ? parseInt(verbtoqueryList.total) : 1,
              onChange: pageChange,
            }}
            rowKey='id'
            columns={columns}
            dataSource={verbtoqueryList.list ? verbtoqueryList.list : []}
          >
          </Table>
          <Row gutter={24} style={{ marginTop: 20, paddingTop: 20, backgroundColor: "#f0f0f0" }}>
            <Skeleton active loading={this.props.submitting}>
              <Col {...col}>
                <ReactEcharts option={this.getOption("bar")}></ReactEcharts>
              </Col>
              <Col {...col}>
                <ReactEcharts option={this.getOption("line")}></ReactEcharts>
              </Col>
            </Skeleton>
          </Row>

          <Modal
            style={{ maxWidth: "90%", top: 20 }}
            width={1000}
            visible={this.state.visible}
            title={iftype.name}
            onCancel={() => {
              this.setState({
                visible: false
              })
            }}
            footer={null}
          >
            <div className={styles.limitdivs}>
              <Row gutter={24}>
                <Col {...coles}>
                  <Skeleton loading={this.props.submittings} active>
                    <Card title="基本信息">
                      <p><span>工单号：</span><span>{verbtoqueryById.taskNo}</span></p>
                      <p><span>设备编号：</span><span>{verbtoqueryById.equipmentNo}</span></p>
                      <p><span>设备名称：</span><span>{verbtoqueryById.equipmentName}</span></p>
                      <p><span>维保类型：</span><span>{verbtoqueryById.maintainPlanTypeName}</span></p>
                      <p><span>任务生成时间：</span><span>{verbtoqueryById.startMaintainDate}</span></p>
                      <p><span>预计完成时间：</span><span>{verbtoqueryById.endMaintainDate}</span></p>
                      <p><span>保养时长：</span><span>{verbtoqueryById.maintainHours}小时</span></p>
                      <p><span>任务状态：</span><span style={{ color: verbtoqueryById.status == 3 ? "#0e6eb8" : verbtoqueryById.status == 4 ? "#ff5000" : "transparent" }}>{verbtoqueryById.status == 3 ? "已执行" : verbtoqueryById.status == 4 ? "关闭" : ""}</span></p>
                    </Card>
                  </Skeleton>
                </Col>
                <Col {...coles}>
                  <Card title="保养内容">
                    <Skeleton loading={this.props.submittings} active>
                      <Table size="middle"
                        rowKey="maintainItem"
                        dataSource={actualItemList}
                        pagination={{
                          showTotal: total => `共${total}条`, // 分页
                          size: "small",
                          pageSize: 4,
                        }}
                        columns={[
                          {
                            title: '保养项目',
                            dataIndex: 'maintainItem',
                            key: 'maintainItem',
                            render: (text) => (<span style={{ color: "#ff5000" }}>{text}</span>)
                          },
                          {
                            title: '保养内容',
                            dataIndex: 'maintainContent',
                            key: 'maintainContent',
                          },
                          {
                            title: '保养费用',
                            dataIndex: 'actualMaintainCost',
                            key: 'actualMaintainCost',
                            render: (text) => (<a>{text}元</a>)
                          },
                        ]}
                      ></Table>
                    </Skeleton>
                  </Card>
                </Col>

                <Col span={24} style={{ marginTop: 24 }}>
                  <Skeleton loading={this.props.submittings} active>
                    <Card title="实际执行信息">
                      <p><span>执行人：</span><span>{verbtoqueryById.maintainUserName}</span></p>
                      <p><span>实际开始时间：</span><span>{verbtoqueryById.startMaintainTime}</span></p>
                      <p><span>实际完成时间：</span><span>{verbtoqueryById.endMaintainTime}</span></p>
                      <p><span>保养费用：</span><span>{verbtoqueryById.totalMaintainCost}元</span></p>
                      {
                        this.props.global.showModule.spare &&
                        <div>
                          <p><span style={{ color: "#000" }}>消耗的备件列表：</span><span></span></p>
                          <Table dataSource={sparePartsConsumeList ? sparePartsConsumeList : []} columns={[
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
                              title: '备件类型名称',
                              dataIndex: 'sparePartsTypeName',
                              key: 'sparePartsTypeName',
                            },
                            {
                              title: '使用数量',
                              dataIndex: 'consumeCount',
                              key: 'consumeCount',
                              render: (text) => <span>{text}个</span>
                            },
                          ]} />

                        </div>
                      }


                    </Card>
                  </Skeleton>
                </Col>

              </Row>
            </div>

          </Modal>

        </Card>
      </div>
    )
  }


}

export default VerbMissionSee



