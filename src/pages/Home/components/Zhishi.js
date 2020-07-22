/**
 * Created by 11485 on 2019/2/25.
 */
import React, { Component } from 'react';
import { Card, Radio, Icon, Tabs, Input, Empty, Pagination, Row, Col, Divider, Tooltip, Menu, Dropdown, Drawer, PageHeader, Button, Select, DatePicker, message, Popconfirm, Table } from 'antd';
import { connect } from 'dva';
import { ChartCard, MiniProgress } from '@/components/Charts';
import styles from '../Homepage.less';
import Link from 'umi/link';
import moment from 'moment';
import UserCheck from '../UserCheck';

const { TabPane } = Tabs;
let Search = Input.Search
const { Option } = Select;

@connect(({ home, loading }) => ({
    home,
    submitting: loading.effects['home/queryHome'],
}))
class Zhishi extends Component {
    constructor(props) {
        super(props)
        this.columns = [
            {
                title: '任务执行状态',
                dataIndex: 'statusName',
                key: 'statusName',
            },
            {
                title: '执行人',
                dataIndex: 'executeUserName',
                key: 'executeUserName',
            },
            {
                title: '执行人公司',
                dataIndex: 'companyName',
                key: 'companyName',
            },
            {
                title: '执行人部门',
                dataIndex: 'departmentName',
                key: 'departmentName',
            },
            {
                title: "验收人名",
                dataIndex: 'auditUserName',
                key: 'auditUserName',
            },
            {
                title: "验收时间",
                dataIndex: 'auditTime',
                key: 'auditTime',
            },
            {
                title: "验收结果",
                dataIndex: 'auditStatusName',
                key: 'auditStatusName',
            },
        ]
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
                "pageIndex": 1,
                "pageSize": 9,
                "equipmentId": "",             //（int）设备id
                "equipmentTypeName": "",                  //（String）设备编号
                "knowledgeBaseDescribe": "",     //（String）描述
                "knowledgeBaseName": "",       //（String）文件名称
                "purposeType": "",                   //（String）用途key
                "search": ""
            },
            postPubData: {
                equipmentKnowledgeBaseId: "",
                pageIndex: 1,
                pageSize: 9,
                equipmentId: ""
            },
            postUrl: "deviceknqueryList",
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
    getFirstData() {
        this.setNewState(this.state.postUrl, this.state.postData)
    }

    componentDidMount() {
        this.getFirstData();
    }

    onClose = () => {
        let _it = this;
        _it.setState({
            visible: false,
        }, () => {
        });
    };

    onRefer = (ref) => {
        this.edtorchild = ref;
    }
    onRef = (ref) => {
        this.child = ref;
    }
    onRefs = (ref) => {
        this.childs = ref;
    }
    onRefc = (ref) => {
        this.childc = ref;
    }

    setNewValue = (val) => {
        if (this.state.key == "1") {
            this.setState({
                person: {
                    ...this.state.person,
                    cj: val
                },
            }, () => { console.log(this.state.person) })
        } else if (this.state.key == "2") {
            this.setState({
                person: {
                    ...this.state.person,
                    cs: val
                },
            }, () => { console.log(this.state.person) })
        } else {
            this.setState({
                person: {
                    ...this.state.person,
                    css: val
                },
            }, () => { console.log(this.state.person) })
        }
    }

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


    //知识库点击事件
    renderRowClick(item, key) {
        if (key) {
            this.setState({
                curitem: item,
                name: "留言板",
                can: key,
            }, () => {
                this.setState({
                    fv: true
                })
            })
        } else {
            this.setState({
                settitle: item.knowledgeBaseName,
                curitem: item,
                postPubData: {
                    ...this.state.postPubData,
                    equipmentKnowledgeBaseId: item.id,
                    equipmentId: item.equipmentId
                },
            }, () => {
                this.setNewState("deviceknchildqueryList", this.state.postPubData, () => {
                    this.setState({
                        visible: true,
                        ifs: "45",
                    })
                })
            })
        }


    }

