/**
 * Created by 11485 on 2019/2/25.
 */
import React, { Component } from 'react';
import styles from './Homepage.less';
import { Icon, Row, Col, Card, Tooltip, Button, Menu, Empty, message, Input, Pagination, Tag, Table, Divider, Badge, Statistic, Drawer, Dropdown, Collapse, Checkbox, PageHeader, DatePicker, Select, Tabs, Modal, Popconfirm, Upload } from 'antd';
import { connect } from 'dva';
import { ChartCard, WaterWave, Pie } from '@/components/Charts';
import ReactEcharts from "echarts-for-react";
import moment from 'moment';
import AbEditor from '@/components/AbEditor';
import UserCheck from './UserCheck';
import router from 'umi/router'

const { Panel } = Collapse;
const { TabPane } = Tabs;
const { Search } = Input;

@connect(({ home, loading }) => ({
  home,
  submitting: loading.effects['home/queryHome'],
}))
class Homepage extends Component {
  constructor(props) {
    super(props)
    this.t = null;
    this.columns = [
      {
        title: '任务执行状态',
        dataIndex: 'statusName',
        key: 'statusName',
      },
      {
        title: '执行人',
        dataIndex: 'executeUserName',
        key: 'executeUserName',
      },
      {
        title: '执行人公司',
        dataIndex: 'companyName',
        key: 'companyName',
      },
      {
        title: '执行人部门',
        dataIndex: 'departmentName',
        key: 'departmentName',
      },
      {
        title: "验收人名",
        dataIndex: 'auditUserName',
        key: 'auditUserName',
      },
      {
        title: "验收时间",
        dataIndex: 'auditTime',
        key: 'auditTime',
      },
      {
        title: "验收结果",
        dataIndex: 'auditStatusName',
        key: 'auditStatusName',
      },
    ]
    this.state = {
      postData: {
        "departmentId": undefined,//部门id
        "shopId": undefined,//车间id
        "startTime": "",//开始时间
        "endTime": ""//结束时间
      },
      visible: false,
      auditStatus: undefined,
      vals: "0",
      curitem: {},
      ifs: "",
      key: "1",
      settitle: "",
      iftype: "mine",
      sendMission: {
        "assignmentTitle": "",//任务标题（必填）
        "assignmentContent": "",//任务内容（必填）
        "closeDate": "",//截至日期（必填）
        "attachmentUrlList": [],
        "sendUserIdList": [],
        "executeUserIdList": [],//执行人id集合（必填）
        "remark": ""//备注（非必填）
      },
      postDate: {
        "pageIndex": 1,
        "pageSize": 10,
        "assignmentTitle": "",//任务标题
        "status": ''
      },
      postDate1: {
        "pageIndex": 1,
        "pageSize": 10,
        "assignmentTitle": "",//任务标题
        "status": ''
      },
      postUrl: "queryMyList",

      person: {
        cj: [],
        cs: [],
        css: [],
      },
    }
  }

  setNewValue = (val) => {
    if (this.state.key == "1") {
      this.setState({
        person: {
          ...this.state.person,
          cj: val
        },
      }, () => { console.log(this.state.person) })
    } else if (this.state.key == "2") {
      this.setState({
        person: {
          ...this.state.person,
          cs: val
        },
      }, () => { console.log(this.state.person) })
    } else {
      this.setState({
        person: {
          ...this.state.person,
          css: val
        },
      }, () => { console.log(this.state.person) })
    }
  }

  onClose = () => {
    let _it = this;
    if (this.state.ifs == "1" || this.state.ifs == "11" || this.state.ifs == "2") {
      Modal.confirm({
        title: "是否取消编辑",
        content: "取消编辑后无法保存已填写的内容",
        onOk: () => {
          _it.setState({
            visible: false,
          }, () => {
            _it.resetData()
          });
        },
        okText: "是",
        cancelText: "否"
      })
    } else {
      _it.setState({
        visible: false,
      }, () => {
        _it.resetData()
      });
    }
  };

