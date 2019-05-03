import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Row, Col, Input, Table, Typography, DatePicker, Collapse, Icon, Empty, Select } from 'antd';
import styles from './index.less';
import moment from 'moment';
import { userInfo } from 'os';
const { Text } = Typography;
const { Panel } = Collapse;
const Option = Select.Option;

const Search = Input.Search;
const { RangePicker } = DatePicker;

@connect(({ summarys }) => ({
  summary: summarys.summary,
  projects: summarys.projects,
}))
class Summary extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      summary: [],
      projects: [],
      projectSearch: null,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.summary && nextProps.summary !== prevState.summary) {
      return {
        summary: nextProps.summary
      };
    }
    if (nextProps.projects && nextProps.projects !== prevState.projects) {
      return {
        projects: nextProps.projects
      };
    }
    return null;
  }
  handleProjectSearch = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'summarys/list',
      payload: {
        project: value,
      }
    });
    this.setState({
      projectSearch: value,
    });
  }
  clearSearch = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'summarys/list' });
    this.setState({
      projectSearch: null,
    });
  }
  genExtra = () => {
    return <span className={styles.exportBtns}>
      <Button
        size="small"
        style={{ marginRight: '16px' }}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <Icon type="cloud-download" />
        决算表
      </Button>
      <Button
        size="small"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <Icon type="cloud-download" />
        汇总表
      </Button>
    </span>;
  }
  render() {
    const { summary, projects } = this.state;
    // console.log('projects', projects);
    // const refundType = ['/', '差旅费', '材料费', '文献出版费', '劳务费', '专家咨询费', '设备费'];
    // console.log('summary', summary);
    const columns = [
      {
        title: '姓名',
        dataIndex: 'user.name',
        align: 'center',
      },
      {
        title: '差旅费',
        align: 'center',
        render: ((text, record) => {
          let refund = record.refunds.find(item => item.type === 1);
          if (refund) return refund.value;
          return null;
        })
      },
      {
        title: '材料费',
        align: 'center',
        render: ((text, record) => {
          let refund = record.refunds.find(item => item.type === 2);
          if (refund) return refund.value;
          return null;
        })
      },
      {
        title: '文献出版费',
        align: 'center',
        render: ((text, record) => {
          let refund = record.refunds.find(item => item.type === 3);
          if (refund) return refund.value;
          return null;
        })
      },
      {
        title: '劳务费',
        align: 'center',
        render: ((text, record) => {
          let refund = record.refunds.find(item => item.type === 4);
          if (refund) return refund.value;
          return null;
        })
      },
      {
        title: '专家咨询费',
        align: 'center',
        render: ((text, record) => {
          let refund = record.refunds.find(item => item.type === 5);
          if (refund) return refund.value;
          return null;
        })
      },
      {
        title: '设备费',
        align: 'center',
        render: ((text, record) => {
          let refund = record.refunds.find(item => item.type === 6);
          if (refund) return refund.value;
          return null;
        })
      },
      {
        title: '合计',
        align: 'center',
        width: '18%',
        render: ((text, record) => {
          let result = record.refunds.reduce((sum, item) => sum + item.value, 0);
          return <Text strong>{result}</Text>;
        })
      },
    ];
    return (
      <div className={styles.whiteBg}>
        <div className={styles.top}>
          <Row type="flex" justify="start" align="middle" style={{ marginTop: 8 }}>
            <Col span={5}>
              <span>项目名称：</span>
              <Select
                placeholder="项目名称"
                style={{ width: 120 }}
                size="small"
                onChange={this.handleProjectSearch}
                dropdownMatchSelectWidth={false}
                value={this.state.projectSearch}
              >
                {
                  projects.map(item => {
                    return <Option key={item._id}>{item.name}</Option>;
                  })
                }
              </Select>
            </Col>
            <Col span={2}>
              <Button size="small" onClick={this.clearSearch}>重置</Button>
            </Col>
          </Row>
        </div>
        <div className={styles.mainTable}>
          {!summary || !summary.length ? <Empty /> :
            <Collapse
              bordered={false}
              defaultActiveKey={summary.map(item => { return item.project._id; })}
            >
              {summary.map((item) => {
                return (
                  <Panel
                    header={<Text strong>{item.project.name}</Text>}
                    key={item.project._id}
                    extra={this.genExtra()}
                    className={styles.panel}
                  >
                    <Table
                      columns={columns}
                      dataSource={item.summary}
                      bordered
                      size="small"
                      rowKey={(record) => record.user._id}
                      footer={(currentPageData) => {
                        let traval = 0, stuff = 0, publish = 0, labor = 0, consult = 0, device = 0;
                        currentPageData.forEach(item => {
                          item.refunds.forEach(refund => {
                            switch (refund.type) {
                            case 1: traval += refund.value; break;
                            case 2: stuff += refund.value; break;
                            case 3: publish += refund.value; break;
                            case 4: labor += refund.value; break;
                            case 5: consult += refund.value; break;
                            case 6: device += refund.value; break;
                            }
                          });
                        });
                        return <Text>
                          <Text strong>合计 ( {traval + stuff + publish + labor + consult + device} 元 )： </Text>
                          1. 差旅费：{traval} 元；
                          2. 材料费：{stuff} 元；
                          3. 文献出版费：{publish} 元；
                          4. 劳务费：{labor}元；
                          5. 专家咨询费：{consult}元；
                          6. 设备费：{device}元；
                        </Text>;
                      }}
                    />
                  </Panel>
                );
              })}
            </Collapse>
          }
        </div>
      </div>
    );
  }
}

export default Summary;
