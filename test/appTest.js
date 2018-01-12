let chai = require('chai');
let assert = chai.assert;
let request = require('./requestSimulator.js');
process.env.COMMENT_STORE = "./testStore.json";
let app = require('../app.js');
let th = require('./testHelper.js');

describe('app',()=>{
  describe('GET /bad',()=>{
    it('responds with 404',done=>{
      request(app,{method:'GET',url:'/bad'},(res)=>{
        assert.equal(res.statusCode,404);
        done();
      })
    })
  })
  describe('GET /',()=>{
    it('serves the login page',done=>{
      request(app,{method:'GET',url:'/'},res=>{
        th.status_is_ok(res);
        th.body_contains(res,'User Name :');
        th.body_contains(res,'Password :');
        th.body_does_not_contain(res,'Login Failed');
        th.should_not_have_cookie(res,'message');
        done();
      })
    })
    it('serves the login page with message for a failed login',done=>{
      request(app, { method: 'GET', url: '/', headers: { 'cookie':'message=Login Failed'}},res=>{
        th.status_is_ok(res);
        th.body_contains(res,'User Name :');
        th.body_contains(res,'Login Failed');
        th.should_not_have_cookie(res,'message');
        done();
      })
    })
  })

  describe('POST /login',()=>{
    it('redirects to todolists for valid user',done=>{
      request(app,{method:'POST',url:'/login',body:'username=nrjais&password=nrjais'},res=>{
        th.should_be_redirected_to(res,'/todolists.html');
        th.should_not_have_cookie(res,'message');
        done();
      })
    })
  })

  describe('Get /logout',()=>{
    it('redirects to / if not logged in',done=>{
      request(app,{method:'get',url:'/logout'},res=>{
        th.should_be_redirected_to(res,'/');
        done();
      })
    })
  })

  describe('Get /todolist',()=>{
    it('redirects to / if not logged in',done=>{
      request(app,{method:'GET',url:'/todolist'},res=>{
        th.should_be_redirected_to(res,'/');
        done();
      })
    })
  })

  describe.skip('tests after logged in', () => {
    request(app, { method: 'POST', url: '/login', body:'username=nrjais&password=nrjais'},(res)=>{
      let sessionid = res.headers['Set-Cookie'];
      let headers = {
        cookie : sessionid
      }
      describe('GET /todolist', () => {
        it('gives [] /todolist', (done) => {
          request(app, { method: 'GET', url:"/todolist", headers:headers},(res)=>{
            th.status_is_ok(res);
            assert.equal(res.body, '[]');
          });
        });
      });
    })
  });
})
