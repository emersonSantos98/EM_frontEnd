export default [
  {
    title: 'Roles & Permissions',
    icon: { icon: 'tabler-lock' },
    children: [
      {
        title: 'Roles',
        to: 'permission-roles-roles',
        action: 'read',
        subject: 'Auth',
      },
      {
        title: 'Permissions',
        to: 'permission-roles-permissions',
        action: 'read',
        subject: 'Auth',
      },
    ],
  },
]
