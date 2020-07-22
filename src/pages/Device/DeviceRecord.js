import {
  Table, Input, InputNumber, Popconfirm, Form, Divider, Modal, Tree, Button, Row, Col, Icon, Select, Alert, Tag, message, Card, DatePicker, Badge, Dropdown, Tooltip
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import CreateForm from "@/components/CreateForm"
import moment from 'moment';
import SearchBox from '@/components/SearchBox'

const FormItem = Form.Item;
const EditableContext = React.createContext();
const Search = Input.Search;
const InputGroup = Input.Group;
const { Option } = Select;


@connect(({ device, loading }) => ({
  device,
  submitting: loading.effects['device/dataqueryList'],
  dataqueryAll: loading.effects['device/dataqueryAll'],
}))
class DeviceRecord extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      expandedRowKeys: [],
      iftype: {
        name: "",
        value: ""
      },
      fv: false,
      /*初始化 main List */
      postData: {
        "pageIndex": 1,//integer 当前页码*
        "pageSize": 10,//intefer 每页条数*
        "logType": props.match.params.key,//履历类型 string
        "content": "",//内容 string
        "startTime": "",//开始时间 string
        "endTime": "",//结束时间 string
        "equipmentId": props.match.params.id//设备名称 string

      },
      postUrl: "dataqueryList",
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


  resetData() {
    let { postUrl, postData } = this.state;
    this.setNewState(postUrl, postData)
  }

  componentDidMount() {
    this.props.ensureDidMount && this.props.ensureDidMount()
    this.resetData()
  }

  componentWillReceiveProps(nextProps) {
    let parames = this.props.match?this.props.match.params:{},
        nparams = nextProps.match?nextProps.match.params:{};

    if (parames.key !== nparams.key) {
      this.setState({
        postData: {
          "pageIndex": 1,//integer 当前页码*
          "pageSize": 10,//intefer 每页条数*
          "logType": nparams.key,//履历类型 string
          "content": "",//内容 string
          "startTime": "",//开始时间 string
          "endTime": "",//结束时间 string
          "equipmentId": nparams.id//设备名称 string
        }
      }, () => {
        this.setNewState(this.state.postUrl, this.state.postData)
      })
    }
  }


  getChildTable(record, expanded) {
    this.setState({
      expandedRowKeys: expanded ? [record.id] : []
    }, () => {
      this.setNewState("dataqueryAll", { equipmentLogId: record.id }, () => {
        this.setState({
          childData: this.props.device.dataqueryAll
        })

      })
    })

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

  disabledStartDate = startValue => {
    const endValue = this.state.postData.endTime ? moment(this.state.postData.endTime) : null;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEndDate = endValue => {
    const startValue = this.state.postData.startTime ? moment(this.state.postData.startTime) : null;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  };

  render() {
    let { postData, postUrl, fv, fields, iftype, curitem, expandedRowKeys } = this.state,
      { dataqueryList, dataList } = this.props.device;

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
    }, getdatebox = (key, disableddate) => {
      if (this.child) {
        return this.child.getColumnDateProps(key, disableddate)
      } else {
        return null
      }
    }

    const columns = [
      {
        title: '履历类型',
        dataIndex: 'logTypeName',
        key: 'logTypeName',
        width: 110,
        ellipsis: true
      },
      {
        title: '内容',
        dataIndex: 'content',
        key: 'content',
        width: 100,
        ellipsis: true,
        ...getsearchbox("content")
      },
      {
        title: '开始时间',
        dataIndex: 'startTime',
        key: 'startTime',
        width: 110,
        ellipsis: true,
        ...getdatebox("startTime", this.disabledStartDate)
      },
      {
        title: '结束时间',
        dataIndex: 'endTime',
        key: 'endTime',
        width: 110,
        ellipsis: true,
        ...getdatebox("endTime", this.disabledEndDate)
      },
      {
        title: '设备编号',
        dataIndex: 'equipmentNo',
        key: 'equipmentNo',
        width: 110,
        ellipsis: true,
      },
      {
        title: '设备名称',
        dataIndex: 'equipmentName',
        key: 'equipmentName',
        width: 110,
        ellipsis: true,
      },
      {
        title: '设备型号',
        dataIndex: 'equipmentModel',
        key: 'equipmentModel',
        width: 110,
        ellipsis: true,
      },
      {
        title: '相关工单号',
        dataIndex: 'workOrderNo',
        key: 'workOrderNo',
        width: 110,
        ellipsis: true,
      },
      {
        title: '结果',
        dataIndex: 'result',
        key: 'result',
        width: 110,
        ellipsis: true,
      },
      {
        title: '创建人',
        dataIndex: 'applyUserName',
        key: 'applyUserName',
        width: 110,
        ellipsis: true,
      },
      {
        title: '处理人',
        dataIndex: 'dealUserName',
        key: 'dealUserName',
        width: 110,
        ellipsis: true,
      },
      {
        title: <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: 90 }}>
          操作
        <a style={{ color: "#f50" }} onClick={() => {
            this.setState({
              postData: {
                ...postData,
                "pageIndex": 1,//integer 当前页码*
                "pageSize": 10,//intefer 每页条数*
                "logType": "",//履历类型 string
                "content": "",//内容 string
                "startTime": "",//开始时间 string
                "endTime": "",//结束时间 string
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
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => {
          return (<div>
            <a onClick={() => {
              this.getChildTable(record, true)
            }}>查看详情</a>
          </div>)

        }
      },
    ]

    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("dataqueryList", this.state.postData);
      })
    }

    const expandedRowRender = () => {
      const columns = [
        {
          title: '设备编号',
          dataIndex: 'equipmentNo',
          key: 'equipmentNo',
          width: 110,
          ellipsis: true,
        },
        {
          title: '设备名称',
          dataIndex: 'equipmentName',
          key: 'equipmentName',
          width: 110,
          ellipsis: true,
        },
        {
          title: '设备型号',
          dataIndex: 'equipmentModel',
          key: 'equipmentModel',
          width: 110,
          ellipsis: true,
        },
        {
          title: '相关工单号',
          dataIndex: 'workOrderNo',
          key: 'workOrderNo',
          width: 140,
          ellipsis: true,
        },
        {
          title: '内容',
          dataIndex: 'content',
          key: 'content',
          width: 110,
          ellipsis: true,
        },
        {
          title: '结果',
          dataIndex: 'result',
          key: 'result',
          width: 110,
          ellipsis: true,
        },
        {
          title: '履历类型',
          dataIndex: 'logTypeName',
          key: 'logTypeName',
          width: 110,
          ellipsis: true,
        },
        {
          title: '创建人',
          dataIndex: 'applyUserName',
          key: 'applyUserName',
          width: 110,
          ellipsis: true,
        },
        {
          title: '处理人',
          dataIndex: 'dealUserName',
          key: 'dealUserName',
          width: 110,
          ellipsis: true,
        },
        {
          title: '处理时间',
          dataIndex: 'dealTime',
          key: 'dealTime',
          width: 160,
          ellipsis: true,
        },
        {
          title: '附件',
          dataIndex: 'attachUrl',
          key: 'attachUrl',
          render: (text) => <a href={text ? text : null}>附件</a>

        },
      ];

      return <Table loading={this.props.dataqueryAll} size="middle" scroll={{ x: 1200, y: "59vh" }} columns={columns} dataSource={this.state.childData} pagination={false} />;
    };

    let parames = this.props.match?this.props.match.params:{}

    return (
      <div>
        <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
        <Card title={parames.name ? <span><a>{parames.name}</a>的履历列表</span> : "设备履历列表"} >
          <Table size="middle" scroll={{ x: 1200, y: "59vh" }}
            loading={this.props.submitting}
            pagination={{
              showTotal: total => `共${total}条`, // 分页
              size: "small",
              pageSize: 10,
              showQuickJumper: true,
              current: dataqueryList.pageNum ? dataqueryList.pageNum : 1,
              total: dataqueryList.total ? parseInt(dataqueryList.total) : 0,
              onChange: pageChange,
            }}
            rowKey='id'
            columns={columns}
            dataSource={dataqueryList.list ? dataqueryList.list : []}
            expandedRowRender={expandedRowRender}
            expandedRowKeys={expandedRowKeys}
            onExpand={(expanded, record) => { this.getChildTable(record, expanded) }}
          >
          </Table>


        </Card>
      </div>
    )
  }


}

export default DeviceRecord



