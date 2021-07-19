function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const getRandomBetween = (min, max) => {
  const random = Math.random() // [0, 1)
  const space = max - min
  let val = space * random
  val = Number(val.toFixed(1))
  let result = val + min
  result = Number(result.toFixed(1))
  return result
}

const getRandomIntBetween = (min, max) => {
  const random = Math.random()
  const space = max - min
  return Math.ceil(space * random) + min
}


const genProductList = (num) => {
  const tableListDataSource = [];
  for (let i = 0; i < num; i++) {
    let inventory_num = getRandomInt(10001)
    let unit_price = getRandomIntBetween(1, 50)
    let total_price = inventory_num * unit_price
    let cost_price = unit_price * getRandomBetween(0.1, 0.6)
    let total_make_price = cost_price(inventory_num)
    tableListDataSource.push({
      key: i,
      type: [`🦟 ${i}钩`, `🐜 ${i}钩`, `🐍 ${i}钩`, `🐞 ${i}钩`, `🦐 ${i}钩`][makeRandomBeforeNumber(5)],
      url: ['http://121.5.231.10:3000/users/woyao.jpg', 'http://121.5.231.10:3000/users/psb.jpeg'][makeRandomBeforeNumber(2)],
      inventory_num,
      unit_price,
      total_price,
      cost_price,
      total_make_price,
      status: getRandomInt(2).toString(),
    });
  }
}

export const productList = genProductList(100)

export const userList = [
  {
    username: 'superadmin',
    password: 'superadmin',
    token: 'superadmin_token',
    userid: 1,
    phone: '18569063402',
    authority: 'superadmin'
  },
  {
    username: 'admin',
    password: 'admin',
    token: 'admin_token',
    userid: 2,
    phone: '18569063403',
    authority: 'admin'
  },
  {
    username: 'operator',
    password: 'operator',
    token: 'operator_token',
    userid: 3,
    phone: '18569063404',
    authority: 'operator'
  },
  {
    username: 'inspector',
    password: 'inspector',
    token: 'inspector_token',
    userid: 4,
    phone: '18569063405',
    authority: 'inspector'
  },
  {
    username: 'user',
    password: 'user',
    userid: 5,
    phone: '18569063406',
    authority: 'user'
  },
  {
    username: '小明',
    password: 'operator',
    token: 'operator_token1',
    userid: 6,
    phone: '18569063407',
    authority: 'operator'
  },
  {
    username: '小红',
    password: 'operator',
    token: 'operator_token2',
    userid: 7,
    phone: '18569063408',
    authority: 'operator'
  },
  {
    username: '小王',
    password: 'operator',
    token: 'operator_token3',
    userid: 8,
    phone: '18569063409',
    authority: 'operator'
  },
]

const genProductionOrderList = (num) => {
  const tableListDataSource = [];
  for (let i = 0; i < num; i++) {
    let user = userList[getRandomInt(userList.length)]
    let product = productList[getRandomInt(productList.length)]
    let make_num = getRandomIntBetween(10, 100)
    product.inventory_num += make_num

    tableListDataSource.push({
      key: i,
      username: user.username,
      userid: user.userid,
      type: product.type,
      url: product.url,
      make_num,
      make_price: product.cost_price,
      total_make_price: make_num * product.cost_price,
      product_key: product.key,
      make_time: new Date(),
    });
  }
}

export const productionOrderList = getProductionOrderList(100)

const genSaleOrderList = (num) => {
  const tableListDataSource = [];
  for (let i = 0; i < num; i++) {
    let user = userList[getRandomInt(userList.length)]
    let product = productList[getRandomInt(productList.length)]
    let sale_num = getRandomInt(product.inventory_num)
    product.inventory_num -= sale_num

    tableListDataSource.push({
      key: i,
      username: user.username,
      userid: user.userid,
      type: product.type,
      url: product.url,
      sale_num,
      sale_num: product.unit_price,
      total_sale_price: sale_num * product.unit_price,
      product_key: product.key,
      make_time: new Date(),
    });
  }
}

export const saleOrdserList = genSaleOrderList(100)
