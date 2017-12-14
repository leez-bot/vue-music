/* 
* @Author: anchen
* @Date:   2017-09-17 21:05:04
* @Last Modified by:   anchen
* @Last Modified time: 2017-09-28 23:52:14
*/

// 操作dom结构的js（更改DOM结构的样式名）
export function addClass(el,className){
  if(hasClass(el,className)){
    return;
  }
  let newClass = el.className.split(' ');
  newClass.push(className);
  el.className = newClass.join(' ');
}

// 判断DOM结构是否已经有某样式名
export function hasClass(el,className){
  let reg = new RegExp('\b' + className + '\d+\b/g');
  // let reg = new RegExp('(^|\\s)' + className + '(\\s|$');
  return reg.test(el.className);
}


// 查看某个DOM结构有无某个属性值，如果没有，就设置这个值，如果有，就返回这个值
export function getData(el,name,val){
  const prefix = 'data-'
  name = prefix + name
  if(val){
    return el.setAttribute(name, val)
  }else{
    return el.getAttribute(name)
  }
}

// js书写CSS兼容性自适应

let elementStyle = document.createElement('div').style

// 浏览器内核
let vendor = (() => {
  let transFormNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for(let key in transFormNames) {
    if(elementStyle[transFormNames[key]] !== undefined){
      return key;
    }
  }

  return false;
})()

export function prefixStyle(style){
  if(vendor === false){
    return false
  }
  if(vendor === 'standard'){
    return style;
  }
  // 将样式第一个字母大写，并截取从第一个位置开始后面所有字符拼接在一起
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}