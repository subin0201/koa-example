const Koa = require('koa');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');
const app = new Koa();
const path = require('path');
const render = require('koa-ejs');
const router = new Router();

// 서버 실행 포트. 환경 변수 PORT를 사용하거나 값이 없으면 3000포트를 사용
const port = process.env.PORT || 3000;

// 바디파서 세팅 (http request의 body 부분을 활용할 수 있도록 해줌)
app.use(bodyParser({formLimit: '5mb'}));

console.log(__dirname);
// 정적 파일
app.use(require('koa-static')(`${__dirname}/public`));

// 라우터 설정
router.use(require('./src/routers').routes());
app.use(router.routes());
app.use(router.allowedMethods());

// EJS 템플릿엔진
render(app, {
    // layout: null,   // 레이아웃 없음
    layout: 'layouts/template',
    root: path.join(__dirname, '/views'),   // 루트 디렉토리 views
    viewExt: 'ejs', cache: false,   // 확장자 ejs, 캐시 사용 안함
   });

// 서버 실행
app.listen(port, () => {
    console.log(`웹서버 구동... ${port}`);
})