// 创建状态仓库
// 要有发布订阅
// 要有对应的api

// T | Partial<T> | { _(state: T): T | Partial<T> }['_'] 类型解释
// 类型表示一个可以是 T 类型、T 的部分可选属性（Partial<T>），或者拥有一个名为 _ 的函数属性，接受类型为 T 的参数，返回 T 或 Partial<T> 的对象类型。
// { _(state: T): T | Partial<T> }['_'] 类型的解释就是一个对象中有 _ 属性，且属性类型是一个接受类型为T的参数且返回T或者Partial<T>类型的函数
export interface StoreApi<T> {
  setState: {
    (
      partial: T | Partial<T> | { _(state: T): T | Partial<T> }['_'],
      replace?: boolean | undefined
    ): void
  }
  getState: () => T
  subscribe: (listener: (state: T, prevState: T) => void) => () => void
  destory: () => void
}

export type StateCreator<T> = (
  setState: StoreApi<T>['setState'],
  getState: StoreApi<T>['getState'],
  store: StoreApi<T>
) => T

export const createStore = (createState: any) => {
  type TState = ReturnType<typeof createState>
  // listener是监听函数，也就是更新状态的方法
  type Listener = (state: TState, prevState: TState) => void

  let state: TState
  // 所有更新方法都会存在Set集合中
  const listeners: Set<Listener> = new Set()

  const setState: StoreApi<TState>['setState'] = (partial, replace) => {
    const nextState = typeof partial === 'function' ? partial(state) : partial
    if (!Object.is(nextState, state)) {
      const prevState = state
      state =
        replace ?? typeof nextState !== 'object'
          ? nextState
          : Object.assign({}, state, nextState)
      // 这里不用扩展运算符，是因为兼容性的问题
      listeners.forEach((listener) => listener(state, prevState))
    }
  }
  const getState: StoreApi<TState>['getState'] = () => state
  // 监听器
  const subscribe: StoreApi<TState>['subscribe'] = (listener: Listener) => {
    listeners.add(listener)

    // 返回一个销毁监听器的方法
    return () => listeners.delete(listener)
  }
  const destory: StoreApi<TState>['destory'] = () => {
    listeners.clear()
  }

  const api = { setState, getState, subscribe, destory }
  state = createState(setState, getState, api)

  return api
}
