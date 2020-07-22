/**
 * Created by 11485 on 2019/2/25.
 */
import React, { Component } from 'react';
import slider from '../../assets/img/slider.png';
import bac from '../../assets/img/bac.jpg';
import styles from './Homepage.less';
import { Icon,Row, Col } from 'antd';

class Homepage extends Component {
  render() {
    return (
      <div className={styles.Homepage}>
        <img src={slider} alt="logo" />
        <Row gutter={24} style={{margin:"24px 0px",padding:0}}>
          <Col xl={8} lg={8} md={8} sm={24} xs={24} className={styles.rowz}>
            <div>
              <Icon style={{fontSize:18}} type="phone" theme="outlined" rotate={90}/>
            </div>
            <span style={{fontSize:16,marginLeft:10}}>服务咨询025-86111901</span>
          </Col>
          <Col xl={8} lg={8} md={8} sm={24} xs={24} className={styles.rowz}>
            <div>
              <Icon style={{fontSize:18}} type="team" theme="outlined" />
            </div>
            <span style={{fontSize:16,marginLeft:10}}>一对一贵宾级服务</span>
          </Col>
          <Col xl={8} lg={8} md={8} sm={24} xs={24} className={styles.rowz}>
            <div>
              <Icon style={{fontSize:18}} type="undo" theme="outlined" />
            </div>
            <span style={{fontSize:16,marginLeft:10}}>7*24小时技术保障</span>
          </Col>
        </Row>


        <Row gutter={24} style={{padding:"0px 12px",margin:0}}>
          <Col xl={12} lg={24} md={24} sm={24} xs={24} className={styles.textarea} style={{backgroundImage:`url(${bac})`}}>
            <h2>
              为什么选择我们
            </h2>
            <p>
              南高智能工业云平台主要为工业设备和生产制造企业，提供智能制造技术服务。平台包括设备管理、设备维修、故障统计、故障诊断与预测、设备远程监控等模块，主要提供下列服务：<br/>
              1.云安灯系统：采集设备报警和生产信息，提供设备维修与管理服务。通过云安端、车间平台显示和相关人员通知体系，实现设备透明化管理，缩短报修时间；通过云平台的故障统计分析、设备使用效率分析，，降低故障修复时间，提高设备使用效率。<br/>
              2.设备健康管理：采集设备运行和传感器数据，通过应用大数据和人工智能技术对设备实时信息进行分析处理，实现设备故障预警与诊断，进行故障识别诊断、故障预测管理，对签约设备进行设备远程监控。<br/>
              南高智能工业云平台由江苏省高档数控机床及成套装备制造业创新中心开发与管理。创新中心由东南大学牵头，联合省内高档数控机床及成套装备行业的数家龙头企业和南京开发区共同创立，是江苏省制造业创新中心试点单位。创新中心着力于建设高档数控机床与智能装备共性技术的研发平台、智能装备技术服务平台、智能装备技术孵化平台与行业高端人才培养平台。力争在高档数控机床及智能装备共性技术上取得创新突破，建成集研究开发、测试服务、产业孵化于一体，国内领先、国际一流，具有引领国内产业发展能力的制造业创新中心，推动江苏2025智能制造战略的实施。
            </p>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24} style={{padding:0}}>
            <div className={styles.rows} style={{padding:"0px 24px",marginBottom:24}}>
              <dl>
                <dt><h2>公司</h2></dt>
                <dd>关于我们</dd>
                <dd>合作伙伴</dd>
                <dd>联系我们</dd>
                <dd>加入我们</dd>
              </dl>
              <div className={styles.lines}></div>
              <dl>
                <dt><h2>产品</h2></dt>
                <dd>设备管理</dd>
                <dd>设备维修</dd>
                <dd>员工管理</dd>
                <dd>供应管理</dd>
              </dl>
              <div className={styles.lines}></div>
              <dl>
                <dt><h2>问题</h2></dt>
                <dd>用户注册</dd>
                <dd>充值支付</dd>
                <dd>服务购买</dd>
                <dd>订单账单</dd>
              </dl>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Homepage;
