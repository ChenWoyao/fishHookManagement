import { parse } from 'url';

let userList = [
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

const waitTime = (time = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

async function getFakeCaptcha(req, res) {
  await waitTime(2000);
  return res.json('captcha-xxx');
} // 代码中会兼容本地 service mock 以及部署站点的静态数据

function getRule(req, res, u) {
  let realUrl = u;

  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }

  let tableListDataSource = userList.slice()
  const { current = 1, pageSize = 10 } = req.query;
  const params = parse(realUrl, true).query;
  if (params.authority) {
    tableListDataSource = tableListDataSource.filter((data) => data.authority === params.authority);
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
  const { username, authority, phone, password, userid, method } = body;

  switch (method) {
    case 'update':
      (() => {
        let newRule = {};
        userList = userList.map((item) => {
          if (item.userid === userid) {
            newRule = { ...item, authority };
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

  const result = {
    list: userList,
    pagination: {
      total: userList.length,
    },
  };
  res.json(result);
}

export default {
  // 支持值为 Object 和 Array
  'GET /api/currentUser': {
    name: '小明哥',
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    userid: 1,
    phone: '86-18569063403',
  },
  // GET POST 可省略
  'GET /api/users': getRule,
  "GET /api/user/authority": async (req, res) => {
    const params = parse(req.url, true).query;
    const { userid } = params
    const { authority } = userList.find(item => item.userid == userid)
    if (authority === 'superadmin') {
      return res.json({
        success: true,
        data: ['admin', 'operator', 'inspector', 'user']
      })
    }
    if (authority === 'admin') {
      return res.json({
        data: ['operator', 'inspector', 'user'],
        success: true
      })
    }
    return res.json({
      success: false,
      data: []
    })
  },
  'POST /api/users': postRule,
  'POST /api/login/account': async (req, res) => {
    const { password, username } = req.body;
    await waitTime(200);

    if (password === 'superadmin' && username === 'superadmin') {
      res.send({
        status: 'ok',
        currentAuthority: 'superadmin',
        token: 'superadmin_token'
      });
      return;
    }

    if (password === 'admin' && username === 'admin') {
      res.send({
        status: 'ok',
        currentAuthority: 'admin',
        token: 'admin_token'
      });
      return;
    }

    if (password === 'inspector' && username === 'inspector') {
      res.send({
        status: 'ok',
        currentAuthority: 'inspector',
        token: 'inspector_token'
      });
      return;
    }

    if (password === 'operator' && username === 'operator') {
      res.send({
        status: 'ok',
        currentAuthority: 'operator',
        token: 'operator_token'
      });
      return;
    }
    console.log("login failure")
    res.send({
      status: 'error',
      currentAuthority: 'user',
    });
  },
  'POST /api/register': (req, res) => {
    res.send({
      status: 'ok',
      currentAuthority: 'operator',
    });
  },
  'GET /api/500': (req, res) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req, res) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET  /api/login/captcha': getFakeCaptcha,
};
