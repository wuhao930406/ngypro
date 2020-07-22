/**
 * Created by 11485 on 2019/2/25.
 */
import React, { Component } from 'react';
import { Card, Radio, Icon, Tabs, Input, Empty, Pagination, Row, Col, Divider, Tooltip, Menu, Dropdown, Drawer, PageHeader, Button, Select, DatePicker, message, Popconfirm, Table, Upload } from 'antd';
import { connect } from 'dva';
import { ChartCard, MiniProgress } from '@/components/Charts';
import styles from '../Homepage.less';
import Link from 'umi/link';
import moment from 'moment';
import UserCheck from '../UserCheck';
import router from 'umi/router';

const { TabPane } = Tabs;
let Search = Input.Search
const { Option } = Select;

@connect(({ home, loading }) => ({
    home,
    submitting: loading.effects['home/queryHome'],
}))
class Gongzuo extends Component {
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
            sendMission: {
                "assignmentTitle": "",//任务标题(必填)
                "assignmentContent": "",//任务内容(必填)
                "closeDate": "",//截至日期(必填)
                "executeUserIdList": [],//执行人id集合(必填)
                "remark": "",//备注(非必填)
                "attachmentUrlList": []
            },
            person: {
                cj: [],
                cs: [],
                css: [],
            },
            postDate: {
                "pageIndex": 1,
                "pageSize": 9,
                "assignmentTitle": "",//任务标题
                "status": ''
            },
            postDate1: {
                "pageIndex": 1,
                "pageSize": 9,
                "assignmentTitle": "",//任务标题
                "status": ''
            },
            postUrl: "queryMyList",
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
    getFirstData(key) {
        let { postUrl, postDate, postDate1, iftype } = this.state;
        if (iftype == "mine") {
            let postes = key ? { ...postDate, status: key } : { ...postDate }
            this.setNewState(postUrl, postes)
        } else if (iftype == "public") {
            let postes = key ? { ...postDate1, status: key } : { ...postDate1 }
            this.setNewState(postUrl, postes)
        }
    }

