// 고유의 기능(URL에 어떤 주소로 들어갈 때 어떤 것을 띄움)에 집중


const Router = require('@koa/router');
const router = new Router();

const { myLogging } = require('./middleware/logging');

const webController = require('./web/controller');
const apiUserController = require('./api/user/controller');
const apiFeedController = require('./api/feed/controller');

// 나머지 처리에 대한 부분은 src/api 폴더의 controller들이 해결
// 도에인 기반 방식

router.use(myLogging);  // 이 줄 이후에 어떤 페이지로 들어가든 myLogging 작동

router.get('/', webController.home);
router.get('/page/:name', webController.page);
// router.get('/', myLogging, webController.home); // '/'로 이동 시 myLogging을 거치고 next 함수로 home으로 이동
// router.get('/page/:name', myLogging, webController.page);
// router.get('/', (ctx, next) => {    // 루트에 이동 시 웹에 'Hello World'가 뜸
//     ctx.body = 'Hello World';
// });
// router.get('page/:page', (ctx, next) => {
//     let page = ctx.params.page;
//     ctx.body = `${page} 페이지`;
// });

router.get('/api/user/:id', apiUserController.info);
// router.get('/user/:id', (ctx, next) => {
//     let id = ctx.params.id;
//     ctx.body = `${id} 회원에 대한 정보`;
// });

router.get('/api/feed', apiFeedController.index);
router.post('/api/feed', apiFeedController.store);
router.get('/api/feed/:id', apiFeedController.show);
router.put('/api/feed/:id', apiFeedController.update);
router.delete('/api/feed/:id', apiFeedController.delete);
// router.get('/api/feed', (ctx, next) => {
//     ctx.body = '피드 리스트';
// });
// router.get('/api/feed/:id', (ctx, next) => {
//     let id = ctx.params.id;
//     ctx.body = `${id} 피드 상세`;
// });

// router.get('/sitemap', (ctx, next) => {     // localhost:3000/sitemap 이동 시 웹에 '사이트맵'이 뜸
//     ctx.body = '사이트맵';
// });
// router.get('/page/:name', (ctx, next) => {     // localhost:3000/page/Hello 이동 시 웹에 'Hello'이 뜸
//     let name = ctx.params.name;
//     ctx.body = `${name} 페이지`;
// });

module.exports = router;