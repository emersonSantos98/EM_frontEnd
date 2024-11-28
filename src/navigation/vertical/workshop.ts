export default [
  {
    title: 'Oficina',
    icon: { icon: 'tabler-building-factory' },
    children: [
      {
        title: 'Oficinas e Costureiras',
        children: [
          {
            title: 'List',
            to: 'apps-workshop-externalservices-list',
            action: 'manage',
            subject: 'all',
          },
          {
            title: 'Add',
            to: 'apps-workshop-externalservices-add',
            action: 'manage',
            subject: 'all',
          },
        ],
      },
    ],

  },
]
