import React, { useState, useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';
import axios from 'axios';
import { useUser } from '../context/userContext';

import { LuDownload } from "react-icons/lu";
import { IoIosWarning } from "react-icons/io";
import { FaPlay, FaStop, FaUser } from "react-icons/fa";

import Popup from '../components/Popup';

const Home = () => {
  const [code, setCode] = useState(getDefaultCode('cpp'));
  const [output, setOutput] = useState('');
  const [compiling, setCompiling] = useState(false);
  const [language, setLanguage] = useState('cpp');
  const processRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const { userData } = useUser();

  const handleCodeChange = (newValue) => {
    setCode(newValue);
  };

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setCode(getDefaultCode(e.target.value));
    setLanguage(selectedLanguage);
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

  const handleDownload = async () => {

    const blob = new Blob([code], { type: 'text/plain' });
    const link = document.createElement('a');
    link.download = `code.${language === "python" ? 'py' : language === "cpp" ? "cpp" : language === "c" ? "c" : "java"}`;
    link.href = URL.createObjectURL(blob);
    link.click()
    URL.revokeObjectURL(link.href);
  }

  const handleInvite = () => {
    setShowModal(true);
  };

  return (
    <div className='min-h-screen bg-[#1E1E1E] text-white '>
      <div className="p-4 font-manrope min-h-[calc(100vh-40px)]">
        <div className='flex items-center justify-between'>

          <div className="mb-4 text-sm">
            <label htmlFor="language-select" className="mr-2">Language:</label>
            <select
              id="language-select"
              value={language}
              onChange={handleLanguageChange}
              className="p-2 py-1 bg-black rounded-lg text-white border-[1px] border-white outline-none"
            >
              <option value="cpp">C++</option>
              <option value="c">C</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
            </select>
          </div>
          <div className="mb-4 flex gap-3 font-semibold">

            <button
              onClick={handleCompile}
              disabled={compiling}
              className="px-4 py-2 rounded-lg bg-[#449D44] cursor-pointer text-white disabled:bg-gray-500 flex gap-2 items-center"
            >
              <FaPlay /> {compiling ? 'Compiling...' : 'Compile'}
            </button>

            <button
              onClick={handleStop}
              disabled={!compiling}
              className={`px-4 py-2 rounded-lg bg-red-500 text-white disabled:bg-gray-500 flex gap-2 items-center ${compiling ? 'cursor-pointer' : 'cursor-not-allowed'}`}
            >
              <FaStop /> Stop
            </button>
            <button
              onClick={handleInvite}
              disabled={compiling}
              className="px-4 py-2 rounded-lg bg-[#EC971F] cursor-pointer text-white disabled:bg-gray-500 flex gap-2 items-center"
            >
              Create a room
            </button>

            <button
              onClick={handleDownload}
              disabled={compiling}
              className="px-4 py-2 rounded-lg bg-[#286090] text-xl cursor-pointer text-white disabled:bg-gray-500"
            >
              <LuDownload />
            </button>

            {Object.entries(userData).length !== 0 &&
              <div className='rounded-full flex px-2 cursor-pointer items-center '>
                {userData.picture === 'NA' ?
                  <img src={userData.picture} className='h-10 rounded-full' /> :
                  <FaUser className='text-2xl' />
                }
              </div>}
          </div>
        </div>

        <MonacoEditor
          height="500px"
          language={language}
          value={code}
          onChange={handleCodeChange}
          theme="vs-dark"
        />

        <div className="mt-4 h-[85px] overflow-auto">
          <pre>{output}</pre>
        </div>
      </div>
      <div className='h-10 text-lg font-manrope flex gap-2 items-center justify-center'> <IoIosWarning className='text-xl' /> This compiler does not support code that requires user input.</div>
      {showModal && <Popup setShowModal={setShowModal} />}
    </div>
  );
};

export default Home;

const getDefaultCode = (lang) => {
  const templates = {
    cpp: `// Made by Bhavishya Garg (https://linkedin.com/in/bhavishya2601)\n#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello, World!" << endl;\n  return 0;\n}`,
    c: `// Made by Bhavishya Garg (https://linkedin.com/in/bhavishya2601)\n#include <stdio.h>\n\nint main() {\n  printf("Hello, World!\\n");\n  return 0;\n}`,
    java: `// Made by Bhavishya Garg (https://linkedin.com/in/bhavishya2601)\npublic class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}`,
    python: `# Made by Bhavishya Garg (https://linkedin.com/in/bhavishya2601)\nprint("Hello, World!")`
  };
  return templates[lang] || '// Start coding...';
};
