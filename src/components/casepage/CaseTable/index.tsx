import React, { FC, useState, useEffect, useCallback, useMemo } from 'react';
import { Table, Button, Tooltip, Dropdown, Menu, Checkbox, Modal } from 'antd';
import {
  EditOutlined,
  FileDoneOutlined,
  CopyOutlined,
  ExclamationCircleOutlined,
  EllipsisOutlined,
} from '@ant-design/icons';
import { ColumnType } from 'antd/es/table';
import FastSearch from '@/components/FastSearch';
import { TSeacher } from '@/components/FastSearch/interface';
import { FormItemType } from '@/components/FormComponents/interface';
import { request, Link } from 'umi';
import moment from 'moment';
import './style.less';

const seacherList: TSeacher[] = [
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

const CaseTable: FC = (props: any) => {
  const [fastSearchVisible, setFastSearchVisible] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const onSeach = useCallback((values: any) => {
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
                <a className="icon-bg border-a-redius-left">
                  <EditOutlined />
                </a>
              </Tooltip>

              <Tooltip title="创建测试任务">
                <a className="icon-bg">
                  <FileDoneOutlined />
                </a>
              </Tooltip>
              <Tooltip title="复制用例集">
                <a className="icon-bg border-a-redius-right margin-3-right">
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
                <a className="icon-bg border-around">
                  <EllipsisOutlined />
                </a>
              </Dropdown>
            </span>
          );
        },
      },
    ];
  }, []);

  const fetchList = useCallback(async () => {
    let { data } = await request('/api/case/list', {
      method: 'GET',
      params: {
        pageSize: 10,
        pageNum: 1,
        productLineId: 1,
        caseType: 0,
        channel: 1,
        bizId: 'root',
      },
    });
    setDataSource(data.dataSources ?? []);
  }, []);
  useEffect(() => {
    fetchList();
  }, []);
  return (
    <div>
      <div>
        <Button type="primary" onClick={() => setFastSearchVisible(true)}>
          快速检索
        </Button>
      </div>
      <Table columns={columns} dataSource={dataSource} />
      <FastSearch
        visible={fastSearchVisible}
        setVisible={setFastSearchVisible}
        seacherList={seacherList}
        onSeach={onSeach}
      />
    </div>
  );
};

export default CaseTable;
