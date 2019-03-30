/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import styles from './index.css';
import { Component } from 'react';
import _ from 'lodash';
import { Layout, Icon, message } from 'antd';
import SiderMenu from '../components/SiderMenu/SiderMenu';
import { getMenuData } from '../common/menu';
import logo from '../assets/logo.svg';
import GlobalHeader from '../components/GlobalHeader';
import TabPage from '../components/TabPage';

const { Content, Header } = Layout;

class BasicLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      panes: [
        { title: '我的项目', key: '/workbench/myProject' },
      ],
      activeKey: '/workbench/myProject'
    };
  }
  handleMenuCollapse = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  // 添加标签，如果该标签页已打开，则只激活该标签页
  addPanes = (title, key) => {
    // console.log('===', title, key);
    const panes = _.cloneDeep(this.state.panes);
    if (!panes.find(item => item.key === key)) {
      panes.push({ title, key });
    }
    this.setState({ panes, activeKey: key });
  }

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  }

  remove = (targetKey) => {
    let activeKey = this.state.activeKey;
    let lastIndex;
    this.state.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const panes = this.state.panes.filter(pane => pane.key !== targetKey);
    if (panes.length && activeKey === targetKey) {
      if (lastIndex >= 0) {
        activeKey = panes[lastIndex].key;
      } else {
        activeKey = panes[0].key;
      }
    }
    this.setState({ panes, activeKey });
  }

  render() {
    const { children, location } = this.props;
    const { collapsed } = this.state;

    return (
      <Layout>
        <SiderMenu
          logo={logo}
          collapsed={collapsed}
          menuData={getMenuData()}
          location={location}
          onCollapse={this.handleMenuCollapse}
          newPane={this.addPanes}
        />
        <Layout>
          <Header style={{ padding: 0 }}>
            <GlobalHeader
              logo={logo}
              collapsed={collapsed}
              currentUser={{
                name: 'serati ma',
                avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
                userId: '00001',
                notifyCount: 12,
              }}
              onCollapse={this.handleMenuCollapse}
            />
          </Header>

          <Content style={{ margin: '8px 8px 0', height: '100%'}} >
            <TabPage
              panes={this.state.panes}
              activeKey={this.state.activeKey}
              onEdit={this.onEdit}
            />
            {children}
          </Content>

        </Layout>
      </Layout>
    );
  }

}

export default BasicLayout;
