import {
    Table, Input, InputNumber, Popconfirm, Form, Divider, Modal, Tree, Button, Row, Col, Icon, Select, Alert, Tag, message, Card
} from 'antd';
import { connect } from 'dva';
import CreateForm from "@/components/CreateForm"
import SearchBox from '@/components/SearchBox'
import WrappedDynamicFieldSet from './paramsaddon'

@connect(({ datagate, loading }) => ({
    datagate,
    submitting: loading.effects['datagate/datagatequery'],
}))
class DataGateList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            iftype: {
                name: "",
                value: ""
            },
            fv: false,
            fields: {},
            /*初始化 main List */
            postData: {
                pageIndex: 1,
                pageSize: 9,
                name: null,     // 传感器名称      
                model: null,   //  传感器类型id 
                manufactory: null,  // 传感器编号 
            },
            postUrl: "datagatequery",
            curitem: {}
        }
    }

    //设置新状态
    setNewState(type, values, fn) {
        const { dispatch } = this.props;
        dispatch({
            type: 'datagate/' + type,
            payload: values
        }).then((res) => {
            if (res) {
                fn ? fn() : null;
            }
        });
    }


    resetData() {
        let { postUrl, postData } = this.state;
        this.setNewState(postUrl, postData, () => {
            this.handleCancel()
        })
    }

    componentDidMount() {
this.props.ensureDidMount&&this.props.ensureDidMount()
        this.resetData()
    }


    //表单改变
    handleFormChange = (changedFields) => {
        let fields = this.state.fields, obj;
        for (let i in changedFields) {
            obj = changedFields[i]
        }
        if (obj) {
            for (let i in fields) {
                if (i == obj.name) {
                    fields[i].value = obj.value
                    fields[i].name = obj.name
                    fields[i].dirty = obj.dirty
                    fields[i].errors = obj.errors
                    fields[i].touched = obj.touched
                    fields[i].validating = obj.validating
                }
            }
            this.setState({
                fields: fields,
            })
        }

    }

    /*绑定form*/
    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }

    /*关闭
    
    {
        "name":"网关名",
        "model":"型号",
        "manufactory":"厂家哦"
}*/
    handleCancel = () => {
        this.setState({
            fv: false,
            fields: {
                name: {
                    value: null,
                    type: "input",
                    title: "网关名",
                    keys: "name",
                    requires: true
                },
                model: {
                    value: null,
                    type: "input",
                    title: "型号",
                    keys: "model",
                    requires: true,
                },
                manufactory: {
                    value: null,
                    type: "input",
                    title: "厂家",
                    keys: "manufactory",
                    requires: true,
                }
            },
        });
    }

    /*form 提交*/
    handleCreate = () => {
        const form = this.formRef.props.form;
        let { curitem, iftype } = this.state;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            for (let i in values) {
                if (!values[i]) {
                    delete values[i];
                }
            }
            if (iftype.value == "edit") {
                let postData = { ...values, id: curitem.id };
                this.setNewState("datagatesave", postData, () => {
                    message.success("修改成功！");
                    this.resetData();
                });
            } else if (iftype.value == "add") {
                let postData = { ...values };
                this.setNewState("datagatesave", postData, () => {
                    message.success("新增成功！");
                    this.resetData();
                });
            }

        });
    }

    handleSearch = (selectedKeys, dataIndex) => {
        let { postUrl } = this.state;
        this.setState({ postData: { ...this.state.postData, [dataIndex]: selectedKeys[0] ? selectedKeys[0] : "" } }, () => {
            this.setNewState(postUrl, this.state.postData)
        });

    };

    onRefs = (ref) => {
        this.childs = ref;
    }


    render() {
        let { postData, postUrl, fv, fields, iftype, curitem } = this.state,
            { datagatequery, sensorType, unitType } = this.props.datagate;

        let getsearchbox = (key) => {
            if (this.childs) {
                return this.childs.getColumnSearchProps(key)
            } else {
                return null
            }
        }, getselectbox = (key, option) => {
            if (this.childs) {
                return this.childs.getColumnSelectProps(key, option)
            } else {
                return null
            }
        }, gettreeselectbox = (key, option) => {
            if (this.childs) {
                return this.childs.getColumnTreeSelectProps(key, option)
            } else {
                return null
            }
        }

        const columns = [
            {
                title: '网关名',
                dataIndex: 'name',
                key: 'name',
                ...getsearchbox('name')
            },
            {
                title: '型号',
                dataIndex: 'model',
                key: 'model',
                ...getsearchbox('model')
            },
            {
                title: '厂家',
                dataIndex: 'manufactory',
                key: 'manufactory',
                ...getsearchbox('manufactory')
            },
            {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                render: (text, record) => <a onClick={() => {
                    this.setState({
                        shown: ["parameterType", "physicalMeaning", "valueType", 'secondParameterType', "parameterKey", "isUse", "unit","earlyWarningValue","secondNameKey"],
                        type: "add",
                        curitem:record,
                        defaultvalue: [],
                    })
                }}>新增</a>
            },
        ]

        let pageChange = (page) => {
            this.setState({
                postData: { ...this.state.postData, pageIndex: page }
            }, () => {
                this.setNewState("datagatequery", this.state.postData);
            })
        }
        const rowClassNameFn = (record, index) => {
            const { curitem } = this.state;
            if (curitem && curitem.id === record.id) {
                return "selectedRow";
            }
            return null;
        };

        let renderAdd = (record) => {
            let queryAll = this.props.datagate.queryAll;
            return <Table
                columns={
                    [
                        {
                            title: '参数类型',
                            dataIndex: 'parameterTypeName',
                            key: 'parameterTypeName',
                        },
                        {
                            title: '二级参数类型',
                            dataIndex: 'secondParameterTypeName',
                            key: 'secondParameterTypeName',
                        },
                        {
                            title: '高亮预警值',
                            dataIndex: 'earlyWarningValue',
                            key: 'earlyWarningValue',
                        },
                        {
                            title: '参数key',
                            dataIndex: 'parameterKey',
                            key: 'parameterKey',
                        },
                        {
                            title: '物理含义',
                            dataIndex: 'physicalMeaning',
                            key: 'physicalMeaning',
                        },
                        {
                            title: '数值类型',
                            dataIndex: 'valueTypeName',
                            key: 'valueTypeName',
                        },
                        {
                            title: '单位',
                            dataIndex: 'unit',
                            key: 'unit',
                        },
                        {
                            title: '是否启用',
                            dataIndex: 'isUse',
                            key: 'isUse',
                            render: (text) => <span>{text == "1" ? "启用" : "不启用"}</span>
                        },
                        {
                            title: '参数',
                            dataIndex: 'parameterValueList',
                            key: 'parameterValueList',
                            render: (text, record) => record.parameterValueList && record.parameterValueList.map(item => <p style={{ marginBottom: 6 }}><span>参数值:{item.value}</span> <Divider type='vertical'></Divider>  <span>物理含义:{item.physicalMeaning}</span></p>)
                        },
                        {
                            title: '操作',
                            dataIndex: 'action',
                            key: 'action',
                            render: (text, record) => <div>
                                <a style={{ display: record.parameterType == "2" ? "inline-block" : "none" }} onClick={() => {
                                    this.setState({
                                        type: "addchild",
                                        curs: record.id,
                                        cursecon: record,
                                        shown: ["physicalMeaning", "valueType", "sortOrder", "unit","earlyWarningValue","parameterKey"],
                                        defaultvalue: [
                                        ],
                                        secondParameterType:record.secondParameterType
                                    })

                                }}>新增子集</a>
                                {record.parameterType == "2" && <Divider type='vertical'></Divider>}
                                <a onClick={() => {
                                    this.setState({
                                        type: "edit",
                                        cur: record.id,
                                        cursecon: record,
                                        shown: ["parameterType", "physicalMeaning", "valueType", "parameterKey", 'secondParameterType', "isUse", "unit","earlyWarningValue","secondNameKey"],
                                        defaultvalue: [
                                            { key: "parameterType", value: record.parameterType },
                                            { key: "secondNameKey", value: record.secondNameKey },
                                            { key: "physicalMeaning", value: record.physicalMeaning },
                                            { key: "valueType", value: record.valueType },
                                            { key: "parameterKey", value: record.parameterKey },
                                            { key: "isUse", value: record.isUse },
                                            { key: "unit", value: record.unit },
                                            { key: "parameterValueList", value: record.parameterValueList },
                                            { key: "secondParameterType", value: record.secondParameterType },
                                            { key: "earlyWarningValue", value: record.earlyWarningValue },
                                        ]
                                    })
                                }}>修改</a>
                                <Divider type='vertical'></Divider>
                                <Popconfirm
                                    okText="确认"
                                    cancelText="取消"
                                    placement="bottomRight"
                                    title={"确认删除该参数？"}
                                    onConfirm={() => {
                                        this.setNewState("parameterdeleteById", { id: record.id }, () => {
                                            message.success("删除成功");
                                            this.setNewState("queryAll", { dataGatewayId: this.state.secondRowKeys[0] ? this.state.secondRowKeys[0] : this.state.curitem.id }, () => {
                                            })
                                        })
                                    }}>
                                    <a style={{ color: "#ff4800" }}>删除</a>
                                </Popconfirm>


                            </div>
                        },
                    ]}
                dataSource={queryAll ? queryAll : []}
                expandedRowRender={expandedRowRender}
            ></Table>

        }

        const expandedRowRender = (record) => {
            const columns = [
                {
                    title: '物理含义',
                    dataIndex: 'physicalMeaning',
                    key: 'physicalMeaning',
                },
                {
                    title: '高亮预警值',
                    dataIndex: 'earlyWarningValue',
                    key: 'earlyWarningValue',
                },
                {
                    title: '数值类型',
                    dataIndex: 'valueTypeName',
                    key: 'valueTypeName',
                },
                {
                    title: '参数key',
                    dataIndex: 'parameterKey',
                    key: 'parameterKey',
                },
                {
                    title: '排序',
                    dataIndex: 'sortOrder',
                    key: 'sortOrder',
                },
                {
                    title: '参数',
                    dataIndex: 'parameterValueList',
                    key: 'parameterValueList',
                    render: (text, items) => items.parameterValueList && items.parameterValueList.map(item => <p style={{ marginBottom: 6 }}><span>参数值:{item.value}</span> <Divider type='vertical'></Divider>  <span>物理含义:{item.physicalMeaning}</span></p>)
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    key: 'action',
                    render: (text, items) => <div>
                        <a onClick={() => {
                            this.setState({
                                type: "editchild",
                                cur: items.id,
                                curitems: items,
                                shown: ["physicalMeaning", "valueType", "sortOrder", "unit","earlyWarningValue"],
                                defaultvalue: [
                                    { key: "physicalMeaning", value: items.physicalMeaning },
                                    { key: "valueType", value: items.valueType },
                                    { key: "sortOrder", value: items.sortOrder },
                                    { key: "unit", value: items.unit },
                                    { key: "parameterValueList", value: items.parameterValueList },
                                    { key: "earlyWarningValue", value: items.earlyWarningValue },
                                    { key: "secondParameterType", value: items.secondParameterType },
                                ]
                            })

                        }}>修改</a>
                        <Divider type='vertical'></Divider>
                        <Popconfirm
                            okText="确认"
                            cancelText="取消"
                            placement="bottomRight"
                            title={"确认删除该参数？"}
                            onConfirm={() => {
                                this.setNewState("parameterdeleteById", { id: items.id }, () => {
                                    message.success("删除成功");
                                    this.setNewState("queryAll", { dataGatewayId: this.state.secondRowKeys[0] ? this.state.secondRowKeys[0] : this.state.curitem.id }, () => {
                                    })
                                })
                            }}>
                            <a style={{ color: "#ff4800" }}>删除</a>
                        </Popconfirm>


                    </div>
                },
            ];

            return <Table columns={columns} dataSource={record.secodeParameterList} pagination={false} />;
        };
        return (
            <div>
                <Modal
                    width={"80%"}
                    title={this.state.type ? this.state.type.indexOf("add") !== -1 ? "新增" : "修改" : ""}
                    visible={this.state.type}
                    onCancel={() => {
                        this.setState({
                            type: ""
                        })
                    }}
                    footer={null}
                >
                    {
                        this.state.type && <WrappedDynamicFieldSet
                            queryByEquipmentId={this.props.datagate.queryByEquipmentId}
                            type={this.state.type}
                            secondParameterType={this.state.secondParameterType}
                            defaultvalue={this.state.defaultvalue}
                            shown={this.state.shown}
                            submitForm={(values) => {
                                if (this.state.type == "add") {
                                    this.setNewState("parametersave", { ...values, dataGatewayId:this.state.curitem.id }, () => {
                                        message.success("新增成功")
                                        this.setNewState("queryAll", { dataGatewayId: this.state.curitem.id }, () => {
                                            this.setState({
                                                type: ""
                                            })
                                        })
                                    })
                                } else if (this.state.type == "edit") {
                                    this.setNewState("parametersave", { ...values, dataGatewayId: this.state.secondRowKeys[0] ? this.state.secondRowKeys[0] : this.state.curitem.id, id: this.state.cursecon.id }, () => {
                                        message.success("修改成功")
                                        this.setNewState("queryAll", { dataGatewayId: this.state.secondRowKeys[0] ? this.state.secondRowKeys[0] : this.state.curitem.id }, () => {
                                            this.setState({
                                                type: ""
                                            })
                                        })
                                    })
                                } else if (this.state.type == "addchild") {
                                    this.setNewState("parametersaveSecondLevel", { ...values, parentId: this.state.cursecon.id }, () => {
                                        message.success("添加成功")
                                        this.setNewState("queryAll", { dataGatewayId: this.state.secondRowKeys[0] ? this.state.secondRowKeys[0] : this.state.curitem.id }, () => {
                                            this.setState({
                                                type: ""
                                            })
                                        })
                                    })
                                } else if (this.state.type == "editchild") {
                                    this.setNewState("parametersaveSecondLevel", {
                                        ...values,
                                        parentId: this.state.curitems.parentId,
                                        id: this.state.curitems && this.state.curitems.id
                                    }, () => {
                                        message.success("修改成功")
                                        this.setNewState("queryAll", { dataGatewayId: this.state.secondRowKeys[0] ? this.state.secondRowKeys[0] : this.state.curitem.id }, () => {
                                            this.setState({
                                                type: ""
                                            })
                                        })
                                    })
                                }
                            }}></WrappedDynamicFieldSet>

                    }
                </Modal>


                <SearchBox onRef={this.onRefs} handleSearch={this.handleSearch} postData={this.state.postData}></SearchBox>
                <Card title='数据网关列表' extra={
                    <div/>      
                    /*<div>
                        <a onClick={() => {
                            this.setState({
                                iftype: {
                                    name: "新增",
                                    value: "add"
                                },
                                fv: true
                            })
                        }}>新增</a>
                        <span style={{ display: curitem.id ? "inline-block" : "none" }}>
                            <Divider type="vertical"></Divider>
                            <a onClick={() => {
                                let arrurl = curitem.pictureUrl ? curitem.pictureUrl.split(".") : ["demo", "png"];
                                this.setState({
                                    fv: true,
                                    iftype: {
                                        name: "修改传感器",
                                        value: "edit"
                                    },
                                    fields: {
                                        name: {
                                            ...fields.name,
                                            value: curitem.name,
                                        },
                                        model: {
                                            ...fields.model,
                                            value: curitem.model,
                                        },
                                        manufactory: {
                                            ...fields.manufactory,
                                            value: curitem.manufactory,
                                        }
                                    },
                                })
                            }}>修改</a>
                            <Divider type="vertical"></Divider>
                            <Popconfirm
                                okText="确认"
                                cancelText="取消"
                                placement="bottomRight"
                                title={"确认删除该传感器？"}
                                onConfirm={() => {
                                    this.setNewState("datagatedelete", { id: curitem.id }, () => {
                                        let total = this.props.datagate.datagatequery.total,
                                            page = this.props.datagate.datagatequery.pageNum;
                                        if ((total - 1) % 9 == 0) {
                                            page = page - 1
                                        }

                                        this.setState({
                                            postData: { ...this.state.postData, pageIndex: page }
                                        }, () => {
                                            this.setNewState("datagatequery", postData, () => {
                                                message.success("删除成功！");
                                            });
                                        })
                                    })
                                }}>
                                <a style={{ color: "#ff4800" }}>删除</a>
                            </Popconfirm>
                        </span>
                    </div> */
                }>
                    <Table size="middle"
                        loading={this.props.submitting}
                        onRow={record => {
                            return {
                                onClick: event => {
                                    this.setState({ curitem: record });
                                }, // 点击行
                            };
                        }}
                        rowClassName={(record, index) => rowClassNameFn(record, index)}
                        pagination={{
                            showTotal: total => `共${total}条`, // 分页
                            size: "small",
                            pageSize: 9,
                            showQuickJumper: true,
                            current: datagatequery.pageNum ? datagatequery.pageNum : 1,
                            total: datagatequery.total ? parseInt(datagatequery.total) : 1,
                            onChange: pageChange,
                        }}
                        rowKey='id'
                        columns={columns}
                        dataSource={datagatequery.list ? datagatequery.list : []}
                        expandedRowRender={renderAdd}
                        expandedRowKeys={this.state.secondRowKeys ? this.state.secondRowKeys : []}
                        onExpand={(expanded, record) => {
                            this.setState({
                                secondRowKeys: expanded ? [record.id] : [],
                            }, () => {
                                this.setNewState("queryAll", { dataGatewayId: record.id }, () => {
                                })
                            })
                        }}
                    >
                    </Table>

                    <CreateForm
                        width={1000}
                        col={{ xs: 24, sm: 24, md: 12, lg: 12, xl: 12, xxl: 12 }}
                        fields={fields}
                        iftype={iftype}
                        onChange={this.handleFormChange}
                        wrappedComponentRef={this.saveFormRef}
                        visible={fv}
                        onCancel={this.handleCancel}
                        onCreate={this.handleCreate}
                    />

                </Card>
            </div>
        )
    }


}

export default DataGateList



