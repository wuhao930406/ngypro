import {
  Table, Input, InputNumber, Popconfirm, Form, Divider, Modal, Tree, Button, Row, Col, Icon, Select, Alert, Tag, message, Card
} from 'antd';
let id = 0;

class DynamicFieldSet extends React.Component {

  state = {
    keys: []
  }

  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = this.state.keys;
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }
    // can use data-binding to set
    this.setState({
      keys: keys.filter(key => key.key !== k),
    });
  };

  add = () => {
    // can use data-binding to get
    const keys = this.state.keys;
    const nextKeys = keys.concat([{ key: id++, value: "", physicalMeaning: "" }]);
    // can use data-binding to set
    // important! notify form to detect changes
    this.setState({
      keys: nextKeys,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { keys, physicalMeanings, value } = values;

        let parameterValueList = this.state.keys.map((item, i) => {
          return {
            physicalMeaning: item.physicalMeaning,
            value: item.value
          }
        })

        values.parameterValueList = parameterValueList
        console.log('Received values of form: ', values);
        this.props.submitForm(values)


      }
    });
  };


  componentDidMount() {
this.props.ensureDidMount&&this.props.ensureDidMount()
    setTimeout(() => {
      if (this.props.defaultvalue) {
        const { setFieldsValue } = this.props.form;
        let parameterValueList = {}
        this.props.defaultvalue.map((item, i) => {
          if (item.key == "parameterValueList") {
            parameterValueList = item
          } if (item.key == "earlyWarningValue") {
            setTimeout(() => {
              setFieldsValue({
                [item.key]: item.value && item.value.toString(),
              })
            }, 200)
          } else {
            setFieldsValue({
              [item.key]: item.value && item.value.toString(),
            })
          }
        })
        let keys = [];

        parameterValueList.value && parameterValueList.value.map((item, i) => {
          let ios = "ios" + i;
          keys.push({
            key: ios,
            value: item.value,
            physicalMeaning: item.physicalMeaning
          })
        })
        this.setState({
          keys
        })
      }
    }, 60)

  }

  componentWillReceiveProps(np) {
    setTimeout(() => {
      if (this.props.defaultvalue && this.props.defaultvalue !== np.defaultvalue) {
        const { setFieldsValue } = this.props.form;
        let parameterValueList = {}
        np.defaultvalue.map((item, i) => {
          if (item.key == "parameterValueList") {
            parameterValueList = item
          } else {
            setFieldsValue({
              [item.key]: item.value && item.value.toString() + "",
            })
          }
        })
        let keys = [];
        console.log(parameterValueList)
        parameterValueList.value && parameterValueList.value.map((item, i) => {
          let ios = "ios" + i;
          keys.push({
            key: ios,
            value: item.value,
            physicalMeaning: item.physicalMeaning
          })
        })
        this.setState({
          keys
        })
      }

    }, 60)


  }


  render() {
    const { getFieldDecorator, getFieldValue, resetFields } = this.props.form; let { shown, type } = this.props;
    shown = shown ? shown : ["parameterType", "physicalMeaning", "valueType", 'secondParameterType', "parameterKey", "sortOrder", "isUse", "unit", "earlyWarningValue", "secondNameKey"]
    const keys = this.state.keys;
    const formItems = keys.map((k, index) => (
      <Row gutter={18} style={{ height: index == "0" ? 64 : 34, marginBottom: 12 }}>
        <Col span={6}>
          {
            index == 0 && <label style={{ paddingBottom: 8, display: "block" }}><i style={{ color: "red" }}>*</i> 参数值</label>
          }
          <Input placeholder="参数值" value={k.value ? k.value : null} onChange={(e) => {
            let newkeys = this.state.keys.map((item) => {
              if (item.key == k.key) {
                item.value = e.target.value
              }
              return item
            })
            this.setState({
              keys: newkeys
            })
          }} style={{ width: '100%', marginRight: 8 }} />
        </Col>
        <Col span={17}>
          {
            index == 0 && <label style={{ paddingBottom: 8, display: "block" }}><i style={{ color: "red" }}>*</i> 物理含义</label>
          }
          <Input placeholder="物理含义" value={k.physicalMeaning ? k.physicalMeaning : null} onChange={(e) => {
            let newkeys = this.state.keys.map((item) => {
              if (item.key == k.key) {
                item.physicalMeaning = e.target.value
              }
              return item
            })
            this.setState({
              keys: newkeys
            })
          }} style={{ width: '100%', marginRight: 8 }} />
        </Col>
        <Col span={1} style={{ display: "flex", alignItems: "flex-end", height: index == "0" ? 51 : 23 }}>
          {keys.length > 1 ? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              onClick={() => this.remove(k.key)}
            />
          ) : null}
        </Col>
      </Row>

    ));
    return (
      <div style={{ backgroundColor: "#f0f0f0", padding: "12px 24px" }}>
        <Form onSubmit={this.handleSubmit}>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {
              shown.indexOf("parameterType") !== -1 && <div style={{ width: "50%", padding: "0 6px" }}>
                <Form.Item label={"参数类型"}>
                  {getFieldDecorator(`parameterType`, {
                    validateTrigger: ['onChange'],
                    rules: [
                      {
                        required: true,

                        message: "请输入参数类型",
                      },
                    ],
                  })(<Select placeholder="参数类型" style={{ width: '100%', marginRight: 8 }} >
                    {
                      this.props.queryByEquipmentId.parameterTypeList &&
                      this.props.queryByEquipmentId.parameterTypeList.map((item, i) => {
                        return <Option value={item.dicKey.toString()}>{item.dicName}</Option>
                      })
                    }
                  </Select>)}
                </Form.Item>
              </div>
            }

            {
              shown.indexOf("physicalMeaning") !== -1 && <div style={{ width: "50%", padding: "0 6px" }}>
                <Form.Item label={"物理含义"}>
                  {getFieldDecorator(`physicalMeaning`, {
                    validateTrigger: ['onChange'],
                    rules: [
                      {
                        required: true,

                        message: "请输入物理含义",
                      },
                    ],
                  })(<Input placeholder="物理含义" style={{ width: '100%', marginRight: 8 }} />)}
                </Form.Item>
              </div>
            }
            {
              shown.indexOf("valueType") !== -1 && <div style={{ width: "50%", padding: "0 6px" }}>
                <Form.Item label={"数值类型"}>
                  {getFieldDecorator(`valueType`, {
                    validateTrigger: ['onChange'],
                    rules: [
                      {
                        required: true,

                        message: "请输入数值类型",
                      },
                    ],
                  })(<Select placeholder="数值类型" style={{ width: '100%', marginRight: 8 }} >
                    {
                      this.props.queryByEquipmentId.valueTypeList &&
                      this.props.queryByEquipmentId.valueTypeList.map((item, i) => {
                        return <Option value={item.dicKey.toString()}>{item.dicName}</Option>
                      })
                    }
                  </Select>)}
                </Form.Item>

              </div>
            }

            {
              shown.indexOf("secondParameterType") !== -1 && getFieldValue("parameterType") == 2 ? <div style={{ width: "50%", padding: "0 6px" }}>
                <Form.Item label={"二级参数类型"}>
                  {getFieldDecorator(`secondParameterType`, {
                    validateTrigger: ['onChange'],
                    rules: [
                      {
                        required: getFieldValue("parameterType") == "2",

                        message: "请选择二级参数类型",
                      },
                    ],
                  })(<Select placeholder="二级参数类型" style={{ width: '100%', marginRight: 8 }} >
                    {
                      this.props.queryByEquipmentId.secondParameterTypeList &&
                      this.props.queryByEquipmentId.secondParameterTypeList.map((item, i) => {
                        return <Option value={item.dicKey.toString()}>{item.dicName}</Option>
                      })
                    }
                  </Select>)}
                </Form.Item>

              </div> : null
            }
            {
              shown.indexOf("secondNameKey") !== -1 && getFieldValue("secondParameterType") == "1" || shown.indexOf("secondNameKey") !== -1 && getFieldValue("secondParameterType") == "2" ? <div style={{ width: "50%", padding: "0 6px" }}>
                <Form.Item label={"secondNameKey"}>
                  {getFieldDecorator(`secondNameKey`, {
                    validateTrigger: ['onChange'],
                    rules: [
                      {
                        required: false,
                      },
                    ],
                  })(<Input placeholder="secondNameKey" style={{ width: '100%', marginRight: 8 }} />)}
                </Form.Item>
              </div> : null
            }

            {
              shown.indexOf("parameterKey") !== -1 && <div style={{ width: "50%", padding: "0 6px" }}>
                <Form.Item label={"参数key"}>
                  {getFieldDecorator(`parameterKey`, {
                    validateTrigger: ['onChange'],
                    rules: [
                      {
                        required: this.props.secondParameterType == 3 ? false : true,
                        message: "请输入参数key",
                      },
                    ],
                  })(<Input placeholder="参数key" style={{ width: '100%', marginRight: 8 }} />)}
                </Form.Item>
              </div>
            }

            {
              shown.indexOf("sortOrder") !== -1 && <div style={{ width: "50%", padding: "0 6px" }}>
                <Form.Item label={"排序"}>
                  {getFieldDecorator(`sortOrder`, {
                    validateTrigger: ['onChange'],
                    rules: [
                      {
                        required:  this.props.secondParameterType == 3 ? true : false,
                        message: "请输入排序",
                      },
                    ],
                  })(<InputNumber placeholder="排序" min={0} style={{ width: '100%', marginRight: 8 }} />)}
                </Form.Item>
              </div>
            }
            {
              shown.indexOf("isUse") !== -1 && <div style={{ width: "50%", padding: "0 6px" }}>
                <Form.Item label={"是否启用"}>
                  {getFieldDecorator(`isUse`, {
                    validateTrigger: ['onChange'],
                    rules: [
                      {
                        required: true,
                        message: "请选择是否启用",
                      },
                    ],
                  })(<Select placeholder="是否启用" style={{ width: '100%', marginRight: 8 }} >
                    <Option value={0}>否</Option>
                    <Option value={1}>是</Option>
                  </Select>)}
                </Form.Item>
              </div>
            }
            {
              shown.indexOf("unit") !== -1 && <div style={{ width: "50%", padding: "0 6px" }}>
                <Form.Item label={"单位"}>
                  {getFieldDecorator(`unit`, {
                    validateTrigger: ['onChange'],
                    rules: [
                      {
                        required: false,
                      },
                    ],
                  })(<Input placeholder="单位" style={{ width: '100%', marginRight: 8 }} />)}
                </Form.Item>
              </div>
            }



          </div>
          {
            shown.indexOf("earlyWarningValue") !== -1 && getFieldValue('parameterType') == "1" && getFieldValue('valueType') == "2" || type.indexOf("child") !== -1 && getFieldValue('valueType') == "2" && shown.indexOf("earlyWarningValue") !== -1 ? <div style={{ width: "50%", padding: "0 6px" }}>
              <Form.Item label={"高亮预警值"}>
                {getFieldDecorator(`earlyWarningValue`, {
                  validateTrigger: ['onChange'],
                  rules: [
                    {
                      required: false,
                    },
                  ],
                })(<Input placeholder="高亮预警值" style={{ width: '100%', marginRight: 8 }} />)}
              </Form.Item>
            </div> : null
          }


          {getFieldValue('parameterType') == "1" && getFieldValue('valueType') == "2" ? formItems : type.indexOf("child") !== -1 && getFieldValue('valueType') == "2" ? formItems : null}
          {getFieldValue('parameterType') == "1" && getFieldValue('valueType') == "2" ?
            <Form.Item>
              <Button type="ghost" onClick={this.add} style={{ width: '100%' }}>
                <Icon type="plus" /> 添加参数
                </Button>
            </Form.Item> : type.indexOf("child") !== -1 && getFieldValue('valueType') == "2" ?
              <Form.Item>
                <Button type="ghost" onClick={this.add} style={{ width: '100%' }}>
                  <Icon type="plus" /> 添加参数
                  </Button>
              </Form.Item> :
              null
          }
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item>
                <Button type="default" htmlType="reset" style={{ width: '100%', marginLeft: 7 }} onClick={() => {
                  resetFields()
                }}>
                  重置
                  </Button>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '100%', marginRight: 7 }}>
                  提交
                  </Button>
              </Form.Item></Col>
          </Row>

        </Form>
      </div>

    );
  }
}

const WrappedDynamicFieldSet = Form.create({ name: 'dynamic_form_item' })(DynamicFieldSet);

export default WrappedDynamicFieldSet