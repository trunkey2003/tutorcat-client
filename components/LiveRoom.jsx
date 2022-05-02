import { useEffect, useState, useRef } from "react";
import Peer from "peerjs";
import { io } from "socket.io-client";
import Loading from "./Loading";
import { Axios } from "../config/axios";
import Error from "./Error";
import Cookies from "universal-cookie";

const socket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}/room`);
var created;

export default function LiveRoom({ roomID }) {
  const [shareAudio, setShareAudio] = useState(true);
  const [shareCam, setShareCam] = useState(false);
  const [sharingScreen, setSharingScreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remoteCallScreenOff, setRemoteCallScreenOff] = useState(null);
  const [myCallScreenOff, setMyCallScreenOff] = useState(true);
  const [error, setError] = useState(false);

  const myCallTrack = useRef();
  const myCallStream = useRef();
  const myWebcamStream = useRef();
  const myScreenStream = useRef();
  const myPeer = useRef();
  const myMediaConnection = useRef();
  const myVideo = useRef();
  const remoteVideo = useRef();

  const setCookieRoom = (key, value) => {
    const cookies = new Cookies();
    cookies.set(key, value, { path: "/live" });
  };

  const removeCookieRoom = (key) => {
    const cookies = new Cookies();
    cookies.remove(key, { path: "/live" });
  };

  function getCookieRoom(key) {
    let name = key + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  useEffect(() => {
    setLoading(true);
    socket.on("me", (socketID) => {
      Axios.put(`/api/room/join/${roomID}/${socketID}`)
        .then(({ data }) => {
          created = data.userCount == 1 ? false : true;
          if (!created) {
            handleCreateRoom();
            socket.emit("create room", roomID);
            socket.on("end call", () => {
              myMediaConnection.current?.close();
              remoteVideo.current.srcObject = null;
              setRemoteCallScreenOff(null);
            });
            socket.on("join room", () => {
              setRemoteCallScreenOff(true);
            });
          } else {
            handleJoinRoom();
            socket.emit("join room", roomID);
            socket.on("end call", () => {
              myMediaConnection.current?.close();
              remoteVideo.current.srcObject = null;
              setRemoteCallScreenOff(null);
            });
          }

          socket.on("remote turn webcam off", () => {
            setRemoteCallScreenOff(true);
            handleRemoteCallScreen(null);
          });

          socket.on("remote turn webcam on", () => {
            setRemoteCallScreenOff(false);
          });

          socket.on("remote start share screen", () => {
            setRemoteCallScreenOff(false);
          });

          socket.on("remote stop share screen", () => {
            setRemoteCallScreenOff(true);
            handleRemoteCallScreen(null);
          });

          setLoading(false);
        })
        .catch((err) => {
          setError(true);
          setLoading(false);
        });
    });
  }, []);

  const handleStartShareScreen = () => {
    navigator.mediaDevices
      .getDisplayMedia({ video: { mediaSource: "screen" }, audio: true })
      .then(async (stream) => {
        myWebcamStream.current?.getTracks().forEach((track) => track.stop());
        myCallTrack.current?.stop();
        myCallTrack.current = stream.getTracks().filter((track) => track.kind == "video")[0];
        socket.emit("start share screen", roomID);
        let finalStream = null;
        //audio của người dùng
        if (shareAudio) {
          const audio = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

          finalStream = new MediaStream([...stream.getTracks(), ...audio.getTracks()]);

          //Luu screen stream de ti hoi ngat ket noi
          myWebcamStream.current = audio;
          myScreenStream.current = finalStream;
          myCallStream.current = finalStream;
        } else {
          finalStream = stream;
          myCallStream.current = finalStream;
          myScreenStream.current = finalStream;
        }

        setMyCallScreenOff(false);
        handleMyCallScreen(finalStream);
        setSharingScreen(true);
        //Neu ma chua call
        if (!remoteVideo.current.srcObject) return;

        //Neu da call roi
        if (created) myPeer.current.call(roomID, finalStream);
        else myPeer.current.call("joiner-" + roomID, finalStream);
        setSharingScreen(true);
      });
  };

  const handleStopShareScreen = () => {
    socket.emit("stop share screen", roomID);
    myScreenStream.current?.getTracks().forEach((track) => track.stop());
    myCallTrack.current?.stop();
    if (shareAudio == false && shareCam == false) {
      setSharingScreen(false);
      setMyCallScreenOff(true);
      return;
    }
    navigator.getUserMedia({ video: shareCam, audio: shareAudio }, (stream) => {
      handleMyCallScreen(stream);
      myWebcamStream.current = stream;
      if (!shareCam) setMyCallScreenOff(true);
      if (created) myPeer.current.call(roomID, stream);
      else myPeer.current.call("joiner-" + roomID, stream);
      setSharingScreen(false);
    });
  };

  const handleMyCallScreen = (stream) => {
    myVideo.current.srcObject = stream;
    myVideo.current.muted = true;
    myVideo.current.play();
    myCallStream.current = stream;
  };

  const handleRemoteCallScreen = (stream) => {
    remoteVideo.current.srcObject = stream;
    remoteVideo.current.play();
  };

  const handleUnShareAudio = () => {
    if (sharingScreen) {
      myWebcamStream.current?.getTracks().forEach((track) => {
        if (track.kind != "video") track.stop();
      });
      setShareAudio(false);
      return;
    }

    myWebcamStream.current?.getTracks().forEach((track) => {
      if (track != myCallTrack.current) track.stop();
    });
    //Trường hợp yêu cầu audio mà cam cũng đang tắt thì:
    if (shareCam == false && !shareAudio == false) {
      myCallStream.current = null;
      myWebcamStream.current?.getTracks().forEach((track) => track.stop());
      //nếu chưa có ai vào
      if (!remoteVideo.current.srcObject) {
        setShareAudio(false);
        return;
      }

      if (created) myPeer.current.call(roomID, null);
      else myPeer.current.call("joiner-" + roomID, null);
      setShareAudio(false);
      return;
    }
    navigator.getUserMedia({ video: shareCam, audio: !shareAudio }, (stream) => {
      myCallStream.current = stream;
      stream.getTracks().forEach((track) => myWebcamStream.current?.addTrack(track));
      //nếu chưa có ai vào
      if (!remoteVideo.current.srcObject) {
        setShareAudio(false);
        return;
      }

      if (created) myPeer.current.call(roomID, stream);
      if (!created) myPeer.current.call("joiner-" + roomID, stream);
      setShareAudio(false);
    });
  };

  const handleShareAudio = async () => {
    if (sharingScreen) {
      const audio = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

      audio.addTrack(myCallTrack.current);

      //Lưu tạm audio vào webcam stream tí hồi clear
      myWebcamStream.current = audio;
      myCallStream.current = audio;

      //nếu chưa có ai vào
      if (!remoteVideo.current.srcObject) {
        setShareAudio(true);
        return;
      }

      if (created) myPeer.current.call(roomID, audio);
      if (!created) myPeer.current.call("joiner-" + roomID, audio);
      setShareAudio(true);
      return;
    }
    navigator.getUserMedia({ video: shareCam, audio: !shareAudio }, (stream) => {
      myCallStream.current = stream;

      myWebcamStream.current?.getTracks().forEach((track) => {
        if (track != myCallTrack.current) track.stop();
      });
      stream.getTracks().forEach((track) => myWebcamStream.current?.addTrack(track));
      //nếu chưa có ai vào
      if (!remoteVideo.current.srcObject) {
        setShareAudio(true);
        return;
      }

      if (created) myPeer.current.call(roomID, stream);
      if (!created) myPeer.current.call("joiner-" + roomID, stream);
      // if (created && myCallTrack.current?.enabled) myPeer.current.call(roomID, new MediaStream(myCallTrack.current));
      // if (!created && myCallTrack.current?.enabled) myPeer.current.call("joiner-" + roomID, new MediaStream(myCallTrack.current));
      setShareAudio(true);
    });
    // myVideo.current.muted = false;
  };

  const handleEndCall = () => {
    // console.log(myMediaConnection.current);
    // myWebcamStream.current?.getTracks().forEach((track) => track.stop());
    myMediaConnection.current?.close();
    if (created) window.location.href = window.location.origin + "/live";
    if (!remoteVideo.current.srcObject) {
      setLoading(true);
      Axios.delete(`/api/room/delete/${roomID}`)
        .then(() => {
          socket.emit("end call", roomID);
          window.location.href = window.location.origin + "/live";
        })
        .catch(() => {})
        .finally(() => {
          setLoading(false);
          window.location.href = window.location.origin + "/live";
        });
    }
    socket.emit("end call", roomID);
    // myVideo.current.srcObject = null;
    // remoteVideo.current.srcObject = null;
  };

  const handleStartWebcam = () => {
    if (sharingScreen) return;
    myWebcamStream.current?.getTracks().forEach((track) => track.stop());
    navigator.getUserMedia({ video: !shareCam, audio: shareAudio }, (stream) => {
      handleMyCallScreen(stream);
      myWebcamStream.current = stream;
      myCallTrack.current = stream.getTracks().filter((track) => track.kind == "video")[0];
      setShareCam(true);
      setMyCallScreenOff(false);

      // Nếu chưa có ai vào
      if (myMediaConnection.current == undefined) {
        return;
      }

      //Nếu là người tạo phòng và đã có người vào thì đưa stream mới có video cho người đó
      if (created) myPeer.current.call(roomID, stream);
      else myPeer.current.call("joiner-" + roomID, stream);

      socket.emit("turn webcam on", roomID);
    });
  };

  const handleStopWebcam = () => {
    socket.emit("turn webcam off", roomID);
    myWebcamStream.current?.getTracks().forEach((track) => track.stop());
    myCallTrack.current?.stop();
    if (!shareCam == false && shareAudio == false) {
      //Trường hợp yêu cầu tắt cam nhưng audio cũng đang tắt thì:
      handleMyCallScreen(null);

      //Nếu chưa có ai vào
      if (myMediaConnection.current == undefined) {
        setShareCam(false);
        setMyCallScreenOff(true);
        return;
      }

      if (created) myPeer.current.call(roomID, null);
      else myPeer.current.call("joiner-" + roomID, null);
      setShareCam(false);
      setMyCallScreenOff(true);
      return;
    }

    navigator.getUserMedia({ video: !shareCam, audio: shareAudio }, (stream) => {
      handleMyCallScreen(stream);
      myWebcamStream.current = stream;

      //Nếu chưa có ai vào
      if (myMediaConnection.current == undefined) {
        setShareCam(false);
        setMyCallScreenOff(true);
        return;
      }

      if (created) myPeer.current.call(roomID, stream);
      else myPeer.current.call("joiner-" + roomID, stream);
      setShareCam(false);
      setMyCallScreenOff(true);
    });
    // myWebcamStream.current?.getTracks()[0].enabled = false;
  };

  const handleCreateRoom = () => {
    if (roomID == "") return;
    var peer = new Peer(roomID);
    myPeer.current = peer;

    peer.on("open", (id) => {
      navigator.getUserMedia(
        { video: false, audio: true },
        (stream) => {
          handleMyCallScreen(stream);
          myCallStream.current = stream;
          myWebcamStream.current = stream;
        },
        (err) => {
          console.log(err);
        }
      );
    });

    peer.on("disconnected", () => {
      console.log("remote disconnected");
    });

    peer.on("close", () => {
      console.log("remote close");
    });

    peer.on("call", (call) => {
      call.answer(myCallStream.current);
      call.on("stream", (stream) => {
        handleRemoteCallScreen(stream);
        call.on("close", () => {
          console.log("close call");
        });
      });
      myMediaConnection.current = call;
      //Send the remote my current video state
    });
  };

  const handleJoinRoom = () => {
    myPeer.current = new Peer("joiner-" + roomID); //tạo ID người vào là joiner-[roomID]

    myPeer.current.on("open", (id) => {
      console.log("opeennnnnnnnnn");
      navigator.getUserMedia(
        { video: false, audio: true },
        (stream) => {
          handleMyCallScreen(stream);
          myWebcamStream.current = stream;
          const call = myPeer.current.call(roomID, stream);
          
          call.on("stream", (stream) => {
            console.log("Streammm");
            handleRemoteCallScreen(stream);
            if (stream.getTracks()[stream.getTracks().length - 1].kind == 'video'){
              setRemoteCallScreenOff(false);
            } else{
              setRemoteCallScreenOff(true);
            }
          });
          call.on("close", () => {
            console.log("close stream");
          });
          myMediaConnection.current = call;
        },
        (err) => {
          console.log(err);
        }
      );
    });

    //người join room nhận dc sự thay đổi từ người tạo room
    myPeer.current.on("call", (call) => {
      call.answer(myWebcamStream.current);
      call.on("stream", (stream) => {
        handleRemoteCallScreen(stream);
        call.on("close", () => {
          console.log("close call");
        });
      });

      myMediaConnection.current = call;
    });
  };

  const MuteButton = () => {
    return (
      <div
        onClick={handleUnShareAudio}
        className="w-16 h-16 flex items-center justify-center mx-auto rounded-full bg-blue-500 hover:bg-blue-600 hover:cursor-pointer mx-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 fill-white"
          viewBox="0 0 384 512"
        >
          <path d="M192 352c53.03 0 96-42.97 96-96v-160c0-53.03-42.97-96-96-96s-96 42.97-96 96v160C96 309 138.1 352 192 352zM344 192C330.7 192 320 202.7 320 215.1V256c0 73.33-61.97 132.4-136.3 127.7c-66.08-4.169-119.7-66.59-119.7-132.8L64 215.1C64 202.7 53.25 192 40 192S16 202.7 16 215.1v32.15c0 89.66 63.97 169.6 152 181.7V464H128c-18.19 0-32.84 15.18-31.96 33.57C96.43 505.8 103.8 512 112 512h160c8.222 0 15.57-6.216 15.96-14.43C288.8 479.2 274.2 464 256 464h-40v-33.77C301.7 418.5 368 344.9 368 256V215.1C368 202.7 357.3 192 344 192z" />
        </svg>
      </div>
    );
  };

  const UnmuteButton = () => {
    return (
      <div
        onClick={handleShareAudio}
        className="w-16 h-16 flex items-center justify-center mx-auto rounded-full bg-blue-500 hover:bg-blue-600 hover:cursor-pointer mx-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 fill-white"
          viewBox="0 0 640 512"
        >
          <path d="M383.1 464l-39.1-.0001v-33.77c20.6-2.824 39.98-9.402 57.69-18.72l-43.26-33.91c-14.66 4.65-30.28 7.179-46.68 6.144C245.7 379.6 191.1 317.1 191.1 250.9V247.2L143.1 209.5l.0001 38.61c0 89.65 63.97 169.6 151.1 181.7v34.15l-40 .0001c-17.67 0-31.1 14.33-31.1 31.1C223.1 504.8 231.2 512 239.1 512h159.1c8.838 0 15.1-7.164 15.1-15.1C415.1 478.3 401.7 464 383.1 464zM630.8 469.1l-159.3-124.9c15.37-25.94 24.53-55.91 24.53-88.21V216c0-13.25-10.75-24-23.1-24c-13.25 0-24 10.75-24 24l-.0001 39.1c0 21.12-5.559 40.77-14.77 58.24l-25.72-20.16c5.234-11.68 8.493-24.42 8.493-38.08l-.001-155.1c0-52.57-40.52-98.41-93.07-99.97c-54.37-1.617-98.93 41.95-98.93 95.95l0 54.25L38.81 5.111C34.41 1.673 29.19 0 24.03 0C16.91 0 9.839 3.158 5.12 9.189c-8.187 10.44-6.37 25.53 4.068 33.7l591.1 463.1c10.5 8.203 25.57 6.328 33.69-4.078C643.1 492.4 641.2 477.3 630.8 469.1z" />
        </svg>
      </div>
    );
  };

  const StopShareWebcamButton = () => {
    if (sharingScreen) return <StartShareWebcamButton />;
    return (
      <div
        onClick={handleStopWebcam}
        className="w-16 h-16 flex items-center justify-center mx-auto rounded-full bg-cyan-500 hover:bg-cyan-600 hover:cursor-pointer mx-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 576 512"
          className="w-8 h-8 fill-white"
        >
          <path d="M384 112v288c0 26.51-21.49 48-48 48h-288c-26.51 0-48-21.49-48-48v-288c0-26.51 21.49-48 48-48h288C362.5 64 384 85.49 384 112zM576 127.5v256.9c0 25.5-29.17 40.39-50.39 25.79L416 334.7V177.3l109.6-75.56C546.9 87.13 576 102.1 576 127.5z" />
        </svg>
      </div>
    );
  };

  const StartShareWebcamButton = () => {
    return (
      <div
        onClick={handleStartWebcam}
        className="w-16 h-16 flex items-center justify-center mx-auto rounded-full bg-cyan-500 hover:bg-cyan-600 hover:cursor-pointer mx-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 512"
          className="w-8 h-8 fill-white"
        >
          <path d="M32 399.1c0 26.51 21.49 47.1 47.1 47.1h287.1c19.57 0 36.34-11.75 43.81-28.56L32 121.8L32 399.1zM630.8 469.1l-89.21-69.92l15.99 11.02c21.22 14.59 50.41-.2971 50.41-25.8V127.5c0-25.41-29.07-40.37-50.39-25.76l-109.6 75.56l.0001 148.5l-32-25.08l.0001-188.7c0-26.51-21.49-47.1-47.1-47.1H113.9L38.81 5.111C34.41 1.673 29.19 0 24.03 0C16.91 0 9.84 3.158 5.121 9.189C-3.066 19.63-1.249 34.72 9.189 42.89l591.1 463.1c10.5 8.203 25.57 6.328 33.69-4.078C643.1 492.4 641.2 477.3 630.8 469.1z" />
        </svg>
      </div>
    );
  };

  const StartShareScreenButton = () => {
    return (
      <div className="text-center">
        <div
          onClick={handleStartShareScreen}
          className="w-16 h-16 flex items-center justify-center mx-auto rounded-full bg-sky-600 hover:bg-sky-700 hover:cursor-pointer mx-4"
        >
          <svg className="w-8 h-8 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
            <path d="M528 0h-480C21.5 0 0 21.5 0 48v320C0 394.5 21.5 416 48 416h192L224 464H152C138.8 464 128 474.8 128 488S138.8 512 152 512h272c13.25 0 24-10.75 24-24s-10.75-24-24-24H352L336 416h192c26.5 0 48-21.5 48-48v-320C576 21.5 554.5 0 528 0zM512 352H64V64h448V352z"/>
          </svg>
        </div>
      </div>
    );
  };

  const StopShareScreenButton = () => {
    return (
      <div className="text-center">
        <button
          onClick={handleStopShareScreen}
          className="animate-pulse w-16 h-16 flex items-center justify-center mx-auto rounded-full bg-sky-600 hover:bg-sky-700 hover:cursor-pointer mx-4"
        >
          <svg className="w-8 h-8 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
            <path d="M528 0h-480C21.5 0 0 21.5 0 48v320C0 394.5 21.5 416 48 416h192L224 464H152C138.8 464 128 474.8 128 488S138.8 512 152 512h272c13.25 0 24-10.75 24-24s-10.75-24-24-24H352L336 416h192c26.5 0 48-21.5 48-48v-320C576 21.5 554.5 0 528 0zM512 352H64V64h448V352z"/>
          </svg>
        </button>
      </div>
    );
  };

  const MyCallScreenState = () => {
    if (myCallScreenOff == true)
      return (
        <div className="fixed w-[320px] h-[180px] bottom-[15px] right-[15px] bg-black object-cover border-2 border-cyan-200 z-10 text-white flex justify-center items-center text-2xl">
          Your camera is off
        </div>
      );
    else {
      return "";
    }
  };

  const RemoteCallScreenState = () => {
    if (remoteCallScreenOff == true)
      return (
        <div className="fixed top-0 left-0 w-full h-screen bg-black object-cover border-2 border-cyan-200 z-10 text-white flex justify-center items-center text-2xl">
          Remote camera is off
        </div>
      );
    if (remoteCallScreenOff == null)
      return (
        <div className="fixed top-0 left-0 w-full h-screen animate-pulse bg-gray-200 object-cover border-2 border-cyan-200 z-10 text-black flex justify-center items-center text-2xl">
          Waiting another user to join...
        </div>
      );
    if (remoteCallScreenOff == false) return "";
  };

  if (error) return <Error />;

  return (
    <>
      {loading ? <Loading /> : ""}
      <p id="notification" hidden></p>
      <div className="relative h-[22.5vw] mt-[50px] w-full">
        <video
          ref={remoteVideo}
          className="fixed top-0 left-0 w-full h-screen bg-gray-300 object-cover border-2 border-cyan-200"
        ></video>
        <RemoteCallScreenState />
        <video
          ref={myVideo}
          className="fixed w-[320px] h-[180px] bottom-[15px] right-[15px] bg-blue-100 object-cover border-2 border-cyan-200"
        ></video>
        <MyCallScreenState />
        <div className="text-center">
          <button
            onClick={handleEndCall}
            className="px-5 py-1 text-lg rounded bg-red-600 text-white font-semibold hover:bg-red-800 mx-auto mb-4"
          >
            End Call
          </button>
        </div>
        <div className="fixed z-40 flex items-center justify-center w-[33.33333vw] left-[33.333333vw] bottom-[20px]">
        {sharingScreen ? <StopShareScreenButton /> : <StartShareScreenButton />}
        {shareAudio ? <MuteButton /> : <UnmuteButton />}
        {shareCam ? <StopShareWebcamButton /> : <StartShareWebcamButton />}
        </div>
      </div>
    </>
  );
}
