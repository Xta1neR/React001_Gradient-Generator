import React, { useState } from 'react'

const App = () => {

  const [num, setNum] = useState(12);
  const [type, setType] = useState('linear');

  const getHexColorCode = () => {
    
  }

  return (
    <div className='min-h-screen py-12'>
      <div className='w-9/12 mx-auto'>
        <div className='flex justify-between'>
          <h1 className='text-4xl font-bold'>🎨 Gradient Generator {num} {type}</h1>
          <div className='flex gap-4'>
            <input value={num} className="border border-slate-300 bg-white rounded-lg w-[100px] p-2" placeholder='12' onChange={(e) => setNum(Number(e.target.value))} />
            <select value={type} className='border border-slate-300 bg-white rounded-lg w-[100px] p-2' name="" id="" onChange={(e) => setType(e.target.value)}>
              <option value='linear'>Linear</option>
              <option value='radial'>Radial</option>
            </select>
          </div>
          <button onClick={getHexColorCode}>Test</button>
        </div>
      </div>
    </div>
  )
}

export default App
