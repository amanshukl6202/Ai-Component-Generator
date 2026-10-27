import Navbar from '../components/Navbar';
import Select from 'react-select';
import { BsStars } from "react-icons/bs";
import { HiOutlineCode } from "react-icons/hi";
import Editor from '@monaco-editor/react';
import { useState } from 'react';
import { PiExport } from "react-icons/pi";
import { IoCopy, IoCloseSharp } from "react-icons/io5";
import { ImNewTab } from "react-icons/im";
import { FiRefreshCcw } from "react-icons/fi";
import { GoogleGenAI } from "@google/genai";
import { ClipLoader } from 'react-spinners';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const options = [
    { value: 'html-css', label: 'HTML + CSS' },
    { value: 'html-tailwind', label: 'HTML + Tailwind CSS' },
    { value: 'html-bootstrap', label: 'HTML + Bootstrap' },
    { value: 'html-css-js', label: 'HTML + CSS + JS' },
    { value: 'html-tailwind-bootstrap', label: 'HTML + Tailwind + Bootstrap' }
  ];

  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [frameWork, setFrameWork] = useState(options[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewTabOpen, setIsNewTabOpen] = useState(false);

  // Universal fix — works for ANY game or component
  const injectFix = (html) => {
    const fix = `<script>
      // Block external link navigation
      document.addEventListener('click', function(e) {
        const target = e.target.closest('a');
        if (target) {
          const href = target.getAttribute('href');
          if (href && !href.startsWith('#')) e.preventDefault();
        }
      }, true);

      // Fix location.reload() — blocked in sandbox
      const _reload = () => {
        const fns = ['restartGame','resetGame','initGame','startGame','init','initializeGame','newGame','reset','restart','setup'];
        for (const fn of fns) {
          if (typeof window[fn] === 'function') { window[fn](); return; }
        }
        // fallback — reload iframe via srcdoc re-inject
      };
      try {
        Object.defineProperty(window.location, 'reload', { value: _reload, writable: true });
      } catch(e) {}

      // Auto-init on load
      window.addEventListener('load', function() {
        const fns = ['initializeGame','initGame','startGame','init','setup','newGame'];
        for (const fn of fns) {
          if (typeof window[fn] === 'function') { window[fn](); break; }
        }
      });
    <\/script>`;
    if (html.includes('</body>')) return html.replace('</body>', fix + '</body>');
    return html + fix;
  };

  function extractCode(response) {
    const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
  }

  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

  async function getResponse() {
    if (!prompt.trim()) { toast.error("Please describe your component!"); return; }
    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: { thinkingConfig: { thinkingBudget: 0 } },
        contents: `You are an expert web developer. Create modern, animated, fully responsive UI components.

Generate a UI component for: ${prompt}
Framework: ${frameWork.value}

STRICT Rules:
- Return ONLY code in Markdown fenced code block. No explanation.
- Single complete HTML file only.
- Use window.onload instead of DOMContentLoaded.
- NEVER use location.reload() — use a named reset function like restartGame(), resetGame(), or initGame() instead.
- All game restart/reset must use a callable named function.
- Modern design with animations, hover effects, shadows, good typography.
- SEO optimized.`,
      });
      setCode(extractCode(response.text));
      setOutputScreen(true);
      setTab(2);
      toast.success("Code generated!");
    } catch (err) {
      toast.error("Something went wrong. Try again!");
    }
    setLoading(false);
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied!");
    } catch {
      toast.error("Failed to copy.");
    }
  };

  const downloadFile = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "GenUI-Code.html";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded!");
  };

  const refreshPreview = () => {
    const c = code;
    setCode('');
    setTimeout(() => setCode(c), 50);
  };

  return (
    <>
      <Navbar />
      <ToastContainer position="top-right" autoClose={2000} theme="dark" />

      <div className="flex items-center px-[100px] justify-between gap-[30px]">
        <div className="left w-[50%] h-[auto] py-[30px] rounded-xl bg-[#141319] mt-5 p-[20px]">
          <h3 className='text-[25px] font-semibold sp-text'>AI Component Generator</h3>
          <p className='text-[gray] mt-2 text-[16px]'>Describe your component and let AI code for you.</p>

          <p className='text-[15px] font-[700] mt-4'>Framework</p>
          <Select
            className='mt-2'
            options={options}
            defaultValue={options[0]}
            styles={{
              control: (base) => ({ ...base, backgroundColor: "#111", borderColor: "#333", color: "#fff", boxShadow: "none", "&:hover": { borderColor: "#555" } }),
              menu: (base) => ({ ...base, backgroundColor: "#111", color: "#fff" }),
              option: (base, state) => ({ ...base, backgroundColor: state.isSelected ? "#333" : state.isFocused ? "#222" : "#111", color: "#fff", "&:active": { backgroundColor: "#444" } }),
              singleValue: (base) => ({ ...base, color: "#fff" }),
              placeholder: (base) => ({ ...base, color: "#aaa" }),
              input: (base) => ({ ...base, color: "#fff" }),
            }}
            onChange={(e) => setFrameWork(e)}
          />

          <p className='text-[15px] font-[700] mt-5'>Describe your component</p>
          <textarea
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
            className='w-full min-h-[200px] rounded-xl bg-[#090908] mt-3 p-[10px] text-white outline-none resize-none'
            placeholder="Describe your component in detail and let AI do the magic!"
          />
          <div className="flex items-center justify-between mt-2">
            <p className='text-[gray] text-[14px]'>Click Generate to create your component</p>
            <button
              onClick={getResponse}
              disabled={loading}
              className="generate flex items-center p-[15px] rounded-lg border-0 bg-gradient-to-r from-purple-400 to-purple-600 mt-3 px-[20px] gap-[10px] transition-all hover:opacity-[.8] disabled:opacity-50"
            >
              {loading ? <ClipLoader color='white' size={20} /> : <BsStars />}
              Generate
            </button>
          </div>
        </div>

        <div className="right relative mt-2 w-[50%] h-[80vh] bg-[#141319] rounded-xl overflow-hidden">
          {outputScreen === false ? (
            <div className="skeleton w-full h-full flex items-center flex-col justify-center">
              <div className="circle p-[20px] w-[70px] flex items-center justify-center text-[30px] h-[70px] rounded-[50%] bg-gradient-to-r from-purple-400 to-purple-600"><HiOutlineCode /></div>
              <p className='text-[16px] text-[gray] mt-3'>Your component & code will appear here</p>
            </div>
          ) : (
            <>
              <div className="top bg-[#17171C] w-full h-[60px] flex items-center gap-[15px] px-[20px]">
                <button onClick={() => setTab(1)} className={`btn w-[50%] p-[10px] rounded-xl cursor-pointer transition-all ${tab === 1 ? 'bg-[#333]' : ''}`}>Code</button>
                <button onClick={() => setTab(2)} className={`btn w-[50%] p-[10px] rounded-xl cursor-pointer transition-all ${tab === 2 ? 'bg-[#333]' : ''}`}>Preview</button>
              </div>
              <div className="top2 bg-[#17171C] w-full h-[60px] flex items-center justify-between gap-[15px] px-[20px]">
                <p className='font-bold'>Code Editor</p>
                <div className="flex items-center gap-[10px]">
                  {tab === 1 ? (
                    <>
                      <button title="Copy" className="w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333]" onClick={copyCode}><IoCopy /></button>
                      <button title="Download" className="w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333]" onClick={downloadFile}><PiExport /></button>
                    </>
                  ) : (
                    <>
                      <button title="Fullscreen" className="w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333]" onClick={() => setIsNewTabOpen(true)}><ImNewTab /></button>
                      <button title="Refresh" className="w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333]" onClick={refreshPreview}><FiRefreshCcw /></button>
                    </>
                  )}
                </div>
              </div>
              <div className="editor" style={{ height: 'calc(100% - 120px)' }}>
                {tab === 1 ? (
                  <Editor value={code} height="100%" theme='vs-dark' language="html" />
                ) : (
                  <iframe
                    key={code}
                    srcDoc={injectFix(code)}
                    sandbox="allow-scripts allow-same-origin"
                    className="w-full h-full bg-white"
                    title="preview"
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {isNewTabOpen && (
        <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex flex-col bg-white w-screen h-screen">
          <div className="text-black w-full h-[60px] flex items-center justify-between px-[20px] border-b border-gray-200 flex-shrink-0">
            <p className='font-bold'>Fullscreen Preview</p>
            <button className="w-[40px] h-[40px] rounded-xl border border-zinc-300 flex items-center justify-center hover:bg-gray-100 text-black" onClick={() => setIsNewTabOpen(false)}>
              <IoCloseSharp />
            </button>
          </div>
          <iframe
            key={code + 'fs'}
            srcDoc={injectFix(code)}
            sandbox="allow-scripts allow-same-origin"
            className="w-full flex-1"
            title="fullscreen-preview"
          />
        </div>
      )}
    </>
  );
}

export default Home;