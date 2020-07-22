import {
  Table, Input, InputNumber, Popconfirm, Form, Divider, Modal, Tree, Button, Row, Col, Icon, Select, Alert, Tag, message, Card
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import CreateForm from "@/components/CreateForm"


const FormItem = Form.Item;
const EditableContext = React.createContext();
const Search = Input.Search;
const { TreeNode } = Tree;
const InputGroup = Input.Group;
const { Option } = Select;

//taskqueryList
// noticeType:[],
// businessModuleType:[],
// noticeTimesType:[],
@connect(({ verb, loading }) => ({
  verb,
  submitting: loading.effects['verb/taskqueryList'],
}))
class VerbNotice extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      iftype: {
        name: "",
        value: ""
      },
      fv: false,
      fields: {
        businessModuleType: {
          value: null,
          type: "select",
          title: "业务模块",
          keys: "businessModuleType",
          requires: true,
          option: props.verb.businessModuleType.map((item) => {
            return {
              name: item.dicName,
              id: item.dicKey
            }
          })
        },
        noticeType: {
          value: null,
          type: "select",
          title: "通知方式",
          keys: "noticeType",
          requires: true,
          option: props.verb.noticeType.map((item) => {
            return {
              name: item.dicName,
              id: item.dicKey
            }
          })
        },
        timeInterval: {
          value: null,
          type: "inputnumber",
          title: "通知时间间隔(分钟)",
          keys: "timeInterval",
          requires: true
        },
        noticeTimesType: {
          value: null,
          type: "select",
          title: "通知次数类型",
          keys: "noticeTimesType",
          requires: true,
          option: props.verb.noticeTimesType.map((item) => {
            return {
              name: item.dicName,
              id: item.dicKey
            }
          })
        },
        noticeTimes: {
          value: null,
          type: "inputnumber",
          title: "通知次数",
          keys: "noticeTimes",
          requires: false
        },
      },
      /*初始化 main List */
      postData: {

      },
      postUrl: "taskqueryList",
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
      this.handleCancel()
    })
  }

  componentDidMount() {
this.props.ensureDidMount&&this.props.ensureDidMount()
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
          if (i == "noticeTimesType") {
            fields.noticeTimes.hides = fields[i].value != 0
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
    let { props } = this;
    this.setState({
      fv: false,
      fields: {
        businessModuleType: {
          value: null,
          type: "select",
          title: "业务模块",
          keys: "businessModuleType",
          requires: true,
          option: props.verb.businessModuleType.map((item) => {
            return {
              name: item.dicName,
              id: item.dicKey
            }
          })
        },
        noticeType: {
          value: null,
          type: "select",
          title: "通知方式",
          keys: "noticeType",
          requires: true,
          option: props.verb.noticeType.map((item) => {
            return {
              name: item.dicName,
              id: item.dicKey
            }
          })
        },
        timeInterval: {
          value: null,
          type: "inputnumber",
          title: "通知时间间隔(分钟)",
          keys: "timeInterval",
          requires: true
        },
        noticeTimesType: {
          value: null,
          type: "select",
          title: "通知次数类型",
          keys: "noticeTimesType",
          requires: true,
          option: props.verb.noticeTimesType.map((item) => {
            return {
              name: item.dicName,
              id: item.dicKey
            }
          })
        },
        noticeTimes: {
          value: null,
          type: "inputnumber",
          title: "通知次数",
          keys: "noticeTimes",
          requires: false
        },
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
        this.setNewState("tasksave", postData, () => {
          message.success("修改成功！");
          this.setState({ visibleform: false });
          this.resetData();
        });
      } else if (iftype.value == "add") {
        let postData = { ...values };
        this.setNewState("tasksave", postData, () => {
          message.success("新增成功！");
          this.setState({ visibleform: false });
          this.resetData();
        });
      } else {
        //ELSE TO DO
      }

    });
  }



  render() {
    let { postData, postUrl, fv, fields, iftype, curitem } = this.state,
      { taskqueryList } = this.props.verb;
    const columns = [
      {
        title: '业务类型',
        dataIndex: 'businessModuleTypeName',
        key: 'businessModuleTypeName',
      },
      {
        title: '通知间隔(分钟)',
        dataIndex: 'timeInterval',
        key: 'timeInterval',
      },
      {
        title: '通知次数类型',
        dataIndex: 'noticeTimesTypeName',
        key: 'noticeTimesTypeName',
      },
      {
        title: '通知次数',
        dataIndex: 'noticeTimes',
        key: 'noticeTimes',
      },
      {
        title: '通知方式',
        dataIndex: 'noticeTypeName',
        key: 'noticeTypeName',
      },

    ]

    const rowClassNameFn = (record, index) => {
      const { curitem } = this.state;
      if (curitem && curitem.id === record.id) {
        return "selectedRow";
      }
      return null;
    };

    return (
      <div>
        <Card title='通知设置列表' extra={
          <div style={{ display: "flex", alignItems: "center" }}>
            <a onClick={() => {
              this.setState({
                iftype: {
                  name: "新增通知设置",
                  value: "add"
                },
                fv: true
              })
            }}>新增</a>
            <Divider style={{display:curitem.id?"block":"none",marginTop:6}} type="vertical"></Divider>

            <a style={{display:curitem.id?"block":"none"}} onClick={() => {
              this.setState({
                fv: true,
                iftype: {
                  name: "修改通知设置",
                  value: "edit"
                },
                curitem: curitem,
                fields: {
                  businessModuleType: {
                    ...this.state.fields.businessModuleType,
                    value: curitem.businessModuleType,
                  },
                  noticeType: {
                    ...this.state.fields.noticeType,
                    value: curitem.noticeType,
                  },

                  timeInterval: {
                    ...this.state.fields.timeInterval,
                    value: curitem.timeInterval,
                  },
                  noticeTimesType: {
                    ...this.state.fields.noticeTimesType,
                    value: curitem.noticeTimesType,
                  },
                  noticeTimes: {
                    ...this.state.fields.noticeTimes,
                    value: curitem.noticeTimes,
                    hides:curitem.noticeTimesType != 0
                  },
                },
              })
            }}>修改</a>
            <Divider style={{display:curitem.id?"block":"none",marginTop:6}} type="vertical"></Divider>
            <Popconfirm
              okText="确认"
              cancelText="取消"
              placement="bottomRight"
              title={"确认删除该通知？"}
              onConfirm={() => {
                this.setNewState("taskdeleteById", { id: curitem.id }, () => {
                  this.setNewState("taskqueryList", postData, () => {
                    message.success("删除成功！");
                  });
                })
              }}>
              <a  style={{display:curitem.id?"block":"none", color: "#ff4800"}}>删除</a>
            </Popconfirm>


          </div>
        }>
          <Table size="middle"  
            loading={this.props.submitting}
            onRow={record => {
              return {
                onClick: event => {
                  this.setState({ curitem: record });
                }, // 点击行
              };
            }}
            rowClassName={(record, index) => rowClassNameFn(record, index)}
            pagination={false}
            rowKey='id'
            columns={columns}
            dataSource={taskqueryList ? taskqueryList : []}
          >
          </Table>

          <CreateForm
            fields={fields}
            data={{}}
            iftype={iftype}
            onChange={this.handleFormChange}
            wrappedComponentRef={this.saveFormRef}
            visible={fv}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
          />

        </Card>
      </div>
    )
  }


}

export default VerbNotice



