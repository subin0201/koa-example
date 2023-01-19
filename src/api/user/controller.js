const jwt = require("jsonwebtoken");
const { register, login, info } = require('./query');
const crypto = require('crypto');

/** 해당 id의 상세 회원정보 */
exports.info = async (ctx, next) => {
    let id = ctx.params.id;
    let query = await info(id);
    if(query == null){
        ctx.body = `${id} 회원이 존재하지 않습니다.`;
    } else {
        let email = `email: ${query.email}`;
        let name = `name: ${query.name}`;
        let created_at = `created_at: ${query.created_at}`;
        ctx.body = `${id} 회원에 대한 정보\n` + email + '\n' + name + '\n' + created_at;
    }
}

/** 회원 가입 */
exports.register = async (ctx, next) => {
    let { email, password, name} = ctx.request.body;
    let result = await crypto.pbkdf2Sync(password, process.env.APP_KEY, 50, 100, 'sha512');  // 50회 반복, 최대 산출물의 길이 255, sha512 방식으로 암호화

    let { affectedRows } = await register(email, result.toString('base64'), name);  // base64 방식으로 암호화 후 회원가입

    if(affectedRows > 0){
        let token = await generteToken({ email });  // 안에 email 말고도 name 추가 가능
        ctx.body = token;
    } else {
        ctx.body = {result: "fail"}
    }
}

/** 로그인 */
exports.login = async (ctx, next) => {

    let { email, password } = ctx.request.body;    // 아래와 같음
    // let id = ctx.request.body.id;
    // let pw = ctx.request.body.pw;
    let result = await crypto.pbkdf2Sync(password, process.env.APP_KEY, 50, 100, 'sha512');   // 너무 길이 100으로 줄임

    let item = await login(email, result.toString('base64'));

    if(item == null) {
        ctx.body = {result: "fail"};
    } else {
        let token = await generteToken({email: item.email});
        ctx.body = token;
    }
}

/**
 * jwt 토큰 생성
 * @param {object} payload 추가적으로 저장할 payload
 * @returns {string} jwt 토큰 string
 */
let generteToken = (payload) => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, process.env.APP_KEY, (error, token) => {
            // if(error) { reject(error); }
            // resolve(token);
            (error) ? reject(error) : resolve(token);
        })
    })
}