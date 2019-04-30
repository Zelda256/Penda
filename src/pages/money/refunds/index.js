import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Row, Col, Input, Table, Typography, DatePicker } from 'antd';
import styles from './index.less';
import moment from 'moment';
// const { Title } = Typography;

const Search = Input.Search;
const { RangePicker } = DatePicker;

@connect(({ refunds }) => ({
  refund: refunds.refund,
}))
class Refunds extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      refund: [],
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.refund && nextProps.refund !== prevState.refund) {
      return {
        refund: nextProps.refund
      };
    }
    return null;
  }
  render() {
    const { refund } = this.state;
    const refundType = ['/', '差旅费', '材料费', '文献出版费', '劳务费', '专家咨询费', '设备费'];
    console.log(refund);
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
      }
    ];
    return (
      <div className={styles.whiteBg}>
        <div className={styles.top}>
          <Row type="flex" justify="start" align="middle" style={{ marginTop: 8 }}>
            <Col span={3}>
              <Button type="primary">导出Excel</Button>
            </Col>
            <Col span={3}>
              <Button>生成决算表</Button>
            </Col>
            <Col span={6}>
              <RangePicker
                size="small"
                format="YYYY-MM-DD"
                placeholder={['开始日期', '截止日期']}
              // onChange={onChange}
              />
            </Col>
            <Col span={3}>
              <Search
                placeholder="项目名称"
                onSearch={this.handleSearchTeams}
                size="small"
                // style={{ width: 160 }}
              />
            </Col>
            <Col span={3}>
              <Search
                placeholder="任务名称"
                onSearch={this.handleSearchTeams}
                size="small"
                // style={{ width: 160 }}
              />
            </Col>
            <Col span={4}>
              <Search
                placeholder="报销类型"
                onSearch={this.handleSearchTeams}
                size="small"
                // style={{ width: 160 }}
              />
            </Col>
          </Row>
        </div>
        <div className={styles.mainTable}>
          <Table
            columns={columns}
            dataSource={refund}
            size="middle"
          />
        </div>
      </div>
    );
  }
}

export default Refunds;
