import React, { FC, useState, useEffect, useCallback } from 'react';
import { Tree, Input, Dropdown, Menu, Form, message } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { request } from 'umi';
import { useImmer } from 'use-immer';
import { v1 as uuid } from 'uuid';
import _ from 'lodash';
import style from './style.less';
import { modalConfirm } from '@/utils';
import { CaseModelState, connect, ConnectProps, Dispatch } from 'umi';

const { Search } = Input;
const { DirectoryTree } = Tree;
type TTreeNodes = {
  key: React.Key;
  children: TTreeNodes[];
  parentId?: string;
  text: string;
  id: string;
  [peName: string]: any;
};

enum Tree_Operator {
  AddSibling = 'AddSibling',
  AddChild = 'AddChild',
  Rename = 'Rename',
  Delete = 'Delete',
}

enum Edit_Type {
  add = 'add',
  rename = 'rename',
}

type TEditNode = {
  id: string;
  prevText: string;
};

type Key = string | number;

interface ICaseTypeTree {
  dispatch: Dispatch;
}

const CaseTypeTree: FC<ICaseTypeTree> = ({ dispatch }) => {
  const [form] = Form.useForm();
  const [treeData, setTreeData] = useImmer<TTreeNodes[]>([]);
  const [editType, setEditType] = useState<Edit_Type>(Edit_Type.add);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [editNode, setEditNode] = useState<TEditNode | null>(null);
  const renderTreeNode = useCallback((treeNodes: any): TTreeNodes[] => {
    return treeNodes.map((node: any) => {
      const children = renderTreeNode(node.children);
      return {
        ...node,
        key: node.id,
        children,
      };
    });
  }, []);

  const findNode = useCallback((node: TTreeNodes[], nodeId: string) => {
    let selectPath = '';
    function findPath(n: TTreeNodes[], id: string, path: string) {
      n.some((item, i) => {
        let p = path + (path ? `['children'][${i}]` : `[${i}]`);
        if (item.id === id) {
          selectPath = selectPath || p;
          return path;
        }
        if (item.children.length > 0) {
          return findPath(item.children, id, p);
        }
      });
    }
    findPath(node, nodeId, '');
    return selectPath;
  }, []);

  const addChild = useCallback(
    (node: TTreeNodes) => {
      setEditType(Edit_Type.add);
      const id = uuid();
      setTreeData((draft) => {
        const path = findNode(draft, node.id);
        const treeNode: TTreeNodes = _.result(draft, path);
        const newChild = {
          id,
          key: id,
          children: [],
          parentId: node.id,
          text: '',
        };
        treeNode.children.push(newChild);
      });
      setEditNode({
        id,
        prevText: '',
      });
    },
    [treeData],
  );

  const addSibling = useCallback(
    (node: TTreeNodes) => {
      setEditType(Edit_Type.add);
      const id = uuid();
      setTreeData((draft) => {
        const path = findNode(draft, node.parentId!);
        const treeNode: TTreeNodes = _.result(draft, path);
        const newChild = {
          id,
          key: id,
          children: [],
          parentId: node.parentId,
          text: '',
        };
        treeNode.children.push(newChild);
      });
      setEditNode({
        id,
        prevText: '',
      });
    },
    [treeData],
  );

  const deleteNode = useCallback(
    async (node: TTreeNodes) => {
      try {
        await modalConfirm('是否需要删除');
        await request('/api/dir/delete', {
          method: 'POST',
          data: {
            parentId: node.parentId,
            productLineId: 1,
            delId: node.id,
            channel: 1,
          },
        });
        fetchData();
      } catch (error) {}
    },
    [treeData],
  );

  const renameNode = useCallback(
    (node: TTreeNodes) => {
      setEditType(Edit_Type.rename);
      setEditNode({
        id: node.id,
        prevText: node.text,
      });
    },
    [treeData],
  );

  const handleOperatorClick = useCallback(
    (key: string, node: any) => {
      switch (key) {
        case Tree_Operator.AddChild:
          addChild(node);
          break;
        case Tree_Operator.AddSibling:
          addSibling(node);
          break;
        case Tree_Operator.Delete:
          deleteNode(node);
          break;
        case Tree_Operator.Rename:
          renameNode(node);
          break;
      }
    },
    [treeData],
  );

  const addNode = async (node: any, value: string) => {
    const res = await request('/api/dir/add', {
      method: 'POST',
      data: {
        channel: 1,
        parentId: node.parentId,
        productLineId: 1,
        text: value,
      },
    });
    if (res.code !== 200) {
      message.error(res.msg);
    } else {
      fetchData();
    }
  };

  const rename = async (node: TTreeNodes, value: string) => {
    try {
      const res = await request('/api/dir/rename', {
        method: 'POST',
        data: {
          id: node.id,
          productLineId: 1,
          text: value,
          channel: 1,
        },
      });
      if (res.code === 200) {
        setEditNode(null);
        fetchData();
        message.success('修改成功');
      } else {
        message.error(res.msg);
      }
    } catch (error) {}
  };

  const οnblurInput = (node: any) => {
    if (!form.getFieldValue(node.id)) {
      return;
    }
    switch (editType) {
      case Edit_Type.add:
        addNode(node, form.getFieldValue(node.id));
        break;
      case Edit_Type.rename:
        rename(node, form.getFieldValue(node.id));
        break;
      default:
        break;
    }
  };

  const titleRender = (node: any) => {
    return (
      <div className={style.titleContainer}>
        {node.id === editNode?.id ? (
          <Form.Item name={node.id} noStyle initialValue={node.text}>
            <Input
              size="small"
              autoFocus
              onBlur={() => {
                οnblurInput(node);
              }}
              onPressEnter={() => {
                console.log(form.getFieldValue(node.id));
              }}
            />
          </Form.Item>
        ) : (
          <>
            <div className={style['item-label']}>
              {node.text}
              <span> ({node.caseIds?.length || 0})</span>
            </div>
            <span className={style['tree-operator']}>
              <Dropdown
                overlay={
                  <Menu
                    onClick={(e) => {
                      handleOperatorClick(e.key, node);
                      e.domEvent.stopPropagation();
                    }}
                  >
                    {node.id !== 'root' && (
                      <Menu.Item key={Tree_Operator.AddSibling}>
                        添加同级文件夹
                      </Menu.Item>
                    )}
                    {node.id !== '-1' && (
                      <>
                        <Menu.Item key={Tree_Operator.AddChild}>
                          添加子文件夹
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item key={Tree_Operator.Rename}>重命名</Menu.Item>
                      </>
                    )}

                    {node.id !== '-1' && node.id !== 'root' && (
                      <>
                        <Menu.Divider />
                        <Menu.Item key={Tree_Operator.Delete}>删除</Menu.Item>
                      </>
                    )}
                  </Menu>
                }
              >
                <EllipsisOutlined onClick={(e) => e.stopPropagation()} />
              </Dropdown>
            </span>
          </>
        )}
      </div>
    );
  };

  const fetchData = useCallback(async () => {
    const { data } = await request('api/dir/list', {
      method: 'GET',
      params: {
        productLineId: 1,
        channel: 1,
      },
    });
    const treeNodes = renderTreeNode(data.children);
    setTreeData(treeNodes);
    setExpandedKeys(['root']);
  }, []);

  const onSelect = (keys: Key[]) => {
    console.log(keys);
    dispatch?.({
      type: 'case/search',
      payload: keys[0],
    });
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Form form={form}>
      <Form.Item name="search" noStyle>
        <Search placeholder="搜索类别" />
      </Form.Item>
      <DirectoryTree
        titleRender={titleRender}
        multiple
        onSelect={onSelect}
        // expandedKeys={expandedKeys}
        treeData={treeData}
      ></DirectoryTree>
    </Form>
  );
};

export default connect()(CaseTypeTree);
