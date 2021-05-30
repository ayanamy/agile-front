import React from 'react';
import {
  TFormDatePicker,
  TFormInput,
  TFormSelect,
} from '@/components/FormComponents/interface';

export type TSearcherType = 'input' | 'Select' | 'datepicker';

export type TSearcher = TFormDatePicker | TFormInput | TFormSelect;

export type TFastSearcherProps = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  seacrherList: TSearcher[];
  onSearch?: (value: any) => void;
};
