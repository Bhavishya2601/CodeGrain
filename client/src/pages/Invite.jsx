import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MonacoEditor from '@monaco-editor/react';
import io from 'socket.io-client';
import axios from 'axios';

import { FaPlay, FaStop, FaMousePointer } from "react-icons/fa";
import { LuDownload } from "react-icons/lu";
import { IoIosWarning, IoMdExit } from "react-icons/io";

const SOCKET_SERVER = import.meta.env.VITE_BACKEND_URL;
const Invite = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const socketRef = useRef(null);

  const [code, setCode] = useState(getDefaultCode('cpp'));
  const [output, setOutput] = useState('');
  const [compiling, setCompiling] = useState(false);
  const [language, setLanguage] = useState('cpp');
  const processRef = useRef(null);
  const [mousePositions, setMousePositions] = useState({})
  const [username, setUsername] = useState(`User-${Math.floor(Math.random() * 1000)}`)

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER);

    axios.get(`${SOCKET_SERVER}/room/check/${roomId}`)
      .then(response => {
        if (!response.data.exists) {
          alert("Room does not exist!");
          navigate('/');
        }
      })
      .catch(() => {
        alert("Error checking room.");
        navigate('/');
      });

    socketRef.current.emit('joinRoom', { roomId, username });

    socketRef.current.on('codeUpdate', (newCode) => {
      setCode(newCode);
    });

    socketRef.current.on('mouseUpdate', ({ x, y, username, socketId }) => {
      setMousePositions((prev) => ({ ...prev, [socketId]: { x, y, username } }))
    })

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId, navigate]);

  const handleCodeChange = (newValue) => {
    setCode(newValue);
    socketRef.current.emit('codeUpdate', { roomId, code: newValue });
  };

  const handleMouseMove = (e) => {
    const x = e.clientX
    const y = e.clientY
    socketRef.current.emit('mouseMove', { roomId, x, y, username })
  }

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    setCode(getDefaultCode(e.target.value));
    setOutput('');
  };

  const handleCompile = async () => {
    try {
      setOutput('Compiling...');
      setCompiling(true);
      const response = await axios.post(`${SOCKET_SERVER}/code/compile`, { code, language });
      setOutput(response.data.output);
      processRef.current = response.data.processId;
    } catch (error) {
      setOutput(error.response?.data?.output || 'Compilation error');
    } finally {
      setCompiling(false);
    }
  };

  const handleStop = async () => {
    if (processRef.current) {
      await axios.post(`${SOCKET_SERVER}/code/stop`, { processId: processRef.current });
      setOutput('Program stopped.');
      setCompiling(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const link = document.createElement('a');
    link.download = `code.${getFileExtension(language)}`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className='min-h-screen bg-[#1E1E1E] text-white' onMouseMove={handleMouseMove}>
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

          <div className='mb-4 '>
            Room ID: {roomId}
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
              onClick={handleDownload}
              className="px-4 py-2 rounded-lg bg-[#286090] text-xl cursor-pointer text-white"
            >
              <LuDownload />
            </button>

            <button
              onClick={()=>navigate('/')}
              className="px-4 py-2 rounded-lg bg-red-600 text-xl cursor-pointer text-white"
            >
              <IoMdExit className='text-2xl rotate-180' />
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
        {Object.entries(mousePositions).map(([socketId, { x, y, username }]) => (
          <div
            key={socketId}
            className="absolute flex"
            style={{ left: x + 10, top: y + 10 }}
          >
            <FaMousePointer className='text-blue-500' />
            <div className='text-blue-500 text-sm'>{username}</div>
          </div>
        ))}

        <div className="mt-4 h-[85px] overflow-auto">
          <pre>{output}</pre>
        </div>
      </div>

      <div className='h-10 text-lg font-manrope flex gap-2 items-center justify-center'>
        <IoIosWarning className='text-xl' /> This compiler does not support code that requires user input.
      </div>
    </div>
  );
};

export default Invite;

const getDefaultCode = (lang) => {
  const templates = {
    cpp: `// Made by Bhavishya Garg (https://linkedin.com/in/bhavishya2601)\n#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello, World!" << endl;\n  return 0;\n}`,
    c: `// Made by Bhavishya Garg (https://linkedin.com/in/bhavishya2601)\n#include <stdio.h>\n\nint main() {\n  printf("Hello, World!\\n");\n  return 0;\n}`,
    java: `// Made by Bhavishya Garg (https://linkedin.com/in/bhavishya2601)\npublic class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}`,
    python: `# Made by Bhavishya Garg (https://linkedin.com/in/bhavishya2601)\nprint("Hello, World!")`
  };
  return templates[lang] || '// Start coding...';
};

const getFileExtension = (lang) => {
  return { cpp: 'cpp', c: 'c', java: 'java', python: 'py' }[lang] || 'txt';
};
