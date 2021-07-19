// eslint-disable-next-line import/no-extraneous-dependencies
import { parse } from 'url';
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

let productList = genProductList(100)

function getRule(req, res, u) {
  let realUrl = u;

  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }

  let tableListDataSource = productList.slice()

  const { current = 1, pageSize = 10 } = req.query;
  const params = parse(realUrl, true).query;
  if (params.type) {
    tableListDataSource = tableListDataSource.filter((data) => data.type.includes(params.type || ''));
  }

  if (params.status) {
    tableListDataSource = tableListDataSource.filter((data) => data.status.includes(params.status || ''));
  }
  let dataSource = [...tableListDataSource].slice((current - 1) * pageSize, current * pageSize);
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
    total: tableListDataSource.length,
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
  const { method, type, inventory_num, unit_price, total_price, cost_price, total_make_price, status, key } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      productList = productList.filter((item) => key.indexOf(item.key) === -1);
      break;

    case 'post':
      (() => {
        const i = Math.ceil(Math.random() * 10000);
        const newRule = {
          key: productList.length,
          type,
          inventory_num,
          unit_price,
          total_price,
          cost_price,
          total_make_price,
          status,
          url: 'http://121.5.231.10:3000/users/psb.jpeg'
        };
        productList.unshift(newRule);
        return res.json(newRule);
      })();

      return;

    case 'update':
      (() => {
        let newRule = {};
        productList = productList.map((item) => {
          if (item.key === key) {
            newRule = { ...item, type, inventory_num, unit_price, total_price, cost_price, total_make_price, status, key };
            return { ...item, type, inventory_num, unit_price, total_price, cost_price, total_make_price, status, key };
          }

          return item;
        });
        return res.json(newRule);
      })();

      return;

    default:
      break;
  }

  const result = {
    list: productList,
    pagination: {
      total: productList.length,
    },
  };
  res.json(result);
}

const getInventoryNumByType = async (req, res, u) => {
  const params = parse(req.url, true).query;
  const { type } = params
  const result = productList.find(item => item.type === type)?.inventory_num
  return res.json({
    data: result,
    success: result ? true : false,
  })
}

const getProductionStatusOk = async (req, res, u) => {
  return res.json({
    data: productList.filter(item => item.status == '1'),
    success: true
  })
}

export default {
  'GET /api/productionQuery': getRule,
  'GET /api/productionQueryByType': getInventoryNumByType,
  'GET /api/productionStatusOk': getProductionStatusOk,
  'POST /api/productionQuery': postRule,
};
