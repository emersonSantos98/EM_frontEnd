export default [
  {
    path: '/security',
    name: 'secuirity',
    children: [
      {
        path: 'forgotPassword',
        name: 'secuirity.forgotPassword',
        component: () => import('@/views/pages/security/ForgotPassword.vue'),
      },
      {
        path: 'twoFactor',
        name: 'secuirity.twoFactor',
        component: () => import('@/views/pages/security/TwoFactor.vue'),
      },
      {
        path: 'resetPassword',
        name: 'secuirity.resetPassword',
        component: () => import('@/views/pages/security/ResetPassword.vue'),
      },
    ],
    meta: {
      layout: 'blank',
      action: 'read',
      subject: 'Security',
      redirectIfLoggedIn: true,
    },
  },
]
