import {
  Table, Input, Tooltip, InputNumber, Popconfirm, Form, Divider, Modal, Tree, Button, Row, Col, Icon, Select, Alert, Tag, message, Card, DatePicker, Empty
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import CreateForm from "@/components/CreateForm"
import moment from 'moment'
import ReactEcharts from "echarts-for-react";
import SearchBox from '@/components/SearchBox'

const FormItem = Form.Item;
const EditableContext = React.createContext();
const Search = Input.Search;
const { TreeNode } = Tree;
const InputGroup = Input.Group;
const { Option } = Select;


@connect(({ publicmodel, repair, loading }) => ({
  repair,
  publicmodel,
  submitting: loading.effects['repair/TroublequeryTreeList'],
}))
class RepairList extends React.Component {

  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '文件名',
        dataIndex: 'knowledgeBaseName',
        key: 'knowledgeBaseName',
      },
      {
        title: '文件编号',
        dataIndex: 'documentNo',
        key: 'documentNo',
      },
      {
        title: '设备类型',
        dataIndex: 'equipmentTypeName',
        key: 'equipmentTypeName',
      },
      {
        title: '用途',
        dataIndex: 'purposeTypeName',
        key: 'purposeTypeName',
      },
      {
        title: '描述',
        dataIndex: 'knowledgeBaseDescribe',
        key: 'knowledgeBaseDescribe',
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
      },
      {
        title: '上传者',
        dataIndex: 'createUserName',
        key: 'createUserName',
      },
      {
        title: '版本',
        dataIndex: 'knowledgeBaseVersion',
        key: 'knowledgeBaseVersion',
      },
    ]

    this.state = {
      iftype: {
        name: "",
        value: ""
      },
      fv: false,
      expandedRowKeys: [],
      expandedRowKeyes: [],
      fields: {},
      /*初始化 main List */
      postData: {
        pageIndex: 1,
        pageSize: 9,
        faultName: "",
        faultCode: ""
      },
      postDatas: {
        "pageIndex": 1,
        "pageSize": 9,
        "faultId": "",//故障id，必填
        "knowledgeBaseName": "",//文件名，筛选
        "purposeType": "",//用途key，筛选
        "equipmentTypeId": ""//设备类型id
      },
      postDataz: {
        "knowledgeBaseName": "",//文件名，筛选
        "purposeType": "",//用途key，筛选
        "equipmentTypeId": ""//设备类型id，筛选
      },
      postDatad: {
        equipmentKnowledgeBaseId: "",
        pageIndex: 1,
        pageSize: 9,
        equipmentId: ""
      },
      postUrl: "TroublequeryTreeList",
      curitem: {}

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
  //搜索
  setNewStates(type, values, fn) {
    const { dispatch } = this.props;
    dispatch({
      type: 'publicmodel/' + type,
      payload: values
    }).then((res) => {
      if (res) {
        fn ? fn() : null;
      }
    });
  }


  resetData(fn) {
    let { postUrl, postData } = this.state;
    this.setNewState(postUrl, postData, () => {
      this.handleCancel();
      fn ? fn() : null
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
        faultName: {
          value: null,
          type: "input",
          title: "故障名称",
          keys: "faultName",
          requires: true,
        },
        faultCode: {
          value: null,
          type: "input",
          title: "故障代码",
          keys: "faultCode",
          requires: true,
        },
        faultPhenomenon: {
          value: null,
          type: "input",
          title: "故障现象",
          keys: "faultPhenomenon",
          requires: true,
        },
        faultSolution: {
          value: null,
          type: "input",
          title: "处理方法",
          keys: "faultSolution",
          requires: true,
        },
        equipmentTypeId: {
          value: null,
          type: "select",
          title: "设备类型",
          keys: "equipmentTypeId",
          requires: false,
          option: this.props.repair.equipmentTypeList.map((item) => {
            return {
              name: item.equipmentTypeName,
              id: item.id
            }
          })
        },
        remark: {
          value: null,
          type: "textarea",
          title: "备注",
          keys: "remark",
          requires: false,
          col: { span: 24 },
        },
      },
    });
  }

  onSelectChange = (selectval, name) => {
    let { fields } = this.state;
    fields[name] = { ...fields[name], value: selectval };
    this.setState({
      fields
    })
  }
  /*form 提交*/
  handleCreate = () => {
    const form = this.formRef.props.form;
    let { curitem, iftype } = this.state;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      if (iftype.value == "add") {
        let postData = { ...values, parentId: curitem.key ? curitem.key : 0 };
        this.setNewState("Troublesave", postData, () => {
          message.success("新增成功！");
          this.setState({ visibleform: false });
          this.resetData(() => {
            this.setState({
              expandedRowKeys: [curitem.key]
            })

          });
        });

      } else {
        let postData = { ...values, id: curitem.key, parentId: curitem.parentKey ? curitem.parentKey : 0 };
        this.setNewState("Troublesave", postData, () => {
          message.success("修改成功！");
          this.setState({ visibleform: false });
          this.resetData();
        });

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
  handleSearchs = (selectedKeys, dataIndex, end) => {
    let postUrl = "KLqueryKnowledgeByFaultId"
    if (end) {
      let start = dataIndex;
      this.setState({ postDatas: { ...this.state.postDatas, [start]: selectedKeys[0] ? selectedKeys[0] : "", [end]: selectedKeys[1] ? selectedKeys[1] : "" } }, () => {
        this.setNewState(postUrl, this.state.postDatas)
      });
    } else {
      this.setState({ postDatas: { ...this.state.postDatas, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
        this.setNewState(postUrl, this.state.postDatas)
      });
    }

  };
  handleSearchz = (selectedKeys, dataIndex) => {
    let postUrl = "KLqueryAll"
    this.setState({ postDataz: { ...this.state.postDataz, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
      this.setNewStates(postUrl, this.state.postDataz)
    });
  };


  onRef = (ref) => {
    this.child = ref;
  }

  onRefes = (ref) => {
    this.childes = ref;
  }

  onRefs = (ref) => {
    this.childs = ref;
  }

  onRefz = (ref) => {
    this.childz = ref;
  }

  getChildTable(record, expanded) {
    this.setState({
      expandedRowKeyes: expanded ? [record.id] : [],
      postDatad: {
        ...this.state.postDatad,
        equipmentKnowledgeBaseId: record.id,
        pageIndex: 1, pageSize: 9,
      }
    }, () => {
      this.setNewState("deviceknchildqueryList", this.state.postDatad, () => {
        this.setState({
          childData: this.props.repair.deviceknchildqueryList
        })

      })
    })

  }



  render() {
    let { postData, postUrl, fv, fields, iftype, curitem, expandedRowKeys, expandedRowKeyes, postDatas } = this.state,
      { TroublequeryTreeList, repairTypeList, faultTypeList, chart, rslgetRepairDetail, dataList, KLqueryKnowledgeByFaultId } = this.props.repair;


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
    }, getsearchboxs = (key) => {
      if (this.childes) {
        return this.childes.getColumnSearchProps(key)
      } else {
        return null
      }
    }, gettreeselectboxs = (key, option) => {
      if (this.childes) {
        return this.childes.getColumnTreeSelectProps(key, option)
      } else {
        return null
      }
    }, getselectboxs = (key, option) => {
      if (this.childes) {
        return this.childes.getColumnSelectProps(key, option)
      } else {
        return null
      }
    }, getsearchboxz = (key) => {
      if (this.childz) {
        return this.childz.getColumnSearchProps(key)
      } else {
        return null
      }
    }, gettreeselectboxz = (key, option) => {
      if (this.childz) {
        return this.childz.getColumnTreeSelectProps(key, option)
      } else {
        return null
      }
    }, getselectboxz = (key, option) => {
      if (this.childz) {
        return this.childz.getColumnSelectProps(key, option)
      } else {
        return null
      }
    };

    this.columns = [
      {
        title: '文件名',
        dataIndex: 'knowledgeBaseName',
        key: 'knowledgeBaseName',
        width: 90,
        ellipsis: true,
        ...getsearchboxz("knowledgeBaseName")
      },
      {
        title: '文件编号',
        dataIndex: 'documentNo',
        key: 'documentNo',
        ellipsis: true,
      },
      {
        title: '设备类型',
        dataIndex: 'equipmentTypeName',
        key: 'equipmentTypeName',
        width: 120,
        ellipsis: true,
        ...gettreeselectboxz("equipmentTypeId", this.props.publicmodel.equipmentTypeList)
      },
      {
        title: '用途',
        dataIndex: 'purposeTypeName',
        key: 'purposeTypeName',
        width: 90,
        ellipsis: true,
        ...getselectboxz("purposeType", this.props.publicmodel.purposeTypeList && this.props.publicmodel.purposeTypeList)
      },
      {
        title: '描述',
        dataIndex: 'knowledgeBaseDescribe',
        key: 'knowledgeBaseDescribe',
        width: 120,
        ellipsis: true,
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        width: 160,
        ellipsis: true,
      },
      {
        title: '上传者',
        dataIndex: 'createUserName',
        key: 'createUserName',
        width: 100,
        ellipsis: true,
      },
      {
        title: '版本',
        dataIndex: 'knowledgeBaseVersion',
        key: 'knowledgeBaseVersion',
        width: 90,
        ellipsis: true,
      },
    ]

    const columnes = [
      {
        title: '文件名',
        dataIndex: 'knowledgeBaseName',
        key: 'knowledgeBaseName',
        render: (text, record) => {
          return (record.knowledgeBaseUrl ? <a href={record.knowledgeBaseUrl} target="_blank">{text}</a> : { text })
        }
      },
      {
        title: '设备类型',
        dataIndex: 'equipmentTypeName',
        key: 'equipmentTypeName',
        width: 120,
        ellipsis: true,
      },
      {
        title: '文件编号',
        dataIndex: 'documentNo',
        key: 'documentNo',
        width: 120,
        ellipsis: true,
      },
      {
        title: '用途',
        dataIndex: 'purposeTypeName',
        key: 'purposeTypeName',
        width: 90,
        ellipsis: true,
      },
      {
        title: '描述',
        dataIndex: 'knowledgeBaseDescribe',
        key: 'knowledgeBaseDescribe',
        width: 90,
        ellipsis: true,
      },
      {
        title: '创建日期',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 120,
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
        width: 90,
        ellipsis: true,
      },


    ]


    const columns = [
      {
        title: <span>故障名称</span>,
        dataIndex: 'title',
        key: 'title',
        ...getsearchbox("faultName"),
        render: (text, record) => {
          return <a style={{ color: record.level == 1 ? "#f50" : "#0e6eb8" }}>{text}</a>
        }
      },
      {
        title: '故障代码',
        dataIndex: 'no',
        key: 'no',
        ...getsearchbox("faultCode")
      },
      {
        title: '故障现象',
        dataIndex: 'faultPhenomenon',
        key: 'faultPhenomenon',
      },
      {
        title: '解决方案',
        dataIndex: 'faultSolution',
        key: 'faultSolution',
      },
      {
        title: '设备类型名',
        dataIndex: 'equipmentTypeName',
        key: 'equipmentTypeName',
      },
      {
        title: "备注",
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: 80 }}>
          查看
          <a style={{ color: "#f50" }} onClick={() => {
            this.setState({
              postData: {
                ...postData,
                faultName: "",
                faultCode: ""
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
        width: 100,
        dataIndex: 'see',
        key: 'see',
        render: (text, record) => {
          if (record.level == 1 || !record.knowledgeIdList) {
            return null
          } else {
            return <a onClick={() => {
              this.setNewState("KLqueryKnowledgeByFaultId", { ...this.state.postDatas, faultId: record.key }, () => {
                this.setState({
                  curitem: record,
                  postDatas: { ...this.state.postDatas, faultId: record.key },
                  visible: true,
                  iftype: {
                    name: `${record.title}的知识文件`
                  }
                })

              })

            }}>
              知识文件
          </a>
          }

        }
      },

    ]

    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("TroublequeryTreeList", this.state.postData);
      })
    }, pageChanges = (page) => {
      this.setState({
        postDatas: { ...this.state.postDatas, pageIndex: page }
      }, () => {
        this.setNewState("KLqueryKnowledgeByFaultId", this.state.postDatas);
      })
    }, pageChanged = (page) => {
      this.setState({
        postDatad: { ...this.state.postDatad, pageIndex: page }
      }, () => {
        this.setNewState("deviceknchildqueryList", this.state.postDatad);
      })
    }

    const rowClassNameFn = (record, index) => {
      const { curitem } = this.state;
      if (curitem && curitem.key === record.key) {
        return "selectedRow";
      }
      return null;
    };

    const expandedRowRender = () => {
      return <Table size="middle" columns={columnes} dataSource={this.state.childData ? this.state.childData.list : []}
        pagination={{
          showTotal: total => `共${total}条`, // 分页
          size: "small",
          pageSize: 9,
          showQuickJumper: true,
          current: this.state.childData ? this.state.childData.pageNum : 1,
          total: this.state.childData ? parseInt(this.state.childData.total) : 1,
          onChange: pageChanged,
        }}
      />;
    };
    return (
      <div>
        <Modal
          width={1200}
          style={{maxWidth:"95%"}}
          title={iftype.name}
          visible={this.state.visible}
          onCancel={() => {
            this.setState({ visible: false })
          }}
          footer={false}
        >
          <Table
            size="middle"
            scroll={{x:960}}
            dataSource={KLqueryKnowledgeByFaultId.list ? KLqueryKnowledgeByFaultId.list : []}
            pagination={{
              showTotal: total => `共${total}条`, // 分页
              size: "small",
              pageSize: 9,
              showQuickJumper: true,
              current: KLqueryKnowledgeByFaultId.pageNum ? KLqueryKnowledgeByFaultId.pageNum : 1,
              total: KLqueryKnowledgeByFaultId.total ? parseInt(KLqueryKnowledgeByFaultId.total) : 1,
              onChange: pageChanges,
            }}
            rowKey='id'
            columns={[
              {
                title: '文件名',
                dataIndex: 'knowledgeBaseName',
                key: 'knowledgeBaseName',
                width: 160,
                ellipsis: true,
                ...getsearchboxs("knowledgeBaseName"),
                render: (text, record) => <a href={record.knowledgeBaseUrl} target="_blank">{text}</a>
              },
              {
                title: '文件编号',
                dataIndex: 'documentNo',
                key: 'documentNo',
                ellipsis: true,
              },
              {
                title: '设备类型',
                dataIndex: 'equipmentTypeName',
                key: 'equipmentTypeName',
                width: 120,
                ellipsis: true,
                ...gettreeselectboxs("equipmentTypeId", this.props.repair.equipmentTypeList)
              },
              {
                title: '用途',
                dataIndex: 'purposeTypeName',
                key: 'purposeTypeName',
                width: 90,
                ellipsis: true,
                ...getselectboxs("purposeType", this.props.repair.purposeTypeList && this.props.repair.purposeTypeList)
              },
              {
                title: '描述',
                dataIndex: 'knowledgeBaseDescribe',
                key: 'knowledgeBaseDescribe',
                width: 120,
                ellipsis: true,
              },
              {
                title: '更新时间',
                dataIndex: 'updateTime',
                key: 'updateTime',
                width: 160,
                ellipsis: true,
              },
              {
                title: '上传者',
                dataIndex: 'createUserName',
                key: 'createUserName',
                width: 100,
                ellipsis: true,
              },
              {
                title: '版本',
                dataIndex: 'knowledgeBaseVersion',
                key: 'knowledgeBaseVersion',
                width: 90,
                ellipsis: true,
              },
              // {
              //   title: '操作',
              //   dataIndex: 'action',
              //   key: 'action',
              //   width: 90,
              //   render: (text, record) => (<Popconfirm
              //     okText="确认"
              //     cancelText="取消"
              //     placement="bottomRight"
              //     title={"确认取消关联该知识库？"}
              //     onConfirm={() => {
              //       this.setNewState("KLremove", { faultId: curitem.key, knowledgeBaseId: record.id }, () => {
              //         let total = this.props.repair.KLqueryKnowledgeByFaultId.total,
              //           page = this.props.repair.KLqueryKnowledgeByFaultId.pageNum;
              //         if ((total - 1) % 9 == 0) {
              //           page = page - 1
              //         }
              //         this.setState({
              //           postDatas: { ...this.state.postDatas, pageIndex: page }
              //         }, () => {
              //           this.setNewState("KLqueryKnowledgeByFaultId", postDatas, () => {
              //             message.success("取消关联成功！");
              //           });
              //         })
              //       })
              //     }}>
              //     <a style={{ color: "#ff4800" }}>取消关联</a>
              //   </Popconfirm>)
              // },
            ]}
            onExpand={(expanded, record) => { this.getChildTable(record, expanded) }}
            expandedRowRender={expandedRowRender}
            expandedRowKeys={expandedRowKeyes}
          >

          </Table>

        </Modal>

        <SearchBox onRef={this.onRefz} handleSearch={this.handleSearchz} postData={this.state.postDataz}></SearchBox>
        <SearchBox onRef={this.onRefes} handleSearch={this.handleSearchs} postData={this.state.postDatas}></SearchBox>
        <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
        <Card title='故障设置列表' extra={
          <div style={{ display: "flex", alignItems: "center" }}>
            <a style={{ color: "#f50" }} onClick={() => {
              this.setState({
                curitem: {},
                iftype: {
                  name: `新增设备故障`,
                  value: "add"
                },
                fields: {
                  faultName: {
                    value: null,
                    type: "input",
                    title: "故障名称",
                    keys: "faultName",
                    requires: true,
                  },
                  faultCode: {
                    value: null,
                    type: "input",
                    title: "故障代码",
                    keys: "faultCode",
                    requires: true,
                  },
                  equipmentTypeId: {
                    value: null,
                    type: "select",
                    title: "设备类型",
                    keys: "equipmentTypeId",
                    requires: false,
                    option: this.props.repair.equipmentTypeList.map((item) => {
                      return {
                        name: item.equipmentTypeName,
                        id: item.id
                      }
                    }),
                  },
                  remark: {
                    value: null,
                    type: "textarea",
                    title: "备注",
                    keys: "remark",
                    requires: false,
                    col: { span: 24 },
                  },
                }
              }, () => {
                this.setState({
                  fv: true,
                })
              })
            }}>
              新增故障
          </a>
            <div style={{ display: curitem.key ? "flex" : "none", alignItems: "center" }}>
              {
                curitem.parentKey == "0" && <Divider style={{ marginTop: 6 }} type="vertical"></Divider>
              }
              {
                curitem.parentKey == "0" && <a onClick={() => {
                  this.setState({
                    iftype: {
                      name: `新增 ${curitem.title} 下的故障`,
                      value: "add"
                    },
                    fields: {
                      faultName: {
                        value: null,
                        type: "input",
                        title: "故障名称",
                        keys: "faultName",
                        requires: true,
                      },
                      faultCode: {
                        value: null,
                        type: "input",
                        title: "故障代码",
                        keys: "faultCode",
                        requires: true,
                      },
                      faultPhenomenon: {
                        value: null,
                        type: "input",
                        title: "故障现象",
                        keys: "faultPhenomenon",
                        requires: true,
                      },
                      faultSolution: {
                        value: null,
                        type: "input",
                        title: "处理方法",
                        keys: "faultSolution",
                        requires: true,
                      },
                      remark: {
                        value: null,
                        type: "textarea",
                        title: "备注",
                        keys: "remark",
                        requires: false,
                        col: { span: 24 },
                      },
                      knowledgeIdList: {
                        value: undefined,
                        type: "tablenopage",
                        title: "知识文件",
                        keys: "knowledgeIdList",
                        requires: false,
                        columns: this.columns,
                        dataSource: "KLqueryAll",
                        checktype: "checkbox",//单选or多选
                        hides: false,
                        dv: "id",//key
                        lb: "knowledgeBaseName",//value
                        col: { span: 24 }
                      },
                    }
                  }, () => {
                    this.setState({
                      fv: true,
                    })
                  })
                }}>
                  新增故障现象
            </a>

              }



              <Divider style={{ marginTop: 6 }} type="vertical"></Divider>
              <a onClick={() => {
                this.setState({
                  iftype: {
                    name: `修改${curitem.title}`,
                    value: "edit"
                  },
                  fields: {
                    faultName: {
                      value: curitem.title,
                      type: "input",
                      title: "故障名称",
                      keys: "faultName",
                      requires: true,
                    },
                    faultCode: {
                      value: curitem.no,
                      type: "input",
                      title: "故障代码",
                      keys: "faultCode",
                      requires: true,
                    },
                    faultPhenomenon: {
                      value: curitem.faultPhenomenon,
                      type: "input",
                      title: "故障现象",
                      keys: "faultPhenomenon",
                      requires: true,
                      hides: curitem.parentKey == "0"
                    },
                    faultSolution: {
                      value: curitem.faultSolution,
                      type: "input",
                      title: "处理方法",
                      keys: "faultSolution",
                      requires: true,
                      hides: curitem.parentKey == "0"
                    },
                    equipmentTypeId: {
                      value: curitem.equipmentTypeId,
                      type: "select",
                      title: "设备类型",
                      keys: "equipmentTypeId",
                      requires: false,
                      option: this.props.repair.equipmentTypeList.map((item) => {
                        return {
                          name: item.equipmentTypeName,
                          id: item.id
                        }
                      }),
                      hides: curitem.parentKey != "0"
                    },
                    remark: {
                      value: curitem.description,
                      type: "textarea",
                      title: "备注",
                      keys: "remark",
                      requires: false,
                      col: { span: 24 },
                    },
                    knowledgeIdList: {
                      value: curitem.knowledgeIdList ? curitem.knowledgeIdList : undefined,
                      type: "tablenopage",
                      title: "知识文件",
                      keys: "knowledgeIdList",
                      requires: false,
                      columns: this.columns,
                      dataSource: "KLqueryAll",
                      checktype: "checkbox",//单选or多选
                      hides: false,
                      dv: "id",//key
                      lb: "knowledgeBaseName",//value
                      col: { span: 24 },
                      hides: curitem.parentKey == "0"
                    },
                  },
                }, () => {
                  this.setState({
                    fv: true
                  })
                })
              }}>修改</a>
              <Divider style={{ marginTop: 6 }} type="vertical"></Divider>
              <Popconfirm
                okText="确认"
                cancelText="取消"
                placement="bottomRight"
                title={"确认删除该故障设置？"}
                onConfirm={() => {
                  this.setNewState("TroubledeleteById", { id: curitem.key }, () => {
                    let total = this.props.repair.TroublequeryTreeList.total,
                      page = this.props.repair.TroublequeryTreeList.pageNum;
                    if ((total - 1) % 9 == 0) {
                      page = page - 1
                    }
                    this.setState({
                      postData: { ...this.state.postData, pageIndex: page }
                    }, () => {
                      this.setNewState("TroublequeryTreeList", postData, () => {
                        message.success("删除成功！");
                      });
                    })
                  })
                }}>
                <a style={{ color: "#ff4800" }}>删除</a>
              </Popconfirm>


            </div>
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
            expandedRowKeys={expandedRowKeys}
            onExpand={(expanded, record) => {
              this.setState({
                expandedRowKeys: expanded ? [record.key] : []
              })
            }}
            rowClassName={(record, index) => rowClassNameFn(record, index)}
            loading={this.props.submitting}
            pagination={{
              showTotal: total => `共${total}条`, // 分页
              size: "small",
              pageSize: 9,
              showQuickJumper: true,
              current: TroublequeryTreeList.pageNum ? TroublequeryTreeList.pageNum : 1,
              total: TroublequeryTreeList.total ? parseInt(TroublequeryTreeList.total) : 1,
              onChange: pageChange,
            }}
            rowKey='key'
            columns={columns}
            dataSource={TroublequeryTreeList.list ? TroublequeryTreeList.list : []}
          >
          </Table>

          <CreateForm
            tableUrl={[{
              url: "KLqueryAll",
              post: this.state.postDataz
            }]}/*配置页面表格数据*/
            width={1200}
            fields={fields}
            iftype={iftype}
            onChange={this.handleFormChange}
            wrappedComponentRef={this.saveFormRef}
            visible={fv}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
            col={{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12, xxl: 12 }}
            onSelectChange={this.onSelectChange}
            onRef={this.onRefs}
          />

        </Card>
      </div>
    )
  }


}

export default RepairList



