/*
 * @Author: your name
 * @Date: 2020-12-29 23:14:00
 * @LastEditTime: 2020-12-29 23:14:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /myNote/项目集合/woyao_cli/hook.middleware/useEventCallback.js
 */
import { useRef, useEffect, useCallback } from 'react'

export default function useEventCallback(fn, deps) {
  const ref = useRef(() => {
    throw new Error('cannot call an event handler while rendering')
  })

  useEffect(() => {
    ref.current = fn
  }, [fn, ...deps])

  return useCallback(() => {
      return ref.current.apply(null, arguments)
  }, [ref])
}
