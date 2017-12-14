/* 
* @Author: leeZ
* @Date:   2017-11-14 22:08:03
* @Last Modified by:   leeZ
* @Last Modified time: 2017-11-24 21:31:37
*/

// 工具函数
// 

function getRandomInt(min,max) {
  // 返回一个存在于这个区间的数字（包括MAX/MIN）
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// 打乱数组函数
export function shuffle(arr) {
  // 返回一个打乱的数组，原数组不变
  let _arr = arr.slice();
  for(let i=0;i<_arr.length;i++){
    let j = getRandomInt(0, i);
    let t = _arr[i];
    _arr[i] = _arr[j];
    _arr[j] = t;
  }
  return _arr;
}

// 截流函数，用于延迟执行某个函数，返回延迟执行的函数
export function debounce(func, delay) {
  let timer;
  return function(...args) {
    if(timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}