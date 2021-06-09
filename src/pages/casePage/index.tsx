import React, { useState } from 'react';
import { CaseTable, CaseTypeTree } from '@/components/casepage';
import style from './style.less';

const CasePage = () => {
  return (
    <div className={style.casepage}>
      <div className={style.casetree}>
        <CaseTypeTree />
      </div>
      <div className={style.casetable}>
        <CaseTable />
      </div>
    </div>
  );
};

export default CasePage;
