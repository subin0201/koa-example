const jwt = require("jsonwebtoken");
const { registerm, login } = require('./query');
const crypto = require('crypto');

/** 해당 id의 회원정보들 */
exports.info = (ctx, next) => {
    let id = ctx.params.id;
    ctx.body = `${id} 회원에 대한 정보`;
}

/** 회원 가입 */
exports.register = async (ctx, next) => {
    let { email, password, name} = ctx.request.body;
    let result = crypto.pbkdf2Sync(password, process.env.APP_KEY, 50, 100, 'sha512');  // 50회 반복, 최대 산출물의 길이 255, sha512 방식으로 암호화

    let { affectedRows } = await register(email, result.toString('base64'), name);  // base64 방식으로 암호화 후 회원가입

    if(affectedRows > 0){
        let token = await generteToken({ name });
        ctx.body = token;
    } else {
        ctx.body = {result: "fail"}
    }

    // let token = await generteToken({name: 'my-name'});
    // ctx.body = token;
}

/** 로그인 */
exports.login = async (ctx, next) => {

    let { email, password } = ctx.request.body;    // 아래와 같음
    // let id = ctx.request.body.id;
    // let pw = ctx.request.body.pw;
    let result = crypto.pbkdf2Sync(password, process.env.APP_KEY, 50, 100, 'sha512');   // 너무 길이 100으로 줄임

    let item = await login(email, result.toString('base64'));

    if(item == null) {
        ctx.body = {result: "fail"};
    } else {
        let token = await generteToken({name: item.name});
        ctx.body = token;
    }
    // if(id === 'admin' && pw === '1234') { // 계정이 있는 경우 토큰 발급
    //     result = await generteToken({name: 'my-name'});
    // } else {
    //     result = "아이디 혹은 패스워드가 일치하지 않습니다.";
    // }
    // ctx.body = result;
}


let generteToken = (payload) => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, process.env.APP_KEY, (error, token) => {
            // if(error) { reject(error); }
            // resolve(token);
            (error) ? reject(error) : resolve(token);
        })
    })
}