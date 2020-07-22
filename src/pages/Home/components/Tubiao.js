/**
 * Created by 11485 on 2019/2/25.
 */
import React, { Component } from 'react';
import { Card, Skeleton, Empty, Tabs } from 'antd';
import { connect } from 'dva';
import { ChartCard, WaterWave, Pie, yuan } from '@/components/Charts';
import styles from '../Homepage.less';
import ReactEcharts from "echarts-for-react";
const { TabPane } = Tabs;

@connect(({ home, loading }) => ({
    home,
    submitting: loading.effects['home/queryHome'],
}))
class Tubiao extends Component {
    constructor(props) {
        super(props)
        this.state = {
            vals: "",
            postData: {
                "departmentId": undefined,//部门id
                "shopId": undefined,//车间id
                "startTime": "",//开始时间
                "endTime": ""//结束时间
            }
        }
    }

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




    getOptions(allData, name, legend, danwei) {
        let res = {}
        let xData = allData.map((item, i) => {
            return item.date
        }), yData = allData.map((item, i) => {
            return item.value
        })
        res = {
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
                x: 60,
                y: 40,
                x2: 20,
                y2: 40,
                borderWidth: 1
            },
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
                    itemStyle: {
                        normal: {
                            color: "#1890ff"
                        }
                    },
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

    componentDidMount() {
        this.setNewState('queryJIA', this.state.postData);
        this.setNewState('queryOEE', this.state.postData);
        this.setNewState('queryMTBF', this.state.postData);
        this.setNewState('queryMTTR', this.state.postData);
    }

    render() {
        let { piedata, total } = this.props,
            { vals } = this.state;

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

        let callbacks = (val) => {
            this.setState({
                vals: val
            })
        }
        //1890ff
        return (
            <div style={{ border: "#e8e8e8 solid 1px", boxSizing: "content-box", backgroundColor: "#fff", padding: "5px 0px" }}>
                <Tabs
                    onChange={callbacks}
                    defaultActiveKey="1"
                >
                    <TabPane tab="OEE" key="1">
                        <div style={{ padding: 12 }}>
                            <ReactEcharts style={{ height: 313 }} option={this.getOptions(this.props.home.queryOEE, "OEE图表", "占比", "%")}>
                            </ReactEcharts>
                        </div>
                    </TabPane>
                    <TabPane tab="稼动率" key="2">
                        <div style={{ padding: 12 }}>
                            <ReactEcharts style={{ height: 313 }} option={this.getOptions(this.props.home.queryJIA, "稼动率", "占比", "%")}></ReactEcharts>
                        </div>
                    </TabPane>
                    <TabPane tab="MTBF" key="3">
                        <div style={{ padding: 12 }}>
                            <ReactEcharts style={{ height: 313 }} option={this.getOptions(this.props.home.queryMTBF, "MTBF图表", "时长", "分钟")}></ReactEcharts>
                        </div>
                    </TabPane>
                    <TabPane tab="MTTR" key="4">
                        <div style={{ padding: 12 }}>
                            <ReactEcharts style={{ height: 313 }} option={this.getOptions(this.props.home.queryMTTR, "MTTR图表", "时长", "分钟")}></ReactEcharts>
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

export default Tubiao;
