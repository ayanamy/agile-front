import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  proxy: {
    '/api': {
      target: `http://localhost:8080`, // 测试环境
      changeOrigin: true,
    },
  },
  routes: [
    {
      path: '/',
      component: '@/layout',
      routes: [
        {
          path: '/',
          component: '@/pages/casePage',
        },
      ],
    },
    {
      path: '/test',
      component: '@/pages/testTask',
    },
  ],
  fastRefresh: {},
});
