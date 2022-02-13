import React, { useState } from 'react';

const App = () => {
  const [count, setCount] = useState(0);
  const addCount = () => {
    setCount(count + 1);
    // setCount((a) => a + 1);
  };
  return (
    <div>
      <h1>{count}</h1>
      <button onClick={addCount}>Add</button>
    </div>
  );
};

export default App;
