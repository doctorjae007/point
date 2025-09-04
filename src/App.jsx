import { useState } from 'react'

import './App.css'

import StudentCardGrid from './components/StudentCardGrid'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      
      <StudentCardGrid/>
    </>
  )
}

export default App
