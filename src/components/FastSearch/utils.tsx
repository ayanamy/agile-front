import React from 'react';
import type { TSearcher } from './interface';
import { Select, Input, DatePicker } from '@/components/FormComponents';
import { Form } from 'antd';
import {
  TFormDatePicker,
  TFormInput,
  TFormSelect,
} from '@/components/FormComponents/interface';

const FormItem = Form.Item;

function isSelect(searcher: TSearcher): searcher is TFormSelect {
  return searcher.type === 'select';
}

function isInput(searcher: TSearcher): searcher is TFormInput {
  return searcher.type === 'input';
}

function isDatePicker(searcher: TSearcher): searcher is TFormDatePicker {
  return searcher.type === 'datepicker';
}

const renderFormItem = (searcher: TSearcher) => {
  if (isInput(searcher)) {
    return <Input {...searcher.tagProps} />;
  }
  if (isSelect(searcher)) {
    return <Select {...searcher.tagProps} />;
  }
  if (isDatePicker(searcher)) {
    return <DatePicker {...searcher.tagProps} />;
  }
};

export const renderForm = (searcher: TSearcher, key: React.Key) => {
  return (
    <FormItem key={key} {...searcher.formItemProps}>
      {renderFormItem(searcher)}
    </FormItem>
  );
};
