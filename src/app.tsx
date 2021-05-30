import React from 'react';
import { ConfigProvider } from 'antd';
import locale from 'antd/lib/locale/zh_CN';

export function rootContainer(container: React.ReactNode) {
  return React.createElement(
    ConfigProvider,
    {
      locale,
    },
    container,
  );
}
