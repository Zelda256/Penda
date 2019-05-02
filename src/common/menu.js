const urlReg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

export function isUrl(path) {
  return urlReg.test(path);
}

// 菜单数据
const menuData = [
  {
    name: '工作台',
    icon: 'dashboard',
    path: 'workbench',
    children: [
      {
        name: '我的项目',
        path: 'myProject',
      },
      // {
      //   name: '下属项目',
      //   path: 'mateProject',
      // },
    ],
  },
  {
    name: '团队管理',
    icon: 'team',
    path: 'team',
    children: [
      {
        name: '我的团队',
        path: 'myTeam',
      },
      {
        name: '通讯录',
        path: 'contact',
      },
    ],
  },
  {
    name: '财务管理',
    icon: 'pay-circle',
    path: 'money',
    children: [
      {
        name: '报销记录',
        path: 'refunds',
      },
      {
        name: '各人汇总',
        path: 'summary',
      },
    ],
  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);


