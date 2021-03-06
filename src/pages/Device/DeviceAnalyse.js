import React, { Component } from 'react';
import moment from 'moment';
import {
  Icon, Tabs, Table, Divider, Card, Form, Button, Input, Row, Col, TreeSelect, Modal, Skeleton,
  message, Popconfirm, Tooltip, Select, DatePicker, InputNumber, Dropdown, Menu
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import white from '../../assets/white.jpg';
import Link from 'umi/link';
import ReactEcharts from "echarts-for-react";

const { TabPane } = Tabs;
const confirm = Modal.confirm;
const { TreeNode } = TreeSelect;
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

@connect(({ device, loading }) => ({
  device,
  submitting: loading.effects['device/getCapacityAnalysis'],
  submittings: loading.effects['device/deviceTypequeryTreeList'],
}))
class DeviceAnalyse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      postData: {
        "pageIndex": 1,                      //（int）页码
        "pageSize": 9,                      //（int）条数
        "departmentId": undefined,//部门id
        "equipmentTypeId": undefined,//设备类型id
        "startTime": "",//开始时间
        "endTime": ""//结束时间
      },
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
this.props.ensureDidMount&&this.props.ensureDidMount()
    this.setNewState('deviceTypequeryTreeList', null);
    this.setNewState('getCapacityAnalysis', this.state.postData, () => {
      this.setState({
        show: true
      })
    });
  }







  getOption(value) {
    let allData = this.props.device.getCapacityAnalysis.total;
    if (!allData) {
      return {
        title: {
          text: `暂无数据`,
          subtext: '',
          x: '0'
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
          data: [],
          left: "center",
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: "",
            axisLabel: {
              formatter: '{value} '
            }
          }
        ],
        series: [
          {
            name: "",
            type: 'bar',
            data: [],
            label: {
              normal: {
                formatter: '{c}',
                show: true
              },
            },
          }
        ]
      };
    } else {
      let xData = this.props.device.getCapacityAnalysis.total.map((item) => {
        return item.date
      });
      let name = value == "workTime" ? "总工作时长" :
        value == "manufactureTotalQuantity" ? "总生产量" :
          value == "rejectQuantity" ? "废品数量" :
            value == "electricityConsumption" ? "总用电量" :
              null;
      let danwei = value == "workTime" ? "h" :
        value == "manufactureTotalQuantity" ? "个" :
          value == "rejectQuantity" ? "个" :
            value == "electricityConsumption" ? "kw" :
              null;
      let color = value == "workTime" ? "#4ecb73" :
        value == "manufactureTotalQuantity" ? "#0e6eb8" :
          value == "rejectQuantity" ? "#f2637b" :
            value == "electricityConsumption" ? "kw" :
              null;

      let yData = allData.map((item) => {
        return item[value]
      })
      return {
        title: {
          text: `${name}`,
          subtext: '',
          x: '0'
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
          data: [name],
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
            name: name,
            axisLabel: {
              formatter: '{value} ' + danwei
            }
          }
        ],
        series: [
          {
            name: name,
            type: 'bar',
            data: yData,
            itemStyle: {
              normal: {
                  color:color
                }
            },
            label: {
              normal: {
                formatter: '{c}' + danwei,
                show: true
              },
            },
          }
        ]
      };
    }


  }


  getOptions(value) {
    let deatilData = this.props.device.getCapacityAnalysis.single;
    if (!deatilData) {
      return {
        title: {
          text: `暂无数据`,
          subtext: '',
          x: '0'
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
          data: [],
          left: "center",
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: "",
            axisLabel: {
              formatter: '{value} '
            }
          }
        ],
        series: [
          {
            name: "",
            type: 'bar',
            data: [],
            label: {
              normal: {
                formatter: '{c}',
                show: true
              },
            },
          }
        ]
      };
    }

    let xDatas = this.props.device.getCapacityAnalysis.single[0].single.map((item) => {
      return item.date
    })
    let name = value == "workTime" ? "设备工作时长" :
      value == "manufactureTotalQuantity" ? "设备生产量" :
        value == "rejectQuantity" ? "设备废品数量" :
          value == "electricityConsumption" ? "设备用电量" :
            null;
    let danwei = value == "workTime" ? "h" :
      value == "manufactureTotalQuantity" ? "个" :
        value == "rejectQuantity" ? "个" :
          value == "electricityConsumption" ? "kw" :
            null;

    let tips = deatilData.map((item) => {
      return item.equipmentNo
    })
    let yDatas = deatilData.map((item) => {
      return {
        name: item.equipmentNo,
        type: 'line',
        data: item.single.map((item) => {
          return item[value]
        }),
        label: {
          normal: {
            formatter: '{c}' + danwei,
            show: true
          },
        },
      }
    })



    return {
      title: {
        text: `${name}`,
        subtext: '',
        x: '0'
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
          name: name,
          axisLabel: {
            formatter: '{value}' + danwei
          }
        }
      ],
      series: yDatas
    };
  }


  render() {
    const { postData } = this.state,
      { companyDepartList,deviceTypequeryTreeList } = this.props.device;
    const { getFieldDecorator } = this.props.form;

    function disabledDate(current) {
      // Can not select days before today and today
      return current && current > moment().add("day", -1).endOf('day');
    }

    const titlerender = () => (
      <div className={styles.pubheader}>
        <div>
          <h3 style={{ fontSize: 16, margin: 0, padding: 0 }}>
            设备产能分析
          </h3>
        </div>
      </div>
    );

    const loop = data =>
      data.map(item => {
        const title = <span>{item.title}</span>;
        if (item.children) {
          return (
            <TreeNode value={item.key} key={item.key} title={title}>
              {loop(item.children)}
            </TreeNode>
          );
        } else {
          return <TreeNode value={item.key} key={item.key} title={title}/>;
        }
    });

    let cols = {
      xs: 24, sm: 24, md: 24, lg: 12, xl: 12, xxl: 12
    }

    return (
      <div>
        <div className={styles.container}>
          <Row style={{ backgroundColor: '#ffffff' }}>
            <Col
              span={24}
              style={{ borderLeft: "#ededed solid 1px" }}
            >
              <div>
                <Card bordered={false} title={titlerender()} >
                  <Row gutter={24} style={{marginBottom:0}}>
                    <Col xs={24} sm={24} md={7} lg={7} xl={7} xxl={7}  style={{marginBottom:12}}>
                    <TreeSelect placeholder="设备类型" allowClear style={{width:"100%"}} value={postData.equipmentTypeId} onChange={(value)=>{
                        this.setState({
                          postData: { ...this.state.postData, equipmentTypeId: value },
                        }, () => {
                          this.setNewState('getCapacityAnalysis', { ...this.state.postData, equipmentTypeId: value });
                        });
                    }}>
                      {loop(deviceTypequeryTreeList)}
                    </TreeSelect>
                    </Col>
                    <Col xs={24} sm={24} md={7} lg={7} xl={7} xxl={7}  style={{marginBottom:12}}>
                      <DatePicker.RangePicker style={{width:"100%"}} value={postData.startTime?[moment(postData.startTime),moment(postData.endTime)]:undefined}
                        onChange={val => {
                          this.setState(
                            {
                              postData: { ...postData, startTime:val[0]?moment(val[0]).format("YYYY-MM-DD"):null, endTime:val[1]?moment(val[1]).format("YYYY-MM-DD"):null,pageIndex: 1 },
                            },
                            () => {
                              this.setNewState('getCapacityAnalysis', this.state.postData);
                            },
                          );
                        }}/>
                    </Col>

                    <Col xs={24} sm={24} md={7} lg={7} xl={7} xxl={7}  style={{marginBottom:12}}>
                    <TreeSelect placeholder="所在部门" allowClear style={{width:"100%"}} value={postData.departmentId} onChange={(value)=>{
                          this.setState({
                            postData: { ...this.state.postData, departmentId: value },
                          }, () => {
                            this.setNewState('getCapacityAnalysis', { ...this.state.postData, departmentId: value });
                          });
                      }}>
                        {loop(companyDepartList)}
                      </TreeSelect>

                    </Col>
                    <Col xs={24} sm={24} md={3} lg={3} xl={3} xxl={3}  style={{marginBottom:12}}>
                      <Button style={{width:"100%"}} onClick={() => {
                        this.setState({
                          postData: {
                            "pageIndex": 1,                      //（int）页码
                            "pageSize": 9,                      //（int）条数
                            "departmentId": "",//部门id
                            "equipmentTypeId": "",//设备类型id
                            "startTime": "",//开始时间
                            "endTime": ""//结束时间
                          }
                        }, () => {
                          this.setNewState('getCapacityAnalysis', this.state.postData);
                        })
                      }}>
                        重置
                          </Button>
                    </Col>
                  </Row>
                  <Tabs defaultActiveKey="1">
                    <TabPane tab="总产能分析" key="1">
                      <Row gutter={24}>
                        <Col span={24} style={{ marginBottom: 18 }}>
                        <ReactEcharts option={this.getOption("workTime")}></ReactEcharts> 
                        </Col>
                        <Col {...cols} style={{ marginBottom: 18 }}>
                        <ReactEcharts option={this.getOption("manufactureTotalQuantity")}></ReactEcharts> 
                        </Col>
                        <Col {...cols} style={{ marginBottom: 18 }}>
                        <ReactEcharts option={this.getOption("rejectQuantity")}></ReactEcharts>
                        </Col>
                      </Row>

                    </TabPane>
                    <TabPane tab="设备产能分析" key="2">
                      <Row gutter={24}>
                        <Col span={24} style={{ marginBottom: 18 }}>
                          <ReactEcharts option={this.getOptions("workTime")}></ReactEcharts>
                        </Col>
                        <Col {...cols} style={{ marginBottom: 18 }}>
                          <ReactEcharts option={this.getOptions("manufactureTotalQuantity")}></ReactEcharts>
                        </Col>
                        <Col {...cols} style={{ marginBottom: 18 }}>
                          <ReactEcharts option={this.getOptions("rejectQuantity")}></ReactEcharts>
                        </Col>
                      </Row>

                    </TabPane>
                  </Tabs>

                </Card>

              </div>
            </Col>
          </Row>
        </div>

      </div>
    );
  }
}

DeviceAnalyse = Form.create('yangziges')(DeviceAnalyse);

export default DeviceAnalyse;
