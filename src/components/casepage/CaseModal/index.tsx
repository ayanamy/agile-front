import React, { FC, useState, useEffect, useCallback, useMemo } from 'react';
import { Modal, Form, Input, TreeSelect, Upload, message } from 'antd';
import { FileAddFilled, FileDoneOutlined } from '@ant-design/icons';
import { request } from 'umi';
type TCaseModal = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdate?: () => void;
  caseId?: number;
  isCopy: boolean;
};
const FormItem = Form.Item;
const { TextArea } = Input;
const { Dragger } = Upload;
const initData = `{"root":{"data":{"id":"bv8nxhi3c800","created":1562059643204,"text":"中心主题"},"children":[]},"template":"default","theme":"fresh-blue","version":"1.4.43","base":0}`;

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const { TreeNode } = TreeSelect;
const CaseModal: FC<TCaseModal> = ({
  visible,
  setVisible,
  onUpdate,
  caseId,
  isCopy,
}) => {
  const [form] = Form.useForm();
  const [treeData, setTreeData] = useState([]);
  const [uploadFile, setUploadFile] = useState<any>(null);
  useEffect(() => {
    async function initTreeData() {
      const { data } = await request('./api/dir/cardTree', {
        method: 'GET',
        params: {
          productLineId: 1,
          channel: 1,
        },
      });
      setTreeData(data?.children);
    }
    initTreeData();
  }, []);
  useEffect(() => {
    (async () => {
      if (visible) {
        if (caseId) {
          const res = await request(`api/case/detail?caseId=${caseId}`);
          if (res.code === 200) {
            const bizIds = res.data.biz.map(
              ({ bizId }: { bizId: string }) => bizId,
            );
            const data = {
              ...res.data,
              bizId: bizIds,
            };
            if (isCopy) {
              data.title = `copy of ${data.title}`;
            }
            form.setFieldsValue(data);
          }
        } else {
          form.resetFields();
          setUploadFile(null);
        }
      }
    })();
  }, [visible, caseId]);
  const onCancel = () => {
    form.resetFields();
    setVisible(false);
  };
  const title = isCopy ? '复制用例集' : '新建用例集';
  const renderTreeNode = useMemo(() => {
    const renderNodes = (nodes: any) => {
      return nodes.map((item: any) => {
        return (
          <TreeNode value={item.id} title={item.text} key={item.id}>
            {renderNodes(item.children)}
          </TreeNode>
        );
      });
    };
    return renderNodes(treeData);
  }, [treeData]);
  const onOk = async () => {
    try {
      const values = await form.validateFields();
      let url = 'api/case/create';
      const formData = new FormData();
      let params = {
        productLineId: 1,
        creator: 'admin',
        caseType: 0,
        caseContent: initData,
        title: values.title,
        channel: 1,
        bizId: values.bizId ? values.bizId.join(',') : '-1',
        id: '',
        requirementId: values.requirementId,
        description: values.description,
      };
      if (uploadFile) {
        url = 'api/file/import';
        Object.entries(params).forEach(([key, value]) => {
          formData.append(key, value);
        });
        formData.append('file', uploadFile);
      }
      const res = await request(url, {
        method: 'POST',
        data: uploadFile ? formData : params,
      });
      if (res.code === 200) {
        message.success('新建测试用例集成功');
        setVisible(false);
        form.resetFields();
        onUpdate?.();
      }
    } catch (error) {}
  };
  return (
    <Modal
      visible={visible}
      width={500}
      onCancel={onCancel}
      onOk={onOk}
      title={title}
    >
      <Form form={form} size="small" {...layout}>
        <FormItem
          label="用例集名称"
          rules={[
            {
              required: true,
              message: '请填写用例集名称',
            },
          ]}
          name="title"
        >
          <Input placeholder="请填写用例集名称" />
        </FormItem>
        <FormItem label="关联需求" name="requirementId">
          <Input placeholder="关联需求" />
        </FormItem>
        <FormItem
          label="用例集分类"
          name="bizId"
          rules={[
            {
              required: true,
              message: '请选择分类',
            },
          ]}
        >
          <TreeSelect
            showSearch
            allowClear
            multiple
            treeDefaultExpandAll
            // treeCheckable={true}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          >
            {renderTreeNode}
          </TreeSelect>
        </FormItem>
        <FormItem label="描述" name="description">
          <TextArea />
        </FormItem>
        <FormItem label="导入xmind">
          <Dragger
            accept=".xmind"
            onRemove={(file) => setUploadFile(null)}
            beforeUpload={(file) => {
              setUploadFile(file);
              const isLt2M = file.size / 1024 / 1024 <= 100;
              if (!isLt2M) {
                message.error('用例集文件大小不能超过100M');
              }
              return false;
            }}
            fileList={uploadFile ? [uploadFile] : []}
          >
            {uploadFile ? (
              <FileDoneOutlined
                style={{ color: '#447CE6', fontSize: '24px' }}
              />
            ) : (
              <FileAddFilled style={{ color: '#447CE6', fontSize: '24px' }} />
            )}
          </Dragger>
        </FormItem>
      </Form>
    </Modal>
  );
};

export default CaseModal;
