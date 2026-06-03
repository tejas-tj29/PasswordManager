import { useState,useCallback } from 'react'

function App() {

  const [length,setLength] = useState(8);
  const [includeNumbers,setIncludeNumbers] = useState(false);
  const [includeSpecialChars,setIncludeSpecialChars] = useState(false);
  const [password,setPassword] = useState("");// Will hold the generated password

  const generatePassword = useCallback(()=>{
    let pass = "";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    if(includeNumbers){
      str += "0123456789";
    }
    if(includeSpecialChars){
      str += "!@#$%^&*()_+~`|}{[]:;?><,./-=";
    }

    for(let i=1; i<=length; i++){
      const idx = Math.floor(Math.random() * str.length +1);
      pass += str.charAt(idx);
    }
    setPassword(pass);

  },[includeNumbers,includeSpecialChars,length,setPassword])

  return (
    <>
      <div className="w-full max-w-md mx-auto my-8 shadow-md rounded-lg px-4 text-orange-500 bg-gray-700">
        <h1 className="text-xl font-bold text-center pt-4">Password Generator</h1>
        <div className="flex shadow overflow-hidden">
          <input id = "password" type="text" value={password}  readOnly
           className="w-full rounded-lg px-3 py-1 my-4 outline-none"
           placeholder="Password"
          />
          <button className="w-1/4 my-4 ml-3 bg-blue-500 rounded-lg text-white">Copy</button>
        </div>
        <div className="flex shadow overflow-hidden">
          <input type="range" className="mb-2"  value={length} onChange={(e)=>setLength(e.target.value)}/>
          <p className="mb-2 ml-2">Length ({length})</p>
          <input type="checkbox" id="numbers" className="mt-2 ml-3 size-3" />
          <label htmlFor="numbers" className="ml-2">Numbers</label>
          <input type="checkbox" id="specialChars" className="mt-2 ml-3 size-3" />
          <label htmlFor="specialChars" className="ml-2">Characters</label>
          </div>
      </div>
    </>
  )
}

export default App