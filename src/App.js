import React, { useState, useRef } from "react";
import { Transition } from "@headlessui/react";
import FaceDetector from "./lib";
import logo from "./logo.svg"
import axios from 'axios';

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [showResults, setShowResults] = useState(false)
  const [showResults1, setShowResults1] = useState(false)
  const [stream, setStream] = useState(null);

  const startCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(stream => {
        setStream(stream);
      })
      .catch(error => {
        console.log('Error accessing camera:', error);
      });
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };
  const change = () => {
    setShowResults(true);
    setShowResults1(false);
    startCamera()
  }
  const change1 = () => {
    setShowResults(false);
    setShowResults1(true);
    stopCamera()
  }

  const [name, setName] = useState('');
  const [msg, setMsg] = useState([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const register = () => {
    axios.get(`http://localhost:5000/register?name=${name}`)
      .then(res => setMsg(res.data))
      .catch(err => console.log(err));
  }

  const login = () => {
    axios.get('http://localhost:5000/login')
      .then(res => {
        setMsg(res.data);
        if (res.data[0] !== 'You are unknown first register your self') {
          const ctx = canvasRef.current.getContext('2d');
          const img = new Image();
          img.onload = () => ctx.drawImage(img, 0, 0);
          img.src = 'http://localhost:5000/static/Images/Unknown_faces/' + res.data[2] + '.jpg';
        }
      })
      .catch(err => console.log(err));
  }

  return (
    <>
    <div className="h-screen">
      <nav className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img
                  className="h-8 w-8"
                  src={logo}
                  alt="Workflow"
                />
              </div>
              <div className="hidden md:flex">
                <div className="ml-10 flex items-baseline space-x-4">
                  <a
                    href="#"
                    className=" hover:bg-gray-700 text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Home
                  </a>

                  <a
                    target="_blank" rel="noopener noreferrer"
                    href="https://arxiv.org/pdf/1305.4537.pdfs"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    PICO
                  </a>
                </div>
              </div>
            </div>
            <div className="items-baseline space-x-4">
              <a
                target="_blank" rel="noopener noreferrer"
                href="https://github.com/2773kartik/face_detection"
                className="text-gray-300 bg-violet-700 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="inline w-5 mb-1 mr-1 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>

                Star Me!
              </a>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="bg-gray-900 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!isOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        <Transition
          show={isOpen}
          enter="transition ease-out duration-100 transform"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-75 transform"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          {(ref) => (
            <div className="md:hidden" id="mobile-menu">
              <div ref={ref} className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <a
                  href="#"
                  className="hover:bg-gray-700 text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Home
                </a>

                <a
                  target="_blank" rel="noopener noreferrer"
                  href="https://arxiv.org/pdf/1305.4537.pdfs"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  PICO
                </a>

              </div>
            </div>
          )}
        </Transition>
      </nav>

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Face detection and recognition</h1>
        </div>
      </header>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
  <div className="flex justify-center space-x-4">
    <div className="border-2 border-blue-600 rounded-lg px-3 py-2 text-blue-400 cursor-pointer hover:bg-blue-600 hover:text-blue-200 w-28" onClick={change}>
      Detect
    </div>
    <div className="border-2 border-blue-600 rounded-lg px-3 py-2 text-blue-400 cursor-pointer hover:bg-blue-600 hover:text-blue-200 w-28" onClick={change1}>
      Recognize
    </div>
  </div>
  <div className="px-4 py-6 sm:px-0">
    <div className="border-4 border-dashed border-gray-200 rounded-lg h-auto">
      <center className={showResults ? "visible" : "hidden"}>
        {stream && <FaceDetector stream={stream}>
          {(facesData) => (
            <ul>
              {facesData.map((face) => (
                <li key={`${face.x}-${face.y}`}>{face.x + " " + face.y}</li>
              ))}
            </ul>
          )}
        </FaceDetector>}
        <h1>Face detection using PICO</h1>
      </center>
      <center className={showResults1 ? "visible" : "hidden"}>
      <div className="App">
      <header className="App-header">
        <h1>Face Recognition</h1>
      </header>
        <div className="form-container">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" placeholder="Your id (keep it unique)" value={name} onChange={e => setName(e.target.value)} className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
          <br/>
          <button onClick={register} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-2 rounded">Register</button>
          <button onClick={login} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Login</button>
          <h1>{msg[0]}</h1>
          {msg[1]==1?
          <img src={`${msg[2]}`}></img>
          :
          <img></img>
          }
        </div>
    </div>
      </center>
    </div>
  </div>
</div>
</div>
<footer class="bg-gray-800 rounded-lg shadow m-4 dark:bg-gray-800">
    <div class="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
      <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 Kartik Tiwari
    </span>
    <ul class="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
        <li>
            <a target="_blank" rel="noopener noreferrer" href="https://github.com/2773kartik" class="mr-4 hover:underline md:mr-6 ">Github</a>
        </li>
        <li>
            <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/kartik-tiwari-808621172/" class="mr-4 hover:underline md:mr-6">LinkedIn</a>
        </li>
    </ul>
    </div>
</footer>
</>

  );
}

export default App;
