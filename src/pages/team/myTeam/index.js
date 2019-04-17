import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Input, Button, Avatar, Tooltip, List } from 'antd';
import styles from './index.less';


const Search = Input.Search;

@connect(({ myTeam }) => ({
  teams: myTeam.teams,
}))
class MyTeam extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      teams: [],
    };
  }

  handleSearchTeams = () => {

  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.teams && nextProps.teams !== prevState.teams) {
      return {
        teams: nextProps.teams
      };
    }
    return null;
  }
  render() {
    const { teams } = this.state;
    console.log(teams);
    return (
      <div className={styles.whiteBg}>
        <div className={styles.top}>
          <Row type="flex" justify="space-between" align="middle" style={{ marginTop: 8 }}>
            <Col span={4}>
              <Button type="primary">新建团队</Button>
            </Col>
            <Col span={20}>
              <Search
                placeholder="团队名称"
                onSearch={this.handleSearchTeams}
                size="small"
                style={{ width: 240 }}
              />
            </Col>
          </Row>
        </div>
        <div className={styles.cards}>
          {teams.map(team => {
            return (
              <Card
                key={team._id}
                title={team.name}
                size="small"
                style={{ width: 240, margin: '6px 8px', borderRadius: 8, cursor: 'pointer', }}
              >
                <Tooltip placement="bottom" title='添加成员'>
                  <Avatar style={{ color: '#fff', backgroundColor: '#fa541c' }}>＋</Avatar>
                </Tooltip>
                {team.member.map(member => <Tooltip placement="bottom" title={member.name} key={member._id}><Avatar src={member.avatar} /></Tooltip>)}
              </Card>);
          })}
        </div>
      </div>
    );
  }
}

export default MyTeam;
