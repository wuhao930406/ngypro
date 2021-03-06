/**
 * Created by 11485 on 2019/3/8.
 */
import {
  Button, Modal, Form, Input, Radio, DatePicker, Select, Row, Col, InputNumber, Table, Upload, message, Icon, Spin, TreeSelect
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';

const { TreeNode } = TreeSelect;
let { Option } = Select;


@connect(({ publicmodel, loading }) => ({
  publicmodel,
  loading
}))
class FormToDo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      postData: [],
      loading: false,
      formData: {}
    }
  }

  componentWillMount() {
    this.props.tableUrl ?
      this.props.tableUrl.map((item, i) => {
        this.setNewState(item.url, item.post, () => {
          let { postData } = this.state;
          postData[i] = item.post;
          this.setState({
            postData
          })
        })
      }) : null
  }
  componentDidMount() {

    this.props.onRef ?
      this.props.onRef(this) :
      null
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

  componentWillReceiveProps(nextProps) {
    if (!nextProps.visible) {
      this.setState({
        formData: {}
      })
    }
  }

  pageChange = (page, posturl) => {
    let { postData } = this.state;
    let cur = 0;
    this.props.tableUrl ?
      this.props.tableUrl.map((item, i) => {
        if (item.url == posturl) {
          cur = i
        }
      }) : null
    postData[cur] = { ...postData[cur], pageIndex: page }
    this.setState(
      {
        postData,
      },
      () => {
        this.setNewState(posturl, this.state.postData[cur]);
      },
    );
  };

  changedData = (url, post, index, fn) => {
    let postData = this.state.postData;
    postData[index] = post
    this.setState({
      postData
    }, () => {
      this.setNewState(url, post, () => {
        fn ? fn() : null
      });
    })
  }

  normFile = (info, { multiple, keys }) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      let dataList = [];
      if (multiple) {
        dataList = info.fileList.map((item, i) => {
          return {
            url: item.response && item.response.data.dataList[0],
            name: item.name
          }
        })
      } else {
        dataList = [
          {
            url: info.file.response.data.dataList,
            name: info.file.name,
          }
        ];
      }


      let fileList = dataList.map((item, i) => {
        return {
          ...item,
          uid: moment().valueOf() + i,
          status: 'done',
        }
      })

      this.setState({ loading: false }, () => {
        let fields = {};
        fields[keys] = fileList;
        this.setState({
          formData: fields
        })
      });
    } else {
    }
    return info.fileList
  };

  loop = data => data.map(item => {
    const title = <span>{item.title}</span>;
    if (item.children) {
      return (
        <TreeNode value={item.key} key={item.key} title={title} icon={<Icon type="edit" />}>
          {this.loop(item.children)}
        </TreeNode>
      );
    } else {
      return <TreeNode value={item.key} key={item.key} title={title} icon={<Icon type="edit" />} />;
    }
  });


  render() {
    const {
      visible, onCancel, onCreate, form, render, iftype, btntext, fields, width, col, onSelectChange, confirmLoading
    } = this.props;
    const { getFieldDecorator } = form;

    const getCol = (itemcol) => {
      if (itemcol) {
        return itemcol
      } else {
        return col
      }

    }
    let Dom = []
    for (let i in fields) {
      Dom.push(fields[i])
    }

    function beforeUpload(file, uploadtype) {
      let isJPG;
      if (uploadtype == "image") {
        let arr = ["jpg", "jpeg", "png", "gif", "bmp", "wbmp"];
        let ifs = arr.filter((item, i) => { return file.type.indexOf(item) == -1 })
        isJPG = ifs.length != arr.length;
      } else {
        isJPG = true
      }
      if (!isJPG) {
        message.error('只能上传图片格式,且支持的格式有：JPG,JPEG,PNG,GIF,BMP,WBMP');
      }
      const isLt2M = file.size / 1024 / 1024 < 100;
      if (!isLt2M) {
        message.error('文件必须小于100MB!');
      }

      return isJPG && isLt2M;
    }


    return (
      <Modal
        style={{ maxWidth: "90%", top: 20 }}
        width={width}
        visible={visible}
        title={iftype ? iftype.name : ''}
        okText={btntext ? btntext : "确定"}
        onCancel={onCancel}
        onOk={() => {
          this.setState({
            loading: true
          })
          setTimeout(() => {
            this.setState({
              loading: false
            })
          }, 1000)
          onCreate()
        }}
        confirmLoading={confirmLoading||this.state.loading}
      >
        <div style={{ maxHeight: "80vh", overflowY: "auto", overflowX: "hidden", margin: "-14px -10px", padding: "0 10px" }}>
          {
            <Form>
              <Row gutter={24}>
                {
                  Dom.map((item, i) => {
                    if (item.type == 'input') {
                      return (
                        !item.hides ?
                          <Col key={i}  {...getCol(item.col)}>
                            <Form.Item style={{ marginBottom: 12 }} label={item.title}>
                              {getFieldDecorator(item.keys, {
                                rules: [{ required: item.requires, message: `请输入${item.title}` },
                                item.keys.indexOf("phone") != -1 ?
                                  {
                                    pattern: /^\d{11}$/,
                                    message: "手机号格式不正确",
                                  } :
                                  item.keys.indexOf("mail") != -1 ?
                                    {
                                      pattern: /^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-z]{2,}$/,
                                      message: "邮箱格式不正确",
                                    } : {}
                                ],
                              })(
                                <Input maxLength={100} disabled={item.disabled} />
                              )}
                            </Form.Item>
                          </Col> : null
                      )
                    } else if (item.type == 'textarea') {
                      return (
                        !item.hides ?
                          <Col key={i} {...getCol(item.col)} >
                            <Form.Item style={{ marginBottom: 12 }} label={item.title}>
                              {getFieldDecorator(item.keys, item.requires ? {
                                rules: [{ required: true, message: `请输入${item.title}` }],
                              } : {})(
                                <Input.TextArea maxLength={600} rows={4} disabled={item.disabled} />
                              )}
                            </Form.Item>
                          </Col> : null
                      )
                    } else if (item.type == 'select') {
                      return (
                        !item.hides ?
                          <Col key={i}  {...getCol(item.col)}>
                            <Form.Item style={{ marginBottom: 12 }} label={item.title}>
                              {getFieldDecorator(item.keys, item.requires ? {
                                rules: [{ required: true, message: `请输入${item.title}` }],
                              } : {})(
                                <Select allowClear
                                  placeholder="请选择"
                                  style={{ width: "100%" }}
                                  showSearch mode={item.multiple ? "multiple" : ""}
                                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} disabled={item.disabled}>
                                  {
                                    item.option ?
                                      item.option.map((it, n) => {
                                        return (<Option key={n} value={it.id}>{it.name}</Option>)

                                      })
                                      : null
                                  }
                                </Select>

                              )}
                            </Form.Item>
                          </Col> : null
                      )

                    } else if (item.type == 'datepicker') {
                      return (
                        !item.hides ?
                          <Col key={i}  {...getCol(item.col)}>
                            <Form.Item style={{ marginBottom: 12 }} label={item.title}>
                              {getFieldDecorator(item.keys, item.requires ? {
                                rules: [{ required: true, message: `请输入${item.title}` }],
                              } : {})(
                                <DatePicker disabledDate={item.disabledDate ? item.disabledDate : null} disabledTime={item.disabledDateTime ? item.disabledDateTime : null} style={{ width: "100%" }} showTime={item.showTime} disabled={item.disabled} />
                              )}
                            </Form.Item>
                          </Col> : null
                      )
                    } else if (item.type == 'inputnumber') {
                      return (
                        !item.hides ?
                          <Col key={i}  {...getCol(item.col)}>
                            <Form.Item style={{ marginBottom: 12 }} label={item.title}>
                              {getFieldDecorator(item.keys, item.requires ? {
                                rules: [{ required: true, message: `请输入${item.title}` }],
                              } : {})(
                                <InputNumber style={{ width: "100%" }} disabled={item.disabled} min={0} />
                              )}
                            </Form.Item>
                          </Col> : null
                      )
                    } else if (item.type == 'table') {
                      let allData = this.props.publicmodel[item.dataSource];
                      return (
                        !item.hides ?
                          <Col key={i}  {...getCol(item.col)}>
                            <Form.Item style={{ marginBottom: 0 }} label={<span>{item.title}</span>}>
                              {getFieldDecorator(item.keys, item.requires ? {
                                rules: [{ required: true, message: `请选择${item.title}` }],
                              } : {})(
                                <Select disabled showSearch filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} mode="multiple" allowClear>
                                  {
                                    allData.list ?
                                      allData.list.map((itz) => (
                                        <Option key={itz[item.dv]} value={itz[item.dv]}>
                                          {itz[item.lb]}
                                        </Option>
                                      )) : ""

                                  }
                                </Select>
                              )}
                            </Form.Item>
                            <Table size="middle"
                              loading={this.props.loading.effects['publicmodel/' + item.dataSource]}
                              columns={item.columns}
                              dataSource={allData.list ? allData.list : []}
                              rowSelection={{
                                selectedRowKeys: item.value,
                                onChange: (selectkey) => this.props.onSelectChange(selectkey, item.keys),
                                type: item.checktype ? item.checktype : "checkbox"
                              }}
                              rowKey={item.dv}
                              pagination={{
                                showTotal: total => `共${total}条`,
                                size: 'small',
                                showQuickJumper: true,
                                pageSize: 9,
                                current: allData.pageNum ? allData.pageNum : 1,
                                total: allData.total ? parseInt(allData.total) : 1,
                                onChange: (page) => this.pageChange(page, item.dataSource),
                              }}

                            />
                          </Col> : null
                      )
                    } else if (item.type == 'tablenopage') {
                      let allData = this.props.publicmodel[item.dataSource];
                      return (
                        !item.hides ?
                          <Col key={i} {...getCol(item.col)}>
                            <Form.Item style={{ marginBottom: 0 }} label={<span>{item.title}</span>}>
                              {getFieldDecorator(item.keys, item.requires ? {
                                rules: [{ required: true, message: `请选择${item.title}` }],
                              } : {})(
                                <Select showSearch filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0} mode="multiple" allowClear>
                                  {
                                    allData ?
                                      allData.map((itz) => (
                                        <Option key={itz[item.dv]} value={itz[item.dv]}>
                                          {itz[item.lb]}
                                        </Option>
                                      )) : ""

                                  }
                                </Select>
                              )}
                            </Form.Item>
                            <Table size="middle"
                              loading={this.props.loading.effects['publicmodel/' + item.dataSource]}
                              columns={item.columns}
                              dataSource={allData ? allData : []}
                              rowSelection={{
                                selectedRowKeys: item.value,
                                onChange: (selectkey) => this.props.onSelectChange(selectkey, item.keys),
                                type: item.checktype ? item.checktype : "checkbox"
                              }}
                              rowKey={item.dv}
                              pagination={{
                                showTotal: total => `共${total}条`,
                                size: 'small',
                                showQuickJumper: true,
                                pageSize: 9,
                              }}
                            />
                          </Col> : null
                      )
                    }
                    else if (item.type == 'upload') {
                      return (
                        !item.hides ?
                          <Col key={i}  {...getCol(item.col)}>
                            <div style={{ marginBottom: -12 }}>
                              <Form.Item style={{ marginBottom: 12 }} label={item.title} extra={<span>{item.defaultval && item.defaultval.map((its, is) => (<a target="_blank" href={its.url} key={is}>{its.name}</a>))}</span>}>
                                {getFieldDecorator(item.keys, item.requires ? {
                                  rules: [{ required: true, message: `请输入${item.title}` }],
                                  getValueFromEvent: (info) => this.normFile(info, item),
                                } : {
                                    getValueFromEvent: (info) => this.normFile(info, item),
                                  })(
                                    <Upload.Dragger
                                      multiple={item.multiple}
                                      showUploadList={false}
                                      style={{ width: "100%" }}
                                      action={
                                        item.uploadtype == "file" ? "/ngy/common/uploadFile" :
                                          item.uploadtype == "image" ? "/ngy/common/uploadImg" : ""
                                      }
                                      beforeUpload={(file) => beforeUpload(file, item.uploadtype)}
                                    >
                                      <Spin size="small" spinning={this.state.loading}>
                                        <p className="ant-upload-drag-icon">
                                          <Icon type="inbox" />
                                        </p>
                                        <p className="ant-upload-text">点击该区域或拖拽文件至此区域</p>
                                        <p className="ant-upload-hint">
                                          {item.multiple ? "该区域可上传多个文件" : "该区域可上传1个文件"}
                                        </p>
                                      </Spin >
                                    </Upload.Dragger >
                                  )}
                              </Form.Item>
                            </div>
                            <div style={{ marginTop: -30 }}>
                              {
                                this.state.formData[item.keys] ?
                                  this.state.formData[item.keys].map((item, i) => (<a key={i} style={{ display: "block", margin: "0px 0px 4px 0px" }}
                                    href={item.url} target='_blank'>{item.name}</a>)) :
                                  null
                              }
                            </div>

                          </Col> : null
                      )
                    } else if (item.type == 'uploads') {
                      return (
                        !item.hides ?
                          <Col key={i}  {...getCol(item.col)}>
                            <div style={{ marginBottom: -12 }}>
                              <Form.Item style={{ marginBottom: 12 }} label={item.title} extra={<span>{item.defaultval && item.defaultval.map((its, is) => (<a target="_blank" href={its.url} key={is}>{its.name}</a>))}</span>}>
                                {getFieldDecorator(item.keys, item.requires ? {
                                  rules: [{ required: true, message: `请输入${item.title}` }],
                                  getValueFromEvent: (info) => this.normFile(info, item),
                                } : {
                                    getValueFromEvent: (info) => this.normFile(info, item),
                                  })(
                                    <Upload.Dragger
                                      multiple={item.multiple}
                                      style={{ width: "100%" }}
                                      action={
                                        item.uploadtype == "file" ? "/ngy/common/uploadFile" :
                                          item.uploadtype == "image" ? "/ngy/common/uploadImg" : ""
                                      }
                                      beforeUpload={(file) => beforeUpload(file, item.uploadtype)}
                                    >
                                      <Spin size="small" spinning={this.state.loading}>
                                        <p className="ant-upload-drag-icon">
                                          <Icon type="inbox" />
                                        </p>
                                        <p className="ant-upload-text">点击该区域或拖拽文件至此区域</p>
                                        <p className="ant-upload-hint">
                                          {item.multiple ? "该区域可上传多个文件" : "该区域可上传1个文件"}
                                        </p>
                                      </Spin >
                                    </Upload.Dragger >
                                  )}
                              </Form.Item>
                            </div>
                          </Col> : null
                      )
                    } else if (item.type == 'treeselect') {
                      return (
                        !item.hides ?
                          <Col key={i}  {...getCol(item.col)}>
                            <Form.Item style={{ marginBottom: 12 }} label={item.title}>
                              {getFieldDecorator(item.keys, item.requires ? {
                                rules: [{ required: true, message: `请输入${item.title}` }],
                              } : {})(
                                <TreeSelect
                                  style={{ width: "100%" }}
                                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                  disabled={item.disabled}
                                  allowClear
                                  treeDefaultExpandAll
                                  placeholder={`请选择...`}
                                >
                                  {
                                    item.option &&
                                    this.loop(item.option)
                                  }
                                </TreeSelect>
                              )}
                            </Form.Item>
                          </Col> : null
                      )

                    }

                  })
                }
              </Row>
            </Form>
          }
        </div>

      </Modal>
    );
  }
}
const CreateForm = Form.create({
  name: 'form_in_modal',
  onFieldsChange(props, changedFields) {
    props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    let fields = props.fields, data = {}
    for (let i in fields) {
      data[i] = Form.createFormField({
        ...fields[i],
        value: fields[i].value,
      })
    }
    return data
  },
  onValuesChange(_, values) {
  }
})(FormToDo);

export default CreateForm

