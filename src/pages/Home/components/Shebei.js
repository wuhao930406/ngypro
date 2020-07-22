/**
 * Created by 11485 on 2019/2/25.
 */
import React, { Component } from 'react';
import { Card, Skeleton } from 'antd';
import { connect } from 'dva';
import { ChartCard, WaterWave, Pie, yuan } from '@/components/Charts';
import styles from '../Homepage.less';
import router from 'umi/router';


@connect(({ home, loading }) => ({
    home,
    submitting: loading.effects['home/queryHome'],
}))
class Shebei extends Component {
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
        let { piedata, total } = this.props;

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

        return (
            <Card title={"设备状态分布"}>
                <div style={{ padding: "16px 0px 17px 0px" }}>
                    <Skeleton loading={!piedata}>
                        <Pie
                            hasLegend
                            title="设备总数"
                            subTitle="设备总数"
                            total={() => (
                                <span>{total}台</span>
                            )}
                            data={piedata}
                            valueFormat={val => <span dangerouslySetInnerHTML={{ __html: val+"台" }} />}
                            height={294}
                            clickFn={(val) => {
                                router.push({
                                    pathname:"/device/tzlist",
                                    query:{
                                        key:val.key
                                    }
                                })
                                //otherwise    
                            }}
                        />
                    </Skeleton>
                </div>
            </Card>
        );
    }
}

export default Shebei;
