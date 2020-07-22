import React, { Component } from 'react';
import moment from 'moment';
import {
  Icon, Upload, Table, Divider, Card, Form, Button, Input, Row, Col, Tree, Modal, Skeleton,
  message, Popconfirm, Tooltip, Select, DatePicker, InputNumber, Dropdown, Menu
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import white from '../../assets/white.jpg';
import Link from 'umi/link';
import Abload from '@/components/Abload';
import SearchBox from '@/components/SearchBox'
import CreateForm from "@/components/CreateForm"


const confirm = Modal.confirm;
const { TreeNode } = Tree;
const Search = Input.Search;
const Option = Select.Option;
const gData = [];

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

@connect(({ spare, loading }) => ({
  spare,
  submitting: loading.effects['spare/sparequeryList'],
  submittings: loading.effects['spare/sparequeryTreeList'],
}))
class SpareList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fv: false,
      fields: {},
      iftype: { name: '', val: '' },
      curitemz: {},
      expandedKeys: [],
      searchValue: '',
      curtitle: '',
      curitem: {},
      ifshow: false,
      addstr: '',
      addkey: '',
      gData: gData,
      show: false,
      postData: {
        "pageIndex": 1,                          //（int）页码
        "pageSize": 9,                           //（int）条数
        "sparePartsName": "",                     // 备件名称
        "warnNoticeUserId": "",                   // 预警通知人
        "sparePartsTypeId": "",                   // 备件类型主键
      },
      postUrl: "sparequeryList"
    };
  }

  /* dispatch获取/设置 */
  setNewState(type, value, fn) {
    let { dispatch, spare } = this.props;
    dispatch({
      type: 'spare/' + type,
      payload: value,
    }).then(key => {
      if (key) {
        fn ? fn(key) : null;
      }
    });
  }
  resetData() {
    this.setNewState(this.state.postUrl, this.state.postData)
  }

  componentDidMount() {
    this.props.ensureDidMount && this.props.ensureDidMount()
    this.setNewState('sparequeryTreeList', null);
    this.setNewState('sparequeryList', this.state.postData);
  }






  pageChange = page => {
    this.setState(
      {
        postData: { ...this.state.postData, pageIndex: page },
      },
      () => {
        this.setNewState('sparequeryList', this.state.postData);
      },
    );
  };

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
    let { sparequeryTreeList, sparequeryList, sparePartsTypeList, userList } = this.props.spare;
    this.setState({
      fv: false,
      fields: {
        sparePartsName: {
          value: null,
          type: "input",
          title: "备件名称",
          keys: "sparePartsName",
          requires: true
        },
        sparePartsTypeId: {
          value: null,
          type: "select",
          title: "备件类型",
          keys: "sparePartsTypeId",
          requires: true,
          option: sparePartsTypeList ? sparePartsTypeList.map(item => {
            return {
              id: item.id,
              name: item.sparePatrsTypeName
            }
          }) : []
        },
        sparePartsNo: {
          value: null,
          type: "input",
          title: "备件料号",
          keys: "sparePartsNo",
          requires: true
        },
        sparePartsValue: {
          value: null,
          type: "inputnumber",
          title: "备件价值(元)",
          keys: "sparePartsValue",
          requires: true
        },
        warnStock: {
          value: null,
          type: "inputnumber",
          title: "库存基数",
          keys: "warnStock",
          requires: true
        },
        warnNoticeUserId: {
          value: null,
          type: "select",
          title: "预警通知人",
          keys: "warnNoticeUserId",
          requires: true,
          option: userList ? userList.map((item, i) => {
            return {
              id: item.id,
              name: item.userName
            }
          }) : []
        }
      }
    });
  }

  /*form 提交*/
  handleCreate = () => {
    const form = this.formRef.props.form;
    let { iftype, curitemz } = this.state;
    form.validateFields((err, values) => {
      if (!err) {
        for (let i in values) {
          if (!values[i]) {
            delete values[i];
          } else {
          }
        }
        if (this.state.iftype.val == 'add') {
          this.setNewState('sparesave', values, () => {
            this.setNewState('sparequeryList', this.state.postData, () => {
              message.success('新增成功');
              this.handleCancel();
            });
          });
        } else {
          this.setNewState('sparesave', { ...values, id: this.state.curitemz.id }, () => {
            this.setNewState('sparequeryList', this.state.postData, () => {
              message.success('修改成功');
              this.handleCancel();
            });
          });
        }
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
    const { searchValue, curtitle, ifshow, curitem, curitemz,
      addstr, addkey, expandedKeys, autoExpandParent, show,
      iftype, fields, fv, postData
    } = this.state,
      { sparequeryTreeList, sparequeryList, sparePartsTypeList, userList } = this.props.spare;
    const { getFieldDecorator } = this.props.form;

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

    const columns = [
      {
        title: '料号',
        dataIndex: 'sparePartsNo',
        key: 'sparePartsNo',
        width: 90,
        ellipsis: true,
      },
      {
        title: '名称',
        dataIndex: 'sparePartsName',
        key: 'sparePartsName',
        ellipsis: true,
        ...getsearchbox('sparePartsName')
      },
      {
        title: '编号',
        dataIndex: 'spartPartsSerialNo',
        key: 'spartPartsSerialNo',
        ellipsis: true,
      },
      {
        title: '类型',
        dataIndex: 'sparePartsTypeName',
        key: 'sparePartsTypeName',
        ...gettreeselectbox('sparePartsTypeId', sparequeryTreeList),
        width: 110,
        ellipsis: true,
      },
      {
        title: '累积库存',
        dataIndex: 'totalStock',
        key: 'totalStock',
        width: 80,
        ellipsis: true,
      },
      {
        title: '可用库存',
        dataIndex: 'availableStock',
        key: 'availableStock',
        width: 80,
        ellipsis: true,
      },
      {
        title: '库存基数',
        dataIndex: 'warnStock',
        key: 'warnStock',
        width: 80,
        ellipsis: true,
      },
      {
        title: '预警通知人',
        dataIndex: 'warnNoticeUserName',
        key: 'warnNoticeUserName',
        ...getselectbox("warnNoticeUserId", userList ? userList.map((item) => {
          return {
            dicName: item.userName,
            dicKey: item.id
          }
        }) : []),
        width: 110,
        ellipsis: true,
      },
      {
        title: <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: 90 }}>
          价值(元)
      <a style={{ color: "#f50" }} onClick={() => {
            this.setState({
              postData: {
                ...postData,
                sparePartsName: "", // 备件名称
                warnNoticeUserId: "", // 预警通知人
                sparePartsTypeId: ""
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
        width: 110,
        ellipsis: true,
        dataIndex: 'sparePartsValue',
        key: 'sparePartsValue',
      },
    ]
    let records = this.props.spare.spareRecordqueryList;
    const menu = (record) => (
      <div style={{ display: record.id ? "flex" : "none", alignItems: "center" }}>
        <a style={{ marginRight: 8 }} onClick={() => {
          this.setState(
            {
              iftype: {
                name: '修改' + record.sparePartsName + '信息',
                val: 'edit',
              },
              curitemz: record,
              fields: {
                sparePartsName: {
                  value: record.sparePartsName,
                  type: "input",
                  title: "备件名称",
                  keys: "sparePartsName",
                  requires: true
                },
                sparePartsTypeId: {
                  value: record.sparePartsTypeId,
                  type: "select",
                  title: "备件类型",
                  keys: "sparePartsTypeId",
                  requires: true,
                  option: sparePartsTypeList ? sparePartsTypeList.map(item => {
                    return {
                      id: item.id,
                      name: item.sparePatrsTypeName
                    }
                  }) : []
                },
                sparePartsNo: {
                  value: record.sparePartsNo,
                  type: "input",
                  title: "备件料号",
                  keys: "sparePartsNo",
                  requires: true
                },
                sparePartsValue: {
                  value: record.sparePartsValue,
                  type: "inputnumber",
                  title: "备件价值(元)",
                  keys: "sparePartsValue",
                  requires: true
                },
                warnStock: {
                  value: record.warnStock,
                  type: "inputnumber",
                  title: "库存基数",
                  keys: "warnStock",
                  requires: true
                },
                warnNoticeUserId: {
                  value: record.warnNoticeUserId,
                  type: "select",
                  title: "预警通知人",
                  keys: "warnNoticeUserId",
                  requires: true,
                  option: userList ? userList.map((item, i) => {
                    return {
                      id: item.id,
                      name: item.userName
                    }
                  }) : []
                }
              }
            },
            () => {
              this.setState({
                fv: true
              })
            },
          );
        }}>
          修改
        </a>
        <Popconfirm
          okText="确认"
          cancelText="取消"
          placement="bottomRight"
          title={"确认删除该备件？"}
          onConfirm={() => {
            this.setNewState("sparedeleteById", { id: record.id }, () => {
              let total = this.props.spare.sparequeryList.total,
                page = this.props.spare.sparequeryList.pageNum;
              if ((total - 1) % 9 == 0) {
                page = page - 1
              }

              this.setState({
                postData: { ...this.state.postData, pageIndex: page }
              }, () => {
                this.setNewState("sparequeryList", postData, () => {
                  message.success("删除成功！");
                });
              })
            })
          }}>
          <a style={{ color: "#ff4800" }}>删除</a>
        </Popconfirm>
        <Divider style={{ marginTop: 6 }} type="vertical"></Divider>
        <a style={{ marginRight: 8 }} onClick={() => {
          let _it = this;
          Modal.confirm({
            title: `是否添加 ${record.sparePartsName} 库存`,
            content: <div>
              <InputNumber onChange={(val) => {
                _it.setState({
                  nums: val
                })
              }} placeholder="入库数量" min={1} style={{ width: "100%", margin: "18px 0px 12px 0px" }} />
              <Input.TextArea placeholder="备注" onChange={(e) => {
                _it.setState({
                  remark: e.target.value
                })
              }}
              />
            </div>,
            cancelText: "取消",
            okText: "添加",
            onOk() {
              let nums = _it.state.nums,
                remark = _it.state.remark;
              if (!nums) {
                message.warn("请填写入库数量");
                return
              }
              _it.setNewState("spareRecordsave", {
                "sparePartsId": record.id, // 备件主键*
                "ioType": "0", // 操作类型：0：入库，1：出库*
                "batchCount": nums, // 入库数量*
                "remark": remark //备注
              }, () => {
                message.success("操作成功");
                this.setNewState("sparequeryList", this.state.postData);
                _it.setState({
                  nums: "",
                  record: ""
                })
              })
            },
            onCancel() { },
          })
        }}>
          备件入库
        </a>
        <a style={{ marginRight: 8 }} onClick={() => {
          this.setNewState("spareRecordqueryList", { pageIndex: 1, pageSize: 9, id: record.id }, () => {
            this.setState({
              iftype: {
                name: `${record.sparePartsName} 的库存记录`,
                val: "tosee"
              },
              visible: true,
              curitemz: record
            })
          })
        }}>
          备件库存记录
          </a>
      </div>
    );


    const loop = data =>
      data.map(item => {
        const index = item.title.indexOf(searchValue);
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span style={{ color: '#f50' }}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
              <span>{item.title}</span>
            );
        if (item.children) {
          return (
            <TreeNode key={item.key} title={title} icon={<Icon type="edit" />}>
              {loop(item.children)}
            </TreeNode>
          );
        } else {
          return <TreeNode key={item.key} title={title} icon={<Icon type="edit" />} />;
        }
      });


    const titlerender = () => (
      <div className={styles.pubheader}>
        <h3 style={{ fontSize: 16, margin: 0, padding: 0 }}>
          备件清单列表
          </h3>
      </div>
    );

    const extrarender = width => (
      <div className={styles.pubextra} style={{ flex: 1, justifyContent: "flex-end", display: 'flex', alignItems: "center" }}>
        <a
          style={{ marginRight: 8 }}
          onClick={() => {
            this.setState(
              {
                iftype: {
                  ...iftype,
                  val: 'add',
                  name: '新增备件',
                },
                fields: {
                  sparePartsName: {
                    value: null,
                    type: "input",
                    title: "备件名称",
                    keys: "sparePartsName",
                    requires: true
                  },
                  sparePartsTypeId: {
                    value: null,
                    type: "select",
                    title: "备件类型",
                    keys: "sparePartsTypeId",
                    requires: true,
                    option: sparePartsTypeList ? sparePartsTypeList.map(item => {
                      return {
                        id: item.id,
                        name: item.sparePatrsTypeName
                      }
                    }) : []
                  },
                  sparePartsNo: {
                    value: null,
                    type: "input",
                    title: "备件料号",
                    keys: "sparePartsNo",
                    requires: true
                  },
                  sparePartsValue: {
                    value: null,
                    type: "inputnumber",
                    title: "备件价值(元)",
                    keys: "sparePartsValue",
                    requires: true
                  },
                  warnStock: {
                    value: null,
                    type: "inputnumber",
                    title: "库存基数",
                    keys: "warnStock",
                    requires: true
                  },
                  warnNoticeUserId: {
                    value: null,
                    type: "select",
                    title: "预警通知人",
                    keys: "warnNoticeUserId",
                    requires: true,
                    option: userList ? userList.map((item, i) => {
                      return {
                        id: item.id,
                        name: item.userName
                      }
                    }) : []
                  }
                }
              },
              () => {
                this.setState({
                  fv: true
                })
              },
            );
          }}
        >
          新增
          </a>

        {
          menu(curitem)
        }
        <Abload reload={() => this.resetData()} data={null} postName="uploadspareParts" left={0} filePath="http://47.100.234.193:8888/download/ngspareModel.xlsx"></Abload>


      </div>
    );
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

        <div className={styles.container}>
          <Row style={{ backgroundColor: '#ffffff' }}>
            <Col
              span={24}
              style={{ borderLeft: "#f0f0f0 solid 1px" }}
            >
              <div>
                <Card bordered={false} title={titlerender()} extra={extrarender()}>
                  <div
                    style={{
                      overflowX: 'hidden',
                      overflowY: 'auto',
                    }}
                  >

                    <Table size="middle"

                      onRow={record => {
                        return {
                          onClick: event => {
                            this.setState({ curitem: record });
                          }, // 点击行
                        };
                      }}
                      rowClassName={(record, index) => rowClassNameFn(record, index)}
                      columns={columns}
                      loading={this.props.submitting}
                      rowKey="id"
                      dataSource={sparequeryList.list}
                      pagination={{
                        showTotal: total => `共${total}条`,
                        // 分页
                        size: 'small',
                        showQuickJumper: true,
                        pageSize: 9,
                        current: sparequeryList.pageNum ? sparequeryList.pageNum : 1,
                        total: sparequeryList.total ? parseInt(sparequeryList.total) : 1,
                        onChange: this.pageChange,
                      }}
                    />
                  </div>
                </Card>
              </div>
            </Col>
          </Row>
        </div>
        <Modal
          style={{ top: 20 }}
          width={"90%"}
          visible={this.state.visible}
          title={iftype.name}
          onCancel={() => {
            this.setState({
              visible: false
            })
          }}
          footer={null}
        >
          <div>
            <Table size="middle"

              dataSource={records ? records.list : []}
              rowKey="id"
              pagination={{
                showTotal: total => `共${total}条`,
                size: 'small',
                showQuickJumper: true,
                pageSize: 9,
                current: records.pageNum ? records.pageNum : 1,
                total: records.total ? parseInt(records.total) : 1,
                onChange: (page) => {
                  this.setNewState("spareRecordqueryList", { pageIndex: page, pageSize: 9, id: curitemz.id })
                },
              }}
              columns={[
                {
                  title: '料号',
                  dataIndex: 'sparePartsNo',
                  key: 'sparePartsNo',
                },
                {
                  title: '备件名称',
                  dataIndex: 'sparePartsName',
                  key: 'sparePartsName',
                },
                {
                  title: '备件类型',
                  dataIndex: 'sparePartsTypeName',
                  key: 'sparePartsTypeName',
                },
                {
                  title: '操作类型',
                  dataIndex: 'ioTypeName',
                  key: 'ioTypeName',
                },
                {
                  title: '操作后数量',
                  dataIndex: 'currentStock',
                  key: 'currentStock',
                },
                {
                  title: '操作前总数',
                  dataIndex: 'beforeStock',
                  key: 'beforeStock',
                },
                {
                  title: '操作数量',
                  dataIndex: 'batchCount',
                  key: 'batchCount',
                },
                {
                  title: '操作人',
                  dataIndex: 'dealUserName',
                  key: 'dealUserName',
                },
                {
                  title: '操作时间',
                  dataIndex: 'dealTime',
                  key: 'dealTime',
                },
                {
                  title: '备注',
                  dataIndex: 'remark',
                  key: 'remark',
                },
                {
                  title: '相关单号',
                  dataIndex: 'recordNo',
                  key: 'recordNo',
                },
              ]}></Table>
          </div>
        </Modal>
        <CreateForm
          fields={fields}
          iftype={iftype}
          onChange={this.handleFormChange}
          wrappedComponentRef={this.saveFormRef}
          visible={fv}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />


      </div>
    );
  }
}

SpareList = Form.create('yangzige')(SpareList);

export default SpareList;
