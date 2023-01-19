const { pool } = require('../../data');

/**
 * 회원가입
 * @param {string} email 메일(아이디)
 * @param {string} password 비밀번호
 * @param {string} name 이름
 * @returns 
 */
exports.register = async ( email, password, name) => {
    const query = `INSERT INTO user
    (email, password, name)
    VALUES (?,?,?)`;
    return await pool(query, [email, password, name]);
}

/**
 * 로그인
 * @param {string} email 메일(아이디)
 * @param {string} password 비밀번호
 * @returns 
 */
exports.login = async (email, password) => {
    const query = `SELECT * FROM user WHERE
    email = ? AND password = ?`;
    let result = await pool(query, [email, password]);
    return (result.length < 0) ? null : result[0];
}

/**
 * 회원의 상세정보
 * @param {number} user_id 회원의 id
 * @returns 회원의 정보
 */
exports.info = async (user_id) => {
    const query = `SELECT email, name, created_at FROM user WHERE
    id = ?`;
    let result = await pool(query, [user_id]);
    return (result.length < 0) ? null : result[0];
}