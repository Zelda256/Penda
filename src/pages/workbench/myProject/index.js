import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Radio, Select, Input, Row, Col } from 'antd';
import styles from './index.less';
import Waterfall from './components/Waterfall';

const Option = Select.Option;
const Search = Input.Search;

@connect(({ myProjects }) => ({
  projects: myProjects.projects,
}))
class MyProject extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showType: 'waterfallType',
      orderType: 'emergency',
      projects: [],
    };
  }
  handleShowTypeChange = (e) => {
    this.setState({ showType: e.target.value });
  }
  handleshowOrderChange = (value) => {
    this.setState({ orderType: value });
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.projects && nextProps.projects !== prevState.projects) {
      console.log('???413', nextProps.projects);
      return {
        projects: nextProps.projects
      }
    }
    return null;
  }
  render() {
    const { showType, orderType, projects } = this.state;
    // 统计 进行中&未开始&已完成 的项目
    const processing = [], notStarted = [], finished = [];
    projects.forEach(item => {
      switch (item.status) {
        case 1: notStarted.push(item); break;
        case 2: processing.push(item); break;
        case 3: finished.push(item); break;
        default: console.log(`这个item的status出错${item}`);
      }
    });
    return <>
      <div>
        <div className={styles.top}>
          <Row type="flex" justify="space-between" align="middle" style={{ marginTop: 8 }}>
            <Col span={6}>
              <Button type="primary">新建项目</Button>
            </Col>

            <Col span={6}>
              <Search
                placeholder="项目名称/编号"
                onSearch={this.handleSearchProject}
                size="small"
                style={{ width: 240 }}
              />
            </Col>

            <Col span={6}>
              <span>排列方式：</span>
              <Select
                value={orderType}
                onChange={this.handleshowOrderChange}
                size="small"
              >
                <Option key="expireTime">结束时间</Option>
                <Option key="createTime">创建时间</Option>
                <Option key="updateTime">更新时间</Option>
                <Option key="emergency" >紧急情况</Option>
              </Select>
            </Col>

            <Col span={6}>
              <span>显示方式：</span>
              <Radio.Group value={showType} onChange={this.handleShowTypeChange} size="small">
                <Radio.Button value="waterfallType">瀑布</Radio.Button>
                <Radio.Button value="listType">列表</Radio.Button>
                <Radio.Button value="ganttType">甘特</Radio.Button>
              </Radio.Group>
            </Col>
          </Row>
        </div>
        <div className={styles.main}>
          {showType === 'waterfallType' && <Waterfall processing={processing} notStarted={notStarted} finished={finished} />}


        </div>
      </div>
    </>;
  }
}

export default MyProject;
