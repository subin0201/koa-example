const { pool } = require('../../data');

exports.feedFullView = async () => {
    const query = `SELECT id, create_at content FROM feed`
    return await pool(query);
}

/**
 * 작성된 피드를 데이터베이스에 저장하는 함수
 * @param {number} user_id 피드 작성자의 id
 * @param {number} image_id 피드 이미지의 id
 * @param {string} content 피드 내용
 * @returns 
 */
exports.feedCreate = async (user_id, image_id, content) => {
    const query = `INSERT INTO feed
    (user_id, image_id, content)
    VALUES (?,?,?)`;
    return await pool(query, [user_id, image_id, content]);
}

/**
 * 사용자의 이메일을 이용해 id를 가져오는 함수
 * @param {string} email 사용자의 email
 * @returns {number} 사용자의 id
 */
exports.findId = async (email) => {
    const query = `SELECT id FROM user WHERE email = ?`;
    let result = await pool(query, [email]);
    return (result.length < 0) ? null : result[0];
}