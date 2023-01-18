const jwt = require('jsonwebtoken');
// const SECRET_KEY = 'my-secret-key';

exports.verify = async (ctx, next) => {
    var token = ctx.request.headers['token'];   // headers에 토큰을 보내는 방법. get post delete 아무거나 상관없음
    await jwt.verify(token, process.env.APP_KEY, async (error, decoded) => {  // 토큰과 키 기반으로 에러 검출
        if(error) {
            ctx.body = '로그인을 해야합니다.';
            return;
        }
        await next(); // await 없어도 괜찮음. 콜백 후 next 사용이기 때문임
    })
}