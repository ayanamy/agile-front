import React, { FC, useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import style from './style.less';
type TTaskModal = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  caseId: number;
  taskData?: any;
  onUpdate?: (caseId: number) => void;
};
import { Modal, Form, Input, DatePicker, Radio, Select, message } from 'antd';
import { request } from 'umi';
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const grade = ['P0', 'P1', 'P2'];
const FormItem = Form.Item;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;
const TaskModal: FC<TTaskModal> = ({
  visible,
  setVisible,
  caseId,
  taskData,
  onUpdate,
}) => {
  const [form] = Form.useForm();
  const [tagList, setTagList] = useState([]);
  useEffect(() => {
    async function countByCondition() {
      const res = await request('/api/case/countByCondition', {
        method: 'GET',
        params: {
          caseId,
          priority: '',
          resource: '',
        },
      });
      if (res.code === 200) {
        setTagList(res.data?.taglist ?? []);
      }
    }
    if (visible) {
      countByCondition();
      if (taskData) {
        let priority = [],
          radioValue = '0',
          resource = [];
        if (taskData.chooseContent && !taskData.chooseContent.includes('0')) {
          priority = JSON.parse(taskData.chooseContent).priority;
          resource = JSON.parse(taskData.chooseContent).resource;
          radioValue = '1';
        }
        form.setFieldsValue({
          ...taskData,
          radioValue,
          priority,
          resource,
        });
      }
    }
  }, [visible, caseId, taskData]);
  const onSubmit = async () => {
    try {
      const values = await form.validateFields();
      const chooseContent = JSON.stringify({
        priority: values.radioValue === '0' ? ['0'] : values.priority,
        resource: values.radioValue === '0' ? ['0'] : values.resource,
      });
      const expectStartTime = values.cyclePlan
        ? values.cyclePlan[0].startOf('day').valueOf()
        : '';
      const expectEndTime = values.cyclePlan
        ? values.cyclePlan[1].startOf('day').valueOf()
        : '';

      const fields = _.pick(values, ['title', 'owner', 'description']);
      const params = {
        ...fields,
        expectStartTime,
        expectEndTime,
        caseId,
        id: taskData?.id,
        modifier: taskData ? 'admin' : undefined,
        creator: taskData ? undefined : 'admin',
        chooseContent,
      };
      let url = `/api/record/${taskData ? 'edit' : 'create'}`;
      const res = await request(url, {
        method: 'POST',
        data: params,
      });
      if (res.code === 200) {
        onUpdate?.(caseId);
        message.success(`${taskData ? '修改' : '新增'}成功`);
        closeModal();
      } else {
        message.error(res.msg);
      }
    } catch (error) {}
  };
  const title = taskData ? '编辑任务' : '新增任务';
  const onRadioChange = () => {
    const radioValue = form.getFieldValue('radioValue');
    if (radioValue === '0') {
      form.setFieldsValue({
        priority: [],
        resource: [],
      });
    }
  };
  const closeModal = () => {
    setVisible(false);
    form.resetFields();
  };
  return (
    <Modal
      visible={visible}
      onOk={onSubmit}
      onCancel={closeModal}
      width={500}
      title={title}
    >
      <Form
        form={form}
        {...layout}
        onChange={() => {
          console.log(1);
        }}
      >
        <FormItem
          label="名称"
          rules={[
            {
              required: true,
              message: '名称必填',
            },
          ]}
          name="title"
        >
          <Input placeholder="请输入名称" />
        </FormItem>
        <FormItem label="负责人" name="owner" initialValue="">
          <Input placeholder="请输入负责人" />
        </FormItem>
        <FormItem label="描述" name="description">
          <TextArea />
        </FormItem>
        <FormItem label="计划周期" name="cyclePlan">
          <RangePicker />
        </FormItem>
        <FormItem dependencies={['radioValue', 'priority', 'resource']} noStyle>
          {({ getFieldValue }) => {
            const disabled = getFieldValue('radioValue') === '0';
            return (
              <FormItem
                label="选择测试用例"
                name="radioValue"
                className={style['no-magin-bottom']}
                dependencies={['radioValue', 'priority', 'resource']}
                initialValue={'0'}
              >
                <Radio.Group onChange={onRadioChange}>
                  <Radio className={style.radio} value={'0'}>
                    包含全部用例
                    <br />
                    <p className={style['small-size-font']}>
                      覆盖全部可用用例（共计0个），如果用例集库有新增的用例，会自动加入到本计划中
                    </p>
                  </Radio>
                  <Radio className={style.radio} value={'1'}>
                    手动圈选用例集
                    <br />
                    <FormItem
                      label="优先级"
                      name="priority"
                      style={{ marginBottom: '8px', marginTop: '8px' }}
                      labelCol={{ span: 4 }}
                      wrapperCol={{ span: 20 }}
                    >
                      <Select
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        size="small"
                        mode="multiple"
                        placeholder="用例等级"
                        disabled={disabled}
                      >
                        {grade.map((item, index) => (
                          <Option value={index.toString()} key={index + 1}>
                            {item}
                          </Option>
                        ))}
                      </Select>
                    </FormItem>
                    <FormItem
                      label="标签"
                      name="resource"
                      className={style['no-magin-bottom']}
                      labelCol={{ span: 4 }}
                      wrapperCol={{ span: 20 }}
                    >
                      <Select
                        size="small"
                        mode="multiple"
                        placeholder="请选择标签"
                        disabled={disabled}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        {tagList.map((item, index) => (
                          <Option value={item} key={item}>
                            {item}
                          </Option>
                        ))}
                      </Select>
                    </FormItem>
                  </Radio>
                </Radio.Group>
              </FormItem>
            );
          }}
        </FormItem>
      </Form>
    </Modal>
  );
};

export default TaskModal;
