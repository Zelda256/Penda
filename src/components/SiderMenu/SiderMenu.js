/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { PureComponent } from 'react';
import { Layout, Menu, Icon } from 'antd';
import pathToRegexp from 'path-to-regexp';
import Link from 'umi/link';
import styles from './index.less';
import { urlToList } from '../utils/pathTools';

const { Sider } = Layout;
const { SubMenu } = Menu;

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
const getIcon = icon => {
  if (typeof icon === 'string' && icon.indexOf('http') === 0) {
    return <img src={icon} alt="icon" className={`${styles.icon} sider-menu-item-img`} />;
  }
  if (typeof icon === 'string') {
    return <Icon type={icon} />;
  }
  return icon;
};

export const getMenuMatcheys = (flatMenuKeys, path) => {
  return flatMenuKeys.filter(item => {
    return pathToRegexp(item).test(path);
  });
};

export default class SiderMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.menus = props.menuData;
    this.flatMenuKeys = this.getFlatMenuKeys(props.menuData);
    this.state = {
      openKeys: this.getDefaultCollapsedSubMenus(props)
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      this.setState({
        openKeys: this.getDefaultCollapsedSubMenus(nextProps)
      });
    }
  }
  // Convert pathname to openKeys
  // /list/search/articles = > ['list','/list/search']
  getDefaultCollapsedSubMenus(props) {
    const { location: { pathname } } = props || this.props;
    return urlToList(pathname).map(item => {
      return getMenuMatcheys(this.flatMenuKeys, item)[0];
    }).filter(item => item);
  }

  // 以递归方式展开菜单数据
  // [{path:string},{path:string}] => {path,path2}
  getFlatMenuKeys(menus) {
    let keys = [];
    menus.forEach(item => {
      if (item.children) {
        keys = keys.concat(this.getFlatMenuKeys(item.children));
      }
      keys.push(item.path);
    });
    return keys;
  }

  // 转化路径
  conversionPath(path) {
    if (path && path.indexOf('http') === 0) {
      return path;
    } else {
      return `/${path || ''}`.replace(/\/+/g, '/');
    }
  }

  // 判断是否是http链接.返回 Link 或 a
  getMenuItemPath(item) {
    const itemPath = this.conversionPath(item.path);
    const icon = getIcon(item.icon);
    const { target, name } = item;
    // 如果是http连接
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          {icon}
          <span>{name}</span>
        </a>
      );
    }
    return (
      <Link
        to={itemPath}
        target={target}
        replace={itemPath === this.props.location.pathname}
        onClick={() => { this.props.newPane(name, itemPath); }}
      >
        {icon}
        <span>{name}</span>
      </Link>
    );
  }

  // 点击了某项菜单，需要判断打开新标签页还是激活已打开的标签页
  clickMenu = (name, itemPath) => {
    
  }


  // 获取子菜单或item
  getSubMenuOrItem(item) {
    if (item.children && item.children.some(child => child.name)) {
      const childrenItems = this.getNavMenuItems(item.children);
      // 当无子菜单时就不展示菜单
      if (childrenItems && childrenItems.length > 0) {
        return (
          <SubMenu
            title={
              item.icon ? (
                <span>
                  {getIcon(item.icon)}
                  <span>{item.name}</span>
                </span>
              ) : (item.name)
            }
            key={item.path}
          >
            {childrenItems}
          </SubMenu>
        );
      }
      return null;
    } else {
      return <Menu.Item key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>;
    }
  }
  // 获得菜单子节点
  getNavMenuItems(menusData) {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name && !item.hideInMenu)
      .map(item => {
        // 生成DOM
        const ItemDom = this.getSubMenuOrItem(item);
        return this.checkPermissionItem(item.authority, ItemDom);
      })
      .filter(item => item);
  }
  // 获取当前已选的菜单
  getSelectedMenuKeys() {
    const { location: { pathname } } = this.props;
    return urlToList(pathname).map(itemPath => getMenuMatcheys(this.flatMenuKeys, itemPath).pop());
  }

  isMainMenu(key) {
    return this.menus.some(item => key && (item.key === key || item.path === key));
  }

  // SubMenu 展开/关闭的回调
  handleOpenChange = (openKeys) => {
    const lastOpenKey = openKeys[openKeys.length - 1];
    const moreThanOne = openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1;
    this.setState({
      openKeys: moreThanOne ? [lastOpenKey] : [...openKeys],
    });
  }
  // 检查权限
  checkPermissionItem(authority, ItemDom) {
    if (this.props.Authorized && this.props.Authorized.check) {
      const { check } = this.props.Authorized;
      return check(authority, ItemDom);
    }
    return ItemDom;
  }
  render() {
    const { logo, collapsed, onCollapse } = this.props;
    const { openKeys } = this.state;
    const menuProps = collapsed ? {} : { openKeys };
    // 当前选中的菜单项 key 数组
    let selectedKeys = this.getSelectedMenuKeys();

    if (!selectedKeys.length) {
      selectedKeys = [openKeys[openKeys.length - 1]];
    }
    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        onCollapse={onCollapse}
        width={256}
        className={styles.sider}
      >
        <div className={styles.logo} key="logo">
          <Link to="/">
            <img src={logo} alt="logo" />
            <h1>Penda</h1>
          </Link>
        </div>
        <Menu
          key="Menu"
          mode="inline"
          {...menuProps}
          onOpenChange={this.handleOpenChange}
          selectedKeys={selectedKeys}
          style={{ padding: '16px 0', width: '100%' }}
        >
          {this.getNavMenuItems(this.menus)}
        </Menu>
      </Sider>
    );
  }
}
