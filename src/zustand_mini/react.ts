import { createStore } from './vanlia'
import type { StoreApi, StateCreator } from './vanlia'
import useSyncExternalStoreExports from 'use-sync-external-store/shim/with-selector'

/*
 * useSyncExternalStore: 接入外部状态，且外部状态更新后如何触发重渲染的逻辑与时机交给 React 来负责
 * 在此使用withSelector的版本 ----- useSyncExternalStoreWithSelector
 * useSyncExternalStoreWithSelector提供一种 state => Selection 的选择器函数，以此提高外部状态的变化感知力度
 *
 */

// import { useSyncExternalStore } from 'react'

const { useSyncExternalStoreWithSelector } = useSyncExternalStoreExports

type ReadonlyStoreApi<S> = Pick<StoreApi<S>, 'getState' | 'subscribe'>

type ExtractState<S> = S extends { getState: () => infer T } ? T : never

type WithReact<S extends ReadonlyStoreApi<unknown>> = S & {
  getServerState?: () => ExtractState<S>
}

// create：初始化store
export function create<T>(createState: StateCreator<T>) {
  return createImpl(createState)
}

// createImpl：定义了zustand基础的api
const createImpl = <T>(createState: StateCreator<T>) => {
  // 初始化api对象： {subscribe、setState、getState、destory}
  const api =
    typeof createState === 'function' ? createStore(createState) : createState

  // selector————代表找到对应state属性的钩子函数
  // equalityFn————代表对应state属性变化的比对规则（比如shallow浅拷贝）
  const useBoundStore: any = (selector?: any, equalityFn?: any) =>
    useStore(api, selector, equalityFn)

  return useBoundStore
}

export function useStore<TState, StateSlice>(
  api: WithReact<StoreApi<TState>>,
  selector: (state: TState) => StateSlice = api.getState as any,
  equalityFn?: (a: StateSlice, b: StateSlice) => boolean
) {
  const slice = useSyncExternalStoreWithSelector(
    api.subscribe,
    api.getState,
    api.getServerState || api.getState,
    selector,
    equalityFn
  )
  return slice
}
