/**
 * Created by 11485 on 2019/2/25.
 */
import React, { Component } from 'react';
import styles from './Homepage.less';
import { Icon, Row, Col } from 'antd';
import { connect } from 'dva';
import Kaijilv from './components/Kaijilv';
import Zhixinglv from './components/Zhixinglv';
import Gongzuo from './components/Gongzuo';
import Shebei from './components/Shebei';
import Tubiao from './components/Tubiao';
import Zhishi from './components/Zhishi';
import Tongzhi from './components/Tongzhi';
import Luntan from './components/Luntan'

@connect(({ home, loading }) => ({
  home,
  submitting: loading.effects['home/queryHome'],
}))
class Homepage extends Component {
  constructor(props) {
    super(props)
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

  resetData() {
    this.setNewState("queryHome");
  }

  componentDidMount() {
    this.props.ensureDidMount && this.props.ensureDidMount()
    this.resetData()
  }


  render() {
    let col = { xs: 24, sm: 24, md: 24, lg: 12, xl: 6, xxl: 6 },
      colc = { xs: 24, sm: 24, md: 24, lg: 12, xl: 8, xxl: 8 },
      cols = { xs: 24, sm: 24, md: 24, lg: 24, xl: 12, xxl: 12 },
      { queryHome: { turnOnRate, taskCount, repairCount, maintainCount, pointChectCount, equipStatusChart, equipmentCount } } = this.props.home;

    return (
      <div className={styles.Homepage}>
        <Row gutter={12}>
          {/*开机率*/}
          <Col {...col} style={{ marginBottom: 12,height:221 }}>
            <Kaijilv turnOnRate={turnOnRate}></Kaijilv>
          </Col>

          {/*维修工单执行率*/}
          <Col {...col} style={{ marginBottom: 12,height:221 }}>
            <Zhixinglv turnOnRate={96}></Zhixinglv>
          </Col>

          {/*个人工作重心*/}
          <Col {...cols} style={{ marginBottom: 12,height:221 }}>
            <Gongzuo datalist={[
              {
                name: "工作任务",
                num: taskCount
              }, {
                name: "维修工单",
                num: repairCount
              }, {
                name: "保养工单",
                num: maintainCount
              }, {
                name: "点检异常",
                num: pointChectCount
              }
            ]}></Gongzuo>
          </Col>

          {/*设备信息*/}
          <Col {...cols} style={{ marginBottom: 12,height:410 }}>
            <Shebei
              total={equipmentCount && equipmentCount}
              piedata={equipStatusChart && equipStatusChart.map((item) => {
                return {
                  x: item.name,
                  y: item.value,
                  key: item.key
                }
              })}></Shebei>
          </Col>

          {/*图表*/}
          <Col {...cols} style={{ marginBottom: 12,height:410 }}>
            <Tubiao
              total={equipmentCount && equipmentCount}
              piedata={equipStatusChart && equipStatusChart.map((item) => {
                return {
                  x: item.name,
                  y: item.value
                }
              })}></Tubiao>

          </Col>

          {/*知识文件*/}
          <Col {...colc} style={{ marginBottom: 12 }}>
            <Zhishi></Zhishi>
          </Col>
          {/*设备论坛*/}
          <Col {...colc} style={{ marginBottom: 12 }}>
            <Luntan></Luntan>
          </Col>

          {/*通知公告*/}
          <Col {...colc} style={{ marginBottom: 12 }}>
            <Tongzhi></Tongzhi>
          </Col>
        </Row>


      </div >
    );
  }
}

export default Homepage;
