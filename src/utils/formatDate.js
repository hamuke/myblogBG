import moment from 'moment';

/**
 * 使用moment.js将时间戳转对应的时间格式
 * @param {*} time 时间戳
 * @returns 
 */
export function formatDate(time){
    // 处理年月日，时分秒
    let formatTime = moment(parseInt(time)).format('YYYY-MM-DD kk:mm:ss');

    // 特殊处理星期几
    let week = moment(parseInt(time)).format('d');
    let weekArr = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
    let finalFormatTime = `${formatTime} ${weekArr[week]}`;
    
    return finalFormatTime;
}