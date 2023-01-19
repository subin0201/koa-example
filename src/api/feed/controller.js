const jwt = require('jsonwebtoken');
const { feedFullView, feedCreate, feedShow,feedUpdate, feedDelete, findId, findFeedUser, findFeedImage} = require('./query');
const { isNewFeed } = require('../../common/formatter/date');
const { dateFromNow } = require('../../common/formatter/date');

// 전체 피드 보기
exports.index = async (ctx, next) => {
    let query = await feedFullView();
    ctx.body = "";

    // 피드 나열 반복문
    for (var i = 0; i < query.length; i++){
        var id = query[i]['id'];
        var result1 = isNewFeed(query[i]['created_at']);
        if(result1 == true) { var newFeed = "NEW"; }
        else { var newFeed = ""; }
        var result2 = dateFromNow(query[i]['created_at']);
        ctx.body = ctx.body + '\n피드: ' + id + '\t' + newFeed + '\t' + result2;
    }
}

// 새 피드 작성 처리
exports.store = async (ctx, next) => {
    let { token } = ctx.request.header;
    let payload = await TokenToEmail(token);    // 토큰을 이메일로 변경
    let user_id = await findId(payload.email);  // 이메일을 통해 ID를 가져옴

    let { image_id, content } = ctx.request.body;
    let file_info = await findFeedImage(image_id);
    if(file_info == null) { // 입력된 id의 파일 없음
        ctx.body = `${image_id} 파일이 존재하지 않습니다.`;
    } else {    // feed 작성
        let result = await feedCreate(user_id.id, image_id, content);
        if(result == null){
            ctx.body = `피드 작성 실패`;
        } else {
            ctx.body = `피드 작성 완료`;
        }
    }
}

// 피드 상세보기
exports.show = async (ctx, next) => {
    let id = ctx.params.id;
    let query = await feedShow(id);
    if (query == null){
        ctx.body = `${id} 피드가 존재하지 않습니다.`;
    } else {
        let feed_id = `피드 id: ${query.id}`;
        let user_id = `작성자 id: ${query.user_id}`;
        let image_id = `파일 id: ${query.image_id}`;
        let content = `내용: ${query.content}`;
        let updated_at = `업데이트된 날짜: ${query.updated_at}`;
        let created_at = `작성된 날짜: ${query.created_at}`;
        ctx.body = feed_id + '\n' + user_id + '\n' + image_id + '\n' + content + '\n' + updated_at + '\n' + created_at;
    }
}

// 피드 수정
exports.update = async (ctx, next) =>{
    // 토큰으로 로그인된 회원의 id를 구하는 과정
    let { token } = ctx.request.header;
    let payload = await TokenToEmail(token);
    let user_id = await findId(payload.email);

    // 피드의 id로 피드 작성자의 id를 구함
    let feed_id = ctx.params.id;
    let feedUser_id = await findFeedUser(feed_id);

    // 피드가 없음 or 로그인된 회원과 피드의 작성자가 일치함 or 일치하지 않음
    if(feedUser_id == null) {
        ctx.body = `${feed_id} 피드가 존재하지 않습니다.`;
    } else if(feedUser_id.user_id == user_id.id){
        let { content } = ctx.request.body;
        let result = await feedUpdate(feed_id, content);
        if(result == null){
            ctx.body = `${feed_id} 피드 수정 실패`;
        } else {
            ctx.body = `${feed_id} 피드 수정 완료`;
        }
    } else {
        ctx.body = `${feed_id} 피드의 작성자가 아닙니다.`;
    }
}

// 피드 삭제
exports.delete = async (ctx, next) => {
    // 토큰으로 로그인된 회원의 id를 구하는 과정
    let { token } = ctx.request.header;
    let payload = await TokenToEmail(token);
    let user_id = await findId(payload.email);

    // 피드의 id로 피드 작성자의 id를 구함
    let feed_id = ctx.params.id;
    let feedUser_id = await findFeedUser(feed_id);

    // 피드가 없음 or 로그인된 회원과 피드의 작성자가 일치함 or 일치하지 않음
    if(feedUser_id == null) {
        ctx.body = `${feed_id} 피드가 존재하지 않습니다.`;
    } else if(feedUser_id.user_id == user_id.id){
        let result = await feedDelete(feed_id);
        if(result == null){
            ctx.body = `${feed_id} 피드 삭제 실패`;
        } else {
            ctx.body = `${feed_id} 피드 삭제 완료`;
        }
    } else {
        ctx.body = `${feed_id} 피드의 작성자가 아닙니다.`;
    }
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