import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Row, Col, Input, Table, Divider, DatePicker, Select, Typography } from 'antd';
import styles from './index.less';
import moment from 'moment';
// const { Title } = Typography;
const { Text } = Typography;

const Option = Select.Option;
// const Search = Input.Search;
const { RangePicker } = DatePicker;

@connect(({ refunds }) => ({
  refund: refunds.refund,
  projects: refunds.projects,
}))
class Refunds extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      refund: [],
      projects: [],
      projectSearch: null,
      typeSearch: null,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.refund && nextProps.refund !== prevState.refund) {
      return {
        refund: nextProps.refund
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
    // console.log('handleProjectSearch', value);
    const { dispatch } = this.props;
    dispatch({
      type: 'refunds/list',
      payload: {
        project: value,
        type: this.state.typeSearch,
      }
    });
    this.setState({
      projectSearch: value,
    });
  }
  handleTypeSearch = (value) => {
    // console.log('handleTypeSearch', value);
    const { dispatch } = this.props;
    dispatch({
      type: 'refunds/list',
      payload: {
        project: this.state.projectSearch,
        type: value,
      }
    });
    this.setState({
      typeSearch: value,
    });
  }
  clearSearch = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'refunds/list' });
    this.setState({
      projectSearch: null,
      typeSearch: null,
    });
  }

  render() {
    const { refund, projects, projectSearch, typeSearch } = this.state;
    const refundType = ['/', '差旅费', '材料费', '文献出版费', '劳务费', '专家咨询费', '设备费'];
    const columns = [
      {
        title: '项目名称',
        dataIndex: 'projectId',
        align: 'center',
        render: ((text, record) => record.projectId.name)
      },
      {
        title: '任务名称',
        dataIndex: 'processId',
        align: 'center',
        render: ((text, record) => record.processId.name)
      },
      {
        title: '报销日期',
        dataIndex: 'date',
        align: 'center',
        render: ((text, record) => moment(text).format('YYYY-MM-DD'))
      },
      {
        title: '报销类型',
        dataIndex: 'type',
        align: 'center',
        render: ((text, record) => refundType[record.type])
      },
      {
        title: '报销人',
        dataIndex: 'userId',
        align: 'center',
        render: ((text, record) => record.userId.name)
      },
      {
        title: '报销金额',
        dataIndex: 'value',
        align: 'center',
        width: '18%',
        render: (text, record) => <span style={{ fontWeight: 'bold' }}>{record.value}</span>
      }
    ];
    return (
      <div className={styles.whiteBg}>
        <div className={styles.top}>
          <Row type="flex" justify="space-between" align="middle" style={{ marginTop: 8 }}>
            <Col span={3}>
              <Button type="primary">导出Excel</Button>
            </Col>
            <Divider type="vertical" />
            <Col span={6}>
              <span>日期：</span>
              <RangePicker
                size="small"
                format="YYYY-MM-DD"
                placeholder={['开始日期', '截止日期']}
                style={{ width: 200 }}
              />
            </Col>
            <Col span={4}>
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
            <Col span={4}>
              <span>报销类型：</span>
              <Select value={this.state.typeSearch} style={{ width: 120 }} size="small" onChange={this.handleTypeSearch}>
                <Option value={1}>差旅费</Option>
                <Option value={2}>材料费</Option>
                <Option value={3}>文献出版费</Option>
                <Option value={4}>劳务费</Option>
                <Option value={5}>专家咨询费</Option>
                <Option value={6}>设备费</Option>
              </Select>
            </Col>
            <Col span={2}>
              <Button size="small" onClick={this.clearSearch}>重置</Button>
            </Col>
          </Row>
        </div>
        <div className={styles.mainTable}>
          <Table
            columns={columns}
            dataSource={refund}
            size="middle"
            bordered
            title={() => {
              return <span>
                <Text strong>{projectSearch ? projects.find(pro => pro._id === projectSearch).name: '所有项目'}</Text>
                <span> ，共 <Text type="warning" strong>{refund.length}</Text> 条 </span>
                <Text strong>{typeSearch ? refundType[typeSearch]: '所有'}</Text>
                <span> 报销类型的记录</span>
              </span>;
            }}
          />
        </div>
      </div>
    );
  }
}

export default Refunds;
