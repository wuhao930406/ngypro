/**
 * Created by 11485 on 2019/2/25.
 */
import React, { Component } from 'react';
import styles from './Homepage.less';
import { Icon, Row, Col, Card, Dropdown, Menu, Empty, message } from 'antd';
import { connect } from 'dva';
import Abload from '@/components/Abload';
import Link from 'umi/link';

@connect(({ home,global, loading }) => ({
    home,
    global,
    loading
}))
class Fastest extends Component {
    constructor(props) {
        super(props)
        this.t = null;
        this.state = {
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

    componentDidMount() {
        this.props.ensureDidMount&&this.props.ensureDidMount()
    }

    render() {
        let { queryHome } = this.props.home;
        let col = {
            xs: 24, sm: 24, md: 12, lg: 12, xl: 6, xxl: 6,
        }
        const menu = (
            <Menu>
                <Menu.Item>
                    <Link to='/devices/repairduty'>
                        维修负责人
                    </Link>
                </Menu.Item>
                <Menu.Item>
                    <Link to='/devices/repairsetting'>
                        验证负责人
                    </Link>
                </Menu.Item>
                <Menu.Item>
                    <Link to='/devices/checksettings'>
                        点检负责人
                    </Link>
                </Menu.Item>
                <Menu.Item>
                    <Link to='/devices/verbplanset'>
                        保养负责人
                    </Link>
                </Menu.Item>
            </Menu>
        );

        return (
            <div className={styles.Homepage}>
                <Card title="快捷设置">
                    <Row gutter={12}>
                        <Col {...col} style={{ marginBottom: 12 }}>
                            <Card hoverable>
                                <p style={{ borderBottom: "1px dashed #f0f0f0", paddingBottom: 12 }}><span>人员导入</span> </p>
                                <Abload postName="uploadsysUser" left={0} filePath="http://47.100.234.193:8888/download/nguserModel.xlsx"></Abload>
                                <Link to='/system/staff' style={{ paddingTop: 12, display: "block", color: "#f50" }}>查看列表</Link>
                            </Card>
                        </Col>
                        <Col {...col} style={{ marginBottom: 12 }}>
                            <Card hoverable>
                                <p style={{ borderBottom: "1px dashed #f0f0f0", paddingBottom: 12 }}>设备导入</p>
                                <Abload postName="uploadequipment" left={0} filePath="http://47.100.234.193:8888/download/ngequipmentModel.xlsx"></Abload>
                                <Link to='/device/devicetzlist' style={{ paddingTop: 12, display: "block", color: "#f50" }}>查看列表</Link>
                            </Card>
                        </Col>
                        <Col {...col} style={{ marginBottom: 12 }}>
                            <Card hoverable>
                                <p style={{ borderBottom: "1px dashed #f0f0f0", paddingBottom: 12 }}>负责人导入</p>
                                <Abload postName="uploaduserEquipment" left={0} filePath="http://47.100.234.193:8888/download/nguserequipment.xlsx"></Abload>
                                <Dropdown overlay={menu}>
                                    <a style={{ paddingTop: 12, display: "block", color: "#f50" }}>查看列表</a>
                                </Dropdown>
                            </Card>
                        </Col>

                        {
                            this.props.global.showModule.spare && <Col {...col} style={{ marginBottom: 12 }}>
                                <Card hoverable>
                                    <p style={{ borderBottom: "1px dashed #f0f0f0", paddingBottom: 12 }}>备件导入</p>
                                    <Abload postName="uploadspareParts" left={0} filePath="http://47.100.234.193:8888/download/ngspareModel.xlsx"></Abload>
                                    <Link to='/spare/sparelist' style={{ paddingTop: 12, display: "block", color: "#f50" }}>查看列表</Link>

                                </Card>
                            </Col>
                        }




                    </Row>
                </Card>

            </div>
        );
    }
}

export default Fastest;
