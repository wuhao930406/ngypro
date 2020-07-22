
import react, { Component } from 'react';
import { Icon, Drawer, PageHeader, Alert, Row, Col, Avatar, Button, Upload, Spin, Input, Affix, message, Divider, Empty, Modal, Pagination } from "antd";
import { connect } from 'dva';
import moment from "moment";

let styles = {
    htmlcon: {
        overflow: "hidden",
        minHeight: 200,

    },
    divs: {
        backgroundColor: "#f9f9f9",
        display: "flex",
        justifyContent: "flex-end",
        padding: "12px 18px"
    }

}

let { TextArea } = Input
// replysave,queryListByKnowledgeId,queryListByParentIds,replydeleteById
@connect(({ publicmodel, loading }) => ({
    publicmodel,
    submitting: loading.effects['publicmodel/queryListByKnowledgeId'],
    submittings: loading.effects['publicmodel/queryListByParentIds'],
}))
class AbReply extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            utem: {},
            txaopen: false,
            defaultValue: null,
            parentId: "",
            postData: {
                "pageIndex": 1,
                "pageSize": 10,
                "equipmentForumId": props.curitem ? props.curitem.id : ""
            }
        }
    }

    setNewState(type, values, fn) {
        const { dispatch } = this.props;
        dispatch({
            type: 'publicmodel/' + type,
            payload: values
        }).then((res) => {
            if (res) {
                fn ? fn() : null;
            }
        });
    }


    resetData(id, fn) {
        if (id) {
            this.setState({
                postData: { ...this.state.postData, equipmentForumId: id }
            }, () => {
                this.setNewState("queryListByKnowledgeId", this.state.postData)
            })
        } else {
            this.setNewState("queryListByKnowledgeId", this.state.postData)
        }
        fn ? fn() : null
    }

    //留言
    replysave(postData, values, fn) {
        if (!values) {
            message.warn("请输入留言...");
            return
        }
        this.setNewState("replysave", postData, () => {
            message.success("操作成功!");
            fn ? fn() : null
        })
    }
    //删除
    deleteReply(id, fn) {
        let _it = this;
        Modal.confirm({
            title: "确认删除？",
            content: "你一定删掉吗？",
            okText: "删除",
            cancelText: "取消",
            onOk: () => {
                _it.setNewState("replydeleteById", { id }, () => {
                    message.success("删除成功!");
                    fn ? fn() : null
                })
            }
        })
    }
    //查询子评论
    getChildReply(parentId) {
        this.setNewState("queryListByParentIds", { parentId }, () => {

        })

    }

    componentDidMount() {
        this.resetData();
        this.t = setInterval(() => {
            this.setState({
                timestamp: moment()
            })
        }, 60 * 1000)
    }

    componentWillUnmount() {
        clearInterval(this.t);
    }

    componentWillReceiveProps(next) {
        if (this.props.curitem.id !== next.curitem.id) {
            this.resetData(next.curitem.id)
        }
    }



    render() {
        let { curitem, publicmodel: { queryListByKnowledgeId, queryListByParentIds } } = this.props, { open, parentId, txaopen, defaultValue } = this.state;

        let pageChange = (page, url, post) => {
            this.setState({
                [post]: { ...this.state[post], pageIndex: page }
            }, () => {
                this.setNewState(url, this.state[post]);
            })
        }
        let pageconfig = (url, post) => {
            return {
                showTotal: total => `共${total}条`, // 分页
                size: "small",
                pageSize: 10,
                showQuickJumper: true,
                current: this.props.publicmodel[url].pageNum ? this.props.publicmodel[url].pageNum : 1,
                total: this.props.publicmodel[url].total ? parseInt(this.props.publicmodel[url].total) : 0,
                onChange: (page) => pageChange(page, url, post),
            }
        }

        let getTime = (time) => {
            let a = moment(), b = moment(time), c = a.diff(b); // 86400000
            return c > 60 * 60 * 1000 ? time : moment(time).fromNow();
        }


        let mainTitle = () => {
            let curitem = this.props.curitem;
            return <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap",fontSize:14,fontWeight:"lighter" }}>
                <div>
                    <p>
                        <span>
                            标题 :
                    </span>
                        <a style={{ fontSize: 16, paddingLeft: 8, cursor: 'default' }}>
                            {curitem.title}
                        </a>
                        <Divider type='vertical' />
                    </p>
                </div>
                <div>
                    <p>
                        <span>
                            设备类型 :
                    </span>
                        <a style={{ fontSize: 16, paddingLeft: 8, cursor: 'default' }}>
                            {curitem.equipmentTypeName}
                        </a>
                        <Divider type='vertical' />
                    </p>
                </div>
                <div>
                    <p>
                        <span>
                            内容 :
                    </span>
                        <a style={{ fontSize: 16, paddingLeft: 8, cursor: 'default' }}>
                            {curitem.comment}
                        </a>
                        <Divider type='vertical' />

                    </p>
                </div>
                <div>
                    <p>
                        <span>
                            创建日期 :
                    </span>
                        <a style={{ fontSize: 16, paddingLeft: 8, cursor: 'default' }}>
                            {curitem.createTime}
                        </a>
                        <Divider type='vertical' />
                    </p>
                </div>
                <div>
                    <p>
                        <span>
                            上传者 :
                    </span>
                        <a style={{ fontSize: 16, paddingLeft: 8, cursor: 'default' }}>
                            {curitem.updateUserName}
                        </a>
                        <Divider type='vertical' />
                    </p>
                </div>
                <div>
                    <p style={{ display: "flex", alignItems: "center" }}>
                        <span>
                            附件 :
                        </span>
                        <div style={{paddingLeft:8}}>
                            {
                                curitem.attachmentUrlList && curitem.attachmentUrlList.map((it, i) => {
                                    return <a href={it} target="_blank" style={{ marginRight: 12 }}><Button>
                                        <Icon type="file"></Icon> 附件{i + 1}
                                    </Button></a>
                                })
                            }
                        </div>
                    </p>
                </div>

            </div>

        }

        return (
            <Drawer
                {...this.props}
            >
                {
                    this.props.children
                }
                <PageHeader
                    ref={node => {
                        this.container = node;
                    }}
                    title={mainTitle()}
                    extra={[
                        <a style={{ userSelect: "none", fontSize: 18, color: open ? "red" : "#405d97" }} onClick={() => {
                            this.setState({
                                open: !open
                            })
                        }}>{open ? "取消" : "留言"}</a>
                    ]}
                >

                    {
                        open ?
                            <div style={{ backgroundColor: "rgba(0,0,0,0.04)", padding: 12 }}>
                                <TextArea
                                    rows={6}
                                    value={this.state.comment}
                                    onChange={(e) => {
                                        this.setState({
                                            comment: e.target.value
                                        })
                                    }}
                                    placeholder={"请输入留言"}
                                >
                                </TextArea>

                                <Upload
                                    action="/ngy/common/uploadFile"
                                    onChange={({ file, fileList }) => {
                                        if (file.status !== 'uploading') {
                                            console.log(file, fileList);
                                            let attachmentUrlList = fileList.map((item, i) => {
                                                return item.response && item.response.data.dataList[0]
                                            })
                                            this.setState({
                                                attachmentUrlList
                                            })
                                        }
                                        if (file.status === 'done') {

                                        } else if (file.status === 'error') {
                                            message.error(`${file.name} file upload failed.`);
                                        }
                                    }}

                                >
                                    <Button style={{ marginTop: 12 }}>
                                        <Icon type="upload" /> 上传附件
                                    </Button>
                                </Upload>

                                <a onClick={() => {
                                    this.replysave({
                                        "comment": this.state.comment,//内容，必填(富文本)
                                        "equipmentForumId": curitem.id,
                                        "attachmentUrlList": this.state.attachmentUrlList
                                    }, this.state.comment, () => {
                                        this.resetData();
                                        this.setState({
                                            open: false,
                                            defaultValue: null,
                                            comment: null
                                        })
                                    })
                                }} style={{ textAlign: "center", fontSize: 16, display: "inline-block", width: "100%", padding: 12, marginTop: 12, backgroundColor: "#fff" }}>提交</a>
                            </div>
                            : null
                    }
                    <Affix offsetTop={0} target={() => {
                        return document.getElementsByClassName("ant-drawer-wrapper-body")[0]
                    }}>
                        <div style={styles.divs}>
                            <Pagination
                                {...pageconfig("queryListByKnowledgeId", "postData")}
                            >
                            </Pagination>
                        </div>

                    </Affix>

                    <Spin spinning={this.props.submitting}>
                        <Row>
                            {
                                queryListByKnowledgeId.list && queryListByKnowledgeId.list.length > 0 ?
                                    queryListByKnowledgeId.list.map((item, i) => (
                                        <Col key={i} style={{ display: "flex", padding: "12px 0px" }}>
                                            <div style={{ display: "flex", width: 120, flexDirection: "column", alignItems: "center" }}>
                                                <Avatar shape="square" size={88} icon="user" />
                                                <a style={{ marginTop: 6 }}>{item.commentUserName}</a>
                                                <span>{item.commentUserTitle}</span>
                                                <span>{item.commentUserCompanyName}</span>
                                                <span>{item.commentUserDepartmentName}</span>
                                                <span>{item.commentUserShopName}</span>
                                                <span style={{ color: "#999" }}>({item.groupOrder}) 楼</span>
                                            </div>

                                            <div style={{ flex: 1, borderLeft: "#f0f0f0 solid 1px", position: "relative", paddingLeft: 12, overflow: "hidden" }}>
                                                <div style={styles.htmlcon} dangerouslySetInnerHTML={{ __html: item.comment ? item.comment : null }}>
                                                </div>
                                                <div>
                                                            {
                                                                item.attachmentUrlList && item.attachmentUrlList.map((it, i) => {
                                                                    return <a href={it} target="_blank" style={{ margin: 12, marginLeft: 0,opacity:0.5 }}>
                                                                        <Icon type="file"></Icon> 附件{i + 1}
                                                                    </a>
                                                                })
                                                            }
                                                        </div>
                                                <Divider style={{opacity:0.5}}></Divider>
                                                <div>
                                                    <span style={{ display: "inline-block", width: "100%", textAlign: "right", paddingBottom: 12 }}>
                                                        <a style={{ color: "#666" }}>{getTime(item.commentTime)}</a>
                                                        <Divider type="vertical"></Divider>
                                                        <a onClick={() => {
                                                            this.deleteReply(item.id, () => {
                                                                this.resetData()
                                                            });
                                                        }} style={{ color: "red", display: item.isMine ? "inline" : "none" }}>删除</a>
                                                        {item.isMine && <Divider type="vertical"></Divider>}
                                                        <a style={{ userSelect: "none" }} onClick={() => {
                                                            this.getChildReply(item.id)
                                                            this.setState({
                                                                parentId: this.state.parentId ?
                                                                    this.state.parentId == item.id ? null
                                                                        : item.id : item.id,
                                                                txaopen: true,
                                                                textarea: null,
                                                                utem: {}
                                                            }, () => {
                                                                let anchorName = "sbtao" + item.id;
                                                                if (anchorName) {
                                                                    // 找到锚点
                                                                    let anchorElement = document.getElementById(anchorName);
                                                                    // 如果对应id的锚点存在，就跳转到锚点
                                                                    if (anchorElement) {
                                                                        anchorElement.scrollIntoView({
                                                                            block: 'start',
                                                                            behavior: 'smooth'
                                                                        })
                                                                    }
                                                                }
                                                            })
                                                        }}>
                                                            {parentId == item.id ? "收起回复" : `回复(${item.childrenCount})`}   </a>
                                                    </span>
                                                    <Row id={"sbtao" + item.id} style={{ backgroundColor: "#f9f9f9", padding: 12, display: parentId == item.id ? "block" : "none" }}>
                                                        {
                                                            queryListByParentIds && queryListByParentIds.length ?
                                                                queryListByParentIds.map((utem, i) => {
                                                                    return (
                                                                        <Col key={i} style={{
                                                                            padding: 12, backgroundColor: utem.id == this.state.utem.id ? "rgba(0,0,0,0.05)" : "transparent"
                                                                        }}>
                                                                            <p style={{ margin: 0 }}>
                                                                                {utem.commentUserName} 回复 <span style={{ color: utem.replyedUserId == item.commentUserId ? "red" : "#333" }}>{utem.replyedUserName}</span> : {utem.comment}
                                                                            </p>
                                                                            <span style={{ display: "inline-block", width: "100%", textAlign: "right" }}>
                                                                                <a style={{ color: "#666" }}>{getTime(utem.commentTime)}</a>
                                                                                <Divider type="vertical"></Divider>
                                                                                <a onClick={() => {
                                                                                    this.deleteReply(utem.id, () => {
                                                                                        this.resetData();
                                                                                        this.getChildReply(this.state.parentId)
                                                                                    });
                                                                                }} style={{ color: "red", display: utem.isMine ? "inline" : "none" }}>删除</a>
                                                                                {utem.isMine && <Divider type="vertical"></Divider>}
                                                                                <a onClick={() => {
                                                                                    this.setState({
                                                                                        utem: utem,
                                                                                        textarea: null,
                                                                                        txaopen: true
                                                                                    }, () => {
                                                                                        let anchorName = "sbxutao" + item.id;
                                                                                        if (anchorName) {
                                                                                            // 找到锚点
                                                                                            let anchorElement = document.getElementById(anchorName);
                                                                                            // 如果对应id的锚点存在，就跳转到锚点
                                                                                            if (anchorElement) {
                                                                                                anchorElement.scrollIntoView({
                                                                                                    block: 'start',
                                                                                                    behavior: 'smooth'
                                                                                                })
                                                                                            }
                                                                                        }
                                                                                    })
                                                                                }}>
                                                                                    回复
                                                                        </a>
                                                                            </span>
                                                                        </Col>
                                                                    )
                                                                })
                                                                :
                                                                null
                                                        }


                                                        <Button size="small" style={{ float: "right", marginTop: 12, display: queryListByParentIds.length == 0 ? "none" : "block" }} onClick={() => {
                                                            this.setState({
                                                                txaopen: this.state.utem.id ? true : !txaopen,
                                                                textarea: null,
                                                            }, () => {
                                                                this.setState({
                                                                    utem: {},
                                                                })
                                                            })
                                                        }}>
                                                            我也说几句
                                                </Button>

                                                        <div id={"sbxutao" + item.id} style={{ display: this.state.txaopen ? "block" : "none" }}>
                                                            <TextArea
                                                                value={this.state.textarea}
                                                                onChange={(e) => {
                                                                    this.setState({
                                                                        textarea: e.target.value
                                                                    })
                                                                }}
                                                                placeholder={queryListByParentIds.length == 0 ? "我来说一句" :
                                                                    this.state.utem.id ? `回复:${this.state.utem.commentUserName}` : '我也说几句'} style={{ marginTop: 12 }} rows={2}>
                                                            </TextArea>
                                                            <a style={{ marginTop: 12, float: "right" }} onClick={() => {

                                                                this.replysave({
                                                                    "comment": this.state.textarea,//内容，必填
                                                                    "parentId": this.state.utem.id ? this.state.utem.id : parentId
                                                                }, this.state.textarea, () => {
                                                                    this.resetData();
                                                                    this.getChildReply(this.state.parentId);
                                                                    this.setState({
                                                                        textarea: null
                                                                    })
                                                                })
                                                            }}>提交</a>
                                                        </div>
                                                    </Row>
                                                </div>
                                            </div>
                                        </Col>
                                    ))
                                    :
                                    <Empty style={{ marginTop: 36 }}>
                                    </Empty>

                            }






                        </Row>


                    </Spin>


                </PageHeader>




            </Drawer>)


    }


}


export default AbReply