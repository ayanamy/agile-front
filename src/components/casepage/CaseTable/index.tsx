import React, { FC, useState, useEffect, useCallback, useMemo } from 'react';
import {
  Table,
  Button,
  Tooltip,
  Dropdown,
  Menu,
  Checkbox,
  Modal,
  Space,
} from 'antd';

import {
  EditOutlined,
  FileDoneOutlined,
  CopyOutlined,
  ExclamationCircleOutlined,
  EllipsisOutlined,
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { ColumnType } from 'antd/es/table';
import FastSearch from '@/components/FastSearch';
import { TSearcher } from '@/components/FastSearch/interface';
import { FormItemType } from '@/components/FormComponents/interface';
import { request, Link, connect, CaseModelState } from 'umi';
import moment from 'moment';
import CaseModal from '@/components/casepage/CaseModal';
import style from './style.less';

const searcherList: TSearcher[] = [
  {
    type: FormItemType.Input,
    tagProps: {
      placeholder: '用例集名称',
    },
    formItemProps: {
      name: 'name',
    },
  },
  {
    type: FormItemType.Select,
    tagProps: {
      placeholder: '创建人',
      options: [
        {
          label: '用户',
          value: 1,
        },
        {
          label: '管理员',
          value: 0,
        },
      ],
    },
    formItemProps: {
      name: 'creator',
    },
  },
  {
    type: FormItemType.Input,
    tagProps: {
      placeholder: '关联需求',
    },
    formItemProps: {
      name: 'connector',
    },
  },
  {
    type: FormItemType.DatePicker,
    tagProps: {},
    formItemProps: {
      name: 'date',
    },
  },
];

const connector = (state: { case: CaseModelState }) => {
  return {
    state: state.case,
  };
};

interface ICaseType {
  state: CaseModelState;
}

const CaseTable: FC<ICaseType> = ({ state }) => {
  const [fastSearchVisible, setFastSearchVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const onSearch = useCallback((values: any) => {
    console.log(values);
  }, []);

  const columns: ColumnType<any>[] = useMemo(() => {
    return [
      {
        title: '用例集ID',
        dataIndex: 'id',
        key: 'id',
        width: 100,
        render: (text) => <div>{text}</div>,
      },
      {
        title: '用例集名称',
        dataIndex: 'title',
        key: 'title',
        width: 200,
        render: (text, record) => {
          let url = ``;
          return <Link to={url}>{text}</Link>;
        },
      },
      {
        title: '关联需求',
        dataIndex: 'requirementId',
        key: 'requirementId',
        width: 200,
      },
      {
        title: '最近更新人',
        dataIndex: 'modifier',
        width: 120,
        key: 'modifier',
      },
      {
        title: '创建人',
        dataIndex: 'creator',
        width: 120,
        key: 'creator',
      },
      {
        title: '创建时间',
        dataIndex: 'gmtCreated',
        width: 180,
        key: 'gmtCreated',
        render: (text) => {
          return (
            <div>
              <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>
            </div>
          );
        },
      },
      {
        title: '操作',
        dataIndex: 'handle',
        width: 300,
        key: 'handle',
        render: (text, record) => {
          return (
            <span>
              <Tooltip title="编辑用例集">
                <a
                  className={`${style['icon-bg']}  ${style['border-a-redius-left']}`}
                >
                  <EditOutlined />
                </a>
              </Tooltip>

              <Tooltip title="创建测试任务">
                <a className={`${style['icon-bg']}`}>
                  <FileDoneOutlined />
                </a>
              </Tooltip>
              <Tooltip title="复制用例集">
                <a
                  className={`${style['icon-bg']}  ${style['border-a-redius-right']}`}
                >
                  <CopyOutlined />
                </a>
              </Tooltip>

              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item>
                      <a
                        onClick={() => {
                          Modal.confirm({
                            title: '确认删除用例集吗',
                            content: (
                              <span>
                                当前正在删除&nbsp;&nbsp;
                                <span style={{ color: 'red' }}>
                                  {record.title}
                                </span>
                                &nbsp;&nbsp;用例集，并且删除用例集包含的{' '}
                                <span style={{ color: 'red' }}>
                                  {record.recordNum}
                                </span>{' '}
                                个测试任务与测试结果等信息，此操作不可撤销
                                <br />
                                <br />
                                <Checkbox>我明白以上操作</Checkbox>
                              </span>
                            ),
                            onOk: (e) => {
                              Modal.destroyAll();
                            },
                            icon: <ExclamationCircleOutlined />,
                            cancelText: '取消',
                            okText: '删除',
                          });
                        }}
                      >
                        删除
                      </a>
                    </Menu.Item>
                    <Menu.Item>
                      <a
                        href={`/api/file/export?id=${record.id}`}
                        target="_blank"
                      >
                        导出xmind
                      </a>
                    </Menu.Item>
                  </Menu>
                }
              >
                <a className={`${style['icon-bg']}  ${style['border-around']}`}>
                  <EllipsisOutlined />
                </a>
              </Dropdown>
            </span>
          );
        },
      },
    ];
  }, []);

  const expandColumns: ColumnType<any>[] = useMemo(
    () => [
      {
        title: '任务ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '任务名称',
        dataIndex: 'title',
        key: 'title',
        width: 200,
        render: (text, record) => {
          return (
            <Tooltip title={text}>
              <a className="table-ellipsis">{text}</a>
            </Tooltip>
          );
        },
      },
      {
        title: () => (
          <Tooltip placement="top" title="负责执行任务与标记用例结果">
            <span style={{ cursor: 'pointer' }}>负责人</span>
          </Tooltip>
        ),
        dataIndex: 'owner',
        key: 'owner',
        render: (text) => (
          <Tooltip title={text}>
            <span className="table-ellipsis">{text}</span>
          </Tooltip>
        ),
      },
      {
        title: () => (
          <Tooltip placement="top" title="参与标记用例结果的人员列表">
            <span style={{ cursor: 'pointer' }}>执行人</span>
          </Tooltip>
        ),
        dataIndex: 'executors',
        key: 'executors',
        width: 100,
        render: (text) => (
          <Tooltip title={text}>
            <span className="table-ellipsis">{text}</span>
          </Tooltip>
        ),
      },
      {
        title: '通过率',
        dataIndex: 'successNum',
        key: 'successNum',
        align: 'center',
        render: (text, record) => (
          <span className="table-operation">
            {parseInt(((text / record.totalNum) * 100).toString())}%
          </span>
        ),
      },
      {
        title: '已测用例集',
        dataIndex: 'executeNum',
        key: 'executeNum',
        align: 'center',
        render: (text, record) => (
          <span className="table-operation">
            {text} / {record.totalNum}
          </span>
        ),
      },
      {
        title: '期望时间',
        dataIndex: 'expectStartTime',
        key: 'expectStartTime',
        render: (text, record) =>
          text
            ? `${moment(text).format('YYYY-MM-DD')} 至 ${moment(
                record.expectEndTime,
              ).format('YYYY-MM-DD')}`
            : '',
      },
      {
        title: '操作',
        dataIndex: 'handle',
        key: 'handle',
        render: (text, record) => {
          return (
            <span>
              <Tooltip title="编辑任务">
                <a className="icon-bg border-a-redius-left">
                  <EditOutlined />
                </a>
              </Tooltip>
              <Tooltip title="执行测试">
                <a className="icon-bg">
                  <FileDoneOutlined />
                </a>
              </Tooltip>
              <Tooltip title={`删除任务`}>
                <a
                  onClick={() => {
                    Modal.confirm({
                      title: '确认删除测试任务吗',
                      content: (
                        <span>
                          这将删除该测试任务下所有的测试与测试结果等信息，并且不可撤销。{' '}
                          <br />
                          <Checkbox>我明白以上操作</Checkbox>
                        </span>
                      ),
                      onOk: (e) => {},
                      icon: <ExclamationCircleOutlined />,
                      cancelText: '取消',
                      okText: '删除',
                    });
                  }}
                  className="icon-bg border-a-redius-right margin-3-right"
                >
                  <DeleteOutlined />
                </a>
              </Tooltip>
            </span>
          );
        },
      },
    ],
    [],
  );

  const fetchList = useCallback(async () => {
    let res = await request('/api/case/list', {
      method: 'GET',
      params: {
        pageSize: 10,
        pageNum: 1,
        productLineId: 1,
        caseType: 0,
        channel: 1,
        bizId: state.bizId,
      },
    });
    if (res.code === 200) {
      setDataSource(res.data.dataSources ?? []);
    }
  }, [state.bizId]);

  useEffect(() => {
    fetchList();
  }, [state.bizId]);

  const expandedRowRender = (recocd: any) => {
    console.log(recocd);
    return <Table columns={expandColumns} />;
  };

  return (
    <div>
      <div className={style['table-toolbar']}>
        <div>快速筛选</div>
        <div>
          <Space>
            <Button
              icon={<PlusOutlined />}
              onClick={() => setFastSearchVisible(true)}
            >
              筛选
            </Button>
            <Button
              icon={<SearchOutlined />}
              type="primary"
              onClick={() => setModalVisible(true)}
            >
              新建用例集
            </Button>
          </Space>
        </div>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={dataSource}
        expandable={{
          expandedRowRender,
          rowExpandable: (record) => {
            return record.recordNum > 0;
          },
        }}
      />
      <FastSearch
        visible={fastSearchVisible}
        setVisible={setFastSearchVisible}
        searcherList={searcherList}
        onSearch={onSearch}
      />
      <CaseModal
        visible={modalVisible}
        setVisible={setModalVisible}
        onUpdate={() => {
          fetchList();
        }}
      />
    </div>
  );
};

export default connect(connector)(CaseTable);
