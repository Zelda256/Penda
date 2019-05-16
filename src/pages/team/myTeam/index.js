import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Input, Button, Avatar, Tooltip, Icon, Typography,Statistic  } from 'antd';
import styles from './index.less';


const Search = Input.Search;
const { Text } = Typography;

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
                hoverable={true}
                key={team._id}
                title={team.name}
                size="small"
                style={{ width: 240, margin: '6px 8px', borderRadius: 8, cursor: 'pointer', }}
                extra={<Icon type="edit" theme="twoTone" twoToneColor="#eb2f96"/>}
              >
                <p>
                  <Text strong>成员：</Text>
                  {team.member.map(member => <Tooltip placement="bottom" title={member.name} key={member._id}>
                    <Avatar src={member.avatar} />
                    <span> </span>
                  </Tooltip>)}
                </p>
                {/* <p>
                  <Text strong>近期项目：</Text>
                </p> */}
                <p>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title="已完成项目"
                        value={team.proj.reduce((sum, proj) => {
                          if (proj.status === 3) return sum + 1;
                        }, 0)}
                        suffix={'/ ' + team.proj.length}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="进行中项目"
                        value={team.proj.reduce((sum, proj) => {
                          if (proj.status === 2) return sum + 1;
                        }, 0)}
                        suffix={'/ ' + team.proj.length}
                      />
                    </Col>
                  </Row>
                </p>
              </Card>);
          })}
        </div>
      </div>
    );
  }
}

export default MyTeam;
