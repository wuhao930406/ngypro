import {
  Table, Input, DatePicker, Popconfirm, Form, Divider, Modal,
  Tree, Button, Row, Col, Icon, Select, Alert, Tag, message, Card, Empty,
  Transfer, Spin
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import SearchBox from '@/components/SearchBox'
import moment from 'moment';
import ReactEcharts from "echarts-for-react";
const { Option } = Select;

@connect(({ sensor, loading }) => ({
  sensor,
  submitting: loading.effects['sensor/findSpecific'],
}))
class SensorChart extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      curitem: {},
      poster: {},
      visible: false,
      name: props.match.params.name,
      postArr: [
        { postUrl: "findChart", postData: { id: props.match.params.id } },
      ],

    }
  }

  //设置新状态
  setNewState(type, values, fn) {
    const { dispatch } = this.props;
    dispatch({
      type: 'sensor/' + type,
      payload: values
    }).then((res) => {
      if (res) {
        fn ? fn() : null;
      }
    });
  }



  resetData() {
    let { postArr } = this.state;
    postArr.map((item) => {
      let { postUrl, postData } = item;
      this.setNewState(postUrl, postData)
    })
  }

  componentDidMount() {
this.props.ensureDidMount&&this.props.ensureDidMount()
    this.resetData();
    this.t = setInterval(() => { this.resetData() }, 10000)
  }

  componentWillUnmount() {
    clearInterval(this.t);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id != nextProps.match.params.id) {
      this.setState({
        name: nextProps.match.params.name,
        postArr: [
          { postUrl: "findChart", postData: { id: nextProps.match.params.id } },
        ],
      }, () => {
        this.resetData()
      })
    }
  }


  renderChart(curData, ifs) {
    if (!curData.worthList) {
      return res = {
        title: {
          text: curData.name,
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
          show: false,
        },
        legend: {
          data: ["数值"],
          left: "right",
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
            name: "单位",
            axisLabel: {
              formatter: (value) => {
                if (value >= 10000) {
                  value = (value / 10000) + 'W';
                }
                if (value >= 1000) {
                  value = (value / 1000) + 'K';
                }
                return value;
              }
            }
          }
        ],
        series: [
          {
            name: "数值",
            type: 'line',
            data: [],
            lineStyle: {
              normal: {
                color: "#0e6eb8"
              }
            },
            label: {
              normal: {
                formatter: '{c} ',
                show: true
              },
            },
          }
        ]
      }
    }
    let xData = curData.worthList.map((item, i) => {
      return moment(parseInt(item.time)).format(ifs ? "YYYY-MM-DD HH:mm:ss" : "HH:mm:ss")
    }), yData = curData.worthList.map((item, i) => {
      return item.value
    }), unit = curData.unit,
      res = {
        title: {
          text: curData.name,
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
          show: false,
        },
        legend: {
          data: ["数值"],
          left: "right",
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
            name: "  " + unit,
            axisLabel: {
              formatter: (value) => {
                if (value >= 10000) {
                  value = (value / 10000) + 'w';
                }
                if (value >= 1000) {
                  value = (value / 1000) + 'k';
                }
                return value;
              }
            }
          }
        ],
        series: [
          {
            name: "数值",
            type: 'line',
            data: yData,
            lineStyle: {
              normal: {
                color: "#0e6eb8"
              }
            },
            label: {
              normal: {
                formatter: '{c} ',
                show: true
              },
            },
          }
        ]
      }
    return res;
  }


  render() {
    let { visible, poster } = this.state,
      { findLeftChart, findUnderChart, findTreeChart, findSpecific, findLocation } = this.props.sensor;
    const cols = { xs: 24, sm: 24, md: 24, lg: 7, xl: 6, xxl: 5 },
      coles = { xs: 24, sm: 24, md: 24, lg: 17, xl: 18, xxl: 19 },
      colcs = { xs: 24, sm: 24, md: 24, lg: 12, xl: 8, xxl: 6 },
      columns = [
        {
          title: '传感器名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '数值',
          dataIndex: 'value',
          key: 'value',
        },
        {
          title: '单位',
          dataIndex: 'unit',
          key: 'unit',
          width: 74,
        }, {
          title: '状态',
          dataIndex: 'connect',
          key: 'connect',
          width: 88,
          render: (text) => <div style={{ display: "flex", alignItems: "center", paddingLeft: 8 }}>
            <img style={{ width: 12 }} src={text !== 0 ? "./images/green.png" : "./images/red.png"} alt="" />
            <span style={{
              color: text !== 0 ?
                "green" : "red", paddingLeft: 4
            }}>
              {
                text !== 0 ?
                  "正常" : "异常"
              }
            </span>
          </div>
        }
      ]
    const rowClassNameFn = (record, index) => {
      const { curitem } = this.state;
      if (curitem && curitem.name === record.name) {
        return "selectedRow";
      }
      return null;
    };


    return (
      <div>
        <Row gutter={12}>
          <Col {...cols}>
            <Card hoverable title={`设备:${this.state.name}的传感器列表`}>
              <Table
                onRow={record => {
                  return {
                    onClick: event => {
                      // this.setState({ curitem: record });
                      // this.setNewState("findLocation", {
                      //   "id": record.id
                      // }, () => {
                      //   Modal.info({
                      //     width: 600,
                      //     maskClosable: true,
                      //     title: `预览${record.name}的位置图片`,
                      //     okText: "关闭",
                      //     content: (
                      //       <div style={{ width: "100%" }}>
                      //         <img style={{ width: "100%", height: "auto", margin: "20px 0px" }} src={this.props.sensor.findLocation.pictureUrl} onError={(e) => { e.target.src = './images/default.png' }} />
                      //       </div>
                      //     ),
                      //     onOk() { },
                      //   });
                      // })



                    }, // 点击行
                  };
                }}
                rowClassName={(record, index) => rowClassNameFn(record, index)}

                rowKey="id"
                columns={columns}
                pagination={false}
                dataSource={findLeftChart ? findLeftChart : []}>
              </Table>
            </Card>

          </Col>
          <Col {...coles}>
            <Card hoverable title={`设备:${this.state.name}的传感器图表`}>
              {
                findTreeChart.map((item, i) => {
                  return <Col key={i} {...colcs} style={{ marginBottom: 12, backgroundColor: this.state.curitem.name == item.name ? "rgba(255,33,33,0.1)" : "transparent" }} onClick={() => {
                    this.setState({
                      curitem: item
                    })
                    this.setNewState("findSpecific", {
                      "id": this.props.match.params.id,  //--------设备标号(必填)
                      "sensorNo": item.sensorNo,  //------传感器编号(必填)
                      "startTime": "",  // 开始时间
                      "endTime": ""   // 结束时间
                    }, () => {
                      this.setState({
                        visible: true, poster: {
                          "id": this.props.match.params.id,  //--------设备标号(必填)
                          "sensorNo": item.sensorNo,  //------传感器编号(必填)
                          "startTime": "",  // 开始时间
                          "endTime": ""   // 结束时间
                        }
                      });
                    })
                  }}>
                    <ReactEcharts option={this.renderChart(item)}></ReactEcharts>
                  </Col>
                })
              }
            </Card>
          </Col>
        </Row>

        <Modal
          width={"80%"}
          visible={visible}
          title={this.state.curitem.name}
          onCancel={() => {
            this.setState({
              visible: false
            })
          }}
          footer={null}
        >
          <DatePicker.RangePicker
            style={{ width: "100%", marginBottom: 18 }}
            showTime={{
              hideDisabledOptions: true,
              defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
            }}
            defaultValue={[undefined, undefined]}
            format="YYYY-MM-DD HH:mm:ss"
            onChange={(val) => {
              let startTime = val[0] ? moment(val[0]).format("YYYY-MM-DD HH:mm:ss") : undefined,
                endTime = val[1] ? moment(val[1]).format("YYYY-MM-DD HH:mm:ss") : undefined
              this.setNewState("findSpecific", {
                ...poster,
                startTime,  // 开始时间
                endTime   // 结束时间
              })
            }}
          />
          {
            findSpecific && <Spin spinning={this.props.submitting}><ReactEcharts option={this.renderChart(findSpecific ? findSpecific : { name: "", worthList: [] }, true)}></ReactEcharts></Spin>
          }
        </Modal>

      </div>
    )
  }


}

export default SensorChart



