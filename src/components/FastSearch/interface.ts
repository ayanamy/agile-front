import React from 'react';
import {
  TFormDatePicker,
  TFormInput,
  TFormSelect,
} from '@/components/FormComponents/interface';

export type TSeacherType = 'input' | 'Select' | 'datepicker';

export type TSeacher = TFormDatePicker | TFormInput | TFormSelect;

export type TFastSeacherProps = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  seacherList: TSeacher[];
  onSeach?: (value: any) => void;
};
