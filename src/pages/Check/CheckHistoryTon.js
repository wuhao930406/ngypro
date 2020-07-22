import {
  Table, Input, InputNumber, Popconfirm, Form, Divider, Modal, Tree, Button, Row, Col, Icon, Select, Alert, Tag, message, Card, Tooltip
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import CreateForm from "@/components/CreateForm"
import SearchBox from '@/components/SearchBox';
import router from 'umi/router'

const FormItem = Form.Item;
const EditableContext = React.createContext();
const Search = Input.Search;
const { TreeNode } = Tree;
const InputGroup = Input.Group;
const { Option } = Select;


@connect(({ check, loading }) => ({
  check,
  submitting: loading.effects['check/hisqueryListton'],
  submittings: loading.effects['check/queryHiston'],
}))
class CheckHistoryTon extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      iftype: {
        name: "",
        value: ""
      },
      fv: false,
      fields: {
      },
      /*初始化 main List */
      postData: {
        "pageIndex": 1,
        "pageSize": 9,
        "equipmentName": "",   //----------------设备名称
        "equipmentNo": "",  //--------------------设备编号
        "taskNo": "",      //----------------------工单号
        "pointCheckUserName": "",  //---------------点检人
        "startDate": "",  //--------------点检开始时间
        "endDate": "",                         //-----------------点检结束时间
        "status": ""          //------------状态(0正常,1异常)
      },
      postUrl: "hisqueryListton",
      curitem: {}





    }
  }

  //设置新状态
  setNewState(type, values, fn) {
    const { dispatch } = this.props;
    dispatch({
      type: 'check/' + type,
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
    this.props.ensureDidMount && this.props.ensureDidMount()
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
        pointCheckItem: {
          value: null,
          type: "input",
          title: "点检项目",
          keys: "pointCheckItem",
          requires: true
        },
        normalReference: {
          value: null,
          type: "input",
          title: "指标",
          keys: "normalReference",
          requires: false
        },
        remark: {
          value: null,
          type: "textarea",
          title: "备注",
          keys: "remark",
          requires: false
        }
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
      if (iftype.value == "edit") {
        let postData = { ...values, id: curitem.id };
        this.setNewState("checksave", postData, () => {
          message.success("修改成功！");
          this.setState({ fv: false });
          this.resetData();
        });
      } else if (iftype.value == "add") {
        let postData = { ...values };
        this.setNewState("checksave", postData, () => {
          message.success("新增成功！");
          this.setState({ fv: false });
          this.resetData();
        });
      } else {
        //ELSE TO DO
      }

    });
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
    let { postData, postUrl, fv, fields, iftype, curitem } = this.state,
      { hisqueryListton, queryHiston } = this.props.check;
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
    }, getdaterangebox = (start, end) => {
      if (this.child) {
        return this.child.getColumnRangeProps(start, end)
      } else {
        return null
      }
    };
    const columns = [
      {
        title: '工单号',
        dataIndex: 'taskNo',
        key: 'taskNo',
        ellipsis: true,
        ...getsearchbox("taskNo")
      },
      {
        title: '设备名称',
        dataIndex: 'equipmentName',
        key: 'equipmentName',
        ellipsis: true,
        ...getsearchbox("equipmentName")
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
        title: '点检人',
        dataIndex: 'pointCheckUserName',
        key: 'pointCheckUserName',
        width: 110,
        ellipsis: true,
        ...getsearchbox("pointCheckUserName")
      },
      {
        title: '点检时间',
        dataIndex: 'pointCheckItemDate',
        key: 'pointCheckItemDate',
        width: 110,
        ellipsis: true,
        ...getdaterangebox("startDate", "endDate")
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 110,
        ellipsis: true,
        ...getselectbox("status", [{ dicName: "异常", dicKey: "1" }, { dicName: "正常", dicKey: "0" }]),
        render: (text) => <span>{text == 1 ? "异常" : "正常"}</span>,
      },
      {
        title: <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: 120 }}>
          设备位置号
         <a style={{ color: "#f50", paddingLeft: 12 }} onClick={() => {
            this.setState({
              postData: {
                pageIndex: 1,
                pageSize: 9,
                "equipmentName": "",   //----------------设备名称
                "equipmentNo": "",  //--------------------设备编号
                "taskNo": "",      //----------------------工单号
                "pointCheckUserName": "",  //---------------点检人
                "startDate": "",  //--------------点检开始时间
                "endDate": "",                         //-----------------点检结束时间
                "status": ""          //------------状态(0正常,1异常)
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
        width: 140,
        dataIndex: 'positionNo',
        key: 'positionNo',
      },


    ]

    let expandedRowRender = () => {
      console.log(queryHiston)
      return <Table
        bordered
        loading={this.props.submittings}
        dataSource={queryHiston ? queryHiston : []}
        pagination={false}
        columns={[
          {
            title: '点检项目',
            dataIndex: 'pointCheckItem',
            key: 'pointCheckItem',
          },
          {
            title: '正常参考',
            dataIndex: 'normalReference',
            key: 'normalReference',
          },
          {
            title: '点检结果',
            dataIndex: 'pointCheckItemResultType',
            key: 'pointCheckItemResultType',
            render: (text) => <span>{text == "1" ? "异常" : "正常"}</span>
          },
          {
            title: '异常记录',
            dataIndex: 'exceptionRecord',
            key: 'exceptionRecord',
          },
          {
            title: '周期类型',
            dataIndex: 'periodTypeName',
            key: 'periodTypeName',
          },
        ]}


      ></Table>


    }


    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("hisqueryListton", this.state.postData);
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
        <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
        <Card title='点检历史'>
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
              current: hisqueryListton.pageNum ? hisqueryListton.pageNum : 1,
              total: hisqueryListton.total ? parseInt(hisqueryListton.total) : 1,
              onChange: pageChange,
            }}
            rowKey='id'
            columns={columns}
            dataSource={hisqueryListton.list ? hisqueryListton.list : []}
            onExpand={(expanded, record) => {
              this.setState({
                expandedRowKeys: expanded ? [record.id] : [],
              }, () => {
                this.setNewState("queryHiston", { equipmentPointCheckItemDayTaskId: record.id }, () => {

                })
              })
            }}
            expandedRowKeys={this.state.expandedRowKeys ? this.state.expandedRowKeys : []}
            expandedRowRender={expandedRowRender}
          >
          </Table>


        </Card>
      </div>
    )
  }


}

export default CheckHistoryTon



