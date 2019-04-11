import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Progress, Empty, Card, Row, Col } from 'antd';
import styles from './Waterfall.less';
import ProjectModal from './ProjectModal';
import moment from 'moment';

@connect(({ myProjects }) => ({
  readProjects: myProjects.readProjects,
}))
class Waterfall extends PureComponent {
  constructor() {
    super();
    this.state = {
      showProjectModal: false,
      readProjects: {}
    };
  }
  showProjectDetail = (projectId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'myProjects/read',
      payload: projectId
    });
    this.setState({
      showProjectModal: true,
    });
  }
  hideProjectDetail = () => {
    this.setState({
      showProjectModal: false,
    });
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.readProjects && nextProps.readProjects !== prevState.readProjects) {
      return {
        readProjects: nextProps.readProjects,
      };
    }
    return null;
  }
  render() {
    const { processing, notStarted, finished } = this.props;  // processing: 进行中的项目
    return <>
      <Row gutter={16}>
        <Col span={8}>
          <Card
            size="small"
            title={`进行中 (${processing.length})`}
            headStyle={{
              backgroundColor: '#56BCA4',
              color: '#fff'
            }}
          >{
              processing.length ? processing.map(item => <Card
                key={item.id}
                hoverable
                type="inner"
                size="small"
                className={item.priority === 1 ? styles.projectItem_red : styles.projectItem_yellow}
                onClick={() => this.showProjectDetail(item._id)}
              >
                <div className={styles.projectItem}>
                  <div className={styles.itemName}>{item.name}</div>
                  <div className={styles.itemID}>ID: {item.id}</div>
                  <Progress percent={item.progress} size="small" />
                  <div>截止日期：{moment(item.deadLine).format('YYYY-MM-DD HH:mm')}</div>
                </div>
              </Card>) : <Empty />
            }
          </Card>
        </Col>
        <Col span={8}>
          <Card
            size="small"
            title={`未开始 (${notStarted.length})`}
            headStyle={{
              backgroundColor: '#8993DD',
              color: '#fff'
            }}
          >{
              notStarted.length ? notStarted.map(item => <Card
                key={item.id}
                hoverable
                type="inner"
                size="small"
                onClick={() => this.showProjectDetail(item._id)}
              >
                <div className={styles.projectItem}>
                  <div className={styles.itemName}>{item.name}</div>
                  <div className={styles.itemID}>ID: {item.id}</div>
                  <Progress percent={item.progress} size="small" />
                  <div>截止日期：{moment(item.deadLine).format('YYYY-MM-DD HH:mm')}</div>
                </div>
              </Card>) : <Empty />
            }</Card>
        </Col>
        <Col span={8}>
          <Card
            size="small"
            title={`已完成 (${finished.length})`}
            headStyle={{
              backgroundColor: '#8A9A97',
              color: '#fff'
            }}
          >{
              finished.length ? finished.map(item => <Card
                key={item.id}
                hoverable
                type="inner"
                size="small"
                onClick={() => this.showProjectDetail(item._id)}
              >
                <div className={styles.projectItem}>
                  <div className={styles.itemName}>{item.name}</div>
                  <div className={styles.itemID}>ID: {item.id}</div>
                  <Progress percent={item.progress} size="small" />
                  <div>截止日期：{moment(item.deadLine).format('YYYY-MM-DD HH:mm')}</div>
                </div>
              </Card>) : <Empty />
            }</Card>
        </Col>
      </Row>
      {
        this.state.showProjectModal && <ProjectModal
          hide={this.hideProjectDetail}
          visible={this.state.showProjectModal}
          project={this.props.readProjects} />
      }
    </>;
  }
}
export default Waterfall;
