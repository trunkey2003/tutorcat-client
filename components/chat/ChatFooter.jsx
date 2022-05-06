import { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Editor from "@monaco-editor/react";

const style = {
  position: "absolute",
  top: "45%",
  left: "50%",
  width: "70vw",
  height: "75vh",
  transform: "translate(-50%, -50%)",
  bgcolor: "#000",
  border: "2px solid #000",
  boxShadow: 24,
};

export default function ChatFooter({ handleAddMessageFromMe }) {
  const [showInputCodeModal, setShowInputCodeModal] = useState(false);
  const [runCodeLoading, setRunCodeLoading] = useState(false);
  const [inputForCode, setInputForCode] = useState('');
  const [outputForCode, setOutputForCode] = useState('');
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("vs-dark");
  const [showOutputCodeModal, setShowOutputCodeModal] = useState(false);
  const [message, setMessage] = useState("");
  const [codeActive, setCodeActive] = useState(false);

  const handleLanguage = (newLanguage) =>{
    if (language == newLanguage) return;
    setLanguage(newLanguage);
  }

  const handleInputInputForCode = (e) => {
    setInputForCode(e.target.value);
  };

  const handleClearInputInputForCode = () => {
    setInputForCode('');
  }

  const handleTheme = () => {
    const newTheme = (theme == 'vs-dark') ? 'light' : 'vs-dark';
    setTheme(newTheme);
  }

  const handleInputOnChange = (e) => {
    setMessage(e.target.value);
  };

  const handleRunCode = () => {
    setRunCodeLoading(true);
    setTimeout(() => {
      setRunCodeLoading(false);
    }, 3000);
  }

  const handleSendMessage = () => {
    if (message == "") return;
    handleAddMessageFromMe(message);
    setMessage("");
  };

  const handleInputOnKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleOpenInputCodeModal = () => {
    setCodeActive(true);
    setShowInputCodeModal(true);
  };

  const handleCloseInputCodeModal = () => {
    setCodeActive(false);
    setShowInputCodeModal(false);
  };

  return (
    <>
      <div className="absolute left-0 bottom-0 w-full h-[40px] bg-sky-900">
        <div className="relative flex">
          <span className="absolute inset-y-0 flex items-center">
            <button
              onClick={handleOpenInputCodeModal}
              type="button"
              className="inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-gray-300 hover:bg-gray-300 focus:outline-none"
            >
              {!codeActive ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 512"
                  className="h-6 w-6 text-gray-400 fill-gray-500"
                >
                  <path d="M414.8 40.79L286.8 488.8C281.9 505.8 264.2 515.6 247.2 510.8C230.2 505.9 220.4 488.2 225.2 471.2L353.2 23.21C358.1 6.216 375.8-3.624 392.8 1.232C409.8 6.087 419.6 23.8 414.8 40.79H414.8zM518.6 121.4L630.6 233.4C643.1 245.9 643.1 266.1 630.6 278.6L518.6 390.6C506.1 403.1 485.9 403.1 473.4 390.6C460.9 378.1 460.9 357.9 473.4 345.4L562.7 256L473.4 166.6C460.9 154.1 460.9 133.9 473.4 121.4C485.9 108.9 506.1 108.9 518.6 121.4V121.4zM166.6 166.6L77.25 256L166.6 345.4C179.1 357.9 179.1 378.1 166.6 390.6C154.1 403.1 133.9 403.1 121.4 390.6L9.372 278.6C-3.124 266.1-3.124 245.9 9.372 233.4L121.4 121.4C133.9 108.9 154.1 108.9 166.6 121.4C179.1 133.9 179.1 154.1 166.6 166.6V166.6z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 512"
                  className="h-6 w-6 text-gray-400 fill-yellow-400"
                >
                  <path d="M414.8 40.79L286.8 488.8C281.9 505.8 264.2 515.6 247.2 510.8C230.2 505.9 220.4 488.2 225.2 471.2L353.2 23.21C358.1 6.216 375.8-3.624 392.8 1.232C409.8 6.087 419.6 23.8 414.8 40.79H414.8zM518.6 121.4L630.6 233.4C643.1 245.9 643.1 266.1 630.6 278.6L518.6 390.6C506.1 403.1 485.9 403.1 473.4 390.6C460.9 378.1 460.9 357.9 473.4 345.4L562.7 256L473.4 166.6C460.9 154.1 460.9 133.9 473.4 121.4C485.9 108.9 506.1 108.9 518.6 121.4V121.4zM166.6 166.6L77.25 256L166.6 345.4C179.1 357.9 179.1 378.1 166.6 390.6C154.1 403.1 133.9 403.1 121.4 390.6L9.372 278.6C-3.124 266.1-3.124 245.9 9.372 233.4L121.4 121.4C133.9 108.9 154.1 108.9 166.6 121.4C179.1 133.9 179.1 154.1 166.6 166.6V166.6z" />
                </svg>
              )}
            </button>
          </span>
          <input
            onChange={handleInputOnChange}
            onKeyDown={handleInputOnKeyDown}
            type="text"
            value={message}
            placeholder="Write your message!"
            className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-200 placeholder-gray-600 ml-12 pl-2 bg-transparent py-1 h-[40px] w-[490px]"
          />
          <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full h-[40px] w-[40px] transition duration-500 ease-in-out text-gray-300 hover:bg-gray-300 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                ></path>
              </svg>
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full h-[40px] w-[40px] transition duration-500 ease-in-out text-gray-300 hover:bg-gray-300 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full h-[40px] w-[40px] transition duration-500 ease-in-out text-gray-300 hover:bg-gray-300 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </button>
            <button
              onClick={handleSendMessage}
              type="button"
              className="inline-flex items-center justify-center rounded-lg mr-5 transition duration-500 text-white ease-in-out hover:text-gray-400 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-6 w-6 transform rotate-90"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <Modal
        open={showInputCodeModal}
        onClose={handleCloseInputCodeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex">
            <div className="w-[60%]">
              <div className="h-[5vh] flex items-center">
                <div className="relative mx-4 language-icon">
                  <img
                    onClick={() => handleLanguage('javascript')}
                    className={`hover-span h-6 w-6 ${language == "javascript" ? "" : "grayscale"
                      } hover:grayscale-0 hover:cursor-pointer rounded-lg`}
                    src="/image/js.ico"
                  ></img>
                  <span className="span-hover bg-black rounded-lg bg-gray-900 text-white px-2 text-[12px] absolute top-[14px] left-4 z-10">
                    Javascript
                  </span>
                </div>
                <div className="relative mx-4 language-icon">
                  <img
                    onClick={() => handleLanguage('cpp')}
                    className={`hover-span h-6 w-6 ${language == "cpp" ? "" : "grayscale"
                      } hover:grayscale-0 hover:cursor-pointer rounded-lg`}
                    src="/image/cpp.ico"
                  ></img>
                  <span className="span-hover bg-black rounded-lg bg-gray-900 text-white px-2 text-[12px] absolute top-[14px] left-4 z-10">
                    C++
                  </span>
                </div>
                <div className="relative mx-4 language-icon">
                  <img
                    onClick={() => handleLanguage('python')}
                    className={`hover-span h-6 w-6 ${language == "python" ? "" : "grayscale"
                      } hover:grayscale-0 hover:cursor-pointer rounded-lg`}
                    src="/image/python.ico"
                  ></img>
                  <span className="span-hover bg-black rounded-lg bg-gray-900 text-white px-2 text-[12px] absolute top-[14px] left-4 z-10">
                    Python
                  </span>
                </div>
                <div className="relative mx-4 language-icon">
                  <img
                    onClick={() => handleLanguage('java')}
                    className={`hover-span h-6 w-6 ${language == "java" ? "" : "grayscale"
                      } hover:grayscale-0 hover:cursor-pointer rounded-lg`}
                    src="/image/java.ico"
                  ></img>
                  <span className="span-hover bg-black rounded-lg bg-gray-900 text-white px-2 text-[12px] absolute top-[14px] left-4 z-10">
                    Java
                  </span>
                </div>
                <div className="relative mx-4 language-icon">
                  <img
                    onClick={() => handleLanguage('csharp')}
                    className={`hover-span h-6 w-6 ${language == "csharp" ? "" : "grayscale"
                      } hover:grayscale-0 hover:cursor-pointer rounded-lg`}
                    src="/image/csharp.ico"
                  ></img>
                  <span className="span-hover bg-black rounded-lg bg-gray-900 text-white px-2 text-[12px] absolute top-[14px] left-4 z-10">
                    C#
                  </span>
                </div>
                <div className="ml-auto">
                  <input type="checkbox" className="checkbox" id="checkbox" onChange={handleTheme} />
                  <label for="checkbox" className="label">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4 h-4 fill-yellow-500 ml-[2px] rounded-full">
                      <path d="M256 159.1c-53.02 0-95.1 42.98-95.1 95.1S202.1 351.1 256 351.1s95.1-42.98 95.1-95.1S309 159.1 256 159.1zM509.3 347L446.1 255.1l63.15-91.01c6.332-9.125 1.104-21.74-9.826-23.72l-109-19.7l-19.7-109c-1.975-10.93-14.59-16.16-23.72-9.824L256 65.89L164.1 2.736c-9.125-6.332-21.74-1.107-23.72 9.824L121.6 121.6L12.56 141.3C1.633 143.2-3.596 155.9 2.736 164.1L65.89 256l-63.15 91.01c-6.332 9.125-1.105 21.74 9.824 23.72l109 19.7l19.7 109c1.975 10.93 14.59 16.16 23.72 9.824L256 446.1l91.01 63.15c9.127 6.334 21.75 1.107 23.72-9.822l19.7-109l109-19.7C510.4 368.8 515.6 356.1 509.3 347zM256 383.1c-70.69 0-127.1-57.31-127.1-127.1c0-70.69 57.31-127.1 127.1-127.1s127.1 57.3 127.1 127.1C383.1 326.7 326.7 383.1 256 383.1z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4 h-4 fill-blue-500 mr-[2px] rounded-full">
                      <path d="M32 256c0-123.8 100.3-224 223.8-224c11.36 0 29.7 1.668 40.9 3.746c9.616 1.777 11.75 14.63 3.279 19.44C245 86.5 211.2 144.6 211.2 207.8c0 109.7 99.71 193 208.3 172.3c9.561-1.805 16.28 9.324 10.11 16.95C387.9 448.6 324.8 480 255.8 480C132.1 480 32 379.6 32 256z" />
                    </svg>
                    <div className="ball" />
                  </label>
                </div>
              </div>
              <div className="h-[65vh] ml-4">
                <Editor
                  height="100%"
                  width="100%"
                  theme={theme}
                  language={language}
                  defaultValue=""
                />
              </div>
            </div>
            <div className="w-[40%] m-[5vh]">
              <textarea className={`w-full min-h-[10vh] h-[28vh] max-h-[28vh] ${(theme == 'vs-dark') ? 'bg-stone-900 text-white' : 'bg-gray-100 text-black'} resize-y rounded-md p-2 font-mono`} placeholder="input" value={inputForCode} onChange={handleInputInputForCode}></textarea>
              <div className="h-[8vh] flex justify-end items-center">
                <div className="relative ">
                  <button className="hover-span w-8 h-8 rounded-lg bg-sky-500 text-white text-sm font-medium flex items-center justify-center mr-2" onClick={handleClearInputInputForCode}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="h-[18px] w-[18px] fill-white">
                      <path d="M93.13 257.7C71.25 275.1 53 313.5 38.63 355.1L99 333.1c5.75-2.125 10.62 4.749 6.625 9.499L11 454.7C3.75 486.1 0 510.2 0 510.2s206.6 13.62 266.6-34.12c60-47.87 76.63-150.1 76.63-150.1L256.5 216.7C256.5 216.7 153.1 209.1 93.13 257.7zM633.2 12.34c-10.84-13.91-30.91-16.45-44.91-5.624l-225.7 175.6l-34.99-44.06C322.5 131.9 312.5 133.1 309 140.5L283.8 194.1l86.75 109.2l58.75-12.5c8-1.625 11.38-11.12 6.375-17.5l-33.19-41.79l225.2-175.2C641.6 46.38 644.1 26.27 633.2 12.34z" />
                    </svg>
                  </button>
                  <span className="span-hover bg-black rounded-lg bg-gray-900 text-white px-2 text-[12px] absolute top-[25px] left-4 z-10">
                    Clear
                  </span>
                </div>
                {(!runCodeLoading) ?
                  <div className="relative">
                    <button className="hover-span w-8 h-8 rounded-lg bg-sky-500 text-white text-sm font-medium flex items-center justify-center" onClick={handleRunCode}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="h-[18px] w-[18px] fill-white">
                        <path d="M361 215C375.3 223.8 384 239.3 384 256C384 272.7 375.3 288.2 361 296.1L73.03 472.1C58.21 482 39.66 482.4 24.52 473.9C9.377 465.4 0 449.4 0 432V80C0 62.64 9.377 46.63 24.52 38.13C39.66 29.64 58.21 29.99 73.03 39.04L361 215z" />
                      </svg>
                    </button>
                    <span className="span-hover bg-black rounded-lg bg-gray-900 text-white px-2 text-[12px] absolute top-[25px] left-4 z-10">
                      Run
                    </span>
                  </div>
                  :
                  <div className="relative">
                    <div className="hover-span relative w-8 h-8 rounded-lg bg-sky-500 text-white text-sm font-medium flex items-center justify-center animate-pulse">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="h-[18px] w-[18px] fill-white animate-spin">
                        <path d="M304 48C304 74.51 282.5 96 256 96C229.5 96 208 74.51 208 48C208 21.49 229.5 0 256 0C282.5 0 304 21.49 304 48zM304 464C304 490.5 282.5 512 256 512C229.5 512 208 490.5 208 464C208 437.5 229.5 416 256 416C282.5 416 304 437.5 304 464zM0 256C0 229.5 21.49 208 48 208C74.51 208 96 229.5 96 256C96 282.5 74.51 304 48 304C21.49 304 0 282.5 0 256zM512 256C512 282.5 490.5 304 464 304C437.5 304 416 282.5 416 256C416 229.5 437.5 208 464 208C490.5 208 512 229.5 512 256zM74.98 437C56.23 418.3 56.23 387.9 74.98 369.1C93.73 350.4 124.1 350.4 142.9 369.1C161.6 387.9 161.6 418.3 142.9 437C124.1 455.8 93.73 455.8 74.98 437V437zM142.9 142.9C124.1 161.6 93.73 161.6 74.98 142.9C56.24 124.1 56.24 93.73 74.98 74.98C93.73 56.23 124.1 56.23 142.9 74.98C161.6 93.73 161.6 124.1 142.9 142.9zM369.1 369.1C387.9 350.4 418.3 350.4 437 369.1C455.8 387.9 455.8 418.3 437 437C418.3 455.8 387.9 455.8 369.1 437C350.4 418.3 350.4 387.9 369.1 369.1V369.1z" />
                      </svg>
                    </div>
                    <span className="span-hover bg-black rounded-lg bg-gray-900 text-white px-2 text-[12px] absolute top-[25px] left-4 z-10">
                      Compiling
                    </span>
                  </div>

                }
              </div>
              <textarea className={`w-full min-h-[10vh] h-[28vh] max-h-[28vh] ${(theme == 'vs-dark') ? 'bg-stone-900 text-white' : 'bg-gray-100 text-black'} resize-y rounded-md p-2 font-mono focus:outline-none`} type="text" disabled placeholder="output" value={outputForCode}></textarea>
            </div>
          </div>
        </Box>
      </Modal>
      <style jsx>{`
        .span-hover {
          display: none;
        }

        .hover-span:hover + .span-hover {
          display: block;
        }

        .checkbox {
          opacity: 0;
          position: absolute;
        }

        .label {
          width: 63px;
          height: 28px;
          background-color: #333;
          display: flex;
          border-radius: 50px;
          align-items: center;
          justify-content: space-between;
          padding: 5px;
          position: relative;
        }

        .ball {
          width: 24px;
          height: 24px;
          background-color: white;
          position: absolute;
          top: 2px;
          left: 2px;
          border-radius: 50%;
          transition: transform 0.2s linear;
        }

        .checkbox:checked + .label .ball {
          transform: translateX(35px);
        }
      `}</style>
    </>
  );
}