    render() {
        let { datalist, home: { deviceknqueryList, deviceknchildqueryList, fqueryDetaila, fqueryDetailb } } = this.props,
            { postUrl, postDate, postDate1, iftype, settitle, ifs, auditStatus, key, sendMission, person, curitem } = this.state;

        //搜索框封装
        let searchBox = (url, post, key) => {
            return <Search style={{ maxWidth: 200 }} key={url} placeholder="搜索文件名/设备类型" allowClear onSearch={(value) => this.searchVal(value, url, post, key)}></Search>
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

        let renderFile = (item, i) => {
            return (<div key={i}>
                <Row onClick={() => {
                    this.renderRowClick(item)
                }} key={i} className={getIfs(item.createTime) ? styles.rows : styles.redrows} style={{
                    padding: "8px 4px 8px 4px",
                    cursor: "pointer",
                    marginTop: -1
                }}>
                    <Col style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "transparent" }}>
                        <span style={{ fontSize: 15 }} className={styles.oneline}>{item.knowledgeBaseName}</span>
                        <span>{item.updateUserName}</span>
                    </Col>
                    <Col style={{ opacity: 0.6 }}  className={styles.oneline}>
                        <span>
                            设备类型:{item.equipmentTypeName}
                        </span>
                        <Divider type='vertical'></Divider>
                        <span>
                            用途:{item.purposeTypeName}
                        </span>
                        <Divider type='vertical'></Divider>
                        <span className={styles.oneline} title={item.knowledgeBaseDescribe}>
                            描述:{item.knowledgeBaseDescribe ? item.knowledgeBaseDescribe : "暂无描述"}
                        </span>
                    </Col>
                </Row>
                <Divider dashed style={{ margin: 0 }}></Divider>
            </div>)
        }
        let pageconfig = (url, post, mainurl) => {
            return {
                showTotal: total => `共${total}条`, // 分页
                size: "small",
                pageSize: this.state[post].pageSize,
                showQuickJumper: true,
                current: this.props.home[url].pageNum ? this.props.home[url].pageNum : 1,
                total: this.props.home[url].total ? parseInt(this.props.home[url].total) : 0,
                onChange: (page) => pageChange(page, mainurl ? mainurl : url, post),
            }
        }

        let pageChange = (page, url, post) => {
            this.setState({
                [post]: { ...this.state[post], pageIndex: page }
            }, () => {
                this.setNewState(url, this.state[post]);
            })
        }


        let renderItems = (key) => {
            return <div style={{ position: "relative",minHeight:570 }}>
                {
                    deviceknqueryList.list && deviceknqueryList.list.length != 0 ?
                        deviceknqueryList.list.map((item, i) => {
                            return renderFile(item, i)
                        }) : <Empty style={{ paddingTop: 32 }}></Empty>
                }
                <div style={{ height: 36, width: "100%" }}></div>
                <div style={{ display: "flex", justifyContent: "flex-end", position: "absolute", bottom: 0, right: 0 }}>
                    <Pagination {...pageconfig("deviceknqueryList", "postData")} />
                </div>
            </div>
        }


        let pageChanges = (page) => {
            this.setNewState("fqueryDetailb", { id: this.state.curitem.id, pageIndex: page, pageSize: 9 });
        }

        let callback = (key) => {
            this.setState({ key })
        }


