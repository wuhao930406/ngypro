/**
 * Created by 11485 on 2019/2/25.
 */
import React, { Component } from 'react';
import { Card, Radio, Icon, Tabs, Input, Empty, Pagination, Row, Col, Divider, Tooltip, Menu, Dropdown, Drawer, PageHeader, Button, Select, DatePicker, message, Popconfirm, Table, Avatar, Upload } from 'antd';
import { connect } from 'dva';
import { ChartCard, MiniProgress } from '@/components/Charts';
import styles from '../Homepage.less';
import Link from 'umi/link';
import moment from 'moment';
import UserCheck from '../UserCheck';
import AbReply from '@/components/AbReply';

const { TabPane } = Tabs;
let Search = Input.Search
const { Option } = Select;

@connect(({ home, loading }) => ({
    home,
    submitting: loading.effects['home/queryRepair'],
}))
class Luntan extends Component {
    constructor(props) {
        super(props)
        this.state = {
            active: 0,
            settitle: "",
            iftype: "mine",
            person: {
                cj: [],
                cs: [],
                css: [],
            },
            postData: {
                pageSize: 9,
                pageIndex: 1,
                search: ""
            },
            postUrl: "queryRepair",
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


    //1格的查询列表
    resetData() {
        this.setNewState(this.state.postUrl, this.state.postData, () => {
        })
    }

    componentDidMount() {
        this.resetData();
    }

    onClose = () => {
        let _it = this;
        _it.setState({
            visible: false,
        }, () => {
        });
    };



    searchVal(value, url, post, key) {
        this.setState({
            [post]: {
                ...this.state[post],
                [key]: value
            }
        }, () => {
            this.setNewState(url, this.state[post])
        })
    }

    renderRowClick(item, key) {
        this.setState({
            curitem: item,
            name: "留言板",
            can: key,
        }, () => {
            this.setState({
                fv: true
            })
        })
    }



    render() {
        let { datalist, home: { noticequeryList, fqueryDetaila, queryRepair } } = this.props,
            { postUrl, postData, iftype, settitle, ifs, auditStatus, key, sendMission, person, curitem } = this.state;


        //搜索框封装
        let searchBox = (url, post, key) => {
            return <Search style={{ maxWidth: 200 }} key={url} placeholder="搜索标题/内容" allowClear onSearch={(value) => this.searchVal(value, url, post, key)}></Search>
        }

        //时间格式化
        let getTime = (time) => {
            let a = moment(), b = moment(time), c = a.diff(b); // 86400000
            return c > 60 * 60 * 1000 ? time : moment(time).fromNow();
        }, getIfs = (time) => {
            let a = moment(), b = moment(time), c = a.diff(b); // 86400000
            return c > 60 * 60 * 1000
        }, columnes = [
            {
                title: '设备类型',
                dataIndex: 'equipmentTypeName',
                key: 'equipmentTypeName',
                width: 110,
                ellipsis: true,
            },
            {
                title: '文件编号',
                dataIndex: 'documentNo',
                key: 'documentNo',
                width: 160,
                ellipsis: true,
            },
            {
                title: '文件名',
                dataIndex: 'knowledgeBaseName',
                key: 'knowledgeBaseName',
                render: (text, record) => {
                    return (record.knowledgeBaseUrl ? <a href={record.knowledgeBaseUrl} target="_blank">{text}</a> : { text })
                },
                width: 200,
                ellipsis: true,
            },
            {
                title: '用途',
                dataIndex: 'purposeTypeName',
                key: 'purposeTypeName',
                width: 80,
                ellipsis: true,
            },
            {
                title: '描述',
                dataIndex: 'knowledgeBaseDescribe',
                key: 'knowledgeBaseDescribe',
                ellipsis: true,
            },
            {
                title: '创建日期',
                dataIndex: 'createTime',
                key: 'createTime',
                width: 160,
                ellipsis: true,
            },
            {
                title: '版本',
                dataIndex: 'knowledgeBaseVersion',
                key: 'knowledgeBaseVersion',
                width: 90,
                ellipsis: true,
            },
            {
                title: '上传者',
                dataIndex: 'updateUserName',
                key: 'updateUserName',
                width: 100,
                ellipsis: true,
            }
        ]

        //设备论坛
        let renderKnowledge = (item, i) => {
            return (<div key={i}>
                <Row key={i} onClick={() => {
                    this.renderRowClick(item, "1")
                }} className={getIfs(item.createTime) ? styles.rows : styles.redrows} style={{ padding: "8px 4px 8px 4px", marginTop: -1 }}>
                    <Col style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 15 }} className={styles.oneline}>{item.title}</span>
                        <span>{item.uploadUserName}</span>
                    </Col>
                    <Col style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span className={styles.oneline} style={{ color: "#999" }} title={item.comment}>
                            {item.comment ? item.comment : "暂无内容"}
                        </span>
                        <span title={item.createTime} style={{ color: "#999", display: "inline-block", width: 130, textAlign: "right" }}>{getTime(item.createTime)}</span>
                    </Col>
                </Row>
                <Divider dashed style={{ margin: 0 }}></Divider>
            </div>)
        }


        let pageconfig = (url, post, mainurl) => {
            return {
                showTotal: total => `共${total}条`, // 分页
                size: "small",
                pageSize: this.state[post] && this.state[post].pageSize,
                showQuickJumper: true,
                current: this.props.home[url].pageNum ? this.props.home[url].pageNum : 1,
                total: this.props.home[url].total ? parseInt(this.props.home[url].total) : 0,
                onChange: (page) => pageChange(page, mainurl ? mainurl : url, post),
            }
        }

        let pageChange = (page, url, post) => {
            console.log(post)
            this.setState({
                [post]: { ...this.state[post], pageIndex: page }
            }, () => {
                this.setNewState(url, this.state[post]);
            })
        }


        let renderItems = (key) => {
            return <div style={{ position: "relative",minHeight:570 }}>
                {
                    queryRepair.list && queryRepair.list.length != 0 ?
                        queryRepair.list.map((item, i) => {
                            return renderKnowledge(item, i)
                        }) : <Empty style={{ paddingTop: 32 }}></Empty>
                }
                <div style={{ height: 36, width: "100%" }}></div>
                <div style={{ display: "flex", justifyContent: "flex-end", position: "absolute", bottom: 0, right: 0 }}>
                    <Pagination {...pageconfig("queryRepair", "postData")} />
                </div>
            </div>
        }



        let callback = (key) => {
            this.setState({ key })
        }



        return (
            <div style={{ position: "relative" }}>
                <Card
                    title={<Link to='/alldeviceknowledge/charts' style={{ padding: "4px 0px", display: "block" }}>设备论坛</Link>}
                    extra={searchBox("queryRepair", "postData", "search")}>
                    {
                        renderItems()
                    }
                </Card>

                <AbReply
                    visible={this.state.fv}
                    title={this.state.name ? this.state.name : ""}
                    placement="right"
                    width={"96%"}
                    onClose={() => {
                        this.setState({
                            fv: false
                        })
                    }}
                    curitem={this.state.curitem ? this.state.curitem : {}}
                    destroyOnClose={true}
                >
                </AbReply>


            </div>
        );
    }
}

export default Luntan;
