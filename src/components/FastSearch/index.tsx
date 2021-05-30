import React, { FC, useState, useEffect, useMemo } from 'react';

import type { TFasTSearcherProps } from './interface';
import { Form, Button, Drawer } from 'antd';
import { renderForm } from './utils';

const FastSearch: FC<TFasTSearcherProps> = ({
  visible,
  setVisible,
  searcherList,
  onSearch,
}) => {
  const [form] = Form.useForm();
  const handleSearch = () => {
    let value = form.getFieldsValue();
    onSearch?.(value);
  };
  const footer = useMemo(
    () => (
      <>
        <Button onClick={() => form.resetFields()}>重置</Button>
        <Button type="primary" onClick={handleSearch}>
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
        {searcherList.map((item, index) => renderForm(item, index))}
      </Form>
    </Drawer>
  );
};

export default FastSearch;
