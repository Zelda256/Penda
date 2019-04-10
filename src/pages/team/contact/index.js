import { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Input, Collapse, Row, Col, Avatar } from 'antd';
import styles from './index.less';

const Search = Input.Search;
const Panel = Collapse.Panel;

@connect(({ contact }) => ({
  contact: contact.contact,
}))
class Contact extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      contact: [],
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.contact && nextProps.contact !== prevState.contact) {
      return {
        contact: nextProps.contact
      };
    }
    return null;
  }
  render() {
    console.log(this.state.contact);
    const { contact } = this.state;
    return <div>
      <div className={styles.top}>
        <Row type="flex" justify="space-between" align="middle" style={{ marginTop: 8 }}>
          <Col span={12}>
            <Button type="primary">新建联系人</Button>
          </Col>
          <Col span={12}>
            <Search
              placeholder="姓名"
              onSearch={this.handleSearchProject}
              size="small"
              style={{ width: 240 }}
            />
          </Col>
        </Row>
      </div>
      <Collapse>
        {
          contact.map(item => <Panel header={item.name} key={item._id}>
            <Avatar src={item.avatar}/>

            <p>邮箱: {item.email}</p>
            <p>号码: {item.phone}</p>
            <p>部门: {item.department ? item.department : '暂无'}</p>
            <p>岗位: {item.job ? item.job : '暂无'}</p>
          </Panel>)
        }
      </Collapse>

    </div>;
  }
}

export default Contact;
