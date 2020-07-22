import {
  Table, Input, InputNumber, Popconfirm, Form, Divider, Modal, Tree, Button, Row, Col, Icon, Select, Alert, Tag, message, Card, DatePicker,Tooltip
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import CreateForm from "@/components/CreateForm"
import moment from 'moment';
import { Link } from 'react-router-dom';
import SearchBox from '@/components/SearchBox'

const FormItem = Form.Item;
const EditableContext = React.createContext();
const Search = Input.Search;
const { TreeNode } = Tree;
const InputGroup = Input.Group;
const { Option } = Select;


@connect(({ spare, loading }) => ({
  spare,
  submitting: loading.effects['spare/spareuspqueryList'],
}))
class SpareOverView extends React.Component {

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
        "sparePartsName": "", // 备件名称
        "sparePartsNo": "", // 备件料号
        "userId": "" // 用户主键
      },
      postUrl: "spareuspqueryList",
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
    this.setNewState(postUrl, postData, () => {

    })
  }

  componentDidMount() {
    this.props.ensureDidMount && this.props.ensureDidMount()
    this.resetData()
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
      { spareuspqueryList, userList } = this.props.spare;
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
        title: '料号',
        dataIndex: 'sparePartsNo',
        width: 80,
        ellipsis: true,
        key: 'sparePartsNo',
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
        title: '持有人',
        dataIndex: 'userName',
        key: 'userName',
        width: 100,
        ellipsis: true,
        ...getselectbox("userId", userList ? userList.map((item) => {
          return {
            dicName: item.userName,
            dicKey: item.id
          }
        }) : [])
      },
      {
        title: '备件类型',
        dataIndex: 'sparePartsTypeName',
        key: 'sparePartsTypeName',
        width: 100,
        ellipsis: true,
      },

      {
        title: '累积持有数量',
        dataIndex: 'totalStock',
        key: 'totalStock',
        width: 100,
        ellipsis: true,
      },
      {
        title: '现持有数量',
        dataIndex: 'availableStock',
        key: 'availableStock',
        width: 100,
        ellipsis: true,
      },
      {
        title: '所在部门',
        dataIndex: 'departmentName',
        key: 'departmentName',
        width: 90,
        ellipsis: true,
      },
      {
        title: <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: 90 }}>
          使用记录
          <a style={{ color: "#f50" }} onClick={() => {
            this.setState({
              postData: {
                ...postData,
                "sparePartsName": "", // 备件名称
                "sparePartsNo": "", // 备件料号
                "userId": "" // 用户主键
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
        ellipsis: true,
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => {
          return (<Link to={`/spare/spareoverview/spareuseage/${record.sparePartsId}/${record.userId}/${record.sparePartsName}`}>查看使用记录</Link>)
        }
      },
    ]

    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("spareuspqueryList", this.state.postData);
      })
    }
    let col = {
      xs: 24,
      sm: 24,
      md: 12,
      lg: 12,
      xl: 6,
      xxl: 6
    }, cols = {
      xs: 24,
      sm: 24,
      md: 12,
      lg: 12,
      xl: 6,
      xxl: 6
    }
    return (
      <div>
        <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>

        <Card title='备件总览'>
          <Table size="middle"
            loading={this.props.submitting}
            pagination={{
              showTotal: total => `共${total}条`, // 分页
              size: "small",
              pageSize: 9,
              showQuickJumper: true,
              current: spareuspqueryList.pageNum ? spareuspqueryList.pageNum : 1,
              total: spareuspqueryList.total ? parseInt(spareuspqueryList.total) : 1,
              onChange: pageChange,
            }}
            rowKey='id'
            columns={columns}
            dataSource={spareuspqueryList.list ? spareuspqueryList.list : []}
          >
          </Table>


        </Card>
      </div>
    )
  }


}

export default SpareOverView



