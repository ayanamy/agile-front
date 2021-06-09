import { ImmerReducer } from 'umi';

export interface CaseModelState {
  bizId: string;
}

export interface CaseModleType {
  namespace: 'case';
  state: CaseModelState;
  reducers: {
    search: ImmerReducer<CaseModelState>;
  };
}

const CaseModel: CaseModleType = {
  namespace: 'case',
  state: {
    bizId: 'root',
  },
  reducers: {
    search(state, action) {
      console.log(state, action);
      state.bizId = action.payload;
    },
  },
};

export default CaseModel;
