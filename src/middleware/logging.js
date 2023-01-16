/**
 * 클라이언트의 요청 ip와 url을 콘솔에 단순히
 * 출력해주는 로그함수
 */
exports.myLogging = async (ctx, next) => {
    let clientIp = ctx.request.ip;
    let url = ctx.originalUrl   // 어떤 주소를 참조했는지
    console.log(`${clientIp.replace("::ffff:", "")} 주소에서 요청 : ${url}`);
    await next();   // 작업이 끝나고 다음 역할로 넘김. 보통 컨트롤러
}