import { InputProps } from 'antd/es/input';
import { SelectProps, SelectValue } from 'antd/es/select';
import { DatePickerProps } from 'antd/es/date-picker';
import { FormItemProps } from 'antd/es/form';

export enum FormItemType {
  Input = 'input',
  Select = 'select',
  DatePicker = 'datepicker',
}

export type TFormInput = {
  type: FormItemType.Input;
  tagProps?: InputProps;
  formItemProps?: FormItemProps;
};

export type TFormSelect = {
  type: FormItemType.Select;
  tagProps?: SelectProps<SelectValue>;
  formItemProps?: FormItemProps;
};

export type TFormDatePicker = {
  type: FormItemType.DatePicker;
  tagProps?: DatePickerProps;
  formItemProps?: FormItemProps;
};
