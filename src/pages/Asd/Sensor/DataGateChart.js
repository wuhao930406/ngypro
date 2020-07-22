import {
  Table, Input, DatePicker, Popconfirm, Form, Divider, Modal,
  Tree, Button, Row, Col, Icon, Select, Alert, Tag, message, Card, Empty,
  Transfer, Spin
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';
import SearchBox from '@/components/SearchBox';
import TreeShown from '@/components/TreeShown'
import moment from 'moment';
import ReactEcharts from "echarts-for-react";
const { Option } = Select;

@connect(({ sensor, loading }) => ({
  sensor,
  submitting: loading.effects['sensor/findChartByParameterId'],
}))
class DataGateChart extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      curitem: {},
      poster: {},
      visible: false,
      name: props.match.params.name,
      postArr: [
        { postUrl: "findCharts", postData: { id: props.match.params.id } },
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
          { postUrl: "findCharts", postData: { id: nextProps.match.params.id } },
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
          subtext: curData.meaning,
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
    }),
      unit = curData.unit ? curData.unit : "",
      res = {
        title: {
          text: curData.name,
          subtext: curData.meaning,
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
        grid: {
          x: 40,
          y: 70,
          x2: 0,
          y2: 70,
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
    let { visible, poster, index } = this.state,
      { findLeftChart, findUnderChart, findTreeChart, findChartByParameterId, findLocation } = this.props.sensor;
    const cols = { xs: 24, sm: 24, md: 24, lg: 7, xl: 6, xxl: 5 },
      coles = { xs: 24, sm: 24, md: 24, lg: 17, xl: 18, xxl: 19 },
      colcs = { xs: 24, sm: 24, md: 24, lg: 12, xl: 8, xxl: 6 };


    let gData = findUnderChart;

    let n = 0;
    const loop = data =>
      data.map(item => {
        n++;
        let { name, type, value, valueName, connect, unit, valueList, earlyWarning } = item;
        let units = unit ? `(${unit})` : ``
        item.title = item.name + units;
        item.key = item.id + n;
        item.children = item.valueList;
        if (item.children) {
          return loop(item.children)
        }
      });
    loop(gData)


    return (
      <div>
        <Row gutter={12}>
          <Col {...cols}>
            <TreeShown gData={gData}></TreeShown>
          </Col>

          <Col {...coles}>
            <Card hoverable title={`设备:${this.state.name}的参数图表`}>
              {
                findTreeChart.map((item, i) => {
                  return <Col key={i} {...colcs} style={{ marginBottom: 12, backgroundColor: index && i.toString() == index.toString() ? "rgba(255,33,33,0.1)" : "transparent" }} onClick={() => {
                    this.setState({
                      curitem: item,
                      index: i + ""
                    })
                    this.setNewState("findChartByParameterId", {
                      "id": item.id,  //--------设备标号(必填)
                      "index": item.index,
                      "equipmentId": this.props.match.params.id,
                      "startTime": "",  // 开始时间
                      "endTime": ""   // 结束时间
                    }, () => {
                      this.setState({
                        visible: true,
                        poster: {
                          "id": item.id,  //--------设备标号(必填)
                          "index": item.index,
                          "equipmentId": this.props.match.params.id,
                          "startTime": "",  // 开始时间
                          "endTime": ""   // 结束时间
                        }
                      });
                    })
                  }}>
                    <ReactEcharts style={{ height: 320 }} option={this.renderChart(item)}></ReactEcharts>
                  </Col>
                })
              }
            </Card>
          </Col>
        </Row>

        <Modal
          width={"80%"}
          visible={visible}
          title={this.state.curitem.name ? this.state.curitem.name : "图表"}
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
              this.setNewState("findChartByParameterId", {
                ...poster,
                startTime,  // 开始时间
                endTime   // 结束时间
              })
            }}
          />
          {
            findChartByParameterId && <Spin spinning={this.props.submitting}><ReactEcharts option={this.renderChart(findChartByParameterId ? findChartByParameterId : { name: "", worthList: [] }, true)}></ReactEcharts></Spin>
          }
        </Modal>

      </div>
    )
  }


}

export default DataGateChart



