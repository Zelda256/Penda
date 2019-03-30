/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { PureComponent } from 'react';
import Link from 'umi/link';
import { Tabs } from 'antd';
import styles from './index.less';

const TabPane = Tabs.TabPane;

export default class TabPage extends PureComponent {
  constructor(props) {
    super(props);
    const panes = this.props.panes;
    const activeKey = this.props.activeKey;
    this.state = {
      activeKey,
      panes
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.panes !== state.panes) {
      return {
        panes: props.panes,
        activeKey: props.activeKey,
      };
    }
    return null;
  }

  onChange = (activeKey) => {
    this.setState({ activeKey });
  }

  render() {
    const panes = this.state.panes;
    return (
      <div>
        <Tabs
          hideAdd
          onChange={this.onChange}
          activeKey={this.state.activeKey}
          type="editable-card"
          onEdit={this.props.onEdit}
          tabBarStyle={{margin: 0, backgroundColor: '#EEF1F4'}}
        >
          {panes.map(pane => <TabPane tab={<Link className={styles.tabName} to={pane.key}>{pane.title}</Link>} key={pane.key} />)}
        </Tabs>
      </div>
    );
  }
}
