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


@connect(({ spare, loading }) => ({
  spare,
  submitting: loading.effects['spare/SETqueryList'],
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
        equipmentId: {
          value: null,
          type: "select",
          title: "选择设备",
          keys: "equipmentId",
          requires: true,
          option:props.spare.equipmentList.map((item,i)=>{
            return {id:item.id,name:item.equipmentName}
          })
        },
        sparePartsId: {
          value: null,
          type: "select",
          title: "选择备件",
          keys: "sparePartsId",
          requires: true,
          option:props.spare.sparePartsList.map((item,i)=>{
            return {id:item.id,name:item.sparePartsName}
          })
        },
        replacePeriodHours: {
          value: null,
          type: "inputnumber",
          title: "更换周期(小时)",
          keys: "replacePeriodHours",
          requires: true,
        },
        aheadHours: {
          value: null,
          type: "inputnumber",
          title: "提前更换时间(小时)",
          keys: "aheadHours",
          requires: true,
        },
        remark: {
          value: null,
          type: "textarea",
          title: "备注",
          keys: "remark",
          requires: false
        }
      },
      /*初始化 main List */
      postData: {
        pageIndex: 1,
        pageSize: 9,
        "status":null, // 状态：0：启用，1：停用
        "sparePartsNo":null, // 备件料号
        "equipmentNo":null // 设备编号
      },
      postUrl: "SETqueryList",
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
      this.handleCancel()
    })
  }

  componentDidMount() {
this.props.ensureDidMount&&this.props.ensureDidMount()
    this.setNewState("queryEquipmentAndSpareParts",null,()=>{
      this.resetData();
    })
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
        equipmentId: {
          value: null,
          type: "select",
          title: "选择设备",
          keys: "equipmentId",
          requires: true,
          option:this.props.spare.equipmentList.map((item,i)=>{
            return {id:item.id,name:item.equipmentName}
          })
        },
        sparePartsId: {
          value: null,
          type: "select",
          title: "选择备件",
          keys: "sparePartsId",
          requires: true,
          option:this.props.spare.sparePartsList.map((item,i)=>{
            return {id:item.id,name:item.sparePartsName}
          })
        },
        replacePeriodHours: {
          value: null,
          type: "inputnumber",
          title: "更换周期(小时)",
          keys: "replacePeriodHours",
          requires: true,
        },
        aheadHours: {
          value: null,
          type: "inputnumber",
          title: "提前更换时间(小时)",
          keys: "aheadHours",
          requires: true,
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
        this.setNewState("SETsave", postData, () => {
          message.success("修改成功！");
          this.resetData();
        });
      } else if (iftype.value == "add") {
        let postData = { ...values };
        this.setNewState("SETsave", postData, () => {
          message.success("新增成功！");
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

  onRefs = (ref) => {
    this.childs = ref;
  }


  render() {
    let { postData, postUrl, fv, fields, iftype, curitem } = this.state,
      { SETqueryList } = this.props.spare;

    let getsearchbox = (key) => {
      if (this.childs) {
        return this.childs.getColumnSearchProps(key)
      } else {
        return null
      }
    }, getselectbox = (key, option) => {
      if (this.childs) {
        return this.childs.getColumnSelectProps(key, option)
      } else {
        return null
      }
    }

    const columns = [
      {
        title: '设备编号',
        dataIndex: 'equipmentNo',
        key: 'equipmentNo',
        width: 110,
        ellipsis: true,
        ...getsearchbox('equipmentNo')
      },
      {
        title: '设备名称',
        dataIndex: 'equipmentName',
        key: 'equipmentName',
        width: 110,
        ellipsis: true,
      },
      {
        title: '设备型号',
        dataIndex: 'equipmentModel',
        key: 'equipmentModel',
        width: 110,
        ellipsis: true,
      },
      {
        title: '设备类型',
        dataIndex: 'equipmentTypeName',
        key: 'equipmentTypeName',
        width: 110,
        ellipsis: true,
      },
      {
        title: '备件料号',
        dataIndex: 'sparePartsNo',
        key: 'sparePartsNo',
        width: 110,
        ellipsis: true,
        ...getsearchbox('sparePartsNo')
      },
      {
        title: '备件名',
        dataIndex: 'sparePartsName',
        key: 'sparePartsName',
        ellipsis: true,
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 110,
        ellipsis: true,
        render:(text)=><span>{text==0?"启用":"停用"}</span>,
        ...getselectbox("status", [{ dicKey: "0", dicName: "启用" }, { dicKey: "1", dicName: "停用" }])
      },
      {
        title: '更换周期',
        dataIndex: 'replacePeriodHours',
        key: 'replacePeriodHours',
        width: 110,
        ellipsis: true,
        render:(text)=><span>{text}小时</span>
      },
      {
        title: '周期运行时间',
        dataIndex: 'runHours',
        key: 'runHours',
        width: 110,
        ellipsis: true,
        render:(text)=><span>{text}小时</span>
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
      },
    ]

    let pageChange = (page) => {
      this.setState({
        postData: { ...this.state.postData, pageIndex: page }
      }, () => {
        this.setNewState("SETqueryList", this.state.postData);
      })
    }
    const rowClassNameFn = (record, index) => {
      const { curitem } = this.state;
      if (curitem && curitem.id === record.id) {
        return "selectedRow";
      }
      return null;
    };
    let menu = (record) =>{
      return record.id?
      <div>
        <Divider type="vertical"></Divider>
            <a onClick={() => {
              this.setState({
                fv: true,
                iftype: {
                  name: "修改备件更换计划",
                  value: "edit"
                },
                curitem: record,
                fields: {
                  equipmentId: {
                    ...this.state.fields.equipmentId,
                    value: record.equipmentId,
                  },
                  sparePartsId: {
                    ...this.state.fields.sparePartsId,
                    value: record.sparePartsId,
                  },
                  replacePeriodHours: {
                    ...this.state.fields.replacePeriodHours,
                    value: record.replacePeriodHours,
                  },
                  aheadHours: {
                    ...this.state.fields.aheadHours,
                    value: record.aheadHours,
                  },
                  remark: {
                    ...this.state.fields.remark,
                    value: record.remark,
                  }
                },
              })
            }}>修改</a>
            <Divider type="vertical"></Divider>
            <Popconfirm
              okText="确认"
              cancelText="取消"
              placement="bottomRight"
              title={"确认删除该计划？"}
              onConfirm={() => {
                this.setNewState("SETdeleteById", { id: record.id }, () => {
                  let total = this.props.spare.SETqueryList.total,
                    page = this.props.spare.SETqueryList.pageNum;
                  if ((total - 1) % 9 == 0) {
                    page = page - 1
                  }
                  this.setState({
                    postData: { ...this.state.postData, pageIndex: page }
                  }, () => {
                    this.setNewState("SETqueryList", postData, () => {
                      message.success("删除成功！");
                    });
                  })
                })
              }}>
              <a style={{ color: "#ff4800" }}>删除</a>
            </Popconfirm>
          </div>:null

    }

    return (
      <div>
        <SearchBox onRef={this.onRefs} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
        <Card title='备件更换计划列表' extra={
        <div style={{display:"flex",justifyContent:"flex-end",alignItems:"center"}}>
          <a onClick={() => {
          this.setState({
            iftype: {
              name: "新增备件更换计划",
              value: "add"
            },
            fv: true
          })
        }}>新增</a>
        {menu(curitem)}

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
            pagination={{ showTotal:total=>`共${total}条`, // 分页
              size: "small",
              pageSize: 9,
              showQuickJumper: true,
              current: SETqueryList.pageNum ? SETqueryList.pageNum : 1,
              total: SETqueryList.total ? parseInt(SETqueryList.total) : 1,
              onChange: pageChange,
            }}
            rowKey='id'
            columns={columns}
            dataSource={SETqueryList.list ? SETqueryList.list : []}
          >
          </Table>

          <CreateForm
            fields={fields}
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



