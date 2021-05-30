import React from 'react';
import type { TSeacher } from './interface';
import { Select, Input, DatePicker } from '@/components/FormComponents';
import { Form } from 'antd';
import {
  TFormDatePicker,
  TFormInput,
  TFormSelect,
} from '@/components/FormComponents/interface';
import { render } from 'react-dom';

const FormItem = Form.Item;

function isSelect(seacher: TSeacher): seacher is TFormSelect {
  return seacher.type === 'select';
}

function isInput(seacher: TSeacher): seacher is TFormInput {
  return seacher.type === 'input';
}

function isDatePicker(seacher: TSeacher): seacher is TFormDatePicker {
  return seacher.type === 'datepicker';
}

const renderFormItem = (seacher: TSeacher) => {
  if (isInput(seacher)) {
    return <Input {...seacher.tagProps} />;
  }
  if (isSelect(seacher)) {
    return <Select {...seacher.tagProps} />;
  }
  if (isDatePicker(seacher)) {
    return <DatePicker {...seacher.tagProps} />;
  }
};

export const renderForm = (seacher: TSeacher, key: React.Key) => {
  return (
    <FormItem key={key} {...seacher.formItemProps}>
      {renderFormItem(seacher)}
    </FormItem>
  );
};
