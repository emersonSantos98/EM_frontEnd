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
      {
        title: 'Produtos',
        children: [
          {
            title: 'List',
            to: 'apps-workshop-product-list',
            action: 'manage',
            subject: 'all',
          },
          {
            title: 'Add',
            to: 'apps-workshop-product-add',
            action: 'manage',
            subject: 'all',
          },
          {
            title: 'Gestão de Estoque',
            to: 'apps-workshop-product-stock',
            action: 'manage',
            subject: 'all',
          },
          {
            title: 'Movimentação de Estoque',
            to: 'apps-workshop-product-stock-movement',
            action: 'manage',
            subject: 'all',
          },
        ],
      },
    ],

  },
]
