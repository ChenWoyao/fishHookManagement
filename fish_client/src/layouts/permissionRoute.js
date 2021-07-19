export default [
  {
    path: '/admin',
    authority: ['admin', 'superadmin'],
  },
  {
    path: '/admin/production-order-status-query',
    authority: ['admin', 'superadmin'],
  },
  {
    path: '/admin/product-information-query',
    authority: ['admin', 'superadmin'],
  },
  {
    path: '/admin/sales-order-status-query',
    authority: ['admin', 'superadmin'],
  },
  {
    path: '/admin/user-management',
    authority: ['admin', 'superadmin'],
  },
  {
    path: '/inspector',
    authority: ['inspector'],
  },
  {
    path: '/inspector/product-information-query',
    authority: ['inspector'],
  },
  {
    path: '/inspector/production-order-status-query',
    authority: ['inspector'],
  },
  {
    path: '/operator/production-order-status-query',
    authority: ['operator'],
  },
]