    componentDidMount() {
        this.getFirstData("");
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
        let { datalist, home: { queryMyList, fqueryDetaila, fqueryDetailb } } = this.props,
            { postUrl, postDate, postDate1, iftype, settitle, ifs, auditStatus, key, sendMission, person, curitem } = this.state;


        //搜索框封装
        let searchBox = (url, post, key) => {
            return <Search key={url} placeholder="搜索..." allowClear onSearch={(value) => this.searchVal(value, url, post, key)}></Search>
        }

        //时间格式化
        let getTime = (time) => {
            let a = moment(), b = moment(time), c = a.diff(b); // 86400000
            return c > 60 * 60 * 1000 ? time : moment(time).fromNow();
        }, getIfs = (time) => {
            let a = moment(), b = moment(time), c = a.diff(b); // 86400000
            return c > 60 * 60 * 1000
        }

        let renderMission = (item, i) => {
            return <div key={i}>
                <Row onClick={() => {
                    let pour = iftype == "mine" ? "fqueryDetaila" : iftype == "public" ? "fqueryDetailb" : null,
                        postl = iftype == "mine" ? { id: item.id } : iftype == "public" ? {
                            id: item.id, "pageIndex": 1,
                            "pageSize": 9,
                        } : null;
                    this.setState({
                        ifs: iftype == "mine" ? "1a" : iftype == "public" ? "1b" : null,
                        settitle: "任务详情",
                        curitem: item
                    }, () => {
                        this.setNewState(pour, postl, () => {
                            this.setState({
                                visible: true,
                                auditStatus: iftype == "mine" ? this.props.home.fqueryDetaila.myWork.auditStatus ? this.props.home.fqueryDetaila.myWork.auditStatus.toString() : "" : ""
                            })
                        })
                    })
                }} className={getIfs(item.createTime) ? styles.rows : styles.redrows} style={{ display: "flex", alignItems: "center", padding: "8px 4px 8px 4px", marginTop: -1 }}>
                    <Icon type={item.assignmentType == "1" ? "file" : "message"} />
                    <Divider style={{ marginTop: 4 }} type="vertical"></Divider>
                    <span>{
                        iftype == "mine" ?
                            item.assignmentType == 2 ? "私信" :
                                item.assignmentType == 1 && item.assignmentUserType == 2 ? "抄送" :
                                    item.assignmentType == 1 && item.assignmentUserType == 1 ? "待办" : "" :
                            item.assignmentTypeName}</span>
                    <Divider style={{ marginTop: 4 }} type="vertical"></Divider>

                    <span style={{ color: item.status == "1" ? "#4B7902" :item.status == "3" ?"#A30014": item.status == "2" ?"#F59A23":"#aaa" }}>{item.statusName}</span>
                    <Divider style={{ marginTop: 4 }} type="vertical"></Divider>
                    <span className={styles.oneline} title={item.assignmentTitle}>
                        {item.assignmentTitle}
                    </span>
                    <span title={item.createTime} style={{ color: "#999", display: "inline-block", width: 130, textAlign: "right" }}>{getTime(item.createTime)}</span>
                    {
                        item.status == 0 && this.state.iftype == "public" ?
                            <div onClick={(e) => {
                                e.stopPropagation()
                            }}>
                                <Popconfirm
                                    okText="确认"
                                    cancelText="取消"
                                    placement="bottom"
                                    title={"确认删除该任务？"}
                                    onConfirm={() => {
                                        this.setNewState("missiondeleteById", { id: item.id }, () => {
                                            message.success("删除成功！");
                                            this.getFirstData();
                                        })
                                    }}>
                                    <Icon style={{ color: "#ff4800", paddingLeft: 12 }} type="close"></Icon>
                                </Popconfirm>
                            </div>
                            :
                            null
                    }

                </Row>
                <Divider dashed style={{ margin: 0 }}></Divider>
            </div>
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
            return <div style={{ height: 376, position: "relative" }}>
                {
                    this.props.home[key].list && this.props.home[key].list.length != 0 ?
                        this.props.home[key].list.map((item, i) => {
                            return renderMission(item, i)
                        }) : <Empty style={{ paddingTop: 32 }}></Empty>
                }
                <div style={{ display: "flex", justifyContent: "flex-end", position: "absolute", bottom: -2, right: 0 }}>
                    <Pagination {...pageconfig(key, this.state.iftype == "public" ? "postDate1" : "postDate", this.state.postUrl)} />
                </div>
            </div>
        }

        const menu = (
            <Menu>
                <Menu.Item onClick={() => {
                    this.setState({
                        visible: true,
                        settitle: "发布任务工作",
                        ifs: "1",
                        key: "1",
                        sendMission: {
                            "assignmentTitle": "",//任务标题(必填)
                            "assignmentContent": "",//任务内容(必填)
                            "closeDate": "",//截至日期(必填)
                            "executeUserIdList": [],//执行人id集合(必填)
                            "sendUserIdList": [],
                            "attachmentUrlList": [],
                            "remark": ""//备注(非必填)
                        },
                    })
                }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}> 发布任务 </div>
                </Menu.Item>
                <Menu.Item onClick={() => {
                    this.setState({
                        visible: true,
                        settitle: "发布私信工作",
                        ifs: "11",
                        key: "-1",
                        sendMission: {
                            "assignmentTitle": "",//任务标题(必填)
                            "assignmentContent": "",//任务内容(必填)
                            "closeDate": "",//截至日期(必填)
                            "executeUserIdList": [],//执行人id集合(必填)
                            "sendUserIdList": [],
                            "attachmentUrlList": [],
                            "remark": ""//备注(非必填)
                        },
                    })
                }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}> 发布私信 </div>
                </Menu.Item>
            </Menu>
        );

        let pageChanges = (page) => {
            this.setNewState("fqueryDetailb", { id: this.state.curitem.id, pageIndex: page, pageSize: 9 });
        }

        let callback = (key) => {
            this.setState({ key })
        }, callbacks = (key) => {
            if (key == "1") {
                this.setState({
                    postDate: {
                        "pageIndex": 1,
                        "pageSize": 9,
                        "assignmentTitle": "",//任务标题
                        "status": ''
                    },
                    iftype: "mine",
                    postUrl: "queryMyList",
                }, () => {
                    this.getFirstData("")
                })
            } else {
                this.setState({
                    postDate1: {
                        "pageIndex": 1,
                        "pageSize": 9,
                        "assignmentTitle": "",//任务标题
                        "status": ''
                    },
                    iftype: "public",
                    postUrl: "fbqueryMyList"
                }, () => {
                    this.getFirstData("")
                })
            }

        }


        return (
            <div style={{ position: "relative" }}>
                <Card style={{ overflow: "visible" }} title={"个人工作中心"}>
                    <div className={styles.center} style={{ justifyContent: "space-around", alignItems: "flex-start", padding: "16px 0" }}>
                        {
                            datalist.map((item, i) => {
                                return <div key={i} className={this.state.active == item.name ? styles.activecenter : styles.percenters} style={{ flexDirection: "column", textAlign: 'center', padding: "16px 0" }} onClick={() => {
                                    this.setState({
                                        active: this.state.active ? "" : item.name
                                    })
                                    if (i == 1) {
                                        router.push("/repair/repairmylist")
                                    } else if (i == 2) {
                                        router.push("/verb/verbmymission")
                                    } else if (i == 3) {
                                        router.push("/check/checkmyerror")
                                    }


                                }}>
                                    <p style={{ marginBottom: 6 }}>{item.name}</p>
                                    <div className={styles.center} >
                                        <h2 style={{ fontSize: 24 }}>{item.num}</h2>
                                        {
                                            i == 0 && <Icon type={this.state.active == item.name ? "caret-up" : "caret-down"} style={{ marginTop: -6, marginLeft: 10 }} />
                                        }
                                    </div>
                                </div>
                            })
                        }
                        <div style={{ width: "100%", height: 460, position: "absolute", zIndex: 6, backgroundColor: "#fff", top: 180, display: this.state.active == "工作任务" ? "block" : "none", border: "0.5px solid #e8e8e8", borderTop: "none", boxSizing: "content-box" }}>
                            <Tabs
                                type="card"
                                style={{ margin: '0 12px' }}
                                onChange={callbacks}
                                defaultActiveKey="1"
                                tabBarExtraContent={searchBox(this.state.postUrl, this.state.iftype == "public" ? "postDate1" : "postDate", "assignmentTitle")}>
                                <TabPane tab="收到的任务" key="1">
                                    <div style={{ border: "0.5px solid #e8e8e8", borderTop: "none", boxSizing: "content-box", marginTop: -17, padding: "17px 12px" }}>
                                        {renderItems("queryMyList")}
                                    </div>
                                </TabPane>
                                <TabPane tab={<span>
                                    发布的任务
                                    <Dropdown overlay={menu} trigger={['click']}>
                                        <Icon type="plus" style={{ color: "red", paddingLeft: 12 }} />
                                    </Dropdown>
                                </span>} key="2">
                                    <div style={{ border: "0.5px solid #e8e8e8", borderTop: "none", boxSizing: "content-box", marginTop: -17, padding: "17px 12px" }}>
                                        {renderItems("fbqueryMyList")}
                                    </div>
                                </TabPane>
                            </Tabs>
                        </div>
                    </div>
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
                            :
                            ifs == "1" ?
                                <div>
                                    <PageHeader
                                        ghost={false}
                                        title={key == "1" ? <span style={{ color: "red" }}>* 选择任务承接人</span> : <a>选择抄送人</a>}
                                    >
                                        <Tabs defaultActiveKey="1" onChange={callback} tabBarExtraContent={<a onClick={() => {
                                            if (key == "1") {
                                                this.setState({
                                                    person: {
                                                        ...person,
                                                        cj: []
                                                    }
                                                })
                                                this.child.resetEmpty()
                                            } else {
                                                this.setState({
                                                    person: {
                                                        ...person,
                                                        cs: []
                                                    }
                                                })
                                                this.childs.resetEmpty()
                                            }
                                        }}>
                                            清空
                                        </a>}>
                                            <TabPane tab={<a style={{ color: "red" }}>* 选择任务承接人</a>} key="1">
                                                <UserCheck onRef={this.onRef} setNewValue={this.setNewValue} checkedValue={this.state.person.cj} title={key == "1" ? "选择任务承接人" : "选择抄送人"}></UserCheck>
                                            </TabPane>
                                            <TabPane tab="选择抄送人" key="2">
                                                <UserCheck onRef={this.onRefs} key={"b"} setNewValue={this.setNewValue} checkedValue={this.state.person.cs} title={key == "1" ? "选择任务承接人" : "选择抄送人"}></UserCheck>
                                            </TabPane>
                                        </Tabs>
                                    </PageHeader>
                                    <PageHeader
                                        ghost={false}
                                        title={<span style={{ color: "red" }}>* 标题</span>}
                                        subTitle="64字以内"
                                    >
                                        <Input value={sendMission.assignmentTitle} onChange={(e) => {
                                            this.setState({
                                                sendMission: { ...sendMission, assignmentTitle: e.target.value }
                                            })
                                        }} maxLength={64} style={{ width: "100%" }} size='large' placeholder="标题" />
                                    </PageHeader>
                                    <PageHeader
                                        ghost={false}
                                        title={<span style={{ color: "red" }}>* 内容</span>}
                                        subTitle='内容'
                                    >
                                        <div style={{ border: "#ddd solid 1px", overflow: "hidden" }}>
                                            <Input.TextArea rows={8} value={sendMission.assignmentContent} onChange={(e) => {
                                                this.setState({
                                                    sendMission: { ...sendMission, assignmentContent: e.target.value }
                                                })
                                            }} maxLength={64} style={{ width: "100%" }} size='large' placeholder="内容" />
                                        </div>
                                    </PageHeader>
                                    <PageHeader
                                        ghost={false}
                                        title={<span style={{ color: "red" }}>* 截至日期</span>}
                                        subTitle='任务截止日期'
                                    >
                                        <DatePicker disabledDate={(current) => {
                                            return current && current < moment().add('day', -1);
                                        }} value={sendMission.closeDate ? moment(sendMission.closeDate) : undefined} onChange={(value) => {
                                            this.setState({
                                                sendMission: { ...sendMission, closeDate: moment(value).format("YYYY-MM-DD") }
                                            })
                                        }} style={{ width: "100%" }} size='large'></DatePicker>
                                    </PageHeader>
                                    <PageHeader
                                        ghost={false}
                                        title={<span> 附件</span>}
                                        subTitle='任务附件'
                                    >
                                        <Upload
                                            action="/ngy/common/uploadFile"
                                            onChange={({ file, fileList }) => {
                                                if (file.status !== 'uploading') {
                                                    console.log(file, fileList);
                                                    let attachmentUrlList = fileList.map((item, i) => {
                                                        return item.response && item.response.data.dataList[0]
                                                    })
                                                    this.setState({
                                                        sendMission: {
                                                            ...sendMission,
                                                            attachmentUrlList
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

                                    <PageHeader
                                        ghost={false}
                                        title="备注"
                                        subTitle='该任务的注意事项'
                                    >
                                        <Input.TextArea value={sendMission.remark} onChange={(e) => {
                                            this.setState({
                                                sendMission: { ...sendMission, remark: e.target.value }
                                            })
                                        }} rows={6} style={{ width: "100%" }} size='large' placeholder="备注" />
                                    </PageHeader>
                                    <PageHeader>
                                        <Button type='primary' onClick={() => {
                                            let iko = 0, sendMission = this.state.sendMission;
                                            sendMission.executeUserIdList = this.state.person.cj;
                                            sendMission.sendUserIdList = this.state.person.cs;
                                            for (let key in sendMission) {
                                                if (key != "remark") {
                                                    if (!sendMission[key]) {
                                                        iko = 1;
                                                    }
                                                }
                                            }
                                            this.setNewState("missionsave", { ...sendMission, assignmentType: "1" }, () => {
                                                message.success("发布成功");
                                                this.getFirstData()
                                                this.setState({
                                                    visible: false,
                                                    sendMission: {
                                                        "assignmentTitle": "",//任务标题(必填)
                                                        "assignmentContent": "",//任务内容(必填)
                                                        "closeDate": "",//截至日期(必填)
                                                        "executeUserIdList": [],//执行人id集合(必填)
                                                        "sendUserIdList": [],
                                                        "remark": ""//备注(非必填)
                                                    },
                                                    person: {
                                                        cs: [],
                                                        cj: [],
                                                        css: []
                                                    },
                                                })
                                            })
                                        }} style={{ width: "100%", marginTop: 8 }} size='large'>
                                            提交
                  </Button>
                                    </PageHeader>
                                </div>
                                :
                                ifs == "11" ?
                                    <div>
                                        <PageHeader
                                            ghost={false}
                                            title={key == "1" ? <span style={{ color: "red" }}>* 选择任务承接人</span> : <a>选择抄送人</a>}
                                            extra={<a onClick={() => {
                                                this.setState({
                                                    person: {
                                                        ...person,
                                                        css: []
                                                    }
                                                })
                                                this.childc.resetEmpty()
                                            }}>
                                                清空
                                        </a>}>
                                            <UserCheck onRef={this.onRefc} key={"c"} setNewValue={this.setNewValue} checkedValue={this.state.person.css} title={"选择抄送人"}></UserCheck>
                                        </PageHeader>
                                        <PageHeader
                                            ghost={false}
                                            title={<span style={{ color: "red" }}>* 任务标题</span>}
                                            subTitle="64字以内"
                                        >
                                            <Input value={sendMission.assignmentTitle} onChange={(e) => {
                                                this.setState({
                                                    sendMission: { ...sendMission, assignmentTitle: e.target.value }
                                                })
                                            }} maxLength={64} style={{ width: "100%" }} size='large' placeholder="任务标题" />
                                        </PageHeader>
                                        <PageHeader
                                            ghost={false}
                                            title={<span style={{ color: "red" }}>* 任务内容</span>}
                                            subTitle='任务内容'
                                        >
                                            <div style={{ border: "#ddd solid 1px", overflow: "hidden" }}>
                                                <Input.TextArea rows={8} value={sendMission.assignmentContent} onChange={(e) => {
                                                    this.setState({
                                                        sendMission: { ...sendMission, assignmentContent: e.target.value }
                                                    })
                                                }} maxLength={64} style={{ width: "100%" }} size='large' placeholder="任务内容" />
                                            </div>
                                        </PageHeader>

                                        <PageHeader
                                            ghost={false}
                                            title={<span> 附件</span>}
                                            subTitle='私信附件'
                                        >
                                            <Upload
                                                action="/ngy/common/uploadFile"
                                                onChange={({ file, fileList }) => {
                                                    if (file.status !== 'uploading') {
                                                        console.log(file, fileList);
                                                        let attachmentUrlList = fileList.map((item, i) => {
                                                            return item.response && item.response.data.dataList[0]
                                                        })
                                                        this.setState({
                                                            sendMission: {
                                                                ...sendMission,
                                                                attachmentUrlList
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



                                        <PageHeader
                                            ghost={false}
                                            title="备注"
                                            subTitle='该任务的注意事项'
                                        >
                                            <Input.TextArea value={sendMission.remark} onChange={(e) => {
                                                this.setState({
                                                    sendMission: { ...sendMission, remark: e.target.value }
                                                })
                                            }} rows={6} style={{ width: "100%" }} size='large' placeholder="备注" />
                                        </PageHeader>
                                        <PageHeader>
                                            <Button type='primary' onClick={() => {
                                                let iko = 0, sendMission = this.state.sendMission;
                                                sendMission.sendUserIdList = this.state.person.css;
                                                delete sendMission.closeDate;
                                                delete sendMission.executeUserIdList;
                                                for (let key in sendMission) {
                                                    if (key != "remark") {
                                                        if (!sendMission[key]) {
                                                            iko = 1;
                                                        }
                                                    }
                                                }

                                                if (iko == 1) {
                                                    message.error("除备注外都是必填项！");
                                                    return
                                                }

                                                this.setNewState("missionsave", { ...sendMission, assignmentType: "2" }, () => {
                                                    message.success("发布成功");
                                                    this.getFirstData()
                                                    this.setState({
                                                        visible: false,
                                                        sendMission: {
                                                            "assignmentTitle": "",//任务标题(必填)
                                                            "assignmentContent": "",//任务内容(必填)
                                                            "closeDate": "",//截至日期(必填)
                                                            "executeUserIdList": [],//执行人id集合(必填)
                                                            "sendUserIdList": [],
                                                            "remark": ""//备注(非必填)
                                                        },
                                                        person: {
                                                            cs: [],
                                                            cj: [],
                                                            css: []
                                                        },
                                                    })
                                                })
                                            }} style={{ width: "100%", marginTop: 8 }} size='large'>
                                                提交
                    </Button>
                                        </PageHeader>
                                    </div>
                                    :
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
                                                            {
                                                                fqueryDetaila.publish.attachmentUrlList && <Divider></Divider>
                                                            }
                                                            <div style={{ padding: 12, paddingLeft: 0, paddingTop: 0 }}>
                                                                {
                                                                    fqueryDetaila.publish.attachmentUrlList && fqueryDetaila.publish.attachmentUrlList.map((it, i) => {
                                                                        return <a href={it} target="_blank" style={{ margin: 12, marginLeft: 0 }}><Button>
                                                                            <Icon type="file"></Icon> 附件{i + 1}
                                                                        </Button></a>
                                                                    })
                                                                }
                                                            </div>
                                                        </PageHeader>
                                                    }

                                                    {
                                                        fqueryDetaila.myWork && fqueryDetaila.myWork.assignmentUserType == "1" ?
                                                            <div>
                                                                <PageHeader
                                                                    title={"执行内容"}
                                                                    subTitle={"填写任务执行内容"}
                                                                    extra={fqueryDetaila.myWork.status != "1" && fqueryDetaila.myWork.status != "3" ? null : [<Button onClick={() => {
                                                                        if (!this.state.executeContent) {
                                                                            message.error("请填写任务执行内容");
                                                                            return
                                                                        }
                                                                        this.setNewState("missionsubmit", {
                                                                            "id": fqueryDetaila.myWork.id,
                                                                            "executeContent": this.state.executeContent,//执行内容(必填)
                                                                            "executeUrlList": this.state.executeUrlList && this.state.executeUrlList
                                                                        }, () => {
                                                                            this.setNewState("fqueryDetaila", { id: fqueryDetaila.myWork.id }, () => {
                                                                                message.success("提交成功")
                                                                            })
                                                                        })
                                                                    }} type="primary">提交</Button>]}
                                                                >
                                                                    {
                                                                        fqueryDetaila.myWork.status != "1" && fqueryDetaila.myWork.status != "3" ? <div>
                                                                            <p>
                                                                                执行内容: {fqueryDetaila.myWork.executeContent}
                                                                            </p>
                                                                            <div style={{ padding: 12, paddingLeft: 0, paddingTop: 0 }}>
                                                                                {
                                                                                    fqueryDetaila.myWork.executeUrlList && fqueryDetaila.myWork.executeUrlList.map((it, i) => {
                                                                                        return <a href={it} target="_blank" style={{ margin: 12, marginLeft: 0 }}><Button>
                                                                                            <Icon type="file"></Icon> 附件{i + 1}
                                                                                        </Button></a>
                                                                                    })
                                                                                }
                                                                            </div>
                                                                        </div> : <div>
                                                                                <Input.TextArea
                                                                                    rows={8}
                                                                                    defaultValue={fqueryDetaila.myWork.executeContent}
                                                                                    value={this.state.executeContent}
                                                                                    onChange={(e) => {
                                                                                        this.setState({
                                                                                            executeContent: e.target.value
                                                                                        })
                                                                                    }} maxLength={64} style={{ width: "100%", marginBottom: 24 }} size='large' placeholder="任务内容" />
                                                                                <Upload
                                                                                    action="/ngy/common/uploadFile"
                                                                                    onChange={({ file, fileList }) => {
                                                                                        if (file.status !== 'uploading') {
                                                                                            console.log(file, fileList);
                                                                                            let executeUrlList = fileList.map((item, i) => {
                                                                                                return item.response && item.response.data.dataList[0]
                                                                                            })
                                                                                            this.setState({
                                                                                                executeUrlList
                                                                                            })
                                                                                        }
                                                                                        if (file.status === 'done') {

                                                                                        } else if (file.status === 'error') {
                                                                                            message.error(`${file.name} file upload failed.`);
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    <Button>
                                                                                        <Icon type="upload" /> 上传执行附件
                                                                                </Button>
                                                                                </Upload>
                                                                            </div>
                                                                    }

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
                                                                            {
                                                                                fqueryDetaila.myWork.status != "2" ?
                                                                                    <p>
                                                                                        验收结果 ：{fqueryDetaila.myWork.auditStatusName}
                                                                                    </p>
                                                                                    : <Select
                                                                                        disabled={fqueryDetaila.myWork.status != "2"}
                                                                                        value={auditStatus}
                                                                                        style={{ width: "100%" }} placeholder="验收该任务是否通过" onChange={(val) => {
                                                                                            this.setState({
                                                                                                auditStatus: val
                                                                                            })
                                                                                        }}>
                                                                                        <Option value="1">通过</Option>
                                                                                        <Option value="2">不通过</Option>
                                                                                    </Select>
                                                                            }

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
                                                            {
                                                                curitem.attachmentUrlList && <Divider></Divider>
                                                            }
                                                            <div style={{ padding: 12, paddingLeft: 0, paddingTop: 0 }}>
                                                                {
                                                                    curitem.attachmentUrlList && curitem.attachmentUrlList.map((it, i) => {
                                                                        return <a href={it} target="_blank" style={{ margin: 12, marginLeft: 0 }}><Button>
                                                                            <Icon type="file"></Icon> 附件{i + 1}
                                                                        </Button></a>
                                                                    })
                                                                }
                                                            </div>
                                                        </PageHeader>
                                                        <PageHeader
                                                            title="任务执行情况"
                                                            subTitle="分配给个人的任务执行情况"
                                                        >
                                                            <Table bordered size="middle"
                                                                expandedRowRender={record => <div>
                                                                    <p>任务执行内容：</p>
                                                                    <div className={styles.innerHtml} dangerouslySetInnerHTML={{ __html: record ? record.executeContent : null }}></div>
                                                                    {
                                                                        record.executeUrlList && <Divider></Divider>
                                                                    }
                                                                    <div style={{ padding: 12, paddingLeft: 0, paddingTop: 0 }}>
                                                                        {
                                                                            record.executeUrlList && record.executeUrlList.map((it, i) => {
                                                                                return <a href={it} target="_blank" style={{ margin: 12, marginLeft: 0 }}><Button>
                                                                                    <Icon type="file"></Icon> 附件{i + 1}
                                                                                </Button></a>
                                                                            })
                                                                        }
                                                                    </div>

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

export default Gongzuo;
