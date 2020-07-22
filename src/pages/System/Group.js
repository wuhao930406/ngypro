import {
  Table, Tree, Divider, Row, Col, Icon, Select, Alert, Popconfirm , message, Card
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import CreateForm from "@/components/CreateForm"
import SearchBox from '@/components/SearchBox';


const { TreeNode } = Tree;


@connect(({ system, loading }) => ({
  system,
  submitting: loading.effects['system/groupqueryList'],
}))
class Group extends React.Component {
//groupqueryList,groupsave,groupdeleteById
  constructor(props) {
    super(props);
    this.state = {
      checkedKeys: {
        checked: [], halfChecked: []
      },
      iftype: {
        name: "",
        value: ""
      },
      fv: false,
      fields: {},
      /*初始化 main List */
      postData: {
        pageIndex: 1,
        pageSize: 9,
        groupName: "", //分组名
        shopId:"",
      },
      postUrl: "groupqueryList",
      curitem: {}
    }
  }

  onCheck = (checkedKeys, info) => {
    message.destroy();
    if (this.state.iftype.liziyuan == 2) {
      message.warn("微信端无法操作")
    } else {
      this.setState({ checkedKeys });
    }

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

  componentDidMount() {
this.props.ensureDidMount&&this.props.ensureDidMount()
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
        groupName: {
          value: null,
          type: "input",
          title: "分组名称",
          keys: "groupName",
          requires: true,
        },
        shopId: {
          value: null,
          type: "select",
          title: "选择车间",
          keys: "shopId",
          requires: true,
          option: this.props.system.shopList?this.props.system.shopList.map((item)=>{
            return {
              name:item.shopName,
              id:item.id
            }
          }):[]
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
        this.setNewState("groupsave", postData, () => {
          message.success("修改成功！");
          this.resetData();
        });
      } else if (iftype.value == "add") {
        let postData = { ...values };
        this.setNewState("groupsave", postData, () => {
          message.success("新增成功！");
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
      { groupqueryList, shopList } = this.props.system;
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
    }, gettreeselectbox = (key, option) => {
      if (this.child) {
        return this.child.getColumnTreeSelectProps(key, option)
      } else {
        return null
      }
    }



    const columns = [
      {
        title: '分组名称',
        dataIndex: 'groupName',
        key: 'groupName',
        ...getsearchbox("groupName")
      },
      {
        title: '车间名',
        dataIndex: 'shopName',
        key: 'shopName',
        ...getselectbox("shopId", shopList.map((item,i)=>{
          return {
            dicName:item.shopName,
            dicKey:item.id
          }
        }))
      },

    ]


    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("groupqueryList", this.state.postData);
      })
    }

    const loop = data =>
      data.map(item => {
        if (item.children) {
          return (
            <TreeNode key={item.key} title={item.title}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.key} title={item.title} />;
      });

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
        <Card title='分组列表' extra={
          <div>
            <a onClick={() => {
              this.setState({
                iftype: {
                  name: "新增分组",
                  value: "add"
                },
                fv: true
              })
            }}>新增</a>
            {
              curitem.id && <span>
                <Divider type="vertical"></Divider>
                <a onClick={() => {
                  this.setState({
                    iftype: {
                      name: "修改" + curitem.shopName,
                      value: "edit"
                    },
                    fields: {
                      groupName: {
                        value: curitem.groupName,
                        type: "input",
                        title: "分组名称",
                        keys: "groupName",
                        requires: true,
                      },
                      shopId: {
                        value: curitem.shopId,
                        type: "select",
                        title: "选择车间",
                        keys: "shopId",
                        requires: true,
                        option: this.props.system.shopList?this.props.system.shopList.map((item)=>{
                          return {
                            name:item.shopName,
                            id:item.id
                          }
                        }):[]
                      }
                    },
                  }, () => {
                    this.setState({
                      fv: true
                    })
                  })
                }}>修改</a>
                <Divider type="vertical"></Divider>
                <Popconfirm
                  okText="确认"
                  cancelText="取消"
                  placement="bottomRight"
                  title={"确认删除该分组？"}
                  onConfirm={() => {
                    this.setNewState("groupdeleteById", { id: curitem.id }, () => {
                      let total = this.props.system.groupqueryList.total,
                        page = this.props.system.groupqueryList.pageNum;
                      if ((total - 1) % 9 == 0) {
                        page = page - 1
                      }
                      this.setState({
                        postData: { ...this.state.postData, pageIndex: page }
                      }, () => {
                        this.resetData();
                        message.success("删除成功！");
                      })
                    })
                  }}>
                  <a style={{ color: "#ff4800" }}>删除</a>
                </Popconfirm>


              </span>

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
            pagination={{ showTotal:total=>`共${total}条`, // 分页
              size: "small",
              pageSize: 9,
              showQuickJumper: true,
              current: groupqueryList.pageNum ? groupqueryList.pageNum : 1,
              total: groupqueryList.total ? parseInt(groupqueryList.total) : 1,
              onChange: pageChange,
            }}
            rowKey='id'
            columns={columns}
            dataSource={groupqueryList.list ? groupqueryList.list : []}
          >
          </Table>
          {
            fields &&
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
          }

        </Card>
      </div>
    )
  }


}

export default Group



