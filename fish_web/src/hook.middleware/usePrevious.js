/*
 * @Author: your name
 * @Date: 2020-12-29 21:55:48
 * @LastEditTime: 2020-12-29 21:55:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /myNote/项目集合/woyao_cli/hook.middleware/useState.js
 */

function usePrevious(value) {
    const ref = useRef()
    useEffect(() => {
        ref.current = value
    }, [value])
    return ref.current
}
