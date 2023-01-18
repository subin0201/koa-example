const jwt = require('jsonwebtoken');
const { feedFullView, feedCreate, findId} = require('./query');
const { isNewFeed } = require('../../common/formatter/date');
const { dateFromNow } = require('../../common/formatter/date');

// 전체 피드 보기
exports.index = async (ctx, next) => {
    let query = await feedFullView();
    ctx.body = "";

    for (var i = 0; i < query.length; i++){
        var id = query[i]['id'];
        var result1 = isNewFeed(query[i]['created_at']);
        if(result1 == true) { var newFeed = "새글입니다."; }
        else { var newFeed = "새글이 아닙니다."; }
        var result2 = dateFromNow(query[i]['created_at']);
        ctx.body = ctx.body + '\n' + id + '\t' + newFeed + '\t' + result2;
    }
}

// 새 피드 작성 처리
exports.store = async (ctx, next) => {
    let { token } = ctx.request.header;
    let payload = await TokenToEmail(token);
    let user_id = await findId(payload.email);
    let { image_id, content } = ctx.request.body;

    let result = await feedCreate(user_id.id, image_id, content);
    if(result == null){
        ctx.body = `${user_id.id} 피드 작성 실패`;
    } else {
        ctx.body = `${user_id.id} 피드 작성 완료`;
    }

    // let body = ctx.request.body;
    // ctx.body = body;
    // ctx.body = '피드 작성 완료';
}

// 피드 상세보기
exports.show = (ctx, next) => {
    let id = ctx.params.id;
    ctx.body = `${id} 피드 상세`;
}

// 피드 수정
exports.update = (ctx, next) =>{
    let id = ctx.params.id;
    ctx.body = `${id} 피드 수정`;
}

// 피드 삭제
exports.delete = (ctx, next) => {
    let id = ctx.params.id;
    ctx.body = `${id} 피드 삭제`;
}

/**
 * 토큰으로 사용자 이메일 반환
 * @param {string} token jwt 토큰
 * @returns {string} 사용자 email
 */
let TokenToEmail = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.APP_KEY, (error, payload) => {
            (error) ? reject(error) : resolve(payload);
        })
    })
}