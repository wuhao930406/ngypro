import {
  Table, Input, InputNumber, Popconfirm, Form, Divider, Modal, Tree, Button, Row, Col, Icon, Select, Alert, Tag, message, Card, DatePicker,Tooltip
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


@connect(({ spare, loading }) => ({
  spare,
  submitting: loading.effects['spare/spareUsequeryList'],
}))
class SpareUseage extends React.Component {

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
        pageIndex: 1,
        pageSize: 9,
        "equipmentNo": "", // 设备编号
        "sparePartsNo": "", // 备件料号
        "sparePartsName": "", // 备件名称
        "startTime": "", // 使用时间（开始）
        "endTime": "", // 使用时间（结束）
        "sparePartsId": props.match.params.id ? props.match.params.id : "",
        "consumeUserId": props.match.params.userid ? props.match.params.userid : "",
      },
      postUrl: "spareUsequeryList",
      curitem: {}
    }
  }

  //设置新状态
  setNewState(type, values, fn) {
    const { dispatch } = this.props;
    dispatch({
      type: 'spare/' + type,
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

  componentWillReceiveProps(nextProps) {
    let parames = this.props.match ? this.props.match.params : {},
      nparams = nextProps.match ? nextProps.match.params : {};
    if (parames.userid != nparams.userid) {
      this.setState({
        postData: {
          pageIndex: 1,
          pageSize: 9,
          "equipmentNo": "", // 设备编号
          "sparePartsNo": "", // 备件料号
          "sparePartsName": "", // 备件名称
          "startTime": "", // 使用时间（开始）
          "endTime": "", // 使用时间（结束）
          "sparePartsId": nparams.id ? nparams.id : "",
          "consumeUserId": nparams.userid ? nparams.userid : "",
        }
      }, () => {
        this.setNewState(this.state.postUrl, this.state.postData)
      })
    }
  }

  componentDidMount() {
    this.props.ensureDidMount && this.props.ensureDidMount()
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

  onRef = (ref) => {
    this.child = ref;
  }



  render() {
    let { postData, postUrl, iftype, curitem } = this.state,
      { spareUsequeryList, userList } = this.props.spare;
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
        title: '料号',
        dataIndex: 'sparePartsNo',
        key: 'sparePartsNo',
        width: 80,
        ellipsis: true,
        ...getsearchbox('sparePartsNo')
      },
      {
        title: '备件名称',
        dataIndex: 'sparePartsName',
        key: 'sparePartsName',
        ellipsis: true,
        ...getsearchbox('sparePartsName')
      },
      {
        title: '备件类型',
        dataIndex: 'sparePartsTypeName',
        key: 'sparePartsTypeName',
        width: 110,
        ellipsis: true,
      },
      {
        title: '相关单号',
        dataIndex: 'taskNo',
        key: 'taskNo',
        width: 110,
        ellipsis: true,
      },
      {
        title: '使用类型',
        dataIndex: 'consumeTypeName',
        key: 'consumeTypeName',
        width: 110,
        ellipsis: true,
      },
      {
        title: '使用设备编号',
        dataIndex: 'equipmentNo',
        key: 'equipmentNo',
        width: 130,
        ellipsis: true,
        ...getsearchbox('equipmentNo')

      },
      {
        title: '使用设备名称',
        dataIndex: 'equipmentName',
        key: 'equipmentName',
        width: 120,
        ellipsis: true,
      },
      {
        title: '使用人',
        dataIndex: 'consumeUserName',
        key: 'consumeUserName',
        width: 80,
        ellipsis: true,
      },
      {
        title: '所使用时间',
        dataIndex: 'consumeTime',
        key: 'consumeTime',
        ...getdaterangebox("startTime", "endTime"),
        width: 160,
        ellipsis: true,
      },
      {
        title: <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: 90 }}>
          使用数量
        <a style={{ color: "#f50" }} onClick={() => {
            this.setState({
              postData: {
                ...postData,
                "equipmentNo": "", // 设备编号
                "sparePartsNo": "", // 备件料号
                "sparePartsName": "", // 备件名称
                "startTime": "", // 使用时间（开始）
                "endTime": "", // 使用时间（结束）
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
        dataIndex: 'consumeCount',
        key: 'consumeCount',
      },
    ]

    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("spareUsequeryList", this.state.postData);
      })
    }
    let col = {
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
    }

    let parames = this.props.match ? this.props.match.params : {};

    return (
      <div>
        <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>

        <Card title={parames.name ? <span><a>{parames.name}</a>的使用总览</span> : "备件使用总览"}>
          <Table size="middle"
            loading={this.props.submitting}
            pagination={{
              showTotal: total => `共${total}条`, // 分页
              size: "small",
              pageSize: 9,
              showQuickJumper: true,
              current: spareUsequeryList.pageNum ? spareUsequeryList.pageNum : 1,
              total: spareUsequeryList.total ? parseInt(spareUsequeryList.total) : 1,
              onChange: pageChange,
            }}
            rowKey='id'
            columns={columns}
            dataSource={spareUsequeryList.list ? spareUsequeryList.list : []}
          >
          </Table>


        </Card>
      </div>
    )
  }


}

export default SpareUseage



