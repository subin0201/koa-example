const { isNewFeed } = require('../../common/formatter/date');
const { dateFromNow } = require('../../common/formatter/date');

// 전체 피드 보기
exports.index = (ctx, next) => {
    let query = ctx.query;

    let result1 = isNewFeed("2023-01-12 15:40:00");
    console.log("새글인가요? " + result1);

    let result2 = dateFromNow("2023-01-12 01:10:00");
    console.log(result2);

    // let {color, size, count} = ctx.query; // 아래와 동일
    // query.color
    // query.size
    // query.count

    ctx.body = query;
    // ctx.body = '피드 리스트';
}

// 새 피드 작성 처리
exports.store = (ctx, next) => {
    let body = ctx.request.body;
    ctx.body = body;
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