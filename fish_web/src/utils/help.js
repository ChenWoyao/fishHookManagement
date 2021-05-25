import Cookies from 'js-cookie'

export function serialize(obj, prefix) {
    const str = []
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const k = prefix ? `${prefix}[${key}]` : p
            const v = obj[key]
            str.push(typeof v === 'object' ? serialize(v, k) : `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
        }
    }
    return str.join('&')
}

export function getToken(TokenKey) {
    return Cookies.get(TokenKey)
}

export function setToken(TokenKey, token) {
    return Cookies.set(TokenKey, token)
}

export function removeToken(TokenKey) {
    return Cookies.remove(TokenKey)
}

/**
 * @export
 * @param {*} date    Date类型
 * @param {*} cFormat 任何你想要的格式
 * @returns
 */
export function parseDate(date, cFormat) {
    let format = cFormat || 'y-m-d h:i:s';
    let formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    };
    const time_str = format.replace(/([ymdhisa])+/g, (result, key) => {
        let value = formatObj[key];
        if (key === 'a') {
            return ['日', '一', '二', '三', '四', '五', '六'][value]
        }
        return value.toString().padStart(2, '0');
    });
    return time_str;
}
/**
 * 搜索框搜索输入。只需用户最后一次输入完，再发送请求
 * 手机号、邮箱验证输入检测
 * 窗口大小Resize。只需窗口调整完成后，计算窗口大小。防止重复渲染
 * @param {*} func
 * @param {*} delay
 * @param {*} immediate
 * @returns
 */
export const debounce = (func, delay, immediate) => {
    let later = null
    return (...args) => {
        if (!later && immediate) {
            func(...args)
        }
        later && clearTimeout(later)
        later = setTimeout(func, delay, ...args)
    }
}

// 函数节流：
/**
 * 滚动加载，加载更多或滚到底部监听
 * 谷歌搜索框，搜索联想功能
 * 高频点击提交，表单重复提交
 * @param {*} func
 * @param {*} delay
 * @returns
 */
export const throttle = (func, delay) => {
    let later = null
    return (...args) => {
        if (later) return
        later = setTimeout(() => {
            func(...args)
            later = null
        }, delay)
    }
}

/**
 * eventEmitter实现
 */
export class EventEmitter {
    constructor(events) {
        this.events = events || {}
    }
    subscribe(name, cb) {
        (this.events[name]) || (this.events[name] = []).push(cb)
        return {
            unsubscribe: () => {
                this.events[name] && this.events[name].splice(this.events[name].indexOf(cb) >>> 0, 1)
            }
        }
    }
    emit(name, ...args) {
        (this.events[name] || []).forEach(fn => fn(...args))
    }
}

/**
 * compose实现
 * compose (widthData(), widhtLogger())(Component)
*/

export const compose = (...fns) => (Component) => {
    return fns.reduceRight((Component, fn) => {
        return fn(Component)
    }, Component)
}

/**
 * 函数柯里化
 */
export const curring = (func) => (...args) => {
    if (func.length <= args.length) {
        return fns(...args)
    }
    return (...args2) => curring(func)(...args, ...args2)
}

/**
 * 获取本月有多少天
 */

export const getCurrentMonthDays = () => {
    const date = new Date()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    return new Date(year, month, 0).getDate()
}

/**
 * 创建num个[min, max]区间的随机值
 * @param {个数} num
 * @param {最小值} min
 * @param {最大值} max
 * @returns
 */
export const createRandomNums = (num, min, max) => {
    const result = []
    for (let i = 0; i < num; i++) {
        const random = Math.random()
        const space = max - min
        result.push(Math.ceil(space * random) + min)
    }
    return result
}
