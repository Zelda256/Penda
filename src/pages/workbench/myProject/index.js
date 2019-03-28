/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { PureComponent } from 'react';
import router from 'umi/router';
import { Button, Radio, Select, Card, Row, Col } from 'antd';
import styles from './index.less';

const Option = Select.Option;

export default class MyProject extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showType: 'waterfallType',
      orderType: 'expireTime',
      projects: [
        {
          id: '8301',
          created: '2019/3/28 17:32',
          name: '项目名称a',
          creator: {
            id: '00001',
            name: 'Zelda',
            avatar: 'http://pp2ccj9kg.bkt.clouddn.com/63bb1a2e254cd87f%21400x400_big.jpg',
          },
          team: [
            {
              id: '00002',
              name: 'zoe',
              avatar: 'http://pp2ccj9kg.bkt.clouddn.com/0f0b54544f1440b6bc976d46260d8a17%21400x400.jpeg',
            },
            {
              id: '00003',
              name: 'Joy',
              avatar: 'http://pp2ccj9kg.bkt.clouddn.com/a6d01c6f5d344c00b3564c701cf566ab%21400x400.jpeg',
            },
            {
              id: '00004',
              name: 'Young',
              avatar: 'http://pp2ccj9kg.bkt.clouddn.com/5101c265bdaa47a4b954206d59f9e019%21400x400.jpeg',
            }
          ],
          deadLine: '2019/4/13 19:00',
          process: [],
          budget: '3000',
          moneyType: 'RMB',
          status: 2,
          priority: 1,
          description: '项目描述a',
          remark: ''
        },
        {
          id: '8302',
          created: '2019/3/18 12:32',
          name: '项目名称b',
          creator: {
            id: '00001',
            name: 'Zelda',
            avatar: 'http://pp2ccj9kg.bkt.clouddn.com/63bb1a2e254cd87f%21400x400_big.jpg',
          },
          team: [
            {
              id: '00005',
              name: 'pinky',
              avatar: 'http://pp2ccj9kg.bkt.clouddn.com/926c3bdaaa254bd2831779e450c17049%21400x400.jpeg',
            },
            {
              id: '00003',
              name: 'Joy',
              avatar: 'http://pp2ccj9kg.bkt.clouddn.com/a6d01c6f5d344c00b3564c701cf566ab%21400x400.jpeg',
            },
            {
              id: '00004',
              name: 'Young',
              avatar: 'http://pp2ccj9kg.bkt.clouddn.com/5101c265bdaa47a4b954206d59f9e019%21400x400.jpeg',
            }
          ],
          deadLine: '2019/6/13 00:00',
          process: [],
          budget: '12000',
          moneyType: 'RMB',
          status: 1,
          priority: 4,
          description: '项目描述b',
          remark: ''
        },
      ]
    };
  }
  handleShowTypeChange = (e) => {
    this.setState({ showType: e.target.value });
  }
  handleshowOrderChange = (value) => {
    this.setState({ orderType: value });
  }
  render() {
    const { showType, orderType, projects } = this.state;
    // 统计 进行中&未开始&已完成 的项目
    const processing = [], notStarted = [], finished = [];
    projects.map(item => {
      switch (item.status) {
      case 1: notStarted.push(item); break;
      case 2: processing.push(item); break;
      case 3: finished.push(item); break;
      default: console.log(`这个item的status出错${item}`);
      }
    });
    return <>
      <div className={styles.container}>
        <div className={styles.top}>
          <Row type="flex" justify="space-between" style={{ marginTop: 8 }}>
            <Col span={8}>
              <Button type="primary">新建项目</Button>
            </Col>

            <Col span={8}>
              <span>排列方式：</span>
              <Select
                value={orderType}
                onChange={this.handleshowOrderChange}
              >
                <Option key="expireTime">结束时间</Option>
                <Option key="createTime">创建时间</Option>
                <Option key="updateTime">更新时间</Option>
                <Option key="emergency" >紧急情况</Option>
              </Select>
            </Col>

            <Col span={8}>
              <span>显示方式：</span>
              <Radio.Group value={showType} onChange={this.handleShowTypeChange}>
                <Radio.Button value="waterfallType">瀑布</Radio.Button>
                <Radio.Button value="listType">列表</Radio.Button>
                <Radio.Button value="ganttType">甘特</Radio.Button>
              </Radio.Group>
            </Col>
          </Row>
        </div>
        <div className={styles.main}>
          <Row gutter={16}>
            <Col span={8}>
              <Card
                size="small"
                title={`进行中 (${processing.length})`}
                headStyle={{
                  backgroundColor: '#56BCA4',
                  color: '#fff'
                }}
              >{
                  processing.map(item => <Card
                    hoverable type="inner"
                    size="small"
                    title={`${item.name}`}
                  >
                    {item.description}
                  </Card>)
                }
              </Card>
            </Col>
            <Col span={8}>
              <Card
                size="small"
                title={`未开始 (${notStarted.length})`}
                headStyle={{
                  backgroundColor: '#8993DD',
                  color: '#fff'
                }}
              >{
                  notStarted.map(item => <Card hoverable type="inner" size="small" title={`${item.name}`}>
                    {item.description}
                  </Card>)
                }</Card>
            </Col>
            <Col span={8}>
              <Card
                size="small"
                title={`已完成 (${finished.length})`}
                headStyle={{
                  backgroundColor: '#8A9A97',
                  color: '#fff'
                }}
              >{
                  finished.map(item => <Card hoverable type="inner" size="small" title={`${item.name}`}>
                    {item.description}
                  </Card>)
                }</Card>
            </Col>
          </Row>
        </div>
      </div>
    </>;
  }
}

