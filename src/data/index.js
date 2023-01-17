require('dotenv').config();
const mysql = require('mysql2');

// 외부에서도 상용 가능하도록 작성
// 쉽게 실행 가능하도록 매핑
// connection을 만들어 mysql에 집어넣음
// connection을 통해 pool에서 더 편하게 사용 -> 구현부분만 바꾸면 환경이 바뀌어도 쉽게 작성
exports.connection = mysql.createPool(
    {
        host:process.env.DB_HOST,   // 중요한 파일 -> 설정 파일에 작성
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    }
);

/**
 * 조금 더 간단하게 connection pool을 사용할 수 있도록
 * 만든 함수입니다.
 * @param {string} queryString 쿼리 문자열
 * @param {array} params 쿼리 ?에 들어갈 파라미터
 * @returns 
 */
exports.pool = (queryString, params) => {
    return new Promise((resolve, reject) => {   // 콜백 패턴
        this.connection.query(queryString, params, (e, r, f) => {
            (e) ? reject(e) : resolve(r);
        });
    })
}