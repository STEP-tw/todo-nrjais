const qs = require('querystring');

const accumulate = (o, kv) => {
  let parts = kv.split('=');
  o[parts[0].trim()] = parts[1].trim();
  return o;
};

let redirect = function (path) {
  console.log(`redirecting to ${path}`);
  this.statusCode = 302;
  this.setHeader('location', path);
  this.end();
};

const parseCookies = text => {
  try {
    return text && text.split(';').reduce(accumulate, {}) || {};
  } catch (e) {
    return {};
  }
}
let invoke = function (req, res) {
  this.handlerCalled = false;
  let handler = this._handlers[req.method][req.url];
  if (handler){
    handler(req, res);
    this.handlerCalled = true;
  }
}

let invokeDynamicHandler = function (req, res) {
  if(this.handlerCalled) return;
  let paths = Object.keys(this._dynamic[req.method]);
  let path = paths.find(p => {
    let regSource = '^' + p.split('/$').join('.[^/]*') + '$';
    let pathRegex = new RegExp(regSource);
    return pathRegex.test(req.url);
  })
  if (path) {
    let handlerDetails = this._dynamic[req.method][path];
    setRequestParams(req, path, handlerDetails.params);
    handlerDetails.handler(req, res);
  }
}

const setRequestParams = function (req, pathStruct, params) {
  let paths = pathStruct.split('/')
  let urlPaths = req.url.split('/');
  let values = paths.reduce((a, v, i) =>{
    if (v == '$')
      a.push(urlPaths[i])
    return a;
  }, []);
  req.params = {};
  params.forEach((param, index) => {
    req.params[param] = values[index];
  });
}

const addDynamicUrl = function (handlerCollection, handler, url) {
  let path = url.replace(/\$\w+(?=\/|)/g, '$');
  let params = url.match(/\/\$\w+(?=\/|)/g).map(p => p.replace('/$', ''));
  handlerCollection[path] = {
    params: params,
    handler: handler
  }
}

let isDynamic = function (url) {
  return url.includes('$');
}

const initialize = function () {
  this._preprocess = [];
  this._postprocess = [];
  this._handlers = { GET: {}, POST: {}, PUT: {}, DELETE: {} };
  this._dynamic = { GET: {}, POST: {}, PUT: {}, DELETE: {} };
};

const addUrl = function (method, url, handler) {
  if (isDynamic(url)) {
    addDynamicUrl(this._dynamic[method], handler, url);
    return;
  }
  this._handlers[method][url] = handler;
}

const get = function (url, handler) {
  addUrl.call(this, 'GET', url, handler)
}
const put = function (url, handler) {
  addUrl.call(this, 'PUT', url, handler)
}
const post = function (url, handler) {
  addUrl.call(this, 'POST', url, handler)
};
const onDelete = function (url, handler) {
  addUrl.call(this, 'DELETE', url, handler)
};
const use = function (handler) {
  this._preprocess.push(handler);
};
const postProcess = function (handler) {
  this._postprocess.push(handler);
};
let urlIsOneOf = function (urls) {
  return urls.includes(this.url);
}
const main = function (req, res) {
  res.redirect = redirect.bind(res);
  req.urlIsOneOf = urlIsOneOf.bind(req);
  req.cookies = parseCookies(req.headers.cookie || '');
  let content = "";
  req.on('data', data => content += data.toString())
  req.on('end', () => {
    req.body = qs.parse(content);
    runMiddleWares(this._preprocess, req, res);
    if (res.finished) return;
    invoke.call(this, req, res);
    if (res.finished) return;
    invokeDynamicHandler.call(this, req, res);
    if (res.finished) return;
    runMiddleWares(this._postprocess, req, res);
    if (!res.finished) {
      resourceNotFound(req, res);
    };
  });
};

const resourceNotFound = function (req, res) {
  res.statusCode = 404;
  res.write('File not found!');
  res.end();
  return;
}

const runMiddleWares = function (middlewares, req, res) {
  middlewares.forEach(middleware => {
    if (!res.finished)
      middleware(req, res);
  });
}

let create = () => {
  let rh = (req, res) => {
    main.call(rh, req, res)
  };
  initialize.call(rh);
  rh.get = get;
  rh.post = post;
  rh.use = use;
  rh.put = put;
  rh.delete = onDelete;
  rh.postProcess = postProcess;
  return rh;
}
module.exports = create;
