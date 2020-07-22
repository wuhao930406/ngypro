import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const copyright = (
  <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center",position:"relative" }}>
    <div style={{ display: "block" }}>
      <span style={{ color: "rgba(0,0,0,0.6)" }}>Copyright
    <Icon type="copyright" /> 2017 江苏南高智能装备创新中心有限公司 版权所有</span><br />
      <span style={{ color: "rgba(0,0,0,0.6)" }}>备案序号 : 苏IPC备 18015471 号</span>
    </div>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",position:"absolute",right:12 }}>
      <img style={{ height: 60, borderRadius: 4 }} src="./images/tts.png" alt="" />
      <span style={{ color: "#666" }}>扫码分享</span>
    </div>
  </div>
);
const FooterView = () => (
  <Footer style={{ padding: 0, display: "flex", justifyContent: "center" }}>
    <GlobalFooter copyright={copyright} />
  </Footer>
);
export default FooterView;
