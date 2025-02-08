import React, { useState, useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import axios from 'axios';

const Home = () => {
  const [code, setCode] = useState(`#include <iostream>
using namespace std;

int main() {
  cout << "Hello, World!" << endl;
  return 0;
}`);
  const [output, setOutput] = useState('');
  const [compiling, setCompiling] = useState(false);
  const [language, setLanguage] = useState('cpp'); 
  const processRef = useRef(null);

  const handleCodeChange = (newValue) => {
    setCode(newValue);
  };

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);

    
    if (selectedLanguage === 'cpp') {
      setCode(`#include <iostream>
using namespace std;

int main() {
  cout << "Hello, World!" << endl;
  return 0;
}
`); 
    } else if (selectedLanguage === 'c') {
      setCode(`#include <stdio.h>

int main() {
  printf("Hello, World!\\n");
  return 0;
}
`);
    } else if (selectedLanguage === 'java') {
      setCode(`public class Main {
  public static void main(String[] args) {
    System.out.println("Hello, World!");
  }
}`);
    } else if (selectedLanguage === 'python') {
      setCode(`print("Hello, World!")`); 
    }

    setOutput('');
  };

  const handleCompile = async () => {
    try {
      setOutput('Compiling...');
      setCompiling(true);

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/code/compile`, {
        code,
        language,
      });

      setOutput(response.data.output); 
      processRef.current = response.data.processId;
    } catch (error) {
      setOutput(error.response.data.output)
    } finally {
      setCompiling(false);
    }
  };

  const handleStop = async () => {
    if (processRef.current) {
      try {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/code/stop`, {
          processId: processRef.current,
        });
        setOutput('Program stopped.');
        setCompiling(false);
      } catch (error) {
        setOutput('Error stopping the program');
      }
    }
  };

  return (
    <div className="bg-[#1E1E1E] text-white p-4 min-h-screen font-manrope">
      <div className='flex items-center justify-between'>

        <div className="mb-4 text-lg">
          <label htmlFor="language-select" className="mr-2">Select Language:</label>
          <select
            id="language-select"
            value={language}
            onChange={handleLanguageChange}
            className="p-2 py-1 bg-black rounded-lg text-white "
          >
            <option value="cpp">C++</option>
            <option value="c">C</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
          </select>
        </div>
        <div className="mb-4 font-semibold">
          <button
            onClick={handleCompile}
            disabled={compiling}
            className="px-4 py-2 rounded-lg bg-[#449D44] cursor-pointer text-white disabled:bg-gray-500"
          >
            {compiling ? 'Compiling...' : 'Compile'}
          </button>

          <button
            onClick={handleStop}
            disabled={!compiling}
            className="ml-4 px-4 py-2 rounded-lg bg-red-500 text-white disabled:bg-gray-500"
          >
            Stop
          </button>
        </div>
      </div>

      <MonacoEditor
        height="500px"
        language={language}
        value={code}
        onChange={handleCodeChange}
        theme="vs-dark"
      />

      <div className="mt-4">
        <h3>Output:</h3>
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default Home;