import { connect } from 'dva';
import router from 'umi/router';
import styles from './index.css';
import { Component } from 'react';
import _ from 'lodash';
import { Layout, Icon, message } from 'antd';
import SiderMenu from '../components/SiderMenu/SiderMenu';
import { getMenuData } from '../common/menu';
import logo from '../assets/logo.svg';
import GlobalHeader from '../components/GlobalHeader';
import TabPage from '../components/TabPage';
import Login from '../components/Login';

const { Content, Header } = Layout;

@connect(({ login }) => ({
  loginRes: login.loginRes,
}))
class BasicLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      panes: [
        { title: '我的项目', key: '/workbench/myProject' },
      ],
      activeKey: '/workbench/myProject',
    };
  }
  handleMenuCollapse = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  // 个人中心 设置 退出登录
  onMenuClick = ({ key }) => {
    // console.log('????????????????41234234134');
    // console.log(key);
    const { dispatch } = this.props;
    if (key === 'logout') {
      key = null;
      console.log('点击 logout!');
      dispatch({
        type: 'login/logout',
        payload: null
      });
      // console.log('dispatch 一次!');
      // key = null;
      // router.push('/');
      // this.props.location.pathname = '/login';
      // message.success('您已退出登录');
    }
  }

  // 添加标签，如果该标签页已打开，则只激活该标签页
  addPanes = (title, key) => {
    const panes = _.cloneDeep(this.state.panes);
    if (!panes.find(item => item.key === key)) {
      panes.push({ title, key });
    }
    this.setState({ panes, activeKey: key });
  }

  onEdit = (targetKey, action) => {
    this[action](targetKey);
  }

  // 删除标签页
  remove = (targetKey) => {
    if (this.state.panes.length === 1) return;  // 只剩最后一个标签页时 不删除
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
    router.push(activeKey);
  }

  render() {
    const { children, location } = this.props;
    const { collapsed } = this.state;
    if (location.pathname === '/login') {
      return <Login>{children}</Login>;
    }

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
                name: this.props.loginRes ? this.props.loginRes.name : 'zelda',
                avatar: this.props.loginRes ? this.props.loginRes.avatar : '',
                userId: this.props.loginRes ? this.props.loginRes._id : '0001',
                notifyCount: 0,
              }}
              onMenuClick={this.onMenuClick}
              onCollapse={this.handleMenuCollapse}
            />
          </Header>
          <Content style={{ margin: '8px 8px 0', height: '100%' }} >
            <TabPage
              // onChange={this.onPaneChange}
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
