const { pool } = require('../../data');

/**
 * 모든 피드의 id와 작성 시간을 반환하는 함수
 * @returns 모든 피드의 id와 작성 시간
 */
exports.feedFullView = async () => {
    const query = `SELECT id, created_at FROM feed`
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
 * 피드의 id를 이용해 피드의 모든 정보를 가져오는 함수
 * @param {number} feed_id 피드의 id
 * @returns 
 */
exports.feedShow = async (feed_id) => {
    const query = `SELECT * FROM feed WHERE
    id = ?`;
    let result = await pool(query, [feed_id]);
    return (result.length < 0) ? null : result[0];
}

/**
 * 피드의 내용을 수정하는 함수
 * @param {number} feed_id 수정할 피드의 id
 * @param {string} content 피드의 수정한 내용
 * @returns 
 */
exports.feedUpdate = async (feed_id, content) => {
    const query = `UPDATE feed SET content = ? WHERE id = ?`;
    return await pool(query, [content, feed_id]);
}

/**
 * 피드를 삭제하는 함수
 * @param {number} feed_id 삭제할 피드의 id
 * @returns 
 */
exports.feedDelete = async (feed_id) => {
    const query = `DELETE FROM feed WHERE id = ?`;
    return await pool(query, [feed_id]);
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

/**
 * 피드의 id로 작성자의 id를 가져오는 함수
 * @param {number} feed_id 피드의 id
 * @returns {number} 피드 작성자의 id
 */
exports.findFeedUser = async (feed_id) => {
    const query = `SELECT user_id FROM feed WHERE id = ?`;
    let result = await pool(query, [feed_id]);
    return (result.length < 0) ? null : result[0];
}

/**
 * 파일의 id로 그 파일의 전체 정보를 가져오는 함수
 * @param {number} image_id 파일의 id
 * @returns 특정 파일의 전체 정보
 */
exports.findFeedImage = async (image_id) => {
    const query = `SELECT * FROM files WHERE id = ?`;
    let result = await pool(query, [image_id]);
    return (result.length < 0) ? null : result[0];
}