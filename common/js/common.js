/**
 * 时间的展示方式
 * time : 需转换的时间值
 * getTime : 是否直接返回原本时间，false则返回与现实时间的时差
 */
export function formatTime(time, getTime) {
  let arr = time.slice(0, -1).split("T");
  let timeStamp = new Date(arr[0] + " " + arr[1] + " GMT+0000");

  if (getTime) {
    let time = {}
    time.y = timeStamp.getFullYear()
    time.m = timeStamp.getMonth() + 1
    time.d = timeStamp.getDate()
    time.h = timeStamp.getHours()
    time.min = timeStamp.getMinutes()
    time.s = timeStamp.getSeconds()
    for (let i in time) {
      time[i] = addZero(time[i])
    }
    return time.y + "-" + time.m + "-" + time.d + " / " + time.h + ":" + time.min + ":" + time.s;
  } else {
    let diff = new Date().getTime() - timeStamp.getTime()
    if (diff <= 1000) {
      return "刚刚";
    } else if (diff <= 1000*60) {
      return parseInt(diff/(1000)) + "秒前";
    } else if (diff <= 1000*60*60) {
      return parseInt(diff/(1000*60)) + "分钟前";
    } else if (diff <= 1000*60*60*24) {
      return parseInt(diff/(1000*60*60)) + "小时前";
    } else if (diff <= 1000*60*60*24*30) {
      return parseInt(diff/(1000*60*60*24)) + "天前";
    } else if (diff <= 1000*60*60*365) {
      return parseInt(diff/(1000*60*60*24*30)) + "个月前";
    } else {
      return parseInt(diff/(1000*60*60*365)) + "年前";
    }
  }
}

// 时间为个位数时，前面补零
function addZero(val) {
  if (val < 10) {
    return '0' + val
  } else {
    return val
	
  }
}

/**
 * 货币格式
 * value : 需转换货币格式的值
 * intOnly : 是否保留整数
 */
export function currencyFormat(value, intOnly) {
  let valueArray = value.toString().split(".");
  valueArray[0] = valueArray[0].replace(/\B(?=(\d{3})+\b)/g, ",");
  valueArray[1] && !intOnly
    ? (value = valueArray[0] + "." + valueArray[1])
    : (value = valueArray[0]);
  return value;
}