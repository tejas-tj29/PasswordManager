import { useState,useCallback,useEffect,useRef } from 'react'

function App() {

  const [length,setLength] = useState(8);
  const [includeNumbers,setIncludeNumbers] = useState(false);
  const [includeSpecialChars,setIncludeSpecialChars] = useState(false);
  const [password,setPassword] = useState("");// Will hold the generated password

  const handleAutoFill = async(generatedPassword) => {
    // 1. Check if the code is running inside a browser extension environment
    if (!window.chrome || !chrome.tabs) {
      alert("Auto-fill only works when running as a browser extension!");
      return;
    }

    // 2. Get the current active browser tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab) return;

  // 3. Inject a script into that tab to find a password input field and fill it
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (password) => {
      // Look for standard password inputs on the web page
      const passwordInput = document.querySelector('input[type="password"]');
      
      if (passwordInput) {
        passwordInput.value = password;
        // Trigger an input event so the website's form logic detects the change
        passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
        alert("Password autofilled successfully!");
      } else {
        alert("No password input field found on this page!");
      }
    },
    args: [generatedPassword] // Pass the state variable password into the function
  });
};
 


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

  const copyPasswordToClipboard = useCallback(()=>{
    passwordRef.current?.select(); // It highlights the copied text in the input field
    passwordRef.current?.setSelectionRange(0,104);// It specifies the range of text to be selected, 
    window.navigator.clipboard.writeText(password);
  },[password])

  useEffect(()=>{
    generatePassword();
  },[length,includeNumbers,includeSpecialChars,generatePassword]);

  const passwordRef = useRef(null);

  return (
    <>
      <div className="w-full max-w-md mx-auto my-8 shadow-md rounded-lg px-4 text-orange-500 bg-gray-700">
        <h1 className="text-xl font-bold text-center pt-4">Password Generator</h1>
        <div className="flex shadow overflow-hidden">
          <input id = "password" type="text" value={password}  readOnly
           className="w-full rounded-lg px-3 py-1 my-4 outline-none"
           placeholder="Password"
           ref={passwordRef}
          />
          <button 
          onClick = {copyPasswordToClipboard}
          onMouseOver={(e)=>{e.target.style.backgroundColor = "rgb(59 130 246)"}}
          className="w-1/4 my-4 ml-3 bg-blue-500 rounded-lg shrink-0 text-white">Copy</button>
        </div>
        <div className="flex shadow gap-x-1 overflow-hidden">
          <input type="range" max = "50" min = "4" className="mb-2"  value={length} onChange={(e)=>setLength(e.target.value)}/>
          <p className="mb-2 ml-2">Length ({length})</p>
          <input type="checkbox" id="numbers" className="mt-2 size-3" 
          defaultChecked={includeNumbers}
          onChange={()=>{setIncludeNumbers((prev)=>!prev)}}
          />
          <label htmlFor="numbers">Numbers</label>
          <input type="checkbox" id="specialChars" className="mt-2 size-3" 
          defaultChecked={includeSpecialChars}
          onChange={()=>{setIncludeSpecialChars((prev)=>!prev)}}
          />
          <label htmlFor="specialChars">Characters</label>
          </div>
      </div>
    </>
  )
}

export default App