import {
  Table, Input, InputNumber, Popconfirm, Form, Divider, Modal, Tree, Button, Row, Col, Icon, Select, Alert, Tag, message, Card
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import CreateForm from "@/components/CreateForm"
import SearchBox from '@/components/SearchBox'


const FormItem = Form.Item;
const EditableContext = React.createContext();
const Search = Input.Search;
const { TreeNode } = Tree;
const InputGroup = Input.Group;
const { Option } = Select;


@connect(({ verb, loading }) => ({
  verb,
  submitting: loading.effects['verb/werbproqueryList'],
}))
class Character extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      iftype: {
        name: "",
        value: ""
      },
      fv: false,
      fields: {
        maintainItem: {
          value: null,
          type: "input",
          title: "保养项目",
          keys: "maintainItem",
          requires: true
        },
        maintainContent: {
          value: null,
          type: "textarea",
          title: "保养内容",
          keys: "maintainContent",
          requires: true
        }
      },
      /*初始化 main List */
      postData: {
        pageIndex: 1,
        pageSize: 9,
        maintainItem: "" //维保名
      },
      postUrl: "werbproqueryList",
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
        maintainItem: {
          value: null,
          type: "input",
          title: "保养项目",
          keys: "maintainItem",
          requires: true
        },
        maintainContent: {
          value: null,
          type: "textarea",
          title: "保养内容",
          keys: "maintainContent",
          requires: true
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
        this.setNewState("werbprosave", postData, () => {
          message.success("修改成功！");
          this.setState({ visibleform: false });
          this.resetData();
        });
      } else if (iftype.value == "add") {
        let postData = { ...values };
        this.setNewState("werbprosave", postData, () => {
          message.success("新增成功！");
          this.setState({ visibleform: false });
          this.resetData();
        });
      } else {
        //ELSE TO DO
      }

    });
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
    let { postData, postUrl, fv, fields, iftype, curitem } = this.state,
      { werbproqueryList } = this.props.verb;
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
        title: '保养项目',
        dataIndex: 'maintainItem',
        key: 'maintainItem',
        render: (text) => (<span style={{ width: "100%", wordBreak: "break-all" }}>{text}</span>),
        ...getsearchbox('maintainItem')
      },
      {
        title: '保养内容',
        dataIndex: 'maintainContent',
        key: 'maintainContent',
        render: (text) => (<span style={{ width: "100%", wordBreak: "break-all" }}>{text}</span>)
      }


    ]

    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("werbproqueryList", this.state.postData);
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
        <Card title='维保项目设置列表' extra={
          <div style={{ display: "flex", alignItems: "center" }}>
            <a onClick={() => {
              this.setState({
                iftype: {
                  name: "新增维保",
                  value: "add"
                },
                fv: true
              })
            }}>新增</a>
            {
              curitem.id &&
              <div style={{ display: "flex", alignItems: "center" }}>
                <Divider style={{ marginTop: 6 }} type="vertical"></Divider>
                <a onClick={() => {
                  this.setState({
                    fv: true,
                    iftype: {
                      name: "修改维保",
                      value: "edit"
                    },
                    curitem: curitem,
                    fields: {
                      maintainItem: {
                        value: curitem.maintainItem,
                        type: "input",
                        title: "保养项目",
                        keys: "maintainItem",
                        requires: true
                      },
                      maintainContent: {
                        value: curitem.maintainContent,
                        type: "textarea",
                        title: "保养内容",
                        keys: "maintainContent",
                        requires: true
                      }
                    },
                  })
                }}>修改</a>
                <Divider style={{ marginTop: 6 }} type="vertical"></Divider>
                <Popconfirm
                  okText="确认"
                  cancelText="取消"
                  placement="bottomRight"
                  title={"确认删除该项目？"}
                  onConfirm={() => {
                    this.setNewState("werbprodeleteById", { id: curitem.id }, () => {
                      let total = this.props.verb.werbproqueryList.total,
                        page = this.props.verb.werbproqueryList.pageNum;
                      if ((total - 1) % 9 == 0) {
                        page = page - 1
                      }

                      this.setState({
                        postData: { ...this.state.postData, pageIndex: page }
                      }, () => {
                        this.setNewState("werbproqueryList", postData, () => {
                          message.success("删除成功！");
                        });
                      })
                    })
                  }}>
                  <a style={{ color: "#ff4800" }}>删除</a>
                </Popconfirm>
              </div>
            }
          </div>

        }>
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
              current: werbproqueryList.pageNum ? werbproqueryList.pageNum : 1,
              total: werbproqueryList.total ? parseInt(werbproqueryList.total) : 1,
              onChange: pageChange,
            }}
            rowKey='id'
            columns={columns}
            dataSource={werbproqueryList.list ? werbproqueryList.list : []}
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

export default Character



