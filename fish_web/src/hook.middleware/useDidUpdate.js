/*
 * @Author: your name
 * @Date: 2020-12-29 21:49:01
 * @LastEditTime: 2020-12-29 21:49:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /myNote/项目集合/woyao_cli/hook.middleware/useDidUpdate.js
 */

import { useEffect, useRef } from 'react'

function useDidUpdate(cb, deps=[]) {
  const didMount = useRef(false)

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      return
    }
    cb()
  }, deps)

  return didMount.current
}

export default useDidUpdate

