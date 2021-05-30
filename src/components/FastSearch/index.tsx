import React, { FC, useState, useEffect, useMemo } from 'react';

import type { TFastSeacherProps } from './interface';
import { Form, Button, Drawer } from 'antd';
import { renderForm } from './utils';

const FastSearch: FC<TFastSeacherProps> = ({
  visible,
  setVisible,
  seacherList,
  onSeach,
}) => {
  const [form] = Form.useForm();
  const handleSeach = () => {
    let value = form.getFieldsValue();
    onSeach?.(value);
  };
  const footer = useMemo(
    () => (
      <>
        <Button onClick={() => form.resetFields()}>重置</Button>
        <Button type="primary" onClick={handleSeach}>
          搜索
        </Button>
      </>
    ),
    [],
  );
  return (
    <Drawer
      visible={visible}
      onClose={() => setVisible(false)}
      title="快速筛选"
      footer={footer}
    >
      <Form form={form}>
        {seacherList.map((item, index) => renderForm(item, index))}
      </Form>
    </Drawer>
  );
};

export default FastSearch;
