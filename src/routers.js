// 고유의 기능(URL에 어떤 주소로 들어갈 때 어떤 것을 띄움)에 집중


const Router = require('@koa/router');
const router = new Router();
const multer = require('@koa/multer');
const path = require('path');
const upload = multer({
    dest: path.resolve(__dirname, '../', 'storage') // storage라는 폴더에 저장
})

const { myLogging } = require('./middleware/logging');
const { verify } = require('./middleware/auth');

const webController = require('./web/controller');
const apiUserController = require('./api/user/controller');
const apiFeedController = require('./api/feed/controller');

// 나머지 처리에 대한 부분은 src/api 폴더의 controller들이 해결
// 도에인 기반 방식

router.use(myLogging);  // 이 줄 이후에 어떤 페이지로 들어가든 myLogging 작동

router.post('/file/upload', upload.single('file'), require('./api/file/controller').upload);    // middleware를 거쳐 controller의 upload 실행. 변수에 넣어도 상관없음
router.get('/file/:id', require('./api/file/controller').download); // 라우트를 정할 때 upload를 먼저 작성하기 -> upload를 id의 파라미터로 인식할 수 있기 때문임

router.get('/', webController.home);
router.get('/page/:name', webController.page);
// router.get('/', myLogging, webController.home); // '/'로 이동 시 myLogging을 거치고 next 함수로 home으로 이동
// router.get('/page/:name', myLogging, webController.page);

router.post('/api/user/login', apiUserController.login);
router.post('/api/user/register', apiUserController.register);

router.use(verify); // 회원가입과 로그인에는 없어야 함
router.get('/api/user/:id', apiUserController.info);

router.get('/api/feed', apiFeedController.index);
router.post('/api/feed', apiFeedController.store);
router.get('/api/feed/:id', apiFeedController.show);
router.put('/api/feed/:id', apiFeedController.update);
router.delete('/api/feed/:id', apiFeedController.delete);

module.exports = router;