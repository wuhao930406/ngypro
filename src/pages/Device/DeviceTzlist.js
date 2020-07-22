import React, { Component } from 'react';
import moment from 'moment';
import {
  Icon, Upload, Table, Divider, Card, Form, Button, Input, Row, Col, Tree, Modal, Skeleton,
  message, Popconfirm, Tooltip, Select, DatePicker, InputNumber, Dropdown, Menu, Tabs
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import white from '../../assets/white.jpg';
import Link from 'umi/link';
import ReactEcharts from "echarts-for-react";
import Abload from '@/components/Abload';
import SearchBox from '@/components/SearchBox'
import CreateForm from "@/components/CreateForm"
import DrawImage from "@/components/DrawImage"

const { TabPane } = Tabs;

const confirm = Modal.confirm;
const { TreeNode } = Tree;
const Search = Input.Search;
const Option = Select.Option;

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

@connect(({ device, loading }) => ({
  device,
  submitting: loading.effects['device/devicequeryList'],
}))
class Tzlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      iftype: { name: '', val: '' },
      fields: {},
      fv: false,
      curitemz: {},
      curitem: {},
      imageUrl: "",
      postData: {
        "pageIndex": 1,                          //（int）页码
        "pageSize": 9,                           //（int）条数
        "status": undefined,                             //（String）设备状态key
        "equipmentTypeId": undefined,  //（int）设备类型id
        "equipmentNo": "",                    //（String）设备编号
        "equipmentName": '',              //（String）设备名称
        "departmentId": undefined      //（int）部门id
      },
      postUrl: "devicequeryList",
    };
  }

  /* dispatch获取/设置 */
  setNewState(type, value, fn) {
    let { dispatch, device } = this.props;
    dispatch({
      type: 'device/' + type,
      payload: value,
    }).then(key => {
      if (key) {
        fn ? fn(key) : null;
      }
    });
  }

  componentDidMount() {
    this.props.ensureDidMount&&this.props.ensureDidMount();
    this.setNewState('devicequeryList', this.state.postData, () => {
      this.handleCancel()
    });
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
              fields.groupId.option = this.props.device.queryByShopId.map(item => {
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
        equipmentNo: {
          value: null,
          type: "input",
          title: "设备编号",
          keys: "equipmentNo",
          requires: true,
        },
        equipmentName: {
          value: null,
          type: "input",
          title: "设备名称",
          keys: "equipmentName",
          requires: true,
        },
        positionNo: {
          value: null,
          type: "input",
          title: "设备位置号",
          keys: "positionNo",
          requires: false,
        },
        equipmentModel: {
          value: null,
          type: "input",
          title: "设备型号",
          keys: "equipmentModel",
          requires: true,
        },
        equipmentTypeId: {
          value: null,
          type: "select",
          title: "设备类型",
          keys: "equipmentTypeId",
          requires: true,
          option: this.props.device.search.equipmentTypeLeafList ? this.props.device.search.equipmentTypeLeafList.map(item => {
            return {
              name: item.equipmentTypeName,
              id: item.id
            }
          }) : []
        },
        departmentId: {
          value: null,
          type: "treeselect",
          title: "所在部门",
          keys: "departmentId",
          requires: true,
          option: this.props.device.search.departmentDataList ? this.props.device.search.departmentDataList : []
        },
        shopId: {
          value: null,
          type: "select",
          title: "所在车间",
          keys: "shopId",
          requires: true,
          option: this.props.device.search.shopList ? this.props.device.search.shopList.map(item => {
            return {
              name: item.shopName,
              id: item.id
            }
          }) : []
        },
        groupId: {
          value: null,
          type: "select",
          title: "所在分组",
          keys: "groupId",
          requires: false,
          option: this.props.device.queryByShopId ? this.props.device.queryByShopId.map(item => {
            return {
              name: item.groupName,
              id: item.id
            }
          }) : []
        },
        purchaseDate: {
          value: null,
          type: "datepicker",
          title: "购买日期",
          keys: "purchaseDate",
          requires: false,
        },
        brand: {
          value: null,
          type: "input",
          title: "品牌",
          keys: "brand",
          requires: false,
        },
        parameters: {
          value: null,
          type: "input",
          title: "参数",
          keys: "parameters",
          requires: false,
        },
        equipmentWorth: {
          value: null,
          type: "inputnumber",
          title: "设备价值(万元)",
          keys: "equipmentWorth",
          requires: false,
        },
        energyConsumption: {
          value: null,
          type: "inputnumber",
          title: "设备能耗（kw/h）",
          keys: "energyConsumption",
          requires: false,
        },
        pictureUrl: {
          value: null,
          type: "upload",
          title: "设备图片",
          keys: "pictureUrl",
          uploadtype: "image",
          requires: false,
          col: { span: 24 }
        },
      },
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
            if (i == "pictureUrl") {
              let last = values.pictureUrl[values.pictureUrl.length - 1];
              if (last.response) {
                values.pictureUrl = last.response.data.dataList[0] ? last.response.data.dataList[0] : ""
              } else {
                values.pictureUrl = null
              }
            }
            if (i == "purchaseDate") {
              values[i] = moment(values[i]).format("YYYY-MM-DD")
            }
          }
        }
        if (this.state.iftype.val == 'add') {
          this.setNewState('devicesave', values, () => {
            this.setNewState('devicequeryList', this.state.postData, () => {
              message.success('新增成功');
              this.setNewState('devicequeryList', this.state.postData);
              this.handleCancel()
            });
          });
        } else {
          this.setNewState('devicesave', { ...values, id: this.state.curitemz.id }, () => {
            this.setNewState('devicequeryList', this.state.postData, () => {
              message.success('修改成功');
              this.setNewState('devicequeryList', this.state.postData);
              this.handleCancel()
            });
          });
        }
      }
    });
  }


  pageChange = page => {
    this.setState(
      {
        postData: { ...this.state.postData, pageIndex: page },
      },
      () => {
        this.setNewState('devicequeryList', this.state.postData);
      },
    );
  };


  getOption(key) {
    let allData = this.props.device.queryAnalysis;
    let xData = allData.map((item) => {
      return item.date
    });
    if (key == "worktime") {
      let workTime = allData.map((item) => {
        return item.workTime
      })
      return {
        title: {
          text: `${this.state.curitemz.equipmentName}工作时长`,
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
          data: ['工作时长'],
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
            name: '工作时长',
            axisLabel: {
              formatter: '{value} h'
            }
          }
        ],
        series: [
          {
            name: '工作时长',
            type: 'bar',
            data: workTime,
            label: {
              normal: {
                formatter: '{c}h',
                show: true
              },
            },
          },
          {
            name: '工作时长',
            type: 'line',
            data: workTime,
            label: {
              normal: {
                formatter: '{c}h',
                show: true
              },
            },
          }
        ]
      };
    } else if (key == "workenegry") {
      let rejectQuantity = allData.map((item) => {
        return item.rejectQuantity
      }), manufactureTotalQuantity = allData.map((item) => {
        return item.manufactureTotalQuantity
      })
      return {
        title: {
          text: `${this.state.curitemz.equipmentName}产能分析`,
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
          data: ['废品数量', '生产量'],
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
            name: '数量',
            axisLabel: {
              formatter: '{value} 个'
            }
          }
        ],
        series: [
          {
            name: '废品数量',
            type: 'line',
            data: rejectQuantity,
            label: {
              normal: {
                formatter: '{c} 个',
                show: true
              },
            },
          },
          {
            name: '生产量',
            type: 'bar',
            data: manufactureTotalQuantity,
            label: {
              normal: {
                formatter: '{c} 个',
                show: true
              },
            },
          }
        ]
      };
    } else {
      let electricityConsumption = allData.map((item) => {
        return item.electricityConsumption
      })
      return {
        title: {
          text: `${this.state.curitemz.equipmentName} 能耗`,
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
          data: ['能耗'],
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
            name: '能耗',
            axisLabel: {
              formatter: '{value} kw'
            }
          }
        ],
        series: [
          {
            name: '能耗',
            type: 'bar',
            data: electricityConsumption,
            label: {
              normal: {
                formatter: '{c} kw',
                show: true
              },
            },
          },
          {
            name: '能耗',
            type: 'line',
            data: electricityConsumption,
            label: {
              normal: {
                formatter: '{c} kw',
                show: true
              },
            },
          }
        ]
      };
    }
  }


  getOptions(key) {
    let res = {},
      allData = this.props.device.search.chart ? this.props.device.search.chart : undefined;
    let now = allData ? allData[key] : [];
    switch (key) {
      case "electricityChart":
        let xData = now.map((item) => {
          return item.name
        }), yData = now.map((item) => {
          return item.value
        })
        res = {
          title: {
            text: `设备能耗趋势`,
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
            data: ['能耗趋势'],
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
              name: '能耗(kw/h)',
              axisLabel: {
                formatter: '{value}'
              }
            }
          ],
          series: [
            {
              name: '能耗趋势',
              type: 'line',
              data: yData,
              label: {
                normal: {
                  formatter: '{c} kw/h',
                  show: true
                },
              },
            },
          ]
        };
        break;

      case "equipStatusChart":
        res = {
          title: {
            text: '设备状态分布',
            subtext: '',
            x: 0,
            textStyle: {
              fontSize: 16,
              fontWeight: "noraml",
              color: "#f50"
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c}个 ({d}%)"
          },
          series: [
            {
              name: '设备状态分布',
              type: 'pie',
              radius: '55%',
              center: ['50%', '50%'],
              radius: ['20%', '40%'],
              data: now,
              label: {
                normal: {
                  formatter: '{b}: {c}个 ({d}%) ',
                  show: true
                },
              },
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };
        break;
      case "faultCountChart":
        let xDatas = now.map((item) => {
          return item.name
        }), yDatas = now.map((item) => {
          return item.value
        })
        res = {
          title: {
            text: `设备故障总数`,
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
            data: ['设备故障总数'],
            left: "center",
          },
          xAxis: [
            {
              type: 'category',
              data: xDatas,
              axisPointer: {
                type: 'shadow'
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '能耗(台)',
              axisLabel: {
                formatter: '{value}'
              }
            }
          ],
          series: [
            {
              name: '设备故障总数',
              type: 'bar',
              data: yDatas,
              label: {
                normal: {
                  formatter: '{c} 台',
                  show: true
                },
              },
            },
          ]
        };
        break;
    }
    return res
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

  onRefQrCode = (ref) => {
    this.childs = ref;
  }
  
  render() {
    const { searchValue, curtitle, ifshow, curitem, curitemz,
      addstr, addkey, show, fv,
      iftype, postData, imageUrl, fields
    } = this.state, { deviceTypequeryTreeList, devicequeryList, search } = this.props.device;
    const { getFieldDecorator } = this.props.form;

    function disabledDate(current) {
      // Can not select days before today and today
      return current && current > moment().add("day", -1).endOf('day');
    }

    const menu = () => {
      let record = curitem;
      return record.id ? (
        <div style={{ display: 'flex', justifyContent: "flex-start", alignItems: "center" }}>
          <a style={{ marginRight: 12 }} onClick={() => {
            this.setState(
              {
                fields: {
                  equipmentNo: {
                    value: null,
                    type: "input",
                    title: "设备编号",
                    keys: "equipmentNo",
                    requires: true,
                  },
                  equipmentName: {
                    value: null,
                    type: "input",
                    title: "设备名称",
                    keys: "equipmentName",
                    requires: true,
                  },
                  positionNo: {
                    value: null,
                    type: "input",
                    title: "设备位置号",
                    keys: "positionNo",
                    requires: false,
                  },
                  equipmentModel: {
                    value: null,
                    type: "input",
                    title: "设备型号",
                    keys: "equipmentModel",
                    requires: true,
                  },
                  equipmentTypeId: {
                    value: null,
                    type: "select",
                    title: "设备类型",
                    keys: "equipmentTypeId",
                    requires: true,
                    option: this.props.device.search.equipmentTypeLeafList ? this.props.device.search.equipmentTypeLeafList.map(item => {
                      return {
                        name: item.equipmentTypeName,
                        id: item.id
                      }
                    }) : []
                  },
                  departmentId: {
                    value: null,
                    type: "treeselect",
                    title: "所在部门",
                    keys: "departmentId",
                    requires: true,
                    option: this.props.device.search.departmentDataList ? this.props.device.search.departmentDataList : []
                  },
                  shopId: {
                    value: null,
                    type: "select",
                    title: "所在车间",
                    keys: "shopId",
                    requires: true,
                    option: this.props.device.search.shopList ? this.props.device.search.shopList.map(item => {
                      return {
                        name: item.shopName,
                        id: item.id
                      }
                    }) : []
                  },
                  groupId: {
                    value: null,
                    type: "select",
                    title: "所在分组",
                    keys: "groupId",
                    requires: false,
                    option: this.props.device.queryByShopId ? this.props.device.queryByShopId.map(item => {
                      return {
                        name: item.groupName,
                        id: item.id
                      }
                    }) : []
                  },
                  purchaseDate: {
                    value: null,
                    type: "datepicker",
                    title: "购买日期",
                    keys: "purchaseDate",
                    requires: false,
                  },
                  brand: {
                    value: null,
                    type: "input",
                    title: "品牌",
                    keys: "brand",
                    requires: false,
                  },
                  parameters: {
                    value: null,
                    type: "input",
                    title: "参数",
                    keys: "parameters",
                    requires: false,
                  },
                  equipmentWorth: {
                    value: null,
                    type: "inputnumber",
                    title: "设备价值(万元)",
                    keys: "equipmentWorth",
                    requires: false,
                  },
                  energyConsumption: {
                    value: null,
                    type: "inputnumber",
                    title: "设备能耗（kw/h）",
                    keys: "energyConsumption",
                    requires: false,
                  },

                  pictureUrl: {
                    value: null,
                    type: "upload",
                    title: "设备图片",
                    keys: "pictureUrl",
                    uploadtype: "image",
                    requires: false,
                    col: { span: 24 }
                  },
                },
                iftype: {
                  ...iftype,
                  val: 'add',
                  name: '新增设备',
                },
                fv: true
              },
              () => {

              },
            );
          }}>
            <Icon type="plus-square" style={{ marginTop: 2, marginRight: 6 }} />
            新增
            </a>

          <a style={{ marginRight: 12 }}
            onClick={() => {
              let arrurl = record.pictureUrl ? record.pictureUrl.split(".") : ["demo", "png"];
              if (record.shopId) {
                this.setNewState("queryByShopId", { shopId: record.shopId }, () => {
                  let res = this.props.device.queryByShopId;
                  res = res.map((item) => {
                    return {
                      name: item.groupName,
                      id: item.id
                    }
                  })
                  this.setState(
                    {
                      curitemz: record,
                      fields: {
                        equipmentNo: {
                          ...fields.equipmentNo,
                          value: record.equipmentNo
                        },
                        equipmentName: {
                          ...fields.equipmentName,
                          value: record.equipmentName
                        },
                        positionNo: {
                          ...fields.positionNo,
                          value: record.positionNo
                        },
                        equipmentModel: {
                          ...fields.equipmentModel,
                          value: record.equipmentModel
                        },
                        equipmentTypeId: {
                          ...fields.equipmentTypeId,
                          value: record.equipmentTypeId
                        },
                        departmentId: {
                          ...fields.departmentId,
                          value: record.departmentId
                        },
                        shopId: {
                          ...fields.shopId,
                          value: record.shopId
                        },
                        groupId: {
                          ...fields.groupId,
                          value: record.groupId,
                          option: res
                        },
                        purchaseDate: {
                          ...fields.purchaseDate,
                          value: record.purchaseDate ? moment(record.purchaseDate) : undefined
                        },
                        brand: {
                          ...fields.brand,
                          value: record.brand
                        },
                        parameters: {
                          ...fields.parameters,
                          value: record.parameters
                        },

                        equipmentWorth: {
                          ...fields.equipmentWorth,
                          value: record.equipmentWorth
                        },
                        energyConsumption: {
                          ...fields.energyConsumption,
                          value: record.energyConsumption
                        },
                        pictureUrl: {
                          ...fields.pictureUrl,
                          defaultval: record.pictureUrl ? [{
                            url: record.pictureUrl,
                            name: record.equipmentName + "." + arrurl[arrurl.length - 1]
                          }] : "",
                          value: [{
                            "uid": "rc-upload-1564018868008-19",
                            "lastModified": 1560823806880,
                            "name": "demos.png",
                            "size": 2817,
                            "type": "image/png",
                            "percent": 100,
                            "originFileObj": {
                              "uid": "rc-upload-1564018868008-19"
                            },
                            "status": "done",
                            "response": {
                              "code": "0000",
                              "msg": "成功",
                              "data": {
                                "dataList": record.pictureUrl ? [record.pictureUrl] : ""
                              }
                            }
                          }]
                        },
                      },
                    },
                    () => {
                      this.setState({
                        fv: true,
                        iftype: {
                          name: <span>修改 {record.equipmentName} 的信息</span>,
                          val: 'edit',
                        },
                      })
                    },
                  );
                })
              } else {
                this.setState(
                  {
                    curitemz: record,
                    fields: {
                      equipmentNo: {
                        ...fields.equipmentNo,
                        value: record.equipmentNo
                      },
                      equipmentName: {
                        ...fields.equipmentName,
                        value: record.equipmentName
                      },
                      positionNo: {
                        ...fields.positionNo,
                        value: record.positionNo
                      },
                      equipmentModel: {
                        ...fields.equipmentModel,
                        value: record.equipmentModel
                      },
                      equipmentTypeId: {
                        ...fields.equipmentTypeId,
                        value: record.equipmentTypeId
                      },
                      departmentId: {
                        ...fields.departmentId,
                        value: record.departmentId
                      },
                      shopId: {
                        ...fields.shopId,
                        value: record.shopId
                      },
                      groupId: {
                        ...fields.groupId,
                        value: record.groupId,
                      },
                      purchaseDate: {
                        ...fields.purchaseDate,
                        value: record.purchaseDate ? moment(record.purchaseDate) : undefined
                      },
                      brand: {
                        ...fields.brand,
                        value: record.brand
                      },
                      parameters: {
                        ...fields.parameters,
                        value: record.parameters
                      },

                      equipmentWorth: {
                        ...fields.equipmentWorth,
                        value: record.equipmentWorth
                      },
                      energyConsumption: {
                        ...fields.energyConsumption,
                        value: record.energyConsumption
                      },
                      pictureUrl: {
                        ...fields.pictureUrl,
                        defaultval: record.pictureUrl ? [{
                          url: record.pictureUrl,
                          name: record.equipmentName + "." + arrurl[arrurl.length - 1]
                        }] : "",
                        value: [{
                          "uid": "rc-upload-1564018868008-19",
                          "lastModified": 1560823806880,
                          "name": "demos.png",
                          "size": 2817,
                          "type": "image/png",
                          "percent": 100,
                          "originFileObj": {
                            "uid": "rc-upload-1564018868008-19"
                          },
                          "status": "done",
                          "response": {
                            "code": "0000",
                            "msg": "成功",
                            "data": {
                              "dataList": record.pictureUrl ? [record.pictureUrl] : ""
                            }
                          }
                        }]
                      },
                    },
                  },
                  () => {
                    this.setState({
                      fv: true,
                      iftype: {
                        name: <span>修改 {record.equipmentName} 的信息</span>,
                        val: 'edit',
                      },
                    })
                  },
                );
              }




            }}
          >
            <Icon type="edit" style={{ marginTop: 2, marginRight: 6 }} />
            修改
            </a>
          <Popconfirm
            okText="确认"
            cancelText="取消"
            placement="bottomRight"
            title={'确认删除该设备？'}
            onConfirm={() => {
              this.setNewState('devicedeleteById', { id: record.id }, () => {
                let total = this.props.device.devicequeryList.pageSize,
                  page = this.props.device.devicequeryList.pageNum;
                if ((total - 1) % 9 == 0) {
                  page = page - 1;
                }
                this.setNewState(
                  'devicequeryList',
                  { ...this.state.postData, pageIndex: page },
                  () => {
                    message.success('删除成功！');
                  },
                );
              });
            }}
          >
            <a style={{ color: '#ff5000' }}><Icon type="delete" style={{ marginTop: 2, marginRight: 6 }} />删除</a>
          </Popconfirm>
        </div>
      ) : (
          <a onClick={() => {
            this.setState(
              {
                fields: {
                  equipmentNo: {
                    value: null,
                    type: "input",
                    title: "设备编号",
                    keys: "equipmentNo",
                    requires: true,
                  },
                  equipmentName: {
                    value: null,
                    type: "input",
                    title: "设备名称",
                    keys: "equipmentName",
                    requires: true,
                  },
                  positionNo: {
                    value: null,
                    type: "input",
                    title: "设备位置号",
                    keys: "positionNo",
                    requires: false,
                  },
                  equipmentModel: {
                    value: null,
                    type: "input",
                    title: "设备型号",
                    keys: "equipmentModel",
                    requires: true,
                  },
                  equipmentTypeId: {
                    value: null,
                    type: "select",
                    title: "设备类型",
                    keys: "equipmentTypeId",
                    requires: true,
                    option: this.props.device.search.equipmentTypeLeafList ? this.props.device.search.equipmentTypeLeafList.map(item => {
                      return {
                        name: item.equipmentTypeName,
                        id: item.id
                      }
                    }) : []
                  },
                  departmentId: {
                    value: null,
                    type: "treeselect",
                    title: "所在部门",
                    keys: "departmentId",
                    requires: true,
                    option: this.props.device.search.departmentDataList ? this.props.device.search.departmentDataList : []
                  },
                  shopId: {
                    value: null,
                    type: "select",
                    title: "所在车间",
                    keys: "shopId",
                    requires: true,
                    option: this.props.device.search.shopList ? this.props.device.search.shopList.map(item => {
                      return {
                        name: item.shopName,
                        id: item.id
                      }
                    }) : []
                  },
                  groupId: {
                    value: null,
                    type: "select",
                    title: "所在分组",
                    keys: "groupId",
                    requires: false,
                    option: this.props.device.queryByShopId ? this.props.device.queryByShopId.map(item => {
                      return {
                        name: item.groupName,
                        id: item.id
                      }
                    }) : []
                  },
                  purchaseDate: {
                    value: null,
                    type: "datepicker",
                    title: "购买日期",
                    keys: "purchaseDate",
                    requires: false,
                  },
                  brand: {
                    value: null,
                    type: "input",
                    title: "品牌",
                    keys: "brand",
                    requires: false,
                  },
                  parameters: {
                    value: null,
                    type: "input",
                    title: "参数",
                    keys: "parameters",
                    requires: false,
                  },
                  equipmentWorth: {
                    value: null,
                    type: "inputnumber",
                    title: "设备价值(万元)",
                    keys: "equipmentWorth",
                    requires: false,
                  },
                  energyConsumption: {
                    value: null,
                    type: "inputnumber",
                    title: "设备能耗（kw/h）",
                    keys: "energyConsumption",
                    requires: false,
                  },

                  pictureUrl: {
                    value: null,
                    type: "upload",
                    title: "设备图片",
                    keys: "pictureUrl",
                    uploadtype: "image",
                    requires: false,
                    col: { span: 24 }
                  },
                },
                iftype: {
                  ...iftype,
                  val: 'add',
                  name: '新增设备',
                },
                fv: true
              },
              () => {
              },
            );
          }}>
            <Icon type="plus-square" style={{ marginTop: 2, marginRight: 6 }} />
            新增
          </a>
        )
    }

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
        title: '编号',
        dataIndex: 'equipmentNo',
        key: 'equipmentNo',
        width: 120,
        ellipsis: true,
        ...getsearchbox('equipmentNo')
      },
      {
        title: '名称',
        dataIndex: 'equipmentName',
        key: 'equipmentName',
        ellipsis: true,
        ...getsearchbox('equipmentName')
      },
      {
        title: '位置号',
        dataIndex: 'positionNo',
        key: 'positionNo',
        width: 120,
        ellipsis: true,
        ...getsearchbox('positionNo')
      },
      {
        title: '类型',
        dataIndex: 'equipmentTypeName',
        key: 'equipmentTypeName',
        width: 100,
        ellipsis: true,
        ...gettreeselectbox('equipmentTypeId', search.equipmentTypeTreeList ? search.equipmentTypeTreeList : []),
      },
      {
        title: '状态',
        dataIndex: 'statusName',
        key: 'statusName',
        width: 100,
        ellipsis: true,
        ...getselectbox('status', search.equipmentStatusList),
        render: (text, record) => <a style={{
          color: record.status == 0 ? "green" :
            record.status == 1 ? "#0e6eb8" :
              record.status == 2 ? "#999" :
                record.status == 5 ? "#ff5000" :
                  "lightred"
        }}>{text}</a>
      },

      {
        title: '型号',
        dataIndex: 'equipmentModel',
        key: 'equipmentModel',
        width: 120,
        ellipsis: true,
        ...getsearchbox("equipmentModel")
      },
      {
        title: '所在部门',
        dataIndex: 'departmentName',
        key: 'departmentName',
        width: 120,
        ellipsis: true,
        ...gettreeselectbox('departmentId', search.departmentDataList ? search.departmentDataList : [])
      },
      {
        title: '所在车间',
        dataIndex: 'shopName',
        key: 'shopName',
        width: 120,
        ellipsis: true,
        ...getselectbox('shopId', search.shopList ? search.shopList.map(item => {
          return {
            dicName: item.shopName,
            dicKey: item.id
          }
        }) : [])
      },
      {
        title: '所在分组',
        dataIndex: 'groupName',
        key: 'groupName',
        width: 100,
        ellipsis: true,
      },
      {
        title: '能耗(kw/h)',
        dataIndex: 'energyConsumption',
        key: 'energyConsumption',
        width: 100,
        ellipsis: true,
      },
      {
        title: '价值(万元)',
        dataIndex: 'equipmentWorth',
        key: 'equipmentWorth',
        width: 100,
        ellipsis: true,
      },
      {
        title: '购买日期',
        dataIndex: 'purchaseDate',
        key: 'purchaseDate',
        width: 100,
        ellipsis: true,
      },
      {
        title: '品牌',
        dataIndex: 'brand',
        key: 'brand',
        width: 60,
        ellipsis: true,
      },
      {
        title: '参数',
        dataIndex: 'parameters',
        key: 'parameters',
        width: 60,
        ellipsis: true,
      },
      {
        title: '图片',
        dataIndex: 'pictureUrl',
        key: 'pictureUrl',
        width: 60,
        ellipsis: true,
        render: (text, record) => (text ? <img onClick={() => {
          Modal.info({
            maskClosable: true,
            title: `预览${record.equipmentName}的图片`,
            okText: "关闭",
            content: (
              <div style={{ width: "100%" }}>
                <img style={{ width: "100%", height: "auto", margin: "20px 0px" }} src={text} onError={(e) => { e.target.src = './images/default.png' }} />
              </div>
            ),
            onOk() { },
          });

        }} style={{ width: 30, height: 30, cursor: "pointer" }} src={text} onError={(e) => { e.target.src = './images/default.png' }} /> : "")
      },
      {
        title: <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: 80 }}>
          二维码
          <a style={{ color: "#f50" }} onClick={() => {
            this.setState({
              postData: {
                pageIndex: 1, //（int）页码
                pageSize: 9, //（int）条数
                equipmentNo: "",
                equipmentName: "",
                positionNo: "",
                equipmentTypeId: "",
                status: "",
                equipmentModel: "",
                departmentId: "",
                shopId: ""
              } //（int）部门id}
            }, () => {
              this.setNewState(this.state.postUrl, this.state.postData);
            })
          }}>
            <Tooltip title='重置'>
              <Icon type="reload" />
            </Tooltip>

          </a>
        </div>,
        dataIndex: 'qrCodeUrl',
        key: 'qrCodeUrl',
        width: 100,
        ellipsis: true,
        render: (text, record) => (text ? <img onClick={() => {
          Modal.info({
            maskClosable: true,
            title: `预览${record.equipmentName}的二维码`,
            okText: "关闭",
            content: (
              <div style={{ width: "100%" }}>
                <img style={{ width: "100%", height: "auto", margin: "20px 0px" }} src={text} onError={(e) => { e.target.src = './images/default.png' }} />
              </div>
            ),
            onOk() { },
          });
        }} style={{ width: 30, height: 30, cursor: "pointer" }} src={text} onError={(e) => { e.target.src = './images/default.png' }} /> : ""),
      }
    ];

    const titlerender = () => (
      <div className={styles.pubheader}>
        <div style={{ transition: 'all 0.4s', display: "flex", alignItems: "center" }}>
          <h3 style={{ fontSize: 16, margin: 0, padding: 0 }}>
            设备登记
          </h3>
        </div>
      </div>
    );

    const extrarender = width => (
      <div className={styles.pubextra} style={{ overflow: "hidden", display: 'flex', justifyContent: "flex-end", alignItems: "center" }}>
        {
          menu()
        }
        <Divider type="vertical"></Divider>
        <Abload reload={() => {
          this.setNewState('devicequeryList', this.state.postData);
        }} data={null} postName="uploadequipment" left={0} filePath="http://47.100.234.193:8888/download/ngequipmentModel.xlsx"></Abload>
        <Divider type="vertical"></Divider>
        <span style={{ marginLeft: 12, cursor: "pointer" }} onClick={() => {
          let postData = this.state.postData;
          delete postData.pageIndex;
          delete postData.pageSize;
          this.setNewState("queryQrCode", postData, () => {
            let data = this.props.device.queryQrCode;
            this.childs.setAllCanvas(data)
          })
        }}>导出二维码</span>
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
        <DrawImage name="设备二维码" onRef={this.onRefQrCode}></DrawImage>
        <SearchBox onRef={this.onRef} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
        <div className={styles.container}>
          <Row style={{ backgroundColor: '#ffffff' }}>
            <Col style={{ borderLeft: "#f0f0f0 solid 1px" }}>
              <div>
                <Card bordered={false} title={titlerender()} extra={extrarender()}>
                  <div
                    style={{
                      overflowX: 'hidden',
                      overflowY: 'auto',
                    }}
                  >
                    <Table
                      onRow={record => {
                        return {
                          onClick: event => {
                            this.setState({ curitem: record });
                          }, // 点击行
                        };
                      }}
                      rowClassName={(record, index) => rowClassNameFn(record, index)}
                      size="middle"
                      scroll={{x:1520}}
                      columns={columns}
                      loading={this.props.submitting}
                      rowKey="id"
                      dataSource={devicequeryList.list}
                      pagination={{
                        showTotal: total => `共${total}条`,
                        // 分页
                        size: 'small',
                        showQuickJumper: true,
                        pageSize: 9,
                        current: devicequeryList.pageNum ? devicequeryList.pageNum : 1,
                        total: devicequeryList.total ? parseInt(devicequeryList.total) : 1,
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
          style={{ maxWidth: "90%", top: 20 }}
          width={1200}
          visible={this.state.visible}
          title={iftype.name}
          onCancel={() => { this.setState({ visible: false }) }}
          footer={null}
        >
          <Row gutter={24}>
            <Col span={24} style={{ marginBottom: 24 }}>
              {
                this.state.visible && <DatePicker.RangePicker disabledDate={disabledDate} defaultValue={[moment().add("day", -8), moment().add("day", -1)]} style={{ width: "100%" }} onChange={(val) => {
                  this.setNewState("queryAnalysis", {
                    equipmentId: curitemz.id,
                    startTime: val[0] ? moment(val[0]).format("YYYY-MM-DD") : "",
                    endTime: val[1] ? moment(val[1]).format("YYYY-MM-DD") : "",
                  })
                }} />
              }
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} style={{ marginBottom: 24 }}>
              <ReactEcharts option={this.getOption("worktime")}></ReactEcharts>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} style={{ marginBottom: 24 }}>
              <ReactEcharts option={this.getOption("workenegry")}></ReactEcharts>
            </Col>
            <Col span={24}>
              <ReactEcharts option={this.getOption("enegrydown")}></ReactEcharts>
            </Col>
          </Row>
        </Modal>

        <Modal
          style={{ maxWidth: "90%", top: 20 }}
          width={1200}
          visible={this.state.visibles}
          title={iftype.name}
          onCancel={() => { this.setState({ visibles: false }) }}
          footer={null}
        >
          <Row gutter={24}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} style={{ marginBottom: 24 }}>
              <ReactEcharts option={this.getOptions("electricityChart")}></ReactEcharts>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12} style={{ marginBottom: 24 }}>
              <ReactEcharts option={this.getOptions("equipStatusChart")}></ReactEcharts>
            </Col>
            <Col span={24}>
              <ReactEcharts option={this.getOptions("faultCountChart")}></ReactEcharts>
            </Col>
          </Row>
        </Modal>

        <CreateForm
          width={1000}
          fields={fields}
          data={{}}
          iftype={iftype}
          onChange={this.handleFormChange}
          wrappedComponentRef={this.saveFormRef}
          visible={fv}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          col={{ xs: 24, sm: 24, md: 12, lg: 12, xl: 8, xxl: 8 }}

        />


      </div>
    );
  }
}

Tzlist = Form.create('yangzige')(Tzlist);

export default Tzlist;
