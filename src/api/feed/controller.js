const jwt = require('jsonwebtoken');
const { feedFullView, feedCreate, feedShow,feedUpdate, findId} = require('./query');
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
exports.show = async (ctx, next) => {
    let id = ctx.params.id;
    let query = await feedShow(id);
    let feed_id = `피드 id: ${query[0].id}`;
    let user_id = `작성자 id: ${query[0].user_id}`;
    let image_id = `파일 id: ${query[0].image_id}`;
    let content = `내용: ${query[0].content}`;
    let updated_at = `업데이트된 날짜: ${query[0].updated_at}`;
    let created_at = `작성된 날짜: ${query[0].updated_at}`;
    ctx.body = feed_id + '\n' + user_id + '\n' + image_id + '\n' + content + '\n' + updated_at + '\n' + created_at;
}

// 피드 수정
exports.update = async (ctx, next) =>{
    let id = ctx.params.id;
    let { content } = ctx.request.body;
    let result = await feedUpdate(id, content);
    if(result == null){
        ctx.body = `${id} 피드 수정 실패`;
    } else {
        ctx.body = `${id} 피드 수정 완료`;
    }
    // ctx.body = `${id} 피드 수정`;
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