import { Tree, Input } from 'antd';
import styles from './style.less';
const { TreeNode } = Tree;
const { Search } = Input;

const x = 3;
const y = 2;
const z = 1;

const dataList = [];
const generateList = data => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const { key, title } = node;
    dataList.push({ key, title: title });
    if (node.children) {
      generateList(node.children);
    }
  }
};

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

export default class TreeShown extends React.Component {
  constructor(props) {
    super(props);
  

    this.state = {
      expandedKeys:[],
      searchValue: '',
      autoExpandParent: true,
    };
  }

  componentDidMount(){
    generateList(this.props.gData);
    const expandedKeys = dataList.map(item => {
      if (item.title.indexOf("") > -1) {
        return getParentKey(item.key, this.props.gData);
      }
      return null;
    });
    console.log()
    this.setState({
      expandedKeys
    })

  }


  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onChange = e => {
    const { value } = e.target;

    generateList(this.props.gData);
    const expandedKeys = dataList.map(item => {
      if (item.title.indexOf(value) > -1) {
        return getParentKey(item.key, this.props.gData);
      }
      return null;
    });



    this.setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });
  };

  render() {
    const { searchValue, expandedKeys, autoExpandParent } = this.state;
    const loop = data =>
      data.map(item => {
        const index = item.title.indexOf(searchValue);
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + searchValue.length);
        let { value, valueName } = item;
        const title =
          index > -1 ? (
            <div>
              <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                <span>
                  {beforeStr}
                  <span style={{ color: '#f50' }}>{searchValue}</span>
                  {afterStr}
                </span>
                <img style={{ width: 12, margin: "0px 2px 0 6px" }} src={item.connect !== 0 ? "./images/green.png" : "./images/red.png"} alt="" />
                <div style={{ overflow: "hidden" }}>
                  {
                    item.earlyWarning && <div style={{ position: "relative", height: 19, marginLeft: 4, width: 40 }}>
                      <img className={styles.rotate} src="./images/warn_0.png" alt="" />
                      <img className={styles.bgimg} src="./images/warn_1.png" alt="" />
                    </div>
                  }
                </div>


              </div>
              <div style={{ color: "#999" }}>
                值：{valueName ? `${valueName}` : value ? `${value}` : "暂无"}
              </div>
            </div>
          ) : (
              <div>
                <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                  <span>{item.title}</span>
                  <img style={{ width: 12, margin: "0px 2px 0 6px" }} src={item.connect !== 0 ? "./images/green.png" : "./images/red.png"} alt="" />
                  <div style={{ overflow: "hidden" }}>
                    {
                      item.earlyWarning && <div style={{ position: "relative", height: 19, marginLeft: 4, width: 40 }}>
                        <img className={styles.rotate} src="./images/warn_0.png" alt="" />
                        <img className={styles.bgimg} src="./images/warn_1.png" alt="" />
                      </div>
                    }
                  </div>

                </div>
                <div style={{ color: "#999" }}>
                  值：{valueName ? `${valueName}` : value ? `${value}` : "暂无"}
                </div>

              </div>

            );
        if (item.children) {
          return (
            <TreeNode key={item.key} title={title}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode key={item.key} title={title} />;
      });
    return (
      <div>
        <Search style={{ marginBottom: 8 }} placeholder="搜索参数名称" onChange={this.onChange} />
        <Tree
          onExpand={this.onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          defaultExpandAll={true}
        >
          {loop(this.props.gData)}
        </Tree>
      </div>
    );
  }
}

