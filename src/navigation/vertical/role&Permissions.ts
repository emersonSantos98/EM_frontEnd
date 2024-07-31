export default [
  {
    title: 'Roles & Permissions',
    icon: { icon: 'tabler-lock' },
    children: [
      {
        title: 'Roles',
        to: 'permission-roles-roles',
        action: 'manage',
        subject: 'all',
      },
      {
        title: 'Permissions',
        to: 'permission-roles-permissions',
        action: 'manage',
        subject: 'all',
      },
    ],
  },
]
