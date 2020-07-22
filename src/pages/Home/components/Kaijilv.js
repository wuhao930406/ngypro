/**
 * Created by 11485 on 2019/2/25.
 */
import React, { Component } from 'react';
import { Card, Skeleton } from 'antd';
import { connect } from 'dva';
import { ChartCard, WaterWave, Pie } from '@/components/Charts';
import styles from '../Homepage.less';


@connect(({ home, loading }) => ({
    home,
    submitting: loading.effects['home/queryHome'],
}))
class Kaijilv extends Component {
    constructor(props) {
        super(props)
        this.state = {
            c: 0
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





    render() {
        let { turnOnRate } = this.props;

        let renderText = (s, p, step, time) => {
            this.ts = setInterval(() => {
                if (this.state[s] < p) {
                    this.setState({
                        [s]: this.state[s] + step
                    })
                } else {
                    clearInterval(this.ts);
                }
            }, time)
            return this.state[s] < p ? this.state[s] : p
        }

        return (
            <Card title={"设备开机率"}>
                <div className={styles.center} style={{ minHeight: 136 }}>
                    <WaterWave style={{ borderRadius: "50%" }} height={134} title="设备开机率" percent={15} activepercent={
                        renderText("c", turnOnRate ? parseFloat(turnOnRate) : 0, 0.1, 10).toFixed(2)
                    } />

                </div>
            </Card>
        );
    }
}

export default Kaijilv;
