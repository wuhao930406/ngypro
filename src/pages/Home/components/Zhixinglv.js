/**
 * Created by 11485 on 2019/2/25.
 */
import React, { Component } from 'react';
import { Card, Radio,Tooltip } from 'antd';
import { connect } from 'dva';
import { ChartCard, MiniProgress } from '@/components/Charts';
import styles from '../Homepage.less';
import Link from 'umi/link';
import router from 'umi/router';
import moment from 'moment';


@connect(({ home, loading }) => ({
    home,
    submitting: loading.effects['home/queryExecuteRate'],
}))
class Zhixinglv extends Component {
    constructor(props) {
        super(props)
        this.state = {
            c: 0,
            unit: "周"
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

    resetdata() {
        let { unit } = this.state;
        this.setNewState("queryExecuteRate", { unit })
    }

    componentDidMount() {
        this.resetdata()
    }



    render() {
        let { home: { queryExecuteRate } } = this.props;

        let turnOnRate = queryExecuteRate.rate;

        let renderText = (s, p, step, time) => {
            this.tts = setInterval(() => {
                if (this.state[s] < p) {
                    this.setState({
                        [s]: this.state[s] + step
                    })
                } else {
                    clearInterval(this.tts);
                }
            }, time)
            return this.state[s] < p ? this.state[s] : p
        }

        return (
            <Card style={{ overflow: "hidden" }} title={"维修工单执行率"} extra={
                <Radio.Group value={this.state.unit} onChange={(e) => {
                    console.log(e.target.value)
                    this.setState({
                        unit: e.target.value
                    }, () => {
                        this.resetdata()
                    })
                }} defaultValue="周" buttonStyle="solid" size="small">
                    <Radio.Button value="周">
                        <Tooltip title="近一周">
                            周
                        </Tooltip>
                    </Radio.Button>
                    <Radio.Button value="月">
                        <Tooltip title="近一月">
                            月
                        </Tooltip>
                    </Radio.Button>
                </Radio.Group>
            }>
                <div className={styles.center} style={{ flexDirection: "column", alignItems: "flex-start", padding: "20px 0" }}>
                    <div className={styles.center} style={{ justifyContent: "space-between" }}>
                        <h2 style={{ fontSize: 24 }}>{renderText("c", turnOnRate ? parseFloat(turnOnRate) : 0, 0.1, 10).toFixed(2)}%</h2>
                        {/* <a onClick={() => {
                            router.push({
                                pathname: "/repair/repairlist",
                                query: {
                                    startTime: moment().add("day", this.state.unit == "周" ? -7 : -30).format("YYYY-MM-DD"),
                                    endTime: moment().add("day", -1).format("YYYY-MM-DD"),
                                }
                            })
                        }}>维修工单</a> */}
                    </div>

                    <div style={{ width: "100%", height: 8, backgroundColor: "#f0f0f0", overflow: "hidden", margin: "6px 0px" }}>
                        <div style={{ width: renderText("c", turnOnRate ? parseFloat(turnOnRate) : 0, 0.1, 10) + "%", height: 8, backgroundColor: "#1890ff", overflow: "hidden" }}>
                        </div>
                    </div>
                    <div className={styles.center} style={{ justifyContent: "flex-start", color: "#999999", marginTop: 10 }}>
                        <span>
                            总工单数:{queryExecuteRate.total}
                        </span>
                        <span style={{ paddingLeft: 12 }}>
                            已执行工单:{queryExecuteRate.done}
                        </span>
                    </div>

                </div>
            </Card>
        );
    }
}

export default Zhixinglv;
