import {
  Table, Tabs, PageHeader, Card
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import SearchBox from '@/components/SearchBox'
const { TabPane } = Tabs;

@connect(({ repair, loading }) => ({
  repair,
  queryYes: loading.effects['repair/queryYes'],
  queryNo: loading.effects['repair/queryNo'],
}))
class ChildTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postData: {
        "pageIndex": 1,      //------------当前页码(必填)
        "pageSize": 9,      //------------每页条数(必填)
        "equipmentNo": "",    //-------------设备编号
        "equipmentName": "",   //-----------设备名称
        "errorCode": ""              //-----------错误码
      },
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

  resetData(posturl) {
    this.setNewState(posturl, this.state.postData)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.postUrl !== nextProps.postUrl) {
      this.resetData(nextProps.postUrl)
    }
  }

  componentDidMount() {
    this.props.ensureDidMount&&this.props.ensureDidMount()
    this.resetData(this.props.postUrl)
  }


  handleSearch = (selectedKeys, dataIndex) => {
    let { postUrl } = this.props;
    this.setState({ postData: { ...this.state.postData, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
      this.setNewState(postUrl, this.state.postData)
    });
  };

  onRef = (ref) => {
    this.child = ref;
  }

  render() {
    let { queryIfs } = this.props.repair;
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
    let columnes = [
      {
        title: '设备编号',
        dataIndex: 'equipmentNo',
        key: 'equipmentNo',
        ...getsearchbox("equipmentNo")
      },
      {
        title: '设备名称',
        dataIndex: 'equipmentName',
        key: 'equipmentName',
        ...getsearchbox("equipmentName")
      },
      {
        title: '错误码',
        dataIndex: 'errorCode',
        key: 'errorCode',
        ...getsearchbox("errorCode")
      },
      {
        title: '错误时间',
        dataIndex: 'errorTime',
        key: 'errorTime',
      },
      {
        title: '报修信息',
        dataIndex: 'message',
        key: 'message',
      },
    ]
    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState(this.props.postUrl, this.state.postData);
      })
    }
    return <div>
      <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
      <Table size="middle"
        dataSource={queryIfs.list ? queryIfs.list : []}
        loading={this.props[this.props.postUrl]}
        pagination={{
          showTotal: total => `共${total}条`, // 分页
          size: "small",
          pageSize: 9,
          showQuickJumper: true,
          current: queryIfs.pageNum ? queryIfs.pageNum : 1,
          total: queryIfs.total ? parseInt(queryIfs.total) : 1,
          onChange: pageChange,
        }}
        rowKey='id'
        columns={columnes}
      >
      </Table>
    </div>
  }

}


class RepairList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      iftype: {},
      key: "1"
    }
  }
  componentDidMount() {
    this.props.ensureDidMount&&this.props.ensureDidMount()
  }

  render() {
    let { key } = this.state;
    let callback = (key) => {
      this.setState({ key })
    }
    return (
      <Card>
        <PageHeader
          title="自动报修设置"
          subTitle="切换已报修/需要报修"
        >
          <Tabs activeKey={key} onChange={callback}>
            <TabPane tab="需要自动报修的日志" key="1">
              {
                key == "1" && <ChildTable key="1" postUrl={"queryNo"}></ChildTable>
              }
            </TabPane>
            <TabPane tab="已经自动报修的日志" key="2">
              {
                key == "2" && <ChildTable key="2" postUrl={"queryYes"}></ChildTable>
              }
            </TabPane>
          </Tabs>
        </PageHeader>
      </Card>




    )
  }


}

export default RepairList