        return (
            <div style={{ position: "relative" }}>
                <Card title={<Link to='/alldeviceknowledge/deviceknowledges' style={{ padding: "4px 0px", display: "block" }}>知识文件</Link>} extra={searchBox("deviceknqueryList", "postData", "search")}>
                    {
                        renderItems()
                    }
                </Card>



                <Drawer
                    closable={true}
                    destroyOnClose
                    title={settitle ? settitle : "详情"}
                    placement="right"
                    width={"96%"}
                    onClose={this.onClose}
                    visible={this.state.visible}
                >
                    {
                        ifs == "45" ?
                            <div>
                                <Table bordered size="middle" scroll={{ x: 1200, y: "59vh" }} columns={columnes} dataSource={deviceknchildqueryList ? deviceknchildqueryList.list : []}
                                    pagination={pageconfig("deviceknchildqueryList", "postPubData")}
                                />
                            </div>
                            : ifs == "2" ?
                                <div>
                                    <PageHeader
                                        ghost={false}
                                        title={<span style={{ color: "red" }}>* 通知公告标题</span>}
                                        subTitle="64字以内"
                                    >
                                        <Input value={sendGG.announcementTitle} onChange={(e) => {
                                            this.setState({
                                                sendGG: { ...sendGG, announcementTitle: e.target.value }
                                            })
                                        }} maxLength={64} style={{ width: "100%" }} size='large' placeholder="任务标题" />
                                    </PageHeader>
                                    <PageHeader
                                        ghost={false}
                                        title={<span style={{ color: "red" }}>* 通知公告内容</span>}
                                        subTitle='通知公告内容'
                                    >
                                        <div style={{ border: "#ddd solid 1px", overflow: "hidden" }}>
                                            <Input.TextArea rows={8} value={sendGG.announcementContent} onChange={(e) => {
                                                this.setState({
                                                    sendGG: { ...sendGG, announcementContent: e.target.value }
                                                })
                                            }} maxLength={64} style={{ width: "100%" }} size='large' placeholder="任务内容" />
                                        </div>
                                    </PageHeader>
                                    <PageHeader>
                                        <Button type='primary' onClick={() => {
                                            let iko = 0, sendGG = this.state.sendGG;
                                            for (let key in sendGG) {
                                                if (!sendGG[key]) {
                                                    iko = 1;
                                                }
                                            }
                                            if (iko == 1) {
                                                message.error("标题/内容为必填项！");
                                                return
                                            }
                                            this.setNewState("GGsave", sendGG, () => {
                                                this.setState({
                                                    visible: false,
                                                    sendGG: {
                                                        announcementContent: '',
                                                        assignmentTitle: ''
                                                    },
                                                }, () => {
                                                    this.resetData()
                                                })
                                            })
                                        }} style={{ width: "100%", marginTop: 8 }} size='large'>
                                            提交
                  </Button>
                                    </PageHeader>

                                </div>
                                :
                                ifs == "2re" ?
                                    <div>
                                        <PageHeader
                                            title={curitem.announcementTitle}
                                            subTitle={"发布者：" + curitem.publishUserName + " | " + curitem.publishTime}
                                        >
                                            <div className={styles.innerHtml} dangerouslySetInnerHTML={{ __html: curitem ? curitem.announcementContent : null }}>
                                            </div>
                                        </PageHeader>
                                    </div> :
                                    ifs == "1a" ?
                                        <div>
                                            {
                                                fqueryDetaila.publish &&
                                                <PageHeader
                                                    title={fqueryDetaila.publish.assignmentTitle}
                                                    subTitle={`发布者：${fqueryDetaila.publish.publishUserName} | 发布时间：${fqueryDetaila.publish.publishTime} | 截止时间：${fqueryDetaila.publish.closeDate ? fqueryDetaila.publish.closeDate : ""} | 任务状态:${fqueryDetaila.myWork.statusName}`}
                                                >
                                                    <div className={styles.innerHtml} dangerouslySetInnerHTML={{ __html: fqueryDetaila.publish ? fqueryDetaila.publish.assignmentContent : null }}>
                                                    </div>
                                                    <p style={{ marginTop: 20, display: fqueryDetaila.publish.remark ? "block" : "none", color: "#999" }}>备注：{fqueryDetaila.publish.remark}</p>
                                                    <p style={{ marginTop: 20, color: "#999" }}>类型：{fqueryDetaila.publish.assignmentTypeName}</p>

                                                </PageHeader>
                                            }

                                            {
                                                fqueryDetaila.myWork && fqueryDetaila.myWork.assignmentUserType == "1" ?
                                                    <div>
                                                        <PageHeader
                                                            title={"执行内容"}
                                                            subTitle={"填写任务执行内容"}
                                                            extra={[<Button onClick={() => {
                                                                if (!this.state.executeContent) {
                                                                    message.error("请填写任务执行内容");
                                                                    return
                                                                }
                                                                this.setNewState("missionsubmit", {
                                                                    "id": fqueryDetaila.myWork.id,
                                                                    "executeContent": this.state.executeContent,//执行内容(必填)
                                                                }, () => {
                                                                    this.setNewState("fqueryDetaila", { id: fqueryDetaila.myWork.id }, () => {
                                                                        message.success("提交成功")
                                                                    })
                                                                })
                                                            }}
                                                                disabled={fqueryDetaila.myWork.status != "1" && fqueryDetaila.myWork.status != "3"} type="primary">提交</Button>]}
                                                        >
                                                            <div style={{ border: "#ddd solid 1px", overflow: "hidden" }}>
                                                                <Input.TextArea rows={8} defaultValue={fqueryDetaila.myWork.executeContent} value={this.state.executeContent} onChange={(e) => {
                                                                    this.setState({
                                                                        executeContent: e.target.value
                                                                    })
                                                                }} maxLength={64} style={{ width: "100%" }} size='large' placeholder="任务内容" />
                                                            </div>

                                                        </PageHeader>
                                                        <PageHeader
                                                            title={"验收任务"}
                                                            subTitle={"选择验收结果"}
                                                            extra={[<Button onClick={() => {
                                                                if (!this.state.auditStatus) {
                                                                    message.error("请选择验收结果");
                                                                    return
                                                                }
                                                                this.setNewState("missionaudit", {
                                                                    "id": fqueryDetaila.myWork.id,
                                                                    "auditStatus": this.state.auditStatus,//执行内容(必填)
                                                                }, () => {
                                                                    this.setNewState("fqueryDetaila", { id: fqueryDetaila.myWork.id }, () => {
                                                                        message.success("验收成功")
                                                                    })
                                                                })
                                                            }} disabled={fqueryDetaila.myWork.status != "2"} type="primary">验收任务</Button>]}
                                                        >
                                                            {
                                                                <div>
                                                                    <Select value={auditStatus} style={{ width: "100%" }} placeholder="验收该任务是否通过" onChange={(val) => {
                                                                        this.setState({
                                                                            auditStatus: val
                                                                        })
                                                                    }}>
                                                                        <Option value="1">通过</Option>
                                                                        <Option value="2">不通过</Option>
                                                                    </Select>
                                                                    <p style={{ marginTop: 12 }}>验收人 ：{fqueryDetaila.myWork.auditUserName}</p>
                                                                    <p style={{ marginTop: 12 }}>验收时间 ：{fqueryDetaila.myWork.auditTime}</p>
                                                                </div>
                                                            }
                                                        </PageHeader>

                                                    </div>
                                                    : null
                                            }

                                        </div> :
                                        ifs == "1b" ?
                                            <div>
                                                <PageHeader
                                                    title={curitem.assignmentTitle}
                                                    subTitle={`发布者：${curitem.publishUserName} | 发布时间：${curitem.publishTime} | 截止时间：${curitem.closeDate ? curitem.closeDate : ""} `}
                                                >
                                                    <div className={styles.innerHtml} dangerouslySetInnerHTML={{ __html: curitem ? curitem.assignmentContent : null }}>
                                                    </div>
                                                    <p style={{ marginTop: 20, display: curitem.remark ? "block" : "none", color: "#999" }}>备注：{curitem.remark}</p>
                                                    <p style={{ marginTop: 20, color: "#999" }}>类型：{curitem.assignmentTypeName}</p>
                                                </PageHeader>
                                                <PageHeader
                                                    title="任务执行情况"
                                                    subTitle="分配给个人的任务执行情况"
                                                >
                                                    <Table bordered size="middle"
                                                        expandedRowRender={record => <div>
                                                            <p>任务执行内容：</p>
                                                            <div className={styles.innerHtml} dangerouslySetInnerHTML={{ __html: curitem ? record.executeContent : null }}></div>
                                                        </div>
                                                        }
                                                        scroll={{ x: 1200, y: "59vh" }}
                                                        loading={this.props.submitting}
                                                        pagination={{
                                                            showTotal: total => `共${total}条`, // 分页
                                                            size: "small",
                                                            pageSize: 9,
                                                            showQuickJumper: true,
                                                            current: fqueryDetailb.pageNum ? fqueryDetailb.pageNum : 1,
                                                            total: fqueryDetailb.total ? parseInt(fqueryDetailb.total) : 0,
                                                            onChange: pageChanges,
                                                        }}
                                                        rowKey='id'
                                                        columns={this.columns}
                                                        dataSource={fqueryDetailb.list ? fqueryDetailb.list : []}
                                                    >
                                                    </Table>
                                                </PageHeader>
                                            </div>
                                            :
                                            null
                    }
                </Drawer>

            </div>
        );
    }
}

export default Zhishi;
