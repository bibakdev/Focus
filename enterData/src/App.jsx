import { useState } from 'react';
import UserForm from './components/userForm';
function App() {
  const [data, setData] = useState([]);

  const handleClick = async () => {
    // مسیر فایل JSON

    const response = await fetch('http://localhost:5001/update-json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    console.log(result.message);
  };
  return (
    <div className="w-3/4 mx-auto mt-20">
      <UserForm data={data} setData={setData} />
      <button
        type="submit"
        className="w-full mt-10 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs  hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        onClick={handleClick}
      >
        overwrite in input.json
      </button>
    </div>
  );
}

export default App;
