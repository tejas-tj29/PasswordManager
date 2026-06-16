import { useState,useCallback,useEffect,useRef } from 'react'
import { analyzePasswordSecurity } from './gemini.js';

function App() {

  const [length,setLength] = useState(8);
  const [includeNumbers,setIncludeNumbers] = useState(false);
  const [includeSpecialChars,setIncludeSpecialChars] = useState(false);
  const [password,setPassword] = useState("");// Will hold the generated password

  // Step 2: Establish states to manage network interaction updates
  const [aiReview, setAiReview] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);

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

  // Step 3: Handle the asynchronous AI network lifecycle call
  const handleAiAudit = async () => {
    setIsAiLoading(true);
    setAiReview(""); // Clear container
    
    // Pass our active password hook variable directly into the engine function
    const critique = await analyzePasswordSecurity(password);
    
    setAiReview(critique);
    setIsAiLoading(false);

    setIsCooldown(true);
  setTimeout(() => {
    setIsCooldown(false);
  }, 3000);
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
      const idx = Math.floor(Math.random() * str.length);
      pass += str.charAt(idx);
    }
    setPassword(pass);
    setAiReview(""); // Reset the AI state container so old critiques don't linger

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
          <button 
            onClick={() => handleAutoFill(password)} 
            className="autofill-btn"
          > Autofill
          </button>
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
          {/* ==================== NEW FEATURE: AI SECURITY SPECIALIST PANEL ==================== */}
        <div className="mt-2 pt-3 border-t border-gray-600/50">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-zinc-300 font-medium">Want an advanced AI audit?</p>
            <button
              onClick={handleAiAudit}
              disabled={isAiLoading || isCooldown || !password}
              className="px-3 py-1.5 text-xs font-bold rounded-md bg-orange-500 hover:bg-orange-400 disabled:bg-gray-600 disabled:opacity-50 text-white transition-colors cursor-pointer"
            >
              {isAiLoading ? 'Analyzing Layout...' : isCooldown ? 'Cooling down...' : 'Audit with AI'}
            </button>
          </div>

          {/* Conditional layout box container prints out only when data exists */}
          {aiReview && (
            <div className="mt-3 p-3 bg-gray-800 rounded-lg border border-orange-500/20 shadow-inner">
              <p className="text-[10px] text-orange-400 font-mono font-bold tracking-wider uppercase mb-1">
                🔒 Security Assessment:
              </p>
              <p className="text-xs text-zinc-200 leading-relaxed italic">
                "{aiReview}"
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default App