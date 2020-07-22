import {
  Table, Input, InputNumber, Popconfirm, Form,Tooltip, Divider, Modal, Tree, Button, Row, Col, Icon, Select, Alert, Tag, message, Card
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import CreateForm from "@/components/CreateForm"
import moment from "moment"
import SearchBox from '@/components/SearchBox'
const FormItem = Form.Item;
const EditableContext = React.createContext();
const Search = Input.Search;
const { TreeNode } = Tree;
const InputGroup = Input.Group;
const { Option } = Select;


@connect(({ device, loading }) => ({
  device,
  submitting: loading.effects['device/deviceknqueryList'],
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
      fields: {},
      /*初始化 main List */
      postData: {
        "pageIndex": 1,
        "pageSize": 9,
        "equipmentId": props.match.params.id ? props.match.params.id : "",             //（int）设备id
        "equipmentTypeName": "",                  //（String）设备编号
        "knowledgeBaseDescribe": "",     //（String）描述
        "knowledgeBaseName": "",       //（String）文件名称
        "purposeType": ""                   //（String）用途key
      },
      postDatas: {
        equipmentKnowledgeBaseId: "",
        pageIndex: 1,
        pageSize: 9,
        equipmentId: ""
      },
      postUrl: "deviceknqueryList",
      curitem: {},
      expandedRowKeys: [],
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
    this.setNewState(postUrl, postData, () => {
      this.handleCancel()
    })
  }

  componentDidMount() {
    this.props.ensureDidMount && this.props.ensureDidMount()
    this.resetData()
  }

  componentWillReceiveProps(nextProps) {
    let parames = nextProps.match ? nextProps.match.params : {};
    if (!parames.id) {
      return
    }
    if (this.props.match.params.id != nextProps.match.params.id) {
      this.setState({
        postData: {
          "pageIndex": 1,
          "pageSize": 9,
          "equipmentId": nextProps.match.params.id,             //（int）设备id
          "equipmentTypeName": "",                  //（String）设备编号
          "knowledgeBaseDescribe": "",     //（String）描述
          "knowledgeBaseName": "",       //（String）文件名称
          "purposeType": ""                   //（String）用途key
        }
      }, () => {
        this.setNewState(this.state.postUrl, this.state.postData)
      })
    }
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
        equipmentTypeId: {
          value: null,
          type: "treeselect",
          title: "设备类型",
          keys: "equipmentTypeId",
          requires: true,
          option: this.props.device.equipmentTypeList
        },
        knowledgeBaseName: {
          value: null,
          type: "input",
          title: "文件名",
          keys: "knowledgeBaseName",
          requires: true
        },
        purposeType: {
          value: null,
          type: "select",
          title: "用途",
          keys: "purposeType",
          requires: true,
          option: this.props.device.purposeTypeList.map((item) => {
            return {
              name: item.dicName,
              id: item.dicKey,
            }
          })
        },
        knowledgeBaseVersion: {
          value: null,
          type: "input",
          title: "版本",
          keys: "knowledgeBaseVersion",
          requires: true
        },
        knowledgeBaseUrl: {
          value: [],
          type: "upload",
          uploadtype: "file",
          title: "文件地址",
          keys: "knowledgeBaseUrl",
          multiple: false,
          col: { span: 24 },
          requires: true
        },
        knowledgeBaseDescribe: {
          value: null,
          type: "textarea",
          title: "描述",
          keys: "knowledgeBaseDescribe",
          requires: false,
          col: { span: 24 },
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

      values.knowledgeBaseUrl = values.knowledgeBaseUrl[0].url ? values.knowledgeBaseUrl[0].url :
        values.knowledgeBaseUrl[0].response.data.dataList[0];


      if (iftype.value == "edit") {
        let postData = { ...values, id: curitem.id };
        this.setNewState("deviceknsave", postData, () => {
          message.success("修改成功！");
          this.setState({ visibleform: false, expandedRowKeys: [] });
          this.resetData();
        });
      } else if (iftype.value == "add") {
        let postData = { ...values };
        this.setNewState("deviceknsave", postData, () => {
          message.success("新增成功！");
          this.setState({ visibleform: false, expandedRowKeys: [] });
          this.resetData();
        });
      } else {
        //ELSE TO DO
      }

    });
  }

  getChildTable(record, expanded) {
    this.setState({
      expandedRowKeys: expanded ? [record.id] : [],
      postDatas: {
        ...this.state.postDatas,
        equipmentKnowledgeBaseId: record.id,
        pageIndex: 1, pageSize: 9,
      }
    }, () => {
      this.setNewState("deviceknchildqueryList", this.state.postDatas, () => {
        this.setState({
          childData: this.props.device.deviceknchildqueryList
        })

      })
    })

  }

  handleSearch = (selectedKeys, dataIndex, key) => {
    let { postUrl } = this.state;
    this.setState({ postData: { ...this.state.postData, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
      if (key) {
        return
      }
      this.setNewState(postUrl, this.state.postData)
    });
  };

  onRef = (ref) => {
    this.child = ref;
  }

  render() {
    let { postData, postUrl, fv, fields, iftype, curitem, expandedRowKeys } = this.state,
      { deviceknqueryList, equipmentNoList, purposeTypeList } = this.props.device;
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
        title: '设备类型',
        dataIndex: 'equipmentTypeName',
        key: 'equipmentTypeName',
        width: 110,
        ellipsis: true,
        ...getsearchbox('equipmentTypeName')
      },
      {
        title: '文件名',
        dataIndex: 'knowledgeBaseName',
        key: 'knowledgeBaseName',
        width: 200,
        ellipsis: true,
        ...getsearchbox('knowledgeBaseName'),
        render: (text, record) => {
          return (record.knowledgeBaseUrl ? <a href={record.knowledgeBaseUrl} target="_blank">{text}</a> : { text })
        }
      },
      {
        title: '用途',
        width: 100,
        ellipsis: true,
        dataIndex: 'purposeTypeName',
        key: 'purposeTypeName',
        ...getselectbox('purposeType', purposeTypeList)
      },
      {
        title: '文件编号',
        dataIndex: 'documentNo',
        key: 'documentNo',
        width: 160,
        ellipsis: true,
      },
      {
        title: '描述',
        dataIndex: 'knowledgeBaseDescribe',
        key: 'knowledgeBaseDescribe',
        ellipsis: true,
      },
      {
        title: '创建日期',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 160,
        ellipsis: true,
      },
      {
        title: '版本',
        dataIndex: 'knowledgeBaseVersion',
        key: 'knowledgeBaseVersion',
        width: 80,
        ellipsis: true,
      },
      {
        title: '上传者',
        dataIndex: 'updateUserName',
        key: 'updateUserName',
        width: 90,
        ellipsis: true,
      },
      {
        title: <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: 90 }}>
          历史
        <a style={{ color: "#f50" }} onClick={() => {
            this.setState({
              postData: {
                ...this.state.postData,
                "pageIndex": 1,
                "pageSize": 9,
                "equipmentTypeName": undefined,                  //（String）设备编号
                "knowledgeBaseName": undefined,       //（String）文件名称
                "purposeType": undefined                   //（String）用途key
              }
            }, () => { this.resetData() })
          }}>
            <Tooltip title="重置">
              <Icon type="reload" />
            </Tooltip>
          </a>
        </div>,
        dataIndex: 'action',
        width: 110,
        key: 'action',
        render: (text, record) => {
          return (<div>
            <a onClick={() => {
              this.getChildTable(record, true)
            }}>历史记录</a>
          </div>)

        }
      },


    ]

    const columnes = [
      {
        title: '设备类型',
        dataIndex: 'equipmentTypeName',
        key: 'equipmentTypeName',
        width: 110,
        ellipsis: true,
      },
      {
        title: '文件编号',
        dataIndex: 'documentNo',
        key: 'documentNo',
        width: 160,
        ellipsis: true,
      },
      {
        title: '文件名',
        dataIndex: 'knowledgeBaseName',
        key: 'knowledgeBaseName',
        render: (text, record) => {
          return (record.knowledgeBaseUrl ? <a href={record.knowledgeBaseUrl} target="_blank">{text}</a> : { text })
        },
        width: 200,
        ellipsis: true,
      },
      {
        title: '用途',
        dataIndex: 'purposeTypeName',
        key: 'purposeTypeName',
        width: 80,
        ellipsis: true,
      },
      {
        title: '描述',
        dataIndex: 'knowledgeBaseDescribe',
        key: 'knowledgeBaseDescribe',
        ellipsis: true,
      },
      {
        title: '创建日期',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 160,
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
        width: 100,
        ellipsis: true,
      }
    ]

    let pageChanges = (page) => {
      this.setState({
        postDatas: { ...this.state.postDatas, pageIndex: page }
      }, () => {
        this.setNewState("deviceknchildqueryList", this.state.postDatas);
      })
    }
    const expandedRowRender = () => {
      return <Table size="middle" columns={columnes} dataSource={this.state.childData ? this.state.childData.list : []}
        pagination={{
          showTotal: total => `共${total}条`, // 分页
          size: "small",
          pageSize: 9,
          showQuickJumper: true,
          current: this.state.childData ? this.state.childData.pageNum : 1,
          total: this.state.childData ? parseInt(this.state.childData.total) : 1,
          onChange: pageChanges,
        }}
      />;
    };
    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("deviceknqueryList", this.state.postData);
      })
    }
    const rowClassNameFn = (record, index) => {
      const { curitem } = this.state;
      if (curitem && curitem.id === record.id) {
        return "selectedRow";
      }
      return null;
    };

    let parames = this.props.match ? this.props.match.params : {};

    const addbtn = () => {
      return parames.id ? null : <a onClick={() => {
        this.setState({
          iftype: {
            name: "新增设备知识库",
            value: "add"
          },
          fv: true
        })
      }}>新增</a>
    }



    return (
      <div>
        <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
        <Card title={parames.name ? <span><a>{this.props.match.params.name}</a>的知识库列表</span> : "设备知识库列表"} extra={
          curitem.id ?
            <div>
              {addbtn()}
              <Divider style={{ marginTop: 6 }} type="vertical"></Divider>
              <a onClick={() => {
                this.setState({
                  fv: true,
                  iftype: {
                    name: "修改设备知识库",
                    value: "edit"
                  },
                  curitem: curitem,
                  fields: {
                    knowledgeBaseVersion: {
                      value: curitem.knowledgeBaseVersion,
                      type: "input",
                      title: "版本",
                      keys: "knowledgeBaseVersion",
                      requires: true
                    },
                    knowledgeBaseUrl: {
                      value: [{
                        uid: moment().valueOf(),
                        name: curitem.knowledgeBaseName,
                        status: 'done',
                        url: curitem.knowledgeBaseUrl,
                      }],
                      defaultval: [{
                        uid: moment().valueOf(),
                        name: curitem.knowledgeBaseName,
                        status: 'done',
                        url: curitem.knowledgeBaseUrl,
                      }],
                      type: "upload",
                      uploadtype: "file",
                      title: "文件地址",
                      keys: "knowledgeBaseUrl",
                      multiple: false,
                      col: { span: 24 },
                      requires: true
                    },
                    knowledgeBaseDescribe: {
                      value: curitem.knowledgeBaseDescribe,
                      type: "textarea",
                      title: "描述",
                      keys: "knowledgeBaseDescribe",
                      requires: false,
                      col: { span: 24 },
                    }
                  },
                })
              }}>修改</a>
              <Divider style={{ marginTop: 6 }} type="vertical"></Divider>
              <Popconfirm
                okText="确认"
                cancelText="取消"
                placement="bottomRight"
                title={"确认删除该知识库？"}
                onConfirm={() => {
                  this.setNewState("devicekndeleteById", { id: curitem.id }, () => {
                    let total = this.props.device.deviceknqueryList.total,
                      page = this.props.device.deviceknqueryList.pageNum;
                    if ((total - 1) % 9 == 0) {
                      page = page - 1
                    }

                    this.setState({
                      postData: { ...this.state.postData, pageIndex: page }
                    }, () => {
                      this.setNewState("deviceknqueryList", postData, () => {
                        message.success("删除成功！");
                      });
                    })
                  })
                }}>
                <a style={{ color: "#ff4800" }}>删除</a>
              </Popconfirm>

            </div>
            : addbtn()
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
              current: deviceknqueryList.pageNum ? deviceknqueryList.pageNum : 1,
              total: deviceknqueryList.total ? parseInt(deviceknqueryList.total) : 1,
              onChange: pageChange,
            }}
            rowKey='id'
            columns={columns}
            dataSource={deviceknqueryList.list ? deviceknqueryList.list : []}
            expandedRowRender={expandedRowRender}
            expandedRowKeys={expandedRowKeys}
            onExpand={(expanded, record) => { this.getChildTable(record, expanded) }}
          >
          </Table>

          <CreateForm
            width={800}
            fields={fields}
            iftype={iftype}
            onChange={this.handleFormChange}
            wrappedComponentRef={this.saveFormRef}
            visible={fv}
            col={{ xs: 24, sm: 24, md: 12, lg: 12, xl: 12, xxl: 12 }}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
          />

        </Card>
      </div>
    )
  }


}

export default Character



