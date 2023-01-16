const moment = require('moment');
require("moment/locale/ko");

/**
 * 오늘 날짜의 글일경우 N분전 또는 N시간 전 등으로 표기
 * 오늘 이전의 날짜의 경우엔 YYYY-MM-DD 형식으로 표기
 * @param {string} date 'YYYY-MM-DD HH:mm:ss' 형식의 문자
 * @returns {string}
 */
exports.dateFromNow = (date) => {
    let currentTime = moment();
    let feedDate = moment(date);
    // console.log(currentTime);
    // console.log(feedDate);

    if (moment(feedDate).isSame(currentTime, 'day')){   // 오늘 날짜의 글
        let timeGap = moment.duration(currentTime.diff(feedDate)).asMinutes();  // 현재 시간과 글 작성 시간의 분 차이 비교
        if (timeGap >= 60){     // 1시간 이상일 경우 N시간 전으로 표기
            timeGap = parseInt(timeGap / 60);
            return `${timeGap}시간 전`;
        } else {    // 1시간 미만일 경우 N분 전 으로 표기
            timeGap = parseInt(timeGap);
            return `${timeGap}분 전`;
        }
    } else {    // 오늘 이전 날짜의 글 표기
        return feedDate.format("YYYY-MM-DD");
    }
    
}

/**
 * 새 10분을 기반으로 새글인지 판단
 * @author ansubin
 * @date 2023-01-12
 * @param {string} date 
 * @returns {boolean} 새 글이면 ture, 아니면 false
 */
exports.isNewFeed = (date) => {
    let currentTime = moment().add(-10, 'minute');  // 현재 시간에서 10분 빼기
    let feedDate = moment(date);    // 글의 작성 시간
    // console.log(currentTime);
    // console.log(feedDate);
    return feedDate.isAfter(currentTime);   // 글 작성 시간이 현재 시간-10분의 후인지 {ex) 30분 글 작성 vs (현재 33분 -10분 = 23분)}
}