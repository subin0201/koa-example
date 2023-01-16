const jwt = require("jsonwebtoken");
const SECRET_KEY = 'my-secret-key';

// 해당 id의 회원정보들
exports.info = (ctx, next) => {
    let id = ctx.params.id;
    ctx.body = `${id} 회원에 대한 정보`;
}

exports.register = async (ctx, next) => {
    // 회원가입 처리 모듈

    let token = await generteToken({name: 'my-name'});
    ctx.body = token;
}

exports.login = async (ctx, next) => {
    // 로그인 모듈

    let {id, pw} = ctx.request.body;    // 아래와 같음
    // let id = ctx.request.body.id;
    // let pw = ctx.request.body.pw;
    let result = "";

    if(id === 'admin' && pw === '1234') { // 계정이 있는 경우 토큰 발급
        result = await generteToken({name: 'my-name'});
    } else {
        result = "아이디 혹은 패스워드가 일치하지 않습니다.";
    }
    ctx.body = result;
}


let generteToken = (payload) => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, SECRET_KEY, (error, token) => {
            // if(error) { reject(error); }
            // resolve(token);
            (error) ? reject(error) : resolve(token);
        })
    })
}