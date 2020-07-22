import {
  Table, Input, InputNumber,
  Popconfirm, Form, Divider,
  Modal, Tree, Button, Row, Col, Icon, Select, Alert, Tag, message, Card, Checkbox,Tooltip
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import CreateForm from "@/components/CreateForm"
import Abload from '@/components/Abload';
import SearchBox from '@/components/SearchBox';

const FormItem = Form.Item;
const EditableContext = React.createContext();
const Search = Input.Search;
const { TreeNode } = Tree;
const InputGroup = Input.Group;
const { Option } = Select;


@connect(({ system, loading }) => ({
  system,
  submitting: loading.effects['system/AdminuserqueryList'],
}))
class Staff extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      iftype: {
        name: "",
        value: ""
      },
      checkedValues: [],
      fv: false,
      fields: undefined,
      /*初始化 main List */
      postData: {
        pageIndex: 1,
        pageSize: 9,
        userName: "",//string 姓名
        departmentId: "",//long 部门id
        jobTitle: ""//string 职责
      },
      postUrl: "AdminuserqueryList",
      curitem: {},
      visible: false
    }
  }

  handleOk = e => {
    this.setNewState("Admincasave", {
      userId: this.state.curitem.id,
      roleIds: this.state.checkedValues
    }, () => {
      message.success("操作成功");
      this.setState({
        visible: false,
      });
    })
  };

  componentDidMount() {
    this.props.ensureDidMount&&this.props.ensureDidMount()
  }

  handleCancels = e => {
    this.setState({
      visible: false,
    });
  };
  //设置新状态
  setNewState(type, values, fn) {
    const { dispatch } = this.props;
    dispatch({
      type: 'system/' + type,
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

  componentWillMount() {
    this.resetData();
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
          if (i == "shopId") {
            this.setNewState("queryByShopId", { shopId: obj.value }, () => {
              fields.groupId.option = this.props.system.queryByShopId.map(item => {
                return {
                  name: item.groupName,
                  id: item.id
                }
              })
              fields.groupId.value = undefined;
              this.setState({
                fields: fields,
              })
            })
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
    this.setState({
      fv: false,
      fields: {
        userName: {
          value: null,
          type: "input",
          title: "姓名",
          keys: "userName",
          requires: true
        },
        accountName: {
          value: null,
          type: "input",
          title: "用户名",
          keys: "accountName",
          requires: true
        },
        gender: {
          value: null,
          type: "select",
          title: "性别",
          keys: "gender",
          requires: true,
          option: [
            {
              id: 1,
              name: "男"
            },
            {
              id: 2,
              name: "女"
            }
          ]
        },
        telephone: {
          value: null,
          type: "input",
          title: "联系电话",
          keys: "telephone",
          requires: true
        },
        departmentId: {
          value: null,
          type: "treeselect",
          title: "部门",
          keys: "departmentId",
          requires: true,
          option: this.props.system.departmentList ? this.props.system.departmentList : []
        },
        shopId: {
          value: null,
          type: "select",
          title: "车间",
          keys: "shopId",
          requires: false,
          option: this.props.system.shopList.map((item) => {
            return {
              name: item.shopName,
              id: item.id
            }
          })
        },
        groupId: {
          value: null,
          type: "select",
          title: "分组",
          keys: "groupId",
          requires: false,
        },
        academicCareer: {
          value: null,
          type: "input",
          title: "学历",
          keys: "academicCareer",
          requires: false
        },
        university: {
          value: null,
          type: "input",
          title: "毕业院校",
          keys: "university",
          requires: false
        },
        major: {
          value: null,
          type: "input",
          title: "专业",
          keys: "major",
          requires: false
        },
        parentId: {
          value: null,
          type: "select",
          title: "直属领导",
          keys: "parentId",
          requires: false,
          option: this.props.system.AdminuserqueryAll.map((item) => {
            return {
              name: item.userName + "-" + item.accountName,
              id: item.id
            }
          })
        },
        shiftId: {
          value: null,
          type: "select",
          title: "班次",
          keys: "shiftId",
          requires: false,
          option: this.props.system.banci.map((item) => {
            return {
              name: item.shiftName,
              id: item.id
            }
          })
        },
        mailNo: {
          value: null,
          type: "input",
          title: "邮箱",
          keys: "mailNo",
          requires: false
        },
        jobNum: {
          value: null,
          type: "input",
          title: "工号",
          keys: "jobNum",
          requires: false
        },
        jobTitle: {
          value: null,
          type: "textarea",
          title: "职责",
          keys: "jobTitle",
          requires: false,
          col: { span: 24 }
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
        this.setNewState("Adminusersave", postData, () => {
          message.success("修改成功！");
          this.setState({ visibleform: false });
          this.resetData();
        });
      } else if (iftype.value == "add") {
        let postData = { ...values };
        this.setNewState("Adminusersave", postData, () => {
          message.success("新增成功！");
          this.setState({ visibleform: false });
          this.resetData();
        });
      } else {
        //ELSE TO DO
      }

    });
  }


  onChange = (checkedValues, key) => {
    if (key == "1") {
      this.setState({
        pcData: checkedValues
      }, () => {
        let res = this.state.pcData.concat(this.state.ydData)
        this.setState({
          checkedValues: res
        })

      })
    } else {
      this.setState({
        ydData: checkedValues
      }, () => {
        let res = this.state.pcData.concat(this.state.ydData)
        this.setState({
          checkedValues: res
        })
      })
    }

  }

  handleSearch = (selectedKeys, dataIndex) => {
    let { postUrl } = this.state;

    if (dataIndex == "shopId") {
      this.setNewState("queryByShopId", { shopId: selectedKeys[0] }, () => {
        this.setState({
          postData: { ...this.state.postData, groupId: null }
        })
      })
    }

    this.setState({ postData: { ...this.state.postData, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
      this.setNewState(postUrl, this.state.postData)
    });
  };

  onRef = (ref) => {
    this.child = ref;
  }

  render() {
    let { postData, postUrl, fv, fields, iftype, curitem } = this.state,
      { AdminuserqueryList, AdminqueryCompanyList, departmentList, shopList, queryByShopId } = this.props.system;

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
    }, gettreeselectbox = (key, option) => {
      if (this.child) {
        return this.child.getColumnTreeSelectProps(key, option)
      } else {
        return null
      }
    }, col = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 8,
      xl: 8,
      xxl: 8
    }

    const columns = [
      {
        title: '姓名',
        dataIndex: 'userName',
        key: 'userName',
        ...getsearchbox('userName'),
      },
      {
        title: '性别',
        dataIndex: 'gender',
        key: 'gender',
        render: (text) => (<span>{text == 1 ? "男" : "女"}</span>)
      },
      {
        title: '用户名',
        dataIndex: 'accountName',
        key: 'accountName',
        ...getsearchbox("accountName")
      },
      {
        title: '联系电话',
        dataIndex: 'telephone',
        key: 'telephone',
      },
      {
        title: '邮箱',
        dataIndex: 'mailNo',
        key: 'mailNo',
      },
      {
        title: '班次',
        dataIndex: 'shiftName',
        key: 'shiftName',
      },
      {
        title: '部门',
        dataIndex: 'departmentName',
        key: 'departmentName',
        ...gettreeselectbox("departmentId", departmentList)
      },
      {
        title: '车间',
        dataIndex: 'shopName',
        key: 'shopName',
        ...getselectbox("shopId", shopList ? shopList.map(item => {
          return {
            dicName: item.shopName,
            dicKey: item.id
          }
        }) : [])
      },
      {
        title: '分组',
        dataIndex: 'groupName',
        key: 'groupName',
        ...getselectbox("groupId", queryByShopId ? queryByShopId.map(item => {
          return {
            dicName: item.groupName,
            dicKey: item.id
          }
        }) : [])
      },
      {
        title: '学历',
        dataIndex: 'academicCareer',
        key: 'academicCareer',
      },
      {
        title: '毕业院校',
        dataIndex: 'university',
        key: 'university',
      },
      {
        title: '专业',
        dataIndex: 'major',
        key: 'major',
      },
      {
        title: '直属领导',
        dataIndex: 'parentName',
        key: 'parentName',
        ...getsearchbox('parentName'),
      },
      {
        title: '职责',
        dataIndex: 'jobTitle',
        key: 'jobTitle',
        ...getsearchbox("jobTitle")
      },
      {
        title: '工号',
        dataIndex: 'jobNum',
        key: 'jobNum',
      },
      {
        title: <div style={{ display: "flex", justifyContent: "space-between", width:140,alignItems: "center" }}>
          操作
          <a style={{ color: "#f50" }} onClick={() => {
            this.setState({
              postData: {
                pageIndex: 1,
                pageSize: 9,
                userName: "",//string 姓名
                departmentId: "",//long 部门id
                jobTitle: ""//string 职责
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
        width:170,
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => {
          return (<div>
            <a onClick={() => {
              this.setNewState("AdmincaqueryAll", { userId: record.id }, () => {
                let res = this.props.system.AdmincaqueryAll,
                  respc = res.PC ? res.PC.map((item) => {
                    return {
                      label: item.roleName,
                      value: item.id
                    }
                  }) : [],

                  pco = res.PC ? res.PC.map((item) => {
                    return item.id
                  }) : [],

                  resyd = res.YD ? res.YD.map((item) => {
                    return {
                      label: item.roleName,
                      value: item.id
                    }
                  }) : [],

                  ydo = res.PC ? res.YD.map((item) => {
                    return item.id
                  }) : [];

                this.setState({
                  plainOptions: {
                    yd: resyd,
                    pc: respc
                  },
                  checkedValues: res.PC[0].haveRoleIdList ? res.PC[0].haveRoleIdList : [],
                  iftype: {
                    name: `给${record.accountName}分配角色`,
                    value: "star"
                  }
                }, () => {
                  this.setState({
                    curitem:record,
                    pcData: this.state.checkedValues && this.state.checkedValues.filter((item, i) => { return pco.indexOf(item) != -1 }),
                    ydData: this.state.checkedValues && this.state.checkedValues.filter((item, i) => { return ydo.indexOf(item) != -1 }),
                    visible: true,
                  })
                })
              })
            }}>用户配置</a>
            <Divider type="vertical"></Divider>
            <a onClick={() => {
              this.setNewState("AdminuserqueryAll", null, () => {
                if (record.shopId) {
                  this.setNewState("queryByShopId", { shopId: record.shopId }, () => {
                    let res = this.props.system.queryByShopId;
                    res = res.map((item) => {
                      return {
                        name: item.groupName,
                        id: item.id
                      }
                    })
                    this.setState({
                      curitem: record,
                      fields: {
                        userName: {
                          ...fields.userName,
                          value: record.userName,
                        },
                        accountName: {
                          ...fields.accountName,
                          value: record.accountName,
                          disabled: true
                        },
                        gender: {
                          ...fields.gender,
                          value: record.gender,
                        },
                        telephone: {
                          ...fields.telephone,
                          value: record.telephone,
                        },
                        departmentId: {
                          ...fields.departmentId,
                          value: record.departmentId,
                        },
                        shopId: {
                          ...fields.shopId,
                          value: record.shopId,
                        },
                        groupId: {
                          ...fields.groupId,
                          value: record.groupId,
                          option: res
                        },
                        academicCareer: {
                          ...fields.academicCareer,
                          value: record.academicCareer,
                        },
                        university: {
                          ...fields.university,
                          value: record.university,
                        },
                        major: {
                          ...fields.major,
                          value: record.major,
                        },
                        parentId: {
                          ...fields.parentId,
                          value: record.parentId,
                        },
                        shiftId: {
                          ...fields.shiftId,
                          value: record.shiftId,
                        },
                        mailNo: {
                          ...fields.mailNo,
                          value: record.mailNo,
                        },
                        jobNum: {
                          ...fields.jobNum,
                          value: record.jobNum,
                        },
                        jobTitle: {
                          ...fields.jobTitle,
                          value: record.jobTitle,
                        }
                      },
                    }, () => {
                      this.setState({
                        fv: true,
                        iftype: {
                          name: "修改用户",
                          value: "edit"
                        },
                      })
                    })
                  })
                } else {
                  this.setState({
                    curitem: record,
                    fields: {
                      userName: {
                        ...fields.userName,
                        value: record.userName,
                      },
                      accountName: {
                        ...fields.accountName,
                        value: record.accountName,
                        disabled: true
                      },
                      gender: {
                        ...fields.gender,
                        value: record.gender,
                      },
                      telephone: {
                        ...fields.telephone,
                        value: record.telephone,
                      },
                      departmentId: {
                        ...fields.departmentId,
                        value: record.departmentId,
                      },
                      shopId: {
                        ...fields.shopId,
                        value: record.shopId,
                      },
                      groupId: {
                        ...fields.groupId,
                        value: record.groupId,
                      },
                      academicCareer: {
                        ...fields.academicCareer,
                        value: record.academicCareer,
                      },
                      university: {
                        ...fields.university,
                        value: record.university,
                      },
                      major: {
                        ...fields.major,
                        value: record.major,
                      },
                      parentId: {
                        ...fields.parentId,
                        value: record.parentId,
                      },
                      shiftId: {
                        ...fields.shiftId,
                        value: record.shiftId,
                      },
                      mailNo: {
                        ...fields.mailNo,
                        value: record.mailNo,
                      },
                      jobNum: {
                        ...fields.jobNum,
                        value: record.jobNum,
                      },
                      jobTitle: {
                        ...fields.jobTitle,
                        value: record.jobTitle,
                      }
                    },
                  }, () => {
                    this.setState({
                      fv: true,
                      iftype: {
                        name: "修改用户",
                        value: "edit"
                      },
                    })
                  })
                }

              })
            }}>修改</a>
            <Divider type="vertical"></Divider>
            <Popconfirm
              okText="确认"
              cancelText="取消"
              placement="bottomRight"
              title={"确认删除该用户？"}
              onConfirm={() => {
                this.setNewState("AdminuserdeleteById", { id: record.id }, () => {
                  let total = this.props.system.AdminuserqueryList.total,
                    page = this.props.system.AdminuserqueryList.pageNum;
                  if ((total - 1) % 9 == 0) {
                    page = page - 1
                  }

                  this.setState({
                    postData: { ...this.state.postData, pageIndex: page }
                  }, () => {
                    this.setNewState("AdminuserqueryList", postData, () => {
                      message.success("删除成功！");
                    });
                  })
                })
              }}>
              <a style={{ color: "#ff4800" }}>删除</a>
            </Popconfirm>
          </div>)

        }
      },
      {
        title: '重置密码',
        dataIndex: 'reset',
        key: 'reset',
        render: (text, record) => <Popconfirm
          okText="确认"
          cancelText="取消"
          placement="bottomRight"
          title={"确认重置密码？"}
          onConfirm={() => {
            this.setNewState("restPassword", { id: record.accountId }, () => {
              this.setNewState("AdminuserqueryList", postData, () => {
                message.success(record.userName + this.props.system.code.data);
              });
            })
          }}>
          <a style={{ color: "#ff4800" }}>重置密码</a>
        </Popconfirm>
      },

    ]

    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("AdminuserqueryList", this.state.postData);
      })
    }

    return (
      <div>
        <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
        <Card title='用户列表' extra={<div style={{ display: "flex" }}>
          <span style={{ marginRight: 18, cursor: "pointer" }} onClick={() => {
            this.setNewState("AdminuserqueryAll", null, () => {
              this.setState({
                fields: {
                  userName: {
                    value: null,
                    type: "input",
                    title: "姓名",
                    keys: "userName",
                    requires: true
                  },
                  accountName: {
                    value: null,
                    type: "input",
                    title: "用户名",
                    keys: "accountName",
                    requires: true
                  },
                  gender: {
                    value: null,
                    type: "select",
                    title: "性别",
                    keys: "gender",
                    requires: true,
                    option: [
                      {
                        id: 1,
                        name: "男"
                      },
                      {
                        id: 2,
                        name: "女"
                      }
                    ]
                  },
                  telephone: {
                    value: null,
                    type: "input",
                    title: "联系电话",
                    keys: "telephone",
                    requires: true
                  },
                  departmentId: {
                    value: null,
                    type: "treeselect",
                    title: "部门",
                    keys: "departmentId",
                    requires: true,
                    option: this.props.system.departmentList ? this.props.system.departmentList : []
                  },
                  // 直属领导 parentId((分页的表格,带名称,和用户名,)   
                  shopId: {
                    value: null,
                    type: "select",
                    title: "车间",
                    keys: "shopId",
                    requires: false,
                    option: this.props.system.shopList.map((item) => {
                      return {
                        name: item.shopName,
                        id: item.id
                      }
                    })
                  },
                  groupId: {
                    value: null,
                    type: "select",
                    title: "分组",
                    keys: "groupId",
                    requires: false,
                  },
                  academicCareer: {
                    value: null,
                    type: "input",
                    title: "学历",
                    keys: "academicCareer",
                    requires: false
                  },
                  university: {
                    value: null,
                    type: "input",
                    title: "毕业院校",
                    keys: "university",
                    requires: false
                  },
                  major: {
                    value: null,
                    type: "input",
                    title: "专业",
                    keys: "major",
                    requires: false
                  },
                  parentId: {
                    value: null,
                    type: "select",
                    title: "直属领导",
                    keys: "parentId",
                    requires: false,
                    option: this.props.system.AdminuserqueryAll.map((item) => {
                      return {
                        name: item.userName + "-" + item.accountName,
                        id: item.id
                      }
                    })
                  },
                  shiftId: {
                    value: null,
                    type: "select",
                    title: "班次",
                    keys: "shiftId",
                    requires: false,
                    option: this.props.system.banci.map((item) => {
                      return {
                        name: item.shiftName,
                        id: item.id
                      }
                    })
                  },
                  mailNo: {
                    value: null,
                    type: "input",
                    title: "邮箱",
                    keys: "mailNo",
                    requires: false
                  },
                  jobNum: {
                    value: null,
                    type: "input",
                    title: "工号",
                    keys: "jobNum",
                    requires: false
                  },
                  jobTitle: {
                    value: null,
                    type: "textarea",
                    title: "职责",
                    keys: "jobTitle",
                    requires: false,
                    col: { span: 24 }
                  }
                },
                iftype: {
                  name: "新增用户",
                  value: "add"
                },
              }, () => {
                this.setState({
                  fv: true
                })
              })
            })
          }}>新增</span>
          <Abload reload={() => this.resetData()} data={null} postName="uploadsysUser" left={0} filePath="http://47.100.234.193:8888/download/nguserModel.xlsx"></Abload>
        </div>
        }>
          <Table size="middle"
            scroll={{x:1700}}
            loading={this.props.submitting}
            pagination={{
              showTotal: total => `共${total}条`, // 分页
              size: "small",
              pageSize: 9,
              showQuickJumper: true,
              current: AdminuserqueryList.pageNum ? AdminuserqueryList.pageNum : 1,
              total: AdminuserqueryList.total ? parseInt(AdminuserqueryList.total) : 1,
              onChange: pageChange,
            }}
            rowKey='id'
            columns={columns}
            dataSource={AdminuserqueryList.list ? AdminuserqueryList.list : []}
          >
          </Table>

          <CreateForm
            width={800}
            fields={this.state.fields}
            iftype={iftype}
            onChange={this.handleFormChange}
            wrappedComponentRef={this.saveFormRef}
            visible={fv}
            col={{ xs: 24, sm: 24, md: 24, lg: 12, xl: 12, xxl: 12 }}
            onCancel={this.handleCancel}
            onCreate={this.handleCreate}
          />

          <Modal
            style={{ maxWidth: "90%" }}
            width={1000}
            title={iftype.name}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancels}
          >
            <Search placeholder="搜索名称全程，选中需要选择的角色" style={{ marginBottom: 12 }} onSearch={(val) => {
              let alldata = this.state.plainOptions.yd.concat(this.state.plainOptions.pc);
              let arr = alldata.filter((item) => {
                return item.label == val
              }).map((item) => { return item.value })

              let vals = this.state.checkedValues.concat(arr);

              function unique1(arr) {
                var hash = [];
                for (var i = 0; i < arr.length; i++) {
                  if (hash.indexOf(arr[i]) == -1) {
                    hash.push(arr[i]);
                  }
                }
                return hash;
              }

              this.setState({
                checkedValues: unique1(vals)
              }, () => {
                console.log(this.state.checkedValues)
              })

            }}></Search>

            <Row gutter={24}>
              <Col span={12}>
                <p style={{ borderBottom: "#f0f0f0 dashed 1px", color: "#0e6eb8" }}>PC端</p>
                <Checkbox.Group
                  value={this.state.checkedValues}
                  onChange={(val) => this.onChange(val, "1")} >
                  <Row>
                    {
                      this.state.plainOptions ?
                        this.state.plainOptions.pc.map((item, i) => {
                          return <Col {...col} key={i}>
                            <Checkbox value={item.value}>{item.label}</Checkbox>
                          </Col>

                        }) : null
                    }
                  </Row>
                </Checkbox.Group>
              </Col>
              <Col span={12}>
                <p style={{ borderBottom: "#f0f0f0 dashed 1px", color: "#0e6eb8" }}>移动</p>
                <Checkbox.Group
                  value={this.state.checkedValues}
                  options={this.state.plainOptions ? this.state.plainOptions.yd : []}
                  onChange={(val) => this.onChange(val, "2")} />
              </Col>
            </Row>





          </Modal>


        </Card>
      </div>
    )
  }


}

export default Staff



