import cn from 'classnames';

// 类型别名
export type Modifier = string | { [key: string]: any };
export type Modifiers = Modifier | Modifier[];

function _m(be: string, m?: Modifiers): string {
    if (!m) {
        return '';
    }
    if (typeof m === 'string') {
        return ` ${be}--${m}`;
    }
    if (Array.isArray(m)) {
        return m.reduce<string>((res, i) => res + _m(be, i), '')
    }
    return Object.keys(m).reduce<string>(
        (res, i) => res + (m[i] ? _m(be, i) : ''), ''
    )
}

export default function createBem(namespace: string) {
    const b = namespace;

    function classnames(
        e?: Modifiers,
        m?: Modifiers,
        ...classNamesParam: any[]
    ): string {
        if (e && typeof e !== 'string') {
            if (m) {
                classNamesParam.push(m)
            }
            m = e
            e = ''
        }

        e = e ? `${b}__${e}` : b
        const bem = `${e}${_m(e, m)}`
        const rest = cn(classNamesParam)
        return bem + (rest ? ` ${rest}` : '')
    }

    classnames.modifier = function (m : string, e?: string) {
        if (e) {
            return `${b}__${e}--${m}`
        }
        return `${b}--${m}`
    }

    return classnames
}
