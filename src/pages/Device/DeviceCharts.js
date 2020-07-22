/**
 * Created by 11485 on 2019/2/25.
 */
import React, { Component } from 'react';
import { Card, Radio, Icon, Tabs, Input, Empty, Pagination, Row, Col, Divider, Tooltip, Menu, Dropdown, Drawer, PageHeader, Button, Select, DatePicker, message, Popconfirm, Table, Avatar, Upload } from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import moment from 'moment';
import AbReply from '@/components/AbReply';
import SearchBox from '@/components/SearchBox'
import CreateForm from "@/components/CreateForm"

const { TabPane } = Tabs;
let Search = Input.Search
const { Option } = Select;

@connect(({ device, loading }) => ({
  device,
  submitting: loading.effects['device/queryRepair'],
}))
class DeviceCharts extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      curitem:{},
      settitle: "",
      iftype: "mine",
      person: {
        cj: [],
        cs: [],
        css: [],
      },
      postData: {
        "pageIndex": 1,
        "pageSize": 9,
        "search": "",//筛选条件(标题和内容)
        "title": "",//标题
        "comment": "",//内容
        "equipmentTypeId": "",//设备类型id
        "uploadUserName": ""//上传人名
      },
      postUrl: "queryRepair",
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


  //1格的查询列表
  resetData(reset) {
    if (reset) {
      this.setState({
        postData: {
          "pageIndex": 1,
          "pageSize": 9,
          "search": "",
          "title": "",
          "comment": "",
          "equipmentTypeId": "",
          "uploadUserName": ""
        }
      }, () => {
        this.setNewState(this.state.postUrl, this.state.postData, () => {
        })
      })
    } else {
      this.setNewState(this.state.postUrl, this.state.postData, () => {
      })
    }


  }

  componentDidMount() {
    this.props.ensureDidMount && this.props.ensureDidMount()
    this.resetData();
    this.handleCancel();
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
      visible: false,
      fields: {
        title: {
          value: null,
          type: "input",
          title: "标题",
          keys: "title",
          requires: true,
        },
        comment: {
          value: null,
          type: "input",
          title: "内容",
          keys: "comment",
          requires: true,
        },
        equipmentTypeId: {
          value: null,
          type: "treeselect",
          title: "设备类型",
          keys: "equipmentTypeId",
          requires: true,
          option: this.props.device.equipmentTypeList
        },
        attachmentUrlList: {
          value: null,
          type: "uploads",
          title: "附件",
          keys: "attachmentUrlList",
          uploadtype: "file",
          multiple: true,
          requires: false,
          col: { span: 24 },
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
      values.attachmentUrlList = values.attachmentUrlList&&values.attachmentUrlList.length>0?values.attachmentUrlList.map((item, i) => {
        return item.response && item.response.data.dataList[0]
      }):null
      console.log(values);

      if (iftype.value == "add") {
        let postData = { ...values };
        this.setNewState("lunsave", postData, () => {
          message.success("新增成功！");
          this.resetData();
          this.handleCancel()
        });
      }

    });
  }


  onClose = () => {
    let _it = this;
    _it.setState({
      visible: false,
    }, () => {
    });
  };


  renderRowClick(item, key) {
    this.setState({
      curitem: item,
      name: "留言板",
      can: key,
    }, () => {
      this.setState({
        fv: true
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
    let { datalist, device: { queryRepair, equipmentTypeList } } = this.props,
      { postUrl, postData, iftype, fields, visible, ifs, auditStatus, key, sendMission, person, curitem } = this.state;

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
    }


    let pageconfig = (url, post, mainurl) => {
      return {
        showTotal: total => `共${total}条`, // 分页
        size: "small",
        pageSize: this.state[post] && this.state[post].pageSize,
        showQuickJumper: true,
        current: this.props.device[url].pageNum ? this.props.device[url].pageNum : 1,
        total: this.props.device[url].total ? parseInt(this.props.device[url].total) : 0,
        onChange: (page) => pageChange(page, mainurl ? mainurl : url, post),
      }
    }

    let pageChange = (page, url, post) => {
      console.log(post)
      this.setState({
        [post]: { ...this.state[post], pageIndex: page }
      }, () => {
        this.setNewState(url, this.state[post]);
      })
    }

    const rowClassNameFn = (record, index) => {
      const { curitem } = this.state;
      if (curitem && curitem.id === record.id) {
        return "selectedRow";
      }
      return null;
    };

    let renderItems = (key) => {
      return <Table
        onRow={record => {
          return {
            onClick: event => {
              this.setState({ curitem: record });
            }, // 点击行
          };
        }}
        rowKey="id"
        rowClassName={(record, index) => rowClassNameFn(record, index)}
        loading={this.props.submitting}
        columns={[
          {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
            ...getsearchbox('title')
          },
          {
            title: '内容',
            dataIndex: 'comment',
            key: 'comment',
            ellipsis: true,
            ...getsearchbox('comment')
          },
          {
            title: '设备类型',
            dataIndex: 'equipmentTypeName',
            key: 'equipmentTypeName',
            width: 110,
            ellipsis: true,
            ...gettreeselectbox('equipmentTypeId', equipmentTypeList)
          },
          {
            title: '上传人',
            dataIndex: 'uploadUserName',
            key: 'uploadUserName',
            width: 110,
            ellipsis: true,
            ...getsearchbox('equipmentTypeName')
          },
          {
            title: <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: 70 }}>
              操作
              <a style={{ color: "#f50" }} onClick={() => {
                this.resetData(true)
              }}>
                <Tooltip title='重置'>
                  <Icon type="reload" />
                </Tooltip>
              </a>
            </span>,
            dataIndex: 'action',
            key: 'action',
            width: 110,
            ellipsis: true,
            render: (text, record) => {
              return <a onClick={() => {
                this.renderRowClick(record, "1")
              }}>查看</a>
            }
          },
        ]}
        dataSource={queryRepair.list}
        pagination={pageconfig("queryRepair", "postData")}
      >
      </Table>
    }


    return (
      <div style={{ position: "relative" }}>
        <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
        <Card
          title={<a style={{ padding: "4px 0px", display: "block" }}>设备论坛</a>}
          extra={
            <div>
              <a onClick={() => {
                this.setState({
                  visible: true,
                  iftype: {
                    name: "新增设备论坛",
                    value: "add"
                  }
                })
              }}>新增</a>
              {
                curitem.id && <span>
                  <Divider type="vertical"></Divider>
                  <Popconfirm
                    okText="确认"
                    cancelText="取消"
                    placement="bottomRight"
                    title={"确认删除该设备论坛？"}
                    onConfirm={() => {
                      this.setNewState("lundeleteById", { id: curitem.id }, () => {
                        let total = this.props.device.queryRepair.total,
                          page = this.props.device.queryRepair.pageNum;
                        if ((total - 1) % 9 == 0) {
                          page = page - 1
                        }

                        this.setState({
                          postData: { ...this.state.postData, pageIndex: page }
                        }, () => {
                          this.setNewState("queryRepair", postData, () => {
                            message.success("删除成功！");
                          });
                        })
                      })
                    }}>
                    <a style={{ color: "#ff4800" }}>删除</a>
                  </Popconfirm>
                </span>

              }

            </div>

          }
        >
          {
            renderItems()
          }
        </Card>

        <AbReply
          visible={this.state.fv}
          title={this.state.name ? this.state.name : ""}
          placement="right"
          width={"96%"}
          onClose={() => {
            this.setState({
              fv: false
            })
          }}
          curitem={this.state.curitem ? this.state.curitem : {}}
          destroyOnClose={true}
        >
        </AbReply>

        <CreateForm
          width={1200}
          fields={fields}
          iftype={iftype}
          onChange={this.handleFormChange}
          wrappedComponentRef={this.saveFormRef}
          visible={visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          col={{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12, xxl: 12 }}
          onRef={this.onRefs}
        />


      </div>
    );
  }
}

export default DeviceCharts;
