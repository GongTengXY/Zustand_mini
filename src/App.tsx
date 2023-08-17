import { useBearStore } from './store'
import './App.css'

function App() {
  const count = useBearStore((state: any) => state.count)
  const increase = useBearStore((state: any) => state.increase)
  const decrease = useBearStore((state: any) => state.decrease)
  const reset = useBearStore((state: any) => state.reset)
  // const store = useBearStore()

  // const { count, increase, decrease, reset } = store
  console.log(count)

  return (
    <>
      <div>
        <h3>{count}</h3>
        <button onClick={() => increase()}>+1</button>
        <button onClick={() => decrease()}>-1</button>
        <button onClick={() => reset()}>重制</button>
      </div>
    </>
  )
}

export default App
