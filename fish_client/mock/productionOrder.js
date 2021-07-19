// eslint-disable-next-line import/no-extraneous-dependencies
import { parse } from 'url';
import moment from 'moment';

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
    let total_make_price = cost_price * inventory_num
    tableListDataSource.push({
      key: i,
      type: [`🦟 ${i}钩`, `🐜 ${i}钩`, `🐍 ${i}钩`, `🐞 ${i}钩`, `🦐 ${i}钩`][getRandomInt(5)],
      url: ['http://121.5.231.10:3000/users/woyao.jpg', 'http://121.5.231.10:3000/users/psb.jpeg'][getRandomInt(2)],
      inventory_num,
      unit_price,
      total_price,
      cost_price,
      total_make_price,
      status: getRandomInt(2).toString(),
    });
  }
  return tableListDataSource
}

const userList = [
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
let productList = genProductList(100)

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
      status: getRandomInt(2).toString(),
      make_time: new Date(),
    });
  }
  return tableListDataSource
}

let productionOrderList = genProductionOrderList(100)

function getCurrentUser(req) {
  const cookie = req.get('cookie')
  const token = cookie.split('token=')[1]
  const user = userList.find(user => user.token == token)
  return user
}

function getRule(req, res, u) {
  let realUrl = u;
  let currentUser = getCurrentUser(req)

  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }

  const { current = 1, pageSize = 10 } = req.query;
  const params = parse(realUrl, true).query;

  let tableDataSource = productionOrderList.slice()
  if (currentUser.authority === 'operator') {
    tableDataSource = tableDataSource.filter((data) => data.username.includes(currentUser.username || ''))
  }
  if (params.username) {
    tableDataSource = tableDataSource.filter((data) => data.username.includes(params.username || ''));
  }
  if (params.type) {
    tableDataSource = tableDataSource.filter((data) => data.type.includes(params.type || ''));
  }

  if (params.status) {
    tableDataSource = tableDataSource.filter((data) => data.status.includes(params.status || ''));
  }

  if (params.timeQuantum) {
    const [startTime, endTime] = params.timeQuantum
    const dateForm = 'YYYY/MM/DD HH:mm'
    const st = moment(startTime, dateForm)
    const et = moment(endTime, dateForm)
    tableDataSource = tableDataSource.filter((data) => {
      return moment(data.make_time).isBetween(st, et)
    });
  }
  let dataSource = [...tableDataSource].slice((current - 1) * pageSize, current * pageSize);
  const sorter = JSON.parse(params.sorter);

  if (sorter) {
    dataSource = dataSource.sort((prev, next) => {
      let sortNumber = 0;
      Object.keys(sorter).forEach((key) => {
        if (sorter[key] === 'descend') {
          if (prev[key] - next[key] > 0) {
            sortNumber += -1;
          } else {
            sortNumber += 1;
          }

          return;
        }

        if (prev[key] - next[key] > 0) {
          sortNumber += 1;
        } else {
          sortNumber += -1;
        }
      });
      return sortNumber;
    });
  }

  if (params.filter) {
    const filter = JSON.parse(params.filter);

    if (Object.keys(filter).length > 0) {
      dataSource = dataSource.filter((item) => {
        return Object.keys(filter).some((key) => {
          if (!filter[key]) {
            return true;
          }

          if (filter[key].includes(`${item[key]}`)) {
            return true;
          }

          return false;
        });
      });
    }
  }


  const result = {
    data: dataSource,
    total: tableDataSource.length,
    success: true,
    pageSize,
    current: parseInt(`${params.currentPage}`, 10) || 1,
  };
  return res.json(result);
}

function postRule(req, res, u, b) {
  let realUrl = u;

  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }

  const body = (b && b.body) || req.body;
  const { key, type, url, make_num, make_price, total_make_price, make_time, username, method } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      (() => {
        productionOrderList = productionOrderList.filter((item) => item.key !== key);
        return res.json({ success: true })
      })()
      return

    case 'post':
      (() => {
        const i = Math.ceil(Math.random() * 10000);
        const newRule = {
          key: productionOrderList.length,
          type,
          url,
          make_num,
          make_price,
          total_make_price,
          make_time,
          username
        };
        productionOrderList.unshift(newRule);
        return res.json(newRule);
      })();

      return;

    case 'update':
      (() => {
        let newRule = {};
        productionOrderList = productionOrderList.map((item) => {
          if (item.key === key) {
            let make_time = new Date()
            newRule = { ...item, make_time, make_num, make_price, total_make_price };
            return newRule;
          }

          return item;
        });
        return res.json(newRule);
      })();

      return;

    default:
      break;
  }
}

export default {
  'GET /api/productionOrderQuery': getRule,
  'POST /api/productionOrderQuery': postRule,
};
