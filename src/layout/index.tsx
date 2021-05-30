import React, { FC } from 'react';
import { Layout } from 'antd';
import './style.less';
const { Content, Sider, Header } = Layout;
const BasicLayout: FC = ({ children }) => {
  return (
    <Layout className="base-layout">
      <Header>header</Header>
      <Content>{children}</Content>
    </Layout>
  );
};

export default BasicLayout;
