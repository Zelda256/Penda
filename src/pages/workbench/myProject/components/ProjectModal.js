import React, { PureComponent } from 'react';
import { Modal, Spin, Avatar, Icon, DatePicker, Progress } from 'antd';
import styles from './ProjectModal.less';
import moment from 'moment';

const { RangePicker } = DatePicker;
export default class ProjectModal extends PureComponent {
  constructor() {
    super();
    this.state = {
      project: null,
      visible: true,
    };
  }
  handleCancel = () => {
    this.setState({
      visible: false
    });
    this.props.hide();
  }
  handleOk = () => {
    this.setState({
      visible: false
    });
    this.props.hide();
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.project && nextProps.project !== prevState.project) {
      console.log('%@#$!', nextProps.project);
      return {
        project: nextProps.project,
      };
    }
    return null;
  }
  render() {
    console.log(this.state.project);
    const { project } = this.state;
    return <Modal
      visible={this.state.visible}
      title='项目详情'
      onOk={this.handleOk}
      onCancel={this.handleCancel}
      width='1200px'
      footer={null}
    >
      {!this.state.project ? <Spin /> : <>
        <div className={styles.modalLeft}>
          <h2>{project.name}</h2>
          <div className={styles.modalLeftRow}>
            <label className={styles.leftLabel}><Icon type="check-square" /><span> 状态</span></label>
            <label className={styles.status}>{
              project.status === 2 ?
                <span><Icon type="border" /> 未完成</span> :
                <span><Icon type="check-square" /> 已完成</span>}
            </label>
          </div>
          <div className={styles.modalLeftRow}>
            <label className={styles.leftLabel}><Icon type="user" /><span>  负责人</span></label>
            <label style={{ padding: '6px 8px', cursor: 'pointer' }}>
              <Avatar size="small" src={project.creator.avatar} />
              <span> {project.creator.name}</span>
            </label>
          </div>
          <div className={styles.modalLeftRow}>
            <label className={styles.leftLabel}><Icon type="calendar" /><span>  时间</span></label>
            <label style={{ paddingLeft: 6 }}><RangePicker value={[moment(project.startDate), moment(project.deadLine)]} /></label>
          </div>
          <div className={styles.modalLeftRow}>
            <label className={styles.leftLabel}><Icon type="flag" /><span>  优先级</span></label>
            <div className={project.priority === 1 ? styles.priority1 : project.priority === 2 ? styles.priority2 : styles.priority3}>{
              project.priority === 1 ? '普通' : project.priority === 2 ? '紧急' : '非常紧急'
            }
            </div>
          </div>
          <div className={styles.modalLeftRow}>
            <label className={styles.leftLabel}><Icon type="profile" /><span>  描述</span></label>
            <div className={styles.remark}>{project.description ? project.description : '无'}</div>
          </div>
          <div className={styles.modalLeftRow}>
            <label className={styles.leftLabel}><Icon type="file-text" /><span>  备注</span></label>
            <div className={styles.remark}>{project.remark ? project.remark : '无'}</div>
          </div>
          <div className={styles.modalLeftRow}>
            <label className={styles.leftLabel}><Icon type="money-collect" /><span>  预算</span></label>
            <div style={{ padding: '6px 8px' }}>
              {project.moneyType === 'RMB' ? '￥ ' : project.moneyType === 'Dollar' ? '$ ' : ''}
              {project.budget ? project.budget : '--'}
            </div>
          </div>
          <div className={styles.modalLeftRow}>
            <label className={styles.leftLabel}><Icon type="bell" /><span>  提醒</span></label>
            <div >
              {project.budget ? project.budget : '无'}
              {project.moneyType === 'RMB' ? ' RMB' : project.moneyType === 'dollar' ? ' Dollar' : ''}
            </div>
          </div>
          <div className={styles.modalLeftTask}>
            <label className={styles.leftLabel}><Icon type="solution" /><span>  子任务</span></label>
            <div className={styles.task}>
              <div className={styles.addTask}>
                <span> <Icon type="plus-circle" theme="twoTone" /> 添加子任务</span>
              </div>

            </div>
          </div>

        </div>
        <div className={styles.modalRight}>
          <div className={styles.modalRightTop}>
            <p><Icon type="team" /> 参与者 &middot; {project.team.length + 1}</p>
            <Avatar src={project.creator.avatar} />
            {project.team.map(item => <Avatar src={item.avatar} />)}
          </div>
          <div className={styles.modalRightDown}>
            <span><Icon type="schedule" /> 进度</span>
            <div style={{ width: 300, display: 'inline-block', marginLeft: 16 }}>
              <Progress percent={project.progress} size="small" />
            </div>
            <div className={styles.process}>
              {
                project.process && project.process.length ?
                  project.process.map(item => <>{item.json()}</>) :
                  '---暂无动态---'
              }
            </div>
          </div>
        </div>

      </>
      }
    </Modal>;
  }
}
