import {
  Table, Popconfirm, Form, Divider, Modal, Button, Row, Col, Icon, Select, message, Card, Tag,Tooltip
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import moment from 'moment'
import SearchBox from '@/components/SearchBox'

const FormItem = Form.Item;
const { Option } = Select;


@connect(({ verb, loading }) => ({
  verb,
  submitting: loading.effects['verb/queryOfMonth'],
}))
class Verb extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      /*初始化 main List */
      cur: "current",
      postData: {
        pageIndex: 1,
        pageSize: 9,
        type: "current", //next：下个月。last：上个月。current：当前月
        taskNo: "",
        equipmentNo: "",
        maintainPlanType: "",
        status: "",
      },
      postUrl: "queryOfMonth",
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
    this.setNewState(postUrl, postData)
  }

  componentDidMount() {
    this.props.ensureDidMount && this.props.ensureDidMount()
    this.resetData()
  }



  //search box  
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

  onRef = (ref) => {
    this.child = ref;
  }

  render() {
    let { postData, postUrl, curitem, cur } = this.state,
      { queryOfMonth, maintainPlanType } = this.props.verb;

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
    }

    const columns = [
      {
        title: '工单号',
        dataIndex: 'taskNo',
        key: 'taskNo',
        width: 110,
        ellipsis: true,
        ...getsearchbox("taskNo")
      },
      {
        title: '设备编号',
        dataIndex: 'equipmentNo',
        key: 'equipmentNo',
        width: 110,
        ellipsis: true,
        ...getsearchbox("equipmentNo")
      },
      {
        title: '设备名',
        dataIndex: 'equipmentName',
        key: 'equipmentName',
        ellipsis: true,
      },
      {
        title: '设备类型',
        dataIndex: 'equipmentTypeName',
        key: 'equipmentTypeName',
        width: 110,
        ellipsis: true,
      },
      {
        title: '维保类型',
        dataIndex: 'maintainPlanTypeName',
        key: 'maintainPlanTypeName',
        width: 110,
        ellipsis: true,
        ...getselectbox("maintainPlanType", maintainPlanType)
      },
      {
        title: '任务状态',
        dataIndex: 'status',
        key: 'status',
        width: 110,
        ellipsis: true,
        render: (text) => <span>{text == 0 ? "待执行" : text == 1 ? "延期" : text == 2 ? "执行中" : text == 3 ? "已执行" : text == 4 ? "关闭" : ""}</span>,
        ...getselectbox("status", [
          { dicKey: "0", dicName: "待执行" },
          { dicKey: "1", dicName: "延期" },
          { dicKey: "2", dicName: "执行中" },
          { dicKey: "3", dicName: "已执行" },
          { dicKey: "4", dicName: "关闭" },
        ])
      },
      {
        title: '计划开始日期',
        dataIndex: 'planStartMaintainDate',
        key: 'planStartMaintainDate',
        width: 140,
        ellipsis: true,
      },
      {
        title: '保养用时',
        dataIndex: 'maintainHours',
        key: 'maintainHours',
        width: 96,
        ellipsis: true,
      },
      {
        title: '开始时间',
        dataIndex: 'startMaintainTime',
        key: 'startMaintainTime',
        width: 158,
        ellipsis: true,
      },
      {
        title: '结束时间',
        dataIndex: 'endMaintainTime',
        key: 'endMaintainTime',
        width: 158,
        ellipsis: true,
      },
      {
        title: '负责人',
        dataIndex: 'planMaintainUserName',
        key: 'planMaintainUserName',
        width: 90,
        ellipsis: true,
      },
      {
        title: <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: 90 }}>
          备注
      <a style={{ color: "#f50" }} onClick={() => {
            this.setState({
              postData: {
                ...postData,
                "status": "",             //（int）维修类型
                "taskNo": "",        //（String）维修人姓名
                "equipmentNo": "",     //（String）开始时间
                "maintainPlanType": ""        //（String）结束时间
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
        this.setNewState("queryOfMonth", this.state.postData);
      })
    }

    return (
      <div>
        <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
        <Card title='维保计划列表' extra={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Tag color={cur == "last" ? "green" : ""} onClick={() => {
              this.setState({
                postData: { ...postData, type: "last" },
                cur: "last"
              }, () => {
                this.resetData()
              })
            }}>上月</Tag>
            <Tag color={cur == "current" ? "green" : ""} onClick={() => {
              this.setState({
                postData: { ...postData, type: "current" },
                cur: "current"
              }, () => {
                this.resetData()
              })
            }}>本月</Tag>
            <Tag color={cur == "next" ? "green" : ""} onClick={() => {
              this.setState({
                postData: { ...postData, type: "next" },
                cur: "next"
              }, () => {
                this.resetData()
              })
            }}>下月</Tag>
          </div>
        }>
          <Table size="middle"
            scroll={{x:1500}}
            loading={this.props.submitting}
            pagination={{
              showTotal: total => `共${total}条`, // 分页
              size: "small",
              pageSize: 9,
              showQuickJumper: true,
              current: queryOfMonth.pageNum ? queryOfMonth.pageNum : 1,
              total: queryOfMonth.total ? parseInt(queryOfMonth.total) : 1,
              onChange: pageChange,
            }}
            rowKey='id'
            columns={columns}
            dataSource={queryOfMonth.list ? queryOfMonth.list : []}
          >
          </Table>

        </Card>
      </div>
    )
  }


}

export default Verb