  //设置新状态
  setNewState(type, values, fn) {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/' + type,
      payload: values
    }).then((res) => {
      if (res) {
        fn ? fn() : null;
      }
    });
  }

  resetData(fn) {
    this.setNewState("queryHome");
    this.getFirstData("");
    this.setNewState("queryTaskCount", null, fn);

  }

  //1格的查询方法
  getFirstData(key) {
    let { postUrl, postDate, postDate1, iftype } = this.state;
    if (iftype == "mine") {
      let postes = key ? { ...postDate, status: key } : { ...postDate }
      this.setNewState(postUrl, postes)
    } else if (iftype == "public") {
      //maybe change
      let postes = key ? { ...postDate1, status: key } : { ...postDate1 }
      this.setNewState(postUrl, postes)
    }
  }



  componentDidMount() {
this.props.ensureDidMount()
    this.resetData();
    this.setNewState('queryOEE', this.state.postData);
    this.setNewState('queryMTBF', this.state.postData);
    this.setNewState('queryMTTR', this.state.postData);
  }

  getOption(value) {
    let allData = this.props.home.queryHome;
    let res = {}
    if (!allData[value]) {
      return res
    }
    switch (value) {
      case "equipTypeChart":
        let xData = allData[value].map((item, i) => {
          return item.name
        }), yData = allData[value].map((item, i) => {
          return item.value
        })
        res = {
          title: {
            text: "设备统计",
            subtext: '',
            x: '0',
            textStyle: {
              fontSize: 16,
              fontWeight: "noraml",
              color: "#f50"
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          dataZoom: [{
            type: 'inside'
          }, {
            type: 'slider'
          }],
          toolbox: {
            feature: {
              dataView: { show: true, readOnly: false },
              magicType: { show: true, type: ['line', 'bar'] },
              restore: { show: true },
              saveAsImage: { show: false }
            }
          },
          legend: {
            data: ["数量"],
            left: "center",
          },
          xAxis: [
            {
              type: 'category',
              data: xData,
              axisPointer: {
                type: 'shadow'
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: "数量",
              axisLabel: {
                formatter: '{value} 台'
              }
            }
          ],
          series: [
            {
              name: "数量",
              type: 'bar',
              data: yData,
              itemStyle: {
                normal: {
                  color: ["#0e6eb8"]
                }
              },
              label: {
                normal: {
                  formatter: '{c} 台',
                  show: true
                },
              },
            }
          ]
        }
        break;
    }
    return res
  }


  getOptions(allData, name, legend, danwei) {
    let res = {}
    let xData = allData.map((item, i) => {
      return item.date
    }), yData = allData.map((item, i) => {
      return item.value
    })
    res = {
      title: {
        text: name,
        subtext: '',
        x: '0',
        textStyle: {
          fontSize: 16,
          fontWeight: "noraml",
          color: "#f50"
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      dataZoom: [{
        type: 'inside'
      }, {
        type: 'slider'
      }],
      toolbox: {
        feature: {
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
          saveAsImage: { show: false }
        }
      },
      legend: {
        data: [legend],
        left: "center",
      },
      xAxis: [
        {
          type: 'category',
          data: xData,
          axisPointer: {
            type: 'shadow'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: legend + danwei,
          axisLabel: {
            formatter: '{value} '
          }
        }
      ],
      series: [
        {
          name: legend,
          type: 'bar',
          data: yData,
          label: {
            normal: {
              formatter: '{c}',
              show: true
            },
          },
        }
      ]
    }
    return res
  }


  searchVal(value, url, post, key) {
    this.setState({
      [post]: {
        ...this.state[post],
        [key]: value
      }
    }, () => {
      this.setNewState(url, this.state[post])
    })
  }

  onRefer = (ref) => {
    this.edtorchild = ref;
  }
  onRef = (ref) => {
    this.child = ref;
  }
  onRefs = (ref) => {
    this.childs = ref;
  }
  onRefc = (ref) => {
    this.childc = ref;
  }

  render() {
    let { queryHome, queryMyList, fqueryDetaila, fqueryDetailb, queryTaskCount } = this.props.home,
      { settitle, ifs, iftype, postUrl, key, visible, sendMission, person, curitem, auditStatus, vals } = this.state;
    let { equipmentCount, pendingCount, equipStatusChart, equipTypeChart, turnOnRate, spareConsumeChart } = queryHome;
    let col = {
      xs: 24, sm: 24, md: 24, lg: 24, xl: 6, xxl: 4,
    }, cols = {
      xs: 24, sm: 24, md: 24, lg: 24, xl: 9, xxl: 10,
    }, colc = {
      xs: 24, sm: 24, md: 24, lg: 24, xl: 12, xxl: 16,
    }
    let pageChanges = (page) => {
      this.setNewState("fqueryDetailb", { id: this.state.curitem.id, pageIndex: page, pageSize: 10 });
    }

    //时间格式化
    let getTime = (time) => {
      let a = moment(), b = moment(time), c = a.diff(b); // 86400000
      return c > 60 * 60 * 1000 ? time : moment(time).fromNow();
    }, getIfs = (time) => {
      let a = moment(), b = moment(time), c = a.diff(b); // 86400000
      return c > 60 * 60 * 1000
    }
    let pageconfig = (url, post, mainurl) => {
      return {
        showTotal: total => `共${total}条`, // 分页
        size: "small",
        pageSize: 10,
        showQuickJumper: true,
        current: this.props.home[url].pageNum ? this.props.home[url].pageNum : 1,
        total: this.props.home[url].total ? parseInt(this.props.home[url].total) : 0,
        onChange: (page) => pageChange(page, mainurl ? mainurl : url, post),
      }
    }
    const menu = (
      <Menu>
        <Menu.Item onClick={() => this.getFirstData("")}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}> 全部 </div>
        </Menu.Item>
        <Menu.Item onClick={() => this.getFirstData("0")}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}> 未完成 </div>
        </Menu.Item>
        <Menu.Item onClick={() => this.getFirstData("1")}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}> 已完成 </div>
        </Menu.Item>
      </Menu>
    );

    let searchBox = (url, post, key) => {
      return <Search placeholder="搜索..." allowClear onSearch={(value) => this.searchVal(value, url, post, key)}></Search>
    }
    //工作任务list
    let renderMission = (item, i) => {
      return <div key={i}>
        <Row onClick={() => {
          let pour = iftype == "mine" ? "fqueryDetaila" : iftype == "public" ? "fqueryDetailb" : null,
            postl = iftype == "mine" ? { id: item.id } : iftype == "public" ? {
              id: item.id, "pageIndex": 1,
              "pageSize": 10,
            } : null;
          this.setState({
            ifs: iftype == "mine" ? "1a" : iftype == "public" ? "1b" : null,
            settitle: "任务详情",
            curitem: item
          }, () => {
            this.setNewState(pour, postl, () => {
              this.setState({
                visible: true,
                auditStatus: iftype == "mine" ? this.props.home.fqueryDetaila.myWork.auditStatus ? this.props.home.fqueryDetaila.myWork.auditStatus.toString() : "" : ""
              })
            })
          })
        }} className={getIfs(item.createTime) ? styles.rows : styles.redrows} style={{ display: "flex", alignItems: "center", padding: "8px 4px 8px 4px", marginTop: -1 }}>
          <span>{item.statusName}</span>
          <Divider style={{ marginTop: 4 }} type="vertical"></Divider>
          <span style={{ color: item.assignmentType == "1" ? "#f50" : "green" }}>{item.assignmentTypeName}</span>
          <Divider style={{ marginTop: 4 }} type="vertical"></Divider>
          <Tooltip placement="bottomLeft" title={item.assignmentTitle}>
            <span className={styles.oneline}>
              {item.assignmentTitle}
            </span>
          </Tooltip>
          <span title={item.createTime} style={{ color: "#999", display: "inline-block", width: 130, textAlign: "right" }}>{getTime(item.createTime)}</span>
          {
            item.status == 0 && this.state.iftype == "public" ?
              <div onClick={(e) => {
                e.stopPropagation()
              }}>
                <Popconfirm
                  okText="确认"
                  cancelText="取消"
                  placement="bottomRight"
                  title={"确认删除该任务？"}
                  onConfirm={() => {
                    this.setNewState("missiondeleteById", { id: item.id }, () => {
                      message.success("删除成功！");
                      this.getFirstData();
                    })
                  }}>
                  <Icon style={{ color: "#ff4800", paddingLeft: 12 }} type="close"></Icon>
                </Popconfirm>
              </div>
              :
              null
          }
        </Row>
        <Divider dashed style={{ margin: 0 }}></Divider>
      </div>
    }


    let renderText = (s, p, step, time) => {
      this.t = setInterval(() => {
        if (this.state[s] < p) {
          this.setState({
            [s]: this.state[s] + step
          })
        } else {
          clearInterval(this.t);
        }
      }, time)
      return this.state[s] < p ? this.state[s] : p
    }
    
    function getcolor(text) {
      let color = "";
      switch (text) {
        case "待机":
          color = "#999"
          break;
        case "运行中":
          color = "green"
          break;
        case "故障":
          color = "#ff5000"
          break;
        case "维修中":
          color = "#0e6eb8"
          break;
        case " 流转中":
          color = "#0e6eb8"
          break;
        case "报废":
          color = "#ff2100"
          break;
      }
      return color
    }

    let callback = (key) => {
      this.setState({ key })
    }
    const { Dragger } = Upload, _it = this;
    const props = {
      name: 'file',
      multiple: true,
      action: '/ngy/common/uploadFile',
      onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
          console.log(info.file);
        }
        if (status === 'done') {
          let result = info.file.response;
          if (!info.file) {
            return false
          }
          if (info.file.status === 'done') {
            _it.setState({
              sendMission: {
                ...sendMission,
                attachmentUrlList: [...sendMission.attachmentUrlList, { url: result.data.dataList[0], id: info.file.originFileObj.uid }]
              }
            }, () => {
              console.log(_it.state.sendMission)
            })
          }
        } else if (status === 'error') {
          message.error(`${info.file.name}文件上传失败`);
        }
      },
      onRemove(file) {
        let newattachmentUrlList = sendMission.attachmentUrlList.filter((item) => {
          return item.id !== file.originFileObj.uid
        })

        _it.setState({
          sendMission: {
            ...sendMission,
            attachmentUrlList: newattachmentUrlList
          }
        }, () => {
          console.log(_it.state.sendMission)
        })

      }
    };

    return (
      <div className={styles.Homepage}>
        <Drawer
          closable={true}
          destroyOnClose
          title={settitle ? settitle : "详情"}
          placement="right"
          width={"90%"}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          {
            !visible ?
              null :
              ifs == "1" ?
                <div>
                  <PageHeader
                    ghost={false}
                    title={key == "1" ? <span style={{ color: "red" }}>* 选择任务承接人</span> : <a>选择抄送人</a>}
                  >
                    <Tabs defaultActiveKey="1" onChange={callback} tabBarExtraContent={<a onClick={() => {
                      if (key == "1") {
                        this.setState({
                          person: {
                            ...person,
                            cj: []
                          }
                        })
                        this.child.resetEmpty()
                      } else {
                        this.setState({
                          person: {
                            ...person,
                            cs: []
                          }
                        })
                        this.childs.resetEmpty()
                      }
                    }}>
                      清空
                      </a>}>
                      <TabPane tab={<a style={{ color: "red" }}>* 选择任务承接人</a>} key="1">
                        <UserCheck onRef={this.onRef} setNewValue={this.setNewValue} checkedValue={this.state.person.cj} title={key == "1" ? "选择任务承接人" : "选择抄送人"}></UserCheck>
                      </TabPane>
                      <TabPane tab="选择抄送人" key="2">
                        <UserCheck onRef={this.onRefs} key={"b"} setNewValue={this.setNewValue} checkedValue={this.state.person.cs} title={key == "1" ? "选择任务承接人" : "选择抄送人"}></UserCheck>
                      </TabPane>
                    </Tabs>
                  </PageHeader>
                  <PageHeader
                    ghost={false}
                    title={<span style={{ color: "red" }}>* 任务标题</span>}
                    subTitle="64字以内"
                  >
                    <Input value={sendMission.assignmentTitle} onChange={(e) => {
                      this.setState({
                        sendMission: { ...sendMission, assignmentTitle: e.target.value }
                      })
                    }} maxLength={64} style={{ width: "100%" }} size='large' placeholder="任务标题" />
                  </PageHeader>
                  <PageHeader
                    ghost={false}
                    title={<span style={{ color: "red" }}>* 任务内容</span>}
                    subTitle='任务内容'
                  >
                    <div style={{ border: "#ddd solid 1px", overflow: "hidden" }}>
                      <Input.TextArea rows={8} value={sendMission.assignmentContent} onChange={(e) => {
                        this.setState({
                          sendMission: { ...sendMission, assignmentContent: e.target.value }
                        })
                      }} maxLength={64} style={{ width: "100%" }} size='large' placeholder="任务内容" />
                      {/* <AbEditor onRefer={this.onRefer} defaultValue={sendMission.assignmentContent} ></AbEditor> */}
                    </div>
                  </PageHeader>

                  <PageHeader
                    ghost={false}
                    title={<span style={{ color: "red" }}>* 截至日期</span>}
                    subTitle='任务截止日期'
                  >
                    <DatePicker disabledDate={(current) => {
                      return current && current < moment().add('day', -1);
                    }} value={sendMission.closeDate ? moment(sendMission.closeDate) : undefined} onChange={(value) => {
                      this.setState({
                        sendMission: { ...sendMission, closeDate: moment(value).format("YYYY-MM-DD") }
                      })
                    }} style={{ width: "100%" }} size='large'></DatePicker>
                  </PageHeader>

                  <PageHeader
                    ghost={false}
                    title="添加附件"
                    subTitle='附件列表'
                  >
                    <Dragger {...props}>
                      <p className="ant-upload-drag-icon">
                        <Icon type="inbox" />
                      </p>
                      <p className="ant-upload-text">点击/拖拽上传文件</p>
                      <p className="ant-upload-hint">
                        支持上传多个文件
                      </p>
                    </Dragger>


                  </PageHeader>

                  <PageHeader
                    ghost={false}
                    title="备注"
                    subTitle='该任务的注意事项'
                  >
                    <Input.TextArea value={sendMission.remark} onChange={(e) => {
                      this.setState({
                        sendMission: { ...sendMission, remark: e.target.value }
                      })
                    }} rows={6} style={{ width: "100%" }} size='large' placeholder="备注" />
                  </PageHeader>
                  <PageHeader>
                    <Button type='primary' onClick={() => {
                      let iko = 0, sendMission = this.state.sendMission;
                      //sendMission.assignmentContent = this.edtorchild.submitContent()
                      sendMission.executeUserIdList = this.state.person.cj;
                      sendMission.sendUserIdList = this.state.person.cs;
                      sendMission.attachmentUrlList  =  sendMission.attachmentUrlList.map((item)=>{
                        return item.url
                      })
                      for (let key in sendMission) {
                        if (key != "remark") {
                          if (!sendMission[key]) {
                            iko = 1;
                          }
                        }
                      }

                      if (iko == 1) {
                        message.error("除备注外都是必填项！");
                        return
                      }

                      this.setNewState("missionsave", { ...sendMission, assignmentType: "1" }, () => {
                        message.success("发布成功");

                        this.setState({
                          visible: false,
                          sendMission: {
                            "assignmentTitle": "",//任务标题（必填）
                            "assignmentContent": "",//任务内容（必填）
                            "closeDate": "",//截至日期（必填）
                            "executeUserIdList": [],//执行人id集合（必填）
                            "sendUserIdList": [],
                            "attachmentUrlList": [],
                            "remark": ""//备注（非必填）
                          },
                          person: {
                            cs: [],
                            cj: [],
                            css: []
                          },
                        })
                      })
                    }} style={{ width: "100%", marginTop: 8 }} size='large'>
                      提交
                  </Button>
                  </PageHeader>
                </div>
                :
                ifs == "11" ?
                  <div>
                    <PageHeader
                      ghost={false}
                      title={key == "1" ? <span style={{ color: "red" }}>* 选择任务承接人</span> : <a>选择抄送人</a>}
                      extra={<a onClick={() => {
                        this.setState({
                          person: {
                            ...person,
                            css: []
                          }
                        })
                        this.childc.resetEmpty()
                      }}>
                        清空
                        </a>}
                    >
                      <UserCheck onRef={this.onRefc} key={"c"} setNewValue={this.setNewValue} checkedValue={this.state.person.css} title={"选择抄送人"}></UserCheck>
                    </PageHeader>
                    <PageHeader
                      ghost={false}
                      title={<span style={{ color: "red" }}>* 任务标题</span>}
                      subTitle="64字以内"
                    >
                      <Input value={sendMission.assignmentTitle} onChange={(e) => {
                        this.setState({
                          sendMission: { ...sendMission, assignmentTitle: e.target.value }
                        })
                      }} maxLength={64} style={{ width: "100%" }} size='large' placeholder="任务标题" />
                    </PageHeader>
                    <PageHeader
                      ghost={false}
                      title={<span style={{ color: "red" }}>* 任务内容</span>}
                      subTitle='任务内容'
                    >
                      <div style={{ border: "#ddd solid 1px", overflow: "hidden" }}>
                        <Input.TextArea rows={8} value={sendMission.assignmentContent} onChange={(e) => {
                          this.setState({
                            sendMission: { ...sendMission, assignmentContent: e.target.value }
                          })
                        }} maxLength={64} style={{ width: "100%" }} size='large' placeholder="任务内容" />
                        {/* <AbEditor onRefer={this.onRefer} defaultValue={sendMission.assignmentContent} ></AbEditor> */}
                      </div>
                    </PageHeader>
                    <PageHeader
                      ghost={false}
                      title="添加附件"
                      subTitle='附件列表'
                    >
                      <Dragger {...props}>
                        <p className="ant-upload-drag-icon">
                          <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">点击/拖拽上传文件</p>
                        <p className="ant-upload-hint">
                          支持上传多个文件
                      </p>
                      </Dragger>


                    </PageHeader>
                    <PageHeader
                      ghost={false}
                      title="备注"
                      subTitle='该任务的注意事项'
                    >
                      <Input.TextArea value={sendMission.remark} onChange={(e) => {
                        this.setState({
                          sendMission: { ...sendMission, remark: e.target.value }
                        })
                      }} rows={6} style={{ width: "100%" }} size='large' placeholder="备注" />
                    </PageHeader>
                    <PageHeader>
                      <Button type='primary' onClick={() => {
                        let iko = 0, sendMission = this.state.sendMission;
                        //sendMission.assignmentContent = this.edtorchild.submitContent()
                        sendMission.sendUserIdList = this.state.person.css;
                        sendMission.attachmentUrlList  =  sendMission.attachmentUrlList.map((item)=>{
                          return item.url
                        })
                        delete sendMission.closeDate;
                        delete sendMission.executeUserIdList;
                        for (let key in sendMission) {
                          if (key != "remark") {
                            if (!sendMission[key]) {
                              iko = 1;
                            }
                          }
                        }

                        if (iko == 1) {
                          message.error("除备注外都是必填项！");
                          return
                        }

                        this.setNewState("missionsave", { ...sendMission, assignmentType: "2" }, () => {
                          message.success("发布成功");
                          this.getFirstData()
                          this.setState({
                            visible: false,
                            sendMission: {
                              "assignmentTitle": "",//任务标题（必填）
                              "assignmentContent": "",//任务内容（必填）
                              "closeDate": "",//截至日期（必填）
                              "attachmentUrlList": [],
                              "executeUserIdList": [],//执行人id集合（必填）
                              "sendUserIdList": [],
                              "remark": ""//备注（非必填）
                            },
                            person: {
                              cs: [],
                              cj: [],
                              css: []
                            },
                          })
                        })
                      }} style={{ width: "100%", marginTop: 8 }} size='large'>
                        提交
                    </Button>
                    </PageHeader>
                  </div>
                  :
                  ifs == "2" ?
                    <div>
                      <PageHeader
                        ghost={false}
                        title={<span style={{ color: "red" }}>* 通知公告标题</span>}
                        subTitle="64字以内"
                      >
                        <Input value={sendGG.announcementTitle} onChange={(e) => {
                          this.setState({
                            sendGG: { ...sendGG, announcementTitle: e.target.value }
                          })
                        }} maxLength={64} style={{ width: "100%" }} size='large' placeholder="任务标题" />
                      </PageHeader>
                      <PageHeader
                        ghost={false}
                        title={<span style={{ color: "red" }}>* 通知公告内容</span>}
                        subTitle='富文本编辑'
                      >
                        <div style={{ border: "#ddd solid 1px", overflow: "hidden" }}>
                          <AbEditor onRefer={this.onRefer} defaultValue={sendGG.announcementContent} ></AbEditor>
                        </div>
                      </PageHeader>
                      <PageHeader>
                        <Button type='primary' onClick={() => {
                          let iko = 0, sendGG = this.state.sendGG;
                          sendGG.announcementContent = this.edtorchild.submitContent();
                          for (let key in sendGG) {
                            if (!sendGG[key]) {
                              iko = 1;
                            }
                          }
                          if (iko == 1) {
                            message.error("标题/内容为必填项！");
                            return
                          }
                          this.setNewState("GGsave", sendGG, () => {
                            this.setState({
                              visible: false,
                              sendGG: {
                                announcementContent: '',
                                assignmentTitle: ''
                              },
                            }, () => {
                              this.resetData()
                            })
                          })
                        }} style={{ width: "100%", marginTop: 8 }} size='large'>
                          提交
                  </Button>
                      </PageHeader>

                    </div>
                    :
                    ifs == "2re" ?
                      <div>
                        <PageHeader
                          title={curitem.announcementTitle}
                          subTitle={"发布者：" + curitem.publishUserName + " | " + curitem.publishTime}
                        >
                          <div className={styles.innerHtml} dangerouslySetInnerHTML={{ __html: curitem ? curitem.announcementContent : null }}>
                          </div>
                        </PageHeader>
                      </div> :
                      ifs == "1a" ?
                        <div>
                          <PageHeader
                            title={fqueryDetaila.publish.assignmentTitle ? fqueryDetaila.publish.assignmentTitle : ""}
                            subTitle={`发布者：${fqueryDetaila.publish.publishUserName} | 发布时间：${fqueryDetaila.publish.publishTime} | 截止时间：${fqueryDetaila.publish.closeDate ? fqueryDetaila.publish.closeDate : ""} | 任务状态:${fqueryDetaila.myWork.statusName}`}
                          >
                            <div className={styles.innerHtml} dangerouslySetInnerHTML={{ __html: fqueryDetaila.publish ? fqueryDetaila.publish.assignmentContent : null }}>
                            </div>
                            <p style={{ marginTop: 20, display: fqueryDetaila.publish.remark ? "block" : "none", color: "#999" }}>备注：{fqueryDetaila.publish.remark}</p>
                            <p style={{ marginTop: 20, color: "#999" }}>类型：{fqueryDetaila.publish.assignmentTypeName}</p>

                          </PageHeader>
                          {
                            fqueryDetaila.myWork.assignmentUserType == "1" ?
                              <div>
                                <PageHeader
                                  title={"执行内容"}
                                  subTitle={"填写任务执行内容"}
                                  extra={[<Button onClick={() => {
                                    if (!this.edtorchild.submitContent()) {
                                      message.error("请填写任务执行内容");
                                      return
                                    }
                                    this.setNewState("missionsubmit", {
                                      "id": fqueryDetaila.myWork.id,
                                      "executeContent": this.state.executeContent?this.state.executeContent:null,//执行内容（必填）
                                    }, () => {
                                      this.setNewState("fqueryDetaila", { id: fqueryDetaila.myWork.id }, () => {
                                        message.success("提交成功")
                                      })
                                    })
                                  }} disabled={fqueryDetaila.myWork.status != "1" && fqueryDetaila.myWork.status != "3"} type="primary">提交</Button>]}
                                >
                                  <div style={{ border: "#ddd solid 1px", overflow: "hidden" }}>
                                    <Input.TextArea rows={8} defaultValue={fqueryDetaila.myWork.executeContent}
                                      onChange={(e)=>{
                                        this.setState({
                                          executeContent:e.target.value
                                        },()=>{
                                          console.log(this.state.executeContent)
                                        })  
                                      }}
                                    />
                                  </div>

                                </PageHeader>
                                <PageHeader
                                  title={"验收任务"}
                                  subTitle={"选择验收结果"}
                                  extra={[<Button onClick={() => {
                                    if (!this.state.auditStatus) {
                                      message.error("请选择验收结果");
                                      return
                                    }
                                    this.setNewState("missionaudit", {
                                      "id": fqueryDetaila.myWork.id,
                                      "auditStatus": this.state.auditStatus,//执行内容（必填）
                                    }, () => {
                                      this.setNewState("fqueryDetaila", { id: fqueryDetaila.myWork.id }, () => {
                                        message.success("验收成功")
                                      })
                                    })
                                  }} disabled={fqueryDetaila.myWork.status != "2"} type="primary">验收任务</Button>]}
                                >
                                  {
                                    <div>
                                      <Select value={auditStatus} style={{ width: "100%" }} placeholder="验收该任务是否通过" onChange={(val) => {
                                        this.setState({
                                          auditStatus: val
                                        })
                                      }}>
                                        <Option value="1">通过</Option>
                                        <Option value="2">不通过</Option>
                                      </Select>
                                      <p style={{ marginTop: 12 }}>验收人 ：{fqueryDetaila.myWork.auditUserName}</p>
                                      <p style={{ marginTop: 12 }}>验收时间 ：{fqueryDetaila.myWork.auditTime}</p>
                                    </div>
                                  }
                                </PageHeader>

                              </div>
                              : null
                          }

                        </div> :
                        ifs == "1b" ?
                          <div>
                            <PageHeader
                              title={curitem.assignmentTitle ? curitem.assignmentTitle : ""}
                              subTitle={`发布者：${curitem.publishUserName} | 发布时间：${curitem.publishTime} | 截止时间：${curitem.closeDate ? curitem.closeDate : ""} `}
                            >
                              <div className={styles.innerHtml} dangerouslySetInnerHTML={{ __html: curitem ? curitem.assignmentContent : null }}>
                              </div>
                              <p style={{ marginTop: 20, display: curitem.remark ? "block" : "none", color: "#999" }}>备注：{curitem.remark}</p>
                              <p style={{ marginTop: 20, color: "#999" }}>类型：{curitem.assignmentTypeName}</p>
                            </PageHeader>
                            <PageHeader
                              title="任务执行情况"
                              subTitle="分配给个人的任务执行情况"
                            >
                              <Table size="middle"
                                expandedRowRender={record => <div>
                                  <p>任务执行内容：</p>
                                  <div className={styles.innerHtml} dangerouslySetInnerHTML={{ __html: curitem ? record.executeContent : null }}></div>
                                </div>
                                }
                                scroll={{ x: 1200, y: "59vh" }}
                                loading={this.props.submitting}
                                pagination={{
                                  showTotal: total => `共${total}条`, // 分页
                                  size: "small",
                                  pageSize: 10,
                                  showQuickJumper: true,
                                  current: fqueryDetailb.pageNum ? fqueryDetailb.pageNum : 1,
                                  total: fqueryDetailb.total ? parseInt(fqueryDetailb.total) : 0,
                                  onChange: pageChanges,
                                }}
                                rowKey='id'
                                columns={this.columns}
                                dataSource={fqueryDetailb.list ? fqueryDetailb.list : []}
                              >
                              </Table>
                            </PageHeader>
                          </div>
                          :
                          null
          }
        </Drawer>

        <Row>
          <Card hoverable style={{ width: "100%", borderRadius: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 12px" }}>
              <span style={{ fontSize: 18 }}>首页</span>  <Icon type="sync" style={{ color: "#0e6eb8" }} spin={this.props.submitting} onClick={() => {
                this.resetData(() => {
                  message.success("同步数据成功！")
                });

              }} />
            </div>
          </Card>
        </Row>
        <Row gutter={12} style={{ marginTop: 12 }}>
          <Col {...col} >
            <Card hoverable >
              <ChartCard
                bordered={false}
                title="当前设备总数"
                avatar={
                  <img
                    style={{ width: 56, height: 56 }}
                    src="./images/device.png"
                    alt="indicator"
                  />
                }
                total={() => <span><a style={{ color: "#f2637b" }}>{renderText("a", equipmentCount ? parseInt(equipmentCount) : 0, 1, 20)}</a> 台</span>}
              />
            </Card>
          </Col>
          <Col {...col}>
            <Card hoverable>
              <div style={{ width: "100%", textAlign: "center" }}>
                <ChartCard
                  bordered={false}
                  title="设备开机率"
                  avatar={
                    turnOnRate ?
                      <WaterWave style={{ borderRadius: "50%" }} height={56} title="设备开机率" percent={turnOnRate ? parseFloat(turnOnRate) : 0} />
                      : null
                  }
                  total={() => <span><a style={{ color: "#2997ff" }}>{renderText("c", turnOnRate ? parseFloat(turnOnRate) : 0, 0.1, 60).toFixed(2)}</a> %</span>}
                />
              </div>
            </Card>
          </Col>

          <Col {...colc}>
            <Card hoverable>
              <Row style={{ display: "flex", height: 96, alignItems: "center" }}>
                <Col span={8} onClick={() => { queryTaskCount.tally == "0" ? null : router.push("/check/checkmession/checkmymession/1") }} style={{ cursor: "pointer" }}>
                  <Statistic title={<a style={{ color: "#ff5000", fontSize: 22 }}>待点检</a>} value={queryTaskCount.tally ? queryTaskCount.tally : 0} prefix={<Icon style={{ fontSize: 22, marginRight: 8 }} type="file-search" />} valueStyle={{ color: '#ff5000', fontSize: 22 }} />
                </Col>
                <Divider type="vertical" dashed style={{ height: 60 }}></Divider>

                <Col span={8} onClick={() => { queryTaskCount.maintenance == "0" ? null : router.push("/verb/verbmission/verbmymission/1") }} style={{ cursor: "pointer" }}>
                  <Statistic title={<a style={{ color: "green", fontSize: 22 }}>待保养</a>} value={queryTaskCount.maintenance ? queryTaskCount.maintenance : 0} prefix={<Icon style={{ fontSize: 22, marginRight: 8 }} type="file-protect" />} valueStyle={{ color: 'green', fontSize: 22 }} />
                </Col>
                <Divider type="vertical" dashed style={{ height: 60 }}></Divider>

                <Col span={8} onClick={() => { queryTaskCount.repair == "0" ? null : router.push("/repair/repairlist/repairmylist/1") }} style={{ cursor: "pointer" }}>
                  <Statistic title={<a style={{ color: "#ec407a", fontSize: 22 }}>待维修</a>} value={queryTaskCount.repair ? queryTaskCount.repair : 0} prefix={<Icon style={{ fontSize: 22, marginRight: 8 }} type="tool" />} valueStyle={{ color: '#ec407a', fontSize: 22 }} />
                </Col>
              </Row>




            </Card>
          </Col>


        </Row>

        <Row style={{ marginTop: 12 }} gutter={12}>
          <Col {...col}>
            <Card style={{ padding: 0, margin: 0 }} title={<span style={{ padding: "5px 0px 5px 12px", display: "block" }}>设备状态</span>}>
              {
                equipStatusChart ? equipStatusChart.map((item, i) => {
                  return <li className={styles.hoverable} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} key={i}><span style={{ color: getcolor(item.name) }}> <i style={{ padding: 2, color: getcolor(item.name) }}></i> {item.name}</span><span style={{ color: getcolor(item.name) }}>{item.value}个</span>  </li>
                }) : null
              }
            </Card>
          </Col>

          <Col {...cols}>
            <Card style={{ padding: 0, margin: 0 }} title={<span style={{ paddingLeft: 12 }}>{vals == "0" ? "设备统计" :
              vals == "1" ? "设备MOEE" :
                vals == "2" ? "设备MTBF" :
                  vals == "3" ? "设备MTTR" : ""
            }</span>}
              extra={
                <Select value={vals} onChange={(e) => {
                  this.setState({
                    vals: e
                  })
                }}>
                  <Option value="0">设备统计</Option>
                  <Option value="1">设备MOEE</Option>
                  <Option value="2">设备MTBF</Option>
                  <Option value="3">设备MTTR</Option>
                </Select>

              }

            >
              <div style={{ position: "relative", padding: "15px 0" }}>
                {
                  vals == "0" ?
                    <ReactEcharts style={{ height: 403 }} option={this.getOption("equipTypeChart")}></ReactEcharts> :
                    vals == "1" ?
                      <ReactEcharts style={{ height: 403 }} option={this.getOptions(this.props.home.queryOEE, "OEE图表", "占比", "%")}></ReactEcharts> :
                      vals == "2" ?
                        <ReactEcharts style={{ height: 403 }} option={this.getOptions(this.props.home.queryMTBF, "MTBF图表", "时长", "分钟")}></ReactEcharts> :
                        vals == "3" ?
                          <ReactEcharts style={{ height: 403 }} option={this.getOptions(this.props.home.queryMTTR, "MTTR图表", "时长", "分钟")}></ReactEcharts> :
                          <Empty style={{ margin: "12px 0px" }} description={
                            <span>
                              设备类型统计 - 暂无数据
                        </span>
                          } />
                }
              </div>
            </Card>
          </Col>

          <Col {...cols}>
            <Card hoverable title={<a style={{ padding: "4px 0px", display: "block" }}>工作任务</a>} extra={
              <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
                <Dropdown overlay={menu} trigger={['click']}>
                  <a onClick={() => {
                    this.setState({
                      iftype: "mine",
                      postUrl: "queryMyList",
                    }, () => {
                      this.getFirstData("")
                    })
                  }} className={this.state.iftype == "mine" ? styles.current : ""} style={{ width: "60px", display: "block", textAlign: "center" }}>我的</a>
                </Dropdown>
                <Dropdown overlay={menu} trigger={['click']}>
                  <a onClick={() => {
                    this.setState({
                      iftype: "public",
                      postUrl: "fbqueryMyList"
                    }, () => {
                      this.getFirstData("")
                    })
                  }} className={this.state.iftype == "public" ? styles.current : ""} style={{ margin: "0px 4px", width: "88px", display: "block", textAlign: "center" }} icon="file-done">已发布</a>
                </Dropdown>

                {searchBox(this.state.postUrl, this.state.iftype == "public" ? "postDate1" : "postDate", "assignmentTitle")}

              </div>
            }
              actions={[
                <Button size="small" onClick={() => {
                  this.setState({
                    visible: true,
                    settitle: "发布任务工作",
                    ifs: "1",
                    key: "1",
                    sendMission: {
                      "assignmentTitle": "",//任务标题（必填）
                      "assignmentContent": "",//任务内容（必填）
                      "closeDate": "",//截至日期（必填）
                      "attachmentUrlList": [],
                      "executeUserIdList": [],//执行人id集合（必填）
                      "sendUserIdList": [],
                      "remark": ""//备注（非必填）
                    },
                  })
                }} style={{ width: "100%", border: "none", backgroundColor: "transparent", boxShadow: "none" }} icon='edit'>发布任务</Button>
                // <Button size="small" onClick={() => {
                //   this.setState({
                //     visible: true,
                //     settitle: "发布私信工作",
                //     ifs: "11",
                //     key: "-1",
                //     sendMission: {
                //       "assignmentTitle": "",//任务标题（必填）
                //       "assignmentContent": "",//任务内容（必填）
                //       "closeDate": "",//截至日期（必填）
                //       "executeUserIdList": [],//执行人id集合（必填）
                //       "sendUserIdList": [],
                //       "remark": ""//备注（非必填）
                //     },
                //   })
                // }} style={{ width: "100%", border: "none", backgroundColor: "transparent", boxShadow: "none" }} icon='edit'>发布私信</Button>


              ]}>
              <div style={{ height: 385, position: "relative" }}>
                {
                  queryMyList.list && queryMyList.list.length != 0 ?
                    queryMyList.list.map((item, i) => {
                      return renderMission(item, i)
                    }) : <Empty style={{ paddingTop: 32 }}></Empty>
                }
                <div style={{ display: "flex", justifyContent: "flex-end", position: "absolute", bottom: -2, right: 0 }}>
                  <Pagination {...pageconfig("queryMyList", this.state.iftype == "public" ? "postDate1" : "postDate", this.state.postUrl)} />
                </div>
              </div>
            </Card>



          </Col>


        </Row>




      </div>
    );
  }
}

export default Homepage;
