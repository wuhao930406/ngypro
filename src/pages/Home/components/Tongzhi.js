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
import { Avatar } from 'antd';
import { Upload } from 'antd';

const { TabPane } = Tabs;
let Search = Input.Search
const { Option } = Select;

@connect(({ home, loading }) => ({
    home,
    submitting: loading.effects['home/queryHome'],
}))
class Tongzhi extends Component {
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
                pageSize: 14,
                pageIndex: 1,
            },
            postUrl: "noticequeryList",
            sendGG: {
                "announcementTitle": "",        //--------公告标题(必填)
                "announcementContent": "",     //--------公告内容(必填)
                "urlIds": [],
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
            }, () => { })
        } else if (this.state.key == "2") {
            this.setState({
                person: {
                    ...this.state.person,
                    cs: val
                },
            }, () => { })
        } else {
            this.setState({
                person: {
                    ...this.state.person,
                    css: val
                },
            }, () => { })
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



    render() {
        let { datalist, home: { noticequeryList, fqueryDetaila, fqueryDetailb } } = this.props,
            { postUrl, postData, sendGG, iftype, settitle, ifs, auditStatus, key, sendMission, person, curitem } = this.state;


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

        //通知公告list
        let renderNotice = (item, i) => {
            return <div key={i} style={{ padding: "0.5px 0px" }}>
                <Row onClick={() => {
                    console.log(item)
                    this.setState({
                        settitle: "公告详情",
                        curitem: item,
                        ifs: "2re"
                    }, () => {
                        this.setState({
                            visible: true,
                        })
                    })
                }} className={getIfs(item.publishTime) ? styles.rows : styles.redrows} style={{ display: "flex", alignItems: "center", padding: "8px 4px 8px 4px", marginTop: -1 }} >
                    <Icon type="bell" />
                    <Divider style={{ marginTop: 4 }} type="vertical"></Divider>
                    <span className={styles.oneline} title={item.announcementTitle}>
                        {item.announcementTitle}
                    </span>
                    <span title={item.publishTime} style={{ color: "#999", display: "inline-block", width: 130, textAlign: "right" }}>{getTime(item.publishTime)}</span>
                </Row>
                <Divider dashed style={{ margin: 0 }}></Divider>
            </div>
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
            return <div style={{ position: "relative", minHeight: 570 }}>
                {
                    noticequeryList.list && noticequeryList.list.length != 0 ?
                        noticequeryList.list.map((item, i) => {
                            return renderNotice(item, i)
                        }) : <Empty style={{ paddingTop: 32 }}></Empty>
                }
                <div style={{ height: 36, width: "100%" }}></div>
                <div style={{ display: "flex", justifyContent: "flex-end", position: "absolute", bottom: -2, right: 0 }}>
                    <Pagination {...pageconfig("noticequeryList", "postData")} />
                </div>
            </div>
        }



        let callback = (key) => {
            this.setState({ key })
        }



        return (
            <div style={{ position: "relative" }}>
                <Card title={<span style={{ padding: "4px 0px", display: "block" }}>通知公告</span>} extra={<div style={{ cursor: "pointer" }} onClick={() => {
                    this.setState({
                        visible: true,
                        settitle: "发布通知公告",
                        ifs: "2"
                    })
                }}>
                    <Icon type='plus'></Icon> 发布通知
                </div>}>
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
                        ifs == "2" ?
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
                                    }} maxLength={64} style={{ width: "100%" }} size='large' placeholder="标题" />
                                </PageHeader>
                                <PageHeader
                                    ghost={false}
                                    title={<span style={{ color: "red" }}>* 通知公告内容</span>}
                                    subTitle='通知公告内容'
                                >
                                    <Input.TextArea rows={8} value={sendGG.announcementContent} onChange={(e) => {
                                        this.setState({
                                            sendGG: { ...sendGG, announcementContent: e.target.value }
                                        })
                                    }} maxLength={64} style={{ width: "100%" }} size='large' placeholder="内容" />
                                </PageHeader>

                                <PageHeader
                                    ghost={false}
                                    title={<span> 附件</span>}
                                    subTitle='通知公告附件'
                                >
                                    <Upload
                                        action="/ngy/common/uploadFile"
                                        onChange={({ file, fileList }) => {
                                            if (file.status !== 'uploading') {
                                                console.log(file, fileList);
                                                let urlIds = fileList.map((item, i) => {
                                                    return item.response && item.response.data.dataList[0]
                                                })
                                                this.setState({
                                                    sendGG: {
                                                        ...sendGG,
                                                        urlIds
                                                    }
                                                })
                                            }
                                            if (file.status === 'done') {

                                            } else if (file.status === 'error') {
                                                message.error(`${file.name} file upload failed.`);
                                            }
                                        }}

                                    >
                                        <Button>
                                            <Icon type="upload" /> 点击上传
                                            </Button>
                                    </Upload>

                                </PageHeader>



                                <PageHeader>
                                    <Button type='primary' onClick={() => {
                                        // let iko = 0, sendGG = this.state.sendGG;
                                        // for (let key in sendGG) {
                                        //     if (!sendGG[key]) {
                                        //         iko = 1;
                                        //     }
                                        // }
                                        // if (iko == 1) {
                                        //     message.error("标题/内容为必填项！");
                                        //     return
                                        // }
                                        delete sendGG.assignmentTitle;
                                        console.log(sendGG)

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
                                        {
                                            curitem.urlIds && <Divider></Divider>
                                        }
                                        <div style={{ padding: 12, paddingLeft: 0, paddingTop: 0 }}>
                                            {
                                                curitem.urlIds && curitem.urlIds.map((it, i) => {
                                                    return <a href={it} target="_blank" style={{ margin: 12, marginLeft: 0 }}><Button>
                                                        <Icon type="file"></Icon> 附件{i + 1}
                                                    </Button></a>
                                                })
                                            }
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
                                    null
                    }
                </Drawer>

            </div>
        );
    }
}

export default Tongzhi;
