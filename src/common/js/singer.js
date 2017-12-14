/* 
* @Author: anchen
* @Date:   2017-09-19 22:41:02
* @Last Modified by:   anchen
* @Last Modified time: 2017-09-19 22:53:15
*/

export default class Singer{
    constructor ({id,name}){
        this.id = id,
        this.name = name,
        this.avatar = `http://y.gtimg.cn/music/photo_new/T001R150x150M000${id}.jpg?max_age=2592000`
    }
}