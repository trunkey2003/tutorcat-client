import { useState, useEffect } from "react";
import { Axios } from "../../config/axios";
import { io } from "socket.io-client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Loading from "../../components/Loading";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  height: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
};

const socket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}/live`);

export default function Index() {
  const [showModalCreateRoom, setShowModalCreateRoom] = useState(false);
  const [showUserNameSection, setShowUserNameSection] = useState(true);
  const [showCreateRoomSection, setShowCreateRoomSection] = useState(false);
  const [userName, setUserName] = useState("");
  const [showJobSection, setShowJobSection] = useState(false);
  const [userJob, setUserJob] = useState("");
  const [roomID, setRoomID] = useState("");
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    setLoading(true);
    Axios.get("/api/room/get")
      .then(({ data }) => {
        setRooms(data);
        console.log(data);
      })
      .catch(() => {});
    socket.on("myID", (myID) => {
      setRoomID(myID);
      setLoading(false);
    });
  }, []);

  const handleUserNameInput = (e) => {
    setUserName(e.target.value);
  };

  const handleSubmitUserName = () => {
    setUserName(userName);
    setShowUserNameSection(false);
    setShowJobSection(true);
  };

  const handleSubmitUserJob = (job) => {
    setUserJob(job);
    setShowJobSection(false);
    setShowCreateRoomSection(true);
  };

  const handleShowModalCreateRoom = () => {
    setShowModalCreateRoom(true);
  };

  const handleCloseModalCreateRoom = () => {
    setShowModalCreateRoom(false);
  };

  const handleDeleteRoom = (e, roomID) => {
    e.stopPropagation();
    setLoading(true);

    Axios.delete(`/api/room/delete/${roomID}`)
      .then(() => {
        const newRooms = rooms.filter((room) => room.roomID != roomID);
        setRooms(newRooms);
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCreateRoom = () => {
    if (!roomID) return;
    const room = {
      roomID: roomID,
      userJob: userJob,
    };

    if (userName != "") room.userName = userName;

    Axios.post("/api/room/add", room)
      .then(() => {
        window.location.href = window.location.origin + "/live/" + roomID;
      })
      .catch(() => {
        alert("fail to create room");
      });
  };

  const handleJoinRoom = (roomID) => {
    window.location.href = window.location.origin + "/live/" + roomID;
  };

  return (
    <div className="bg-sky-100">
      <div className="md:mx-[15%] flex flex-wrap justify-center">
        <div className="bg-sky-500 w-52 h-72 m-8 static rounded-lg ">
          <div className="bg-white w-52 h-72 -m-2 hover:m-0 absolute rounded-lg shadow-lg hover:shadow-2xl transition-all duration-150 ease-out hover:ease-in ">
            <h1 className="m-4 text-2xl font-bold flex items-center">
              Private
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="ml-2 w-5 h-5 fill-sky-600"
              >
                <path d="M80 192V144C80 64.47 144.5 0 224 0C303.5 0 368 64.47 368 144V192H384C419.3 192 448 220.7 448 256V448C448 483.3 419.3 512 384 512H64C28.65 512 0 483.3 0 448V256C0 220.7 28.65 192 64 192H80zM144 192H304V144C304 99.82 268.2 64 224 64C179.8 64 144 99.82 144 144V192z" />
              </svg>
            </h1>
            <hr className="m-4 rounded-2xl border-t-2" />
            <p className="m-4 text-sm">
              You can call privately, and other people won{`'`}t see your identity. But your activity
              might still be visible to us
            </p>
          </div>
        </div>
        <div className="bg-sky-500 w-52 h-72 m-8 static rounded-lg ">
          <div className="bg-white w-52 h-72 -m-2 hover:m-0 absolute rounded-lg shadow-lg hover:shadow-2xl transition-all duration-150 ease-out hover:ease-in ">
            <h1 className="m-4 text-2xl font-bold flex items-center">
              Easy
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
                className="ml-2 w-5 h-5 fill-sky-600"
              >
                <path d="M240.5 224H352C365.3 224 377.3 232.3 381.1 244.7C386.6 257.2 383.1 271.3 373.1 280.1L117.1 504.1C105.8 513.9 89.27 514.7 77.19 505.9C65.1 497.1 60.7 481.1 66.59 467.4L143.5 288H31.1C18.67 288 6.733 279.7 2.044 267.3C-2.645 254.8 .8944 240.7 10.93 231.9L266.9 7.918C278.2-1.92 294.7-2.669 306.8 6.114C318.9 14.9 323.3 30.87 317.4 44.61L240.5 224z" />
              </svg>
            </h1>
            <hr className="m-4 rounded-2xl border-t-2" />
            <p className="m-4 text-sm">
              We don{`'`}t require account to use LiveTutor platform, but your space will be limited
            </p>
          </div>
        </div>
        <div className="bg-sky-500 w-52 h-72 m-8 static rounded-lg ">
          <div className="bg-white w-52 h-72 -m-2 hover:m-0 absolute rounded-lg shadow-lg hover:shadow-2xl transition-all duration-150 ease-out hover:ease-in ">
            <h1 className="m-4 text-2xl font-bold flex items-center">
              Secure
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="ml-2 w-5 h-5 fill-sky-600"
              >
                <path d="M256-.0078C260.7-.0081 265.2 1.008 269.4 2.913L457.7 82.79C479.7 92.12 496.2 113.8 496 139.1C495.5 239.2 454.7 420.7 282.4 503.2C265.7 511.1 246.3 511.1 229.6 503.2C57.25 420.7 16.49 239.2 15.1 139.1C15.87 113.8 32.32 92.12 54.3 82.79L242.7 2.913C246.8 1.008 251.4-.0081 256-.0078V-.0078z" />
              </svg>
            </h1>
            <hr className="m-4 rounded-2xl border-t-2" />
            <p className="m-4 text-sm">
              We don{`'`}t record your video for any purpose, and your history call will just only
              visible to you and your caller
            </p>
          </div>
        </div>
        <div className="bg-sky-500 w-52 h-72 m-8 static rounded-lg ">
          <div className="bg-white w-52 h-72 -m-2 hover:m-0 absolute rounded-lg shadow-lg hover:shadow-2xl transition-all duration-150 ease-out hover:ease-in ">
            <h1 className="m-4 text-2xl font-bold flex items-center">
              Free
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
                className="ml-2 w-5 h-5 fill-sky-600"
              >
                <path d="M400 96L399.1 96.66C394.7 96.22 389.4 96 384 96H256C239.5 96 223.5 98.08 208.2 102C208.1 100 208 98.02 208 96C208 42.98 250.1 0 304 0C357 0 400 42.98 400 96zM384 128C387.5 128 390.1 128.1 394.4 128.3C398.7 128.6 402.9 129 407 129.6C424.6 109.1 450.8 96 480 96H512L493.2 171.1C509.1 185.9 521.9 203.9 530.7 224H544C561.7 224 576 238.3 576 256V352C576 369.7 561.7 384 544 384H512C502.9 396.1 492.1 406.9 480 416V480C480 497.7 465.7 512 448 512H416C398.3 512 384 497.7 384 480V448H256V480C256 497.7 241.7 512 224 512H192C174.3 512 160 497.7 160 480V416C125.1 389.8 101.3 349.8 96.79 304H68C30.44 304 0 273.6 0 236C0 198.4 30.44 168 68 168H72C85.25 168 96 178.7 96 192C96 205.3 85.25 216 72 216H68C56.95 216 48 224.1 48 236C48 247 56.95 256 68 256H99.2C111.3 196.2 156.9 148.5 215.5 133.2C228.4 129.8 241.1 128 256 128H384zM424 240C410.7 240 400 250.7 400 264C400 277.3 410.7 288 424 288C437.3 288 448 277.3 448 264C448 250.7 437.3 240 424 240z" />
              </svg>
            </h1>
            <hr className="m-4 rounded-2xl border-t-2" />
            <p className="m-4 text-sm">This platform is totally free for everyone</p>
          </div>
        </div>
      </div>
      <div className="p-5 min-h-screen md:mx-[8%]">
        {loading ? <Loading /> : ""}
        {/* <form className="w-full max-w-sm mx-auto">
          <div className="flex items-center border-b border-teal-500 py-2">
          <input className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="text" placeholder="Jane Doe" aria-label="Full name" />
        </div>
        <div className="flex justify-center">
          <div className="mb-3 xl:w-96">
            <select className="form-select appearance-none block w-full mt-3 px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example">
              <option selected>Open this select menu</option>
              <option value="1">One</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </select>
          </div>
        </div>
        </form> */}
        <div
          onClick={handleShowModalCreateRoom}
          className="flex relative mb-5 w-[180px] mx-auto bg-sky-600 rounded hover:cursor-pointer hover:bg-sky-700"
        >
          <div className="text-white text-lg font-medium flex items-center justify-center py-2 w-full">
            Getting Start
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="ml-2 w-6 h-6 fill-white"
            >
              <path d="M512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM176 168V344C176 352.7 180.7 360.7 188.3 364.9C195.8 369.2 205.1 369 212.5 364.5L356.5 276.5C363.6 272.1 368 264.4 368 256C368 247.6 363.6 239.9 356.5 235.5L212.5 147.5C205.1 142.1 195.8 142.8 188.3 147.1C180.7 151.3 176 159.3 176 168V168z" />
            </svg>
          </div>
        </div>
        <div className="flex flex-wrap bg-white min-h-screen rounded p-16">
          {rooms.length
            ? rooms.map((room) => (
                <div
                  onClick={() => handleJoinRoom(room.roomID)}
                  key={room.roomID}
                  className="relative p-5 mb-5 w-[18%] h-[170px] mx-[0.5%] bg-sky-100 text-black border-2 border-black rounded hover:border-sky-500 hover:cursor-pointer"
                >
                  <svg
                    onClick={(e) => handleDeleteRoom(e, room.roomID)}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    className="absolute right-1 top-1 w-5 h-5 fill-red-500 hover:fill-red-700"
                  >
                    <path d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM31.1 128H416V448C416 483.3 387.3 512 352 512H95.1C60.65 512 31.1 483.3 31.1 448V128zM111.1 208V432C111.1 440.8 119.2 448 127.1 448C136.8 448 143.1 440.8 143.1 432V208C143.1 199.2 136.8 192 127.1 192C119.2 192 111.1 199.2 111.1 208zM207.1 208V432C207.1 440.8 215.2 448 223.1 448C232.8 448 240 440.8 240 432V208C240 199.2 232.8 192 223.1 192C215.2 192 207.1 199.2 207.1 208zM304 208V432C304 440.8 311.2 448 320 448C328.8 448 336 440.8 336 432V208C336 199.2 328.8 192 320 192C311.2 192 304 199.2 304 208z" />
                  </svg>
                  <div id="roomID" className="font-medium text-sm py-1 flex">
                    <svg
                      className="h-5 w-5 fill-blue-900 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path d="M282.3 343.7L248.1 376.1C244.5 381.5 238.4 384 232 384H192V424C192 437.3 181.3 448 168 448H128V488C128 501.3 117.3 512 104 512H24C10.75 512 0 501.3 0 488V408C0 401.6 2.529 395.5 7.029 391L168.3 229.7C162.9 212.8 160 194.7 160 176C160 78.8 238.8 0 336 0C433.2 0 512 78.8 512 176C512 273.2 433.2 352 336 352C317.3 352 299.2 349.1 282.3 343.7zM376 176C398.1 176 416 158.1 416 136C416 113.9 398.1 96 376 96C353.9 96 336 113.9 336 136C336 158.1 353.9 176 376 176z" />
                    </svg>
                    {room.roomID}
                  </div>

                  <div id="userName">
                    {room.userJob == "Student" ? (
                      <div className="font-medium text-sm py-1 flex">
                        <svg
                          className="h-5 w-5 fill-blue-900 mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                        >
                          <path d="M45.63 79.75L52 81.25v58.5C45 143.9 40 151.3 40 160c0 8.375 4.625 15.38 11.12 19.75L35.5 242C33.75 248.9 37.63 256 43.13 256h41.75c5.5 0 9.375-7.125 7.625-13.1L76.88 179.8C83.38 175.4 88 168.4 88 160c0-8.75-5-16.12-12-20.25V87.13L128 99.63l.001 60.37c0 70.75 57.25 128 128 128s127.1-57.25 127.1-128L384 99.62l82.25-19.87c18.25-4.375 18.25-27 0-31.5l-190.4-46c-13-3-26.62-3-39.63 0l-190.6 46C27.5 52.63 27.5 75.38 45.63 79.75zM359.2 312.8l-103.2 103.2l-103.2-103.2c-69.93 22.3-120.8 87.2-120.8 164.5C32 496.5 47.53 512 66.67 512h378.7C464.5 512 480 496.5 480 477.3C480 400 429.1 335.1 359.2 312.8z" />
                        </svg>
                        {room.userName}
                      </div>
                    ) : (
                      ""
                    )}

                    {room.userJob == "Developer" ? (
                      <div className="font-medium text-sm py-1 flex">
                        <svg
                          className="h-5 w-5 fill-blue-900 mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 448 512"
                        >
                          <path d="M352 128C352 198.7 294.7 256 224 256C153.3 256 96 198.7 96 128C96 57.31 153.3 0 224 0C294.7 0 352 57.31 352 128zM209.1 359.2L176 304H272L238.9 359.2L272.2 483.1L311.7 321.9C388.9 333.9 448 400.7 448 481.3C448 498.2 434.2 512 417.3 512H30.72C13.75 512 0 498.2 0 481.3C0 400.7 59.09 333.9 136.3 321.9L175.8 483.1L209.1 359.2z" />
                        </svg>
                        {room.userName}
                      </div>
                    ) : (
                      ""
                    )}

                    {room.userJob == "Other" ? (
                      <div className="font-medium text-sm py-1 flex">
                        <svg
                          className="h-5 w-5 fill-blue-900 mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 448 512"
                        >
                          <path d="M377.7 338.8l37.15-92.87C419 235.4 411.3 224 399.1 224h-57.48C348.5 209.2 352 193 352 176c0-4.117-.8359-8.057-1.217-12.08C390.7 155.1 416 142.3 416 128c0-16.08-31.75-30.28-80.31-38.99C323.8 45.15 304.9 0 277.4 0c-10.38 0-19.62 4.5-27.38 10.5c-15.25 11.88-36.75 11.88-52 0C190.3 4.5 181.1 0 170.7 0C143.2 0 124.4 45.16 112.5 88.98C63.83 97.68 32 111.9 32 128c0 14.34 25.31 27.13 65.22 35.92C96.84 167.9 96 171.9 96 176C96 193 99.47 209.2 105.5 224H48.02C36.7 224 28.96 235.4 33.16 245.9l37.15 92.87C27.87 370.4 0 420.4 0 477.3C0 496.5 15.52 512 34.66 512H413.3C432.5 512 448 496.5 448 477.3C448 420.4 420.1 370.4 377.7 338.8zM176 479.1L128 288l64 32l16 32L176 479.1zM271.1 479.1L240 352l16-32l64-32L271.1 479.1zM320 186C320 207 302.8 224 281.6 224h-12.33c-16.46 0-30.29-10.39-35.63-24.99C232.1 194.9 228.4 192 224 192S215.9 194.9 214.4 199C209 213.6 195.2 224 178.8 224h-12.33C145.2 224 128 207 128 186V169.5C156.3 173.6 188.1 176 224 176s67.74-2.383 96-6.473V186z" />
                        </svg>
                        {room.userName}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              ))
            : ""}
        </div>
      </div>
      <Modal
        open={showModalCreateRoom}
        onClose={handleCloseModalCreateRoom}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {showUserNameSection ? (
            <div className="font-tapestry p-4">
              <div className="text-2xl text-center flex justify-center font-semibold mt-5">
                Welcome To Tutor Cat
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                  className="h-5 w-5 fill-blue-900"
                >
                  <path d="M322.6 192C302.4 192 215.8 194 160 278V192c0-53-43-96-96-96C46.38 96 32 110.4 32 128s14.38 32 32 32s32 14.38 32 32v256c0 35.25 28.75 64 64 64h176c8.875 0 16-7.125 16-15.1V480c0-17.62-14.38-32-32-32h-32l128-96v144c0 8.875 7.125 16 16 16h32c8.875 0 16-7.125 16-16V289.9c-10.25 2.625-20.88 4.5-32 4.5C386.2 294.4 334.5 250.4 322.6 192zM480 96h-64l-64-64v134.4c0 53 43 95.1 96 95.1s96-42.1 96-95.1V32L480 96zM408 176c-8.875 0-16-7.125-16-16s7.125-16 16-16s16 7.125 16 16S416.9 176 408 176zM488 176c-8.875 0-16-7.125-16-16s7.125-16 16-16s16 7.125 16 16S496.9 176 488 176z" />
                </svg>
              </div>

              <div className="text-lg text-center mt-5 mb-12">Let people know you</div>

              <div className="w-full max-w-sm mx-auto">
                <div className="flex items-center border-b border-teal-500 py-2">
                  <input
                    onChange={handleUserNameInput}
                    value={userName}
                    className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                  />
                  <button
                    onClick={handleSubmitUserName}
                    className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
                    type="button"
                  >
                    Submit
                  </button>
                </div>
                <p className="text-gray-600 text-xs italic">
                  This helps people know how to call you, you can let this field empty
                </p>
              </div>
            </div>
          ) : (
            ""
          )}

          {showJobSection ? (
            <div className="font-tapestry p-4">
              <svg
                onClick={() => {
                  setShowUserNameSection(true);
                  setShowJobSection(false);
                }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="absolute top-5 left-5 w-10 h-10 fill-sky-500 hover:fill-sky-600 hover:cursor-pointer"
              >
                <path d="M256 0C114.6 0 0 114.6 0 256c0 141.4 114.6 256 256 256s256-114.6 256-256C512 114.6 397.4 0 256 0zM384 288H205.3l49.38 49.38c12.5 12.5 12.5 32.75 0 45.25s-32.75 12.5-45.25 0L105.4 278.6C97.4 270.7 96 260.9 96 256c0-4.883 1.391-14.66 9.398-22.65l103.1-103.1c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L205.3 224H384c17.69 0 32 14.33 32 32S401.7 288 384 288z" />
              </svg>
              <div className="text-2xl text-center flex justify-center font-semibold mt-5">
                Welcome To Tutor Cat
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                  className="h-5 w-5 fill-blue-900"
                >
                  <path d="M322.6 192C302.4 192 215.8 194 160 278V192c0-53-43-96-96-96C46.38 96 32 110.4 32 128s14.38 32 32 32s32 14.38 32 32v256c0 35.25 28.75 64 64 64h176c8.875 0 16-7.125 16-15.1V480c0-17.62-14.38-32-32-32h-32l128-96v144c0 8.875 7.125 16 16 16h32c8.875 0 16-7.125 16-16V289.9c-10.25 2.625-20.88 4.5-32 4.5C386.2 294.4 334.5 250.4 322.6 192zM480 96h-64l-64-64v134.4c0 53 43 95.1 96 95.1s96-42.1 96-95.1V32L480 96zM408 176c-8.875 0-16-7.125-16-16s7.125-16 16-16s16 7.125 16 16S416.9 176 408 176zM488 176c-8.875 0-16-7.125-16-16s7.125-16 16-16s16 7.125 16 16S496.9 176 488 176z" />
                </svg>
              </div>

              <div className="text-lg text-center mt-5 mb-12">Choose your role</div>

              <div className="p-2 w-full flex justify-center text-xl">
                <div
                  onClick={() => handleSubmitUserJob("Student")}
                  className="w-24 md:w-36 h-24 md:h-36 bg-sky-100 mx-4 border-2 border-sky-100 hover:border-blue-900 flex items-center justify-center hover:cursor-pointer rounded-lg"
                >
                  <svg
                    className="h-5 w-5 fill-blue-900 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path d="M45.63 79.75L52 81.25v58.5C45 143.9 40 151.3 40 160c0 8.375 4.625 15.38 11.12 19.75L35.5 242C33.75 248.9 37.63 256 43.13 256h41.75c5.5 0 9.375-7.125 7.625-13.1L76.88 179.8C83.38 175.4 88 168.4 88 160c0-8.75-5-16.12-12-20.25V87.13L128 99.63l.001 60.37c0 70.75 57.25 128 128 128s127.1-57.25 127.1-128L384 99.62l82.25-19.87c18.25-4.375 18.25-27 0-31.5l-190.4-46c-13-3-26.62-3-39.63 0l-190.6 46C27.5 52.63 27.5 75.38 45.63 79.75zM359.2 312.8l-103.2 103.2l-103.2-103.2c-69.93 22.3-120.8 87.2-120.8 164.5C32 496.5 47.53 512 66.67 512h378.7C464.5 512 480 496.5 480 477.3C480 400 429.1 335.1 359.2 312.8z" />
                  </svg>
                  <div>Student</div>
                </div>
                <div
                  onClick={() => handleSubmitUserJob("Developer")}
                  className="w-24 md:w-36 h-24 md:h-36 bg-sky-100 mx-4 border-2 border-sky-100 hover:border-blue-900 flex items-center justify-center hover:cursor-pointer rounded-lg"
                >
                  <svg
                    className="h-5 w-5 fill-blue-900 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path d="M352 128C352 198.7 294.7 256 224 256C153.3 256 96 198.7 96 128C96 57.31 153.3 0 224 0C294.7 0 352 57.31 352 128zM209.1 359.2L176 304H272L238.9 359.2L272.2 483.1L311.7 321.9C388.9 333.9 448 400.7 448 481.3C448 498.2 434.2 512 417.3 512H30.72C13.75 512 0 498.2 0 481.3C0 400.7 59.09 333.9 136.3 321.9L175.8 483.1L209.1 359.2z" />
                  </svg>
                  <div>Developer</div>
                </div>
                <div
                  onClick={() => handleSubmitUserJob("Other")}
                  className="w-24 md:w-36 h-24 md:h-36 bg-sky-100 mx-4 border-2 border-sky-100 hover:border-blue-900 flex items-center justify-center hover:cursor-pointer rounded-lg"
                >
                  <svg
                    className="h-5 w-5 fill-blue-900 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path d="M377.7 338.8l37.15-92.87C419 235.4 411.3 224 399.1 224h-57.48C348.5 209.2 352 193 352 176c0-4.117-.8359-8.057-1.217-12.08C390.7 155.1 416 142.3 416 128c0-16.08-31.75-30.28-80.31-38.99C323.8 45.15 304.9 0 277.4 0c-10.38 0-19.62 4.5-27.38 10.5c-15.25 11.88-36.75 11.88-52 0C190.3 4.5 181.1 0 170.7 0C143.2 0 124.4 45.16 112.5 88.98C63.83 97.68 32 111.9 32 128c0 14.34 25.31 27.13 65.22 35.92C96.84 167.9 96 171.9 96 176C96 193 99.47 209.2 105.5 224H48.02C36.7 224 28.96 235.4 33.16 245.9l37.15 92.87C27.87 370.4 0 420.4 0 477.3C0 496.5 15.52 512 34.66 512H413.3C432.5 512 448 496.5 448 477.3C448 420.4 420.1 370.4 377.7 338.8zM176 479.1L128 288l64 32l16 32L176 479.1zM271.1 479.1L240 352l16-32l64-32L271.1 479.1zM320 186C320 207 302.8 224 281.6 224h-12.33c-16.46 0-30.29-10.39-35.63-24.99C232.1 194.9 228.4 192 224 192S215.9 194.9 214.4 199C209 213.6 195.2 224 178.8 224h-12.33C145.2 224 128 207 128 186V169.5C156.3 173.6 188.1 176 224 176s67.74-2.383 96-6.473V186z" />
                  </svg>
                  <div>Other</div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}

          {showCreateRoomSection ? (
            <div className="font-tapestry p-4">
              <svg
                onClick={() => {
                  setShowCreateRoomSection(false);
                  setShowJobSection(true);
                }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="absolute top-5 left-5 w-10 h-10 fill-sky-500 hover:fill-sky-600 hover:cursor-pointer"
              >
                <path d="M256 0C114.6 0 0 114.6 0 256c0 141.4 114.6 256 256 256s256-114.6 256-256C512 114.6 397.4 0 256 0zM384 288H205.3l49.38 49.38c12.5 12.5 12.5 32.75 0 45.25s-32.75 12.5-45.25 0L105.4 278.6C97.4 270.7 96 260.9 96 256c0-4.883 1.391-14.66 9.398-22.65l103.1-103.1c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L205.3 224H384c17.69 0 32 14.33 32 32S401.7 288 384 288z" />
              </svg>
              <div className="text-2xl text-center flex justify-center font-semibold mt-5">
                Welcome To Tutor Cat
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                  className="h-5 w-5 fill-blue-900"
                >
                  <path d="M322.6 192C302.4 192 215.8 194 160 278V192c0-53-43-96-96-96C46.38 96 32 110.4 32 128s14.38 32 32 32s32 14.38 32 32v256c0 35.25 28.75 64 64 64h176c8.875 0 16-7.125 16-15.1V480c0-17.62-14.38-32-32-32h-32l128-96v144c0 8.875 7.125 16 16 16h32c8.875 0 16-7.125 16-16V289.9c-10.25 2.625-20.88 4.5-32 4.5C386.2 294.4 334.5 250.4 322.6 192zM480 96h-64l-64-64v134.4c0 53 43 95.1 96 95.1s96-42.1 96-95.1V32L480 96zM408 176c-8.875 0-16-7.125-16-16s7.125-16 16-16s16 7.125 16 16S416.9 176 408 176zM488 176c-8.875 0-16-7.125-16-16s7.125-16 16-16s16 7.125 16 16S496.9 176 488 176z" />
                </svg>
              </div>

              <div className="text-lg text-center mt-5 mb-12">
                Everything is ready, it{`'`}s up to you from now on
              </div>
              <div
                onClick={handleCreateRoom}
                className="max-w-[150px] px-5 py-1 bg-sky-500 mx-auto flex justify-center items-center text-lg font-bold text-white rounded hover:cursor-pointer hover:bg-sky-800 hover:animate-pulse"
              >
                Launch
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="ml-2 w-5 h-5 fill-white"
                >
                  <path d="M156.6 384.9L125.7 353.1C117.2 345.5 114.2 333.1 117.1 321.8C120.1 312.9 124.1 301.3 129.8 288H24C15.38 288 7.414 283.4 3.146 275.9C-1.123 268.4-1.042 259.2 3.357 251.8L55.83 163.3C68.79 141.4 92.33 127.1 117.8 127.1H200C202.4 124 204.8 120.3 207.2 116.7C289.1-4.07 411.1-8.142 483.9 5.275C495.6 7.414 504.6 16.43 506.7 28.06C520.1 100.9 516.1 222.9 395.3 304.8C391.8 307.2 387.1 309.6 384 311.1V394.2C384 419.7 370.6 443.2 348.7 456.2L260.2 508.6C252.8 513 243.6 513.1 236.1 508.9C228.6 504.6 224 496.6 224 488V380.8C209.9 385.6 197.6 389.7 188.3 392.7C177.1 396.3 164.9 393.2 156.6 384.9V384.9zM384 167.1C406.1 167.1 424 150.1 424 127.1C424 105.9 406.1 87.1 384 87.1C361.9 87.1 344 105.9 344 127.1C344 150.1 361.9 167.1 384 167.1z" />
                </svg>
              </div>
              <div className="bg-sky-100 p-3 mx-12 mt-12">
                <div className="text-sm py-2 flex">
                  <svg
                    className="h-5 w-5 fill-blue-900 mr-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path d="M282.3 343.7L248.1 376.1C244.5 381.5 238.4 384 232 384H192V424C192 437.3 181.3 448 168 448H128V488C128 501.3 117.3 512 104 512H24C10.75 512 0 501.3 0 488V408C0 401.6 2.529 395.5 7.029 391L168.3 229.7C162.9 212.8 160 194.7 160 176C160 78.8 238.8 0 336 0C433.2 0 512 78.8 512 176C512 273.2 433.2 352 336 352C317.3 352 299.2 349.1 282.3 343.7zM376 176C398.1 176 416 158.1 416 136C416 113.9 398.1 96 376 96C353.9 96 336 113.9 336 136C336 158.1 353.9 176 376 176z" />
                  </svg>
                  {roomID}
                </div>

                {userName != "" && userName != "anonymous" ? (
                  <div className="text-sm py-2 flex">
                    <svg
                      className="h-5 w-5 fill-blue-900 mr-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path d="M224 256c70.7 0 128-57.31 128-128s-57.3-128-128-128C153.3 0 96 57.31 96 128S153.3 256 224 256zM274.7 304H173.3C77.61 304 0 381.6 0 477.3c0 19.14 15.52 34.67 34.66 34.67h378.7C432.5 512 448 496.5 448 477.3C448 381.6 370.4 304 274.7 304z" />
                    </svg>
                    {userName}
                  </div>
                ) : (
                  ""
                )}

                {!(userName != "" && userName != "anonymous") ? (
                  <div className="text-sm py-2 flex">
                    <svg
                      className="h-5 w-5 fill-blue-900 mr-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path d="M377.7 338.8l37.15-92.87C419 235.4 411.3 224 399.1 224h-57.48C348.5 209.2 352 193 352 176c0-4.117-.8359-8.057-1.217-12.08C390.7 155.1 416 142.3 416 128c0-16.08-31.75-30.28-80.31-38.99C323.8 45.15 304.9 0 277.4 0c-10.38 0-19.62 4.5-27.38 10.5c-15.25 11.88-36.75 11.88-52 0C190.3 4.5 181.1 0 170.7 0C143.2 0 124.4 45.16 112.5 88.98C63.83 97.68 32 111.9 32 128c0 14.34 25.31 27.13 65.22 35.92C96.84 167.9 96 171.9 96 176C96 193 99.47 209.2 105.5 224H48.02C36.7 224 28.96 235.4 33.16 245.9l37.15 92.87C27.87 370.4 0 420.4 0 477.3C0 496.5 15.52 512 34.66 512H413.3C432.5 512 448 496.5 448 477.3C448 420.4 420.1 370.4 377.7 338.8zM176 479.1L128 288l64 32l16 32L176 479.1zM271.1 479.1L240 352l16-32l64-32L271.1 479.1zM320 186C320 207 302.8 224 281.6 224h-12.33c-16.46 0-30.29-10.39-35.63-24.99C232.1 194.9 228.4 192 224 192S215.9 194.9 214.4 199C209 213.6 195.2 224 178.8 224h-12.33C145.2 224 128 207 128 186V169.5C156.3 173.6 188.1 176 224 176s67.74-2.383 96-6.473V186z" />
                    </svg>
                    anonymous
                  </div>
                ) : (
                  ""
                )}

                {userJob == "Student" ? (
                  <div className="text-sm py-2 flex">
                    <svg
                      className="h-5 w-5 fill-blue-900 mr-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path d="M45.63 79.75L52 81.25v58.5C45 143.9 40 151.3 40 160c0 8.375 4.625 15.38 11.12 19.75L35.5 242C33.75 248.9 37.63 256 43.13 256h41.75c5.5 0 9.375-7.125 7.625-13.1L76.88 179.8C83.38 175.4 88 168.4 88 160c0-8.75-5-16.12-12-20.25V87.13L128 99.63l.001 60.37c0 70.75 57.25 128 128 128s127.1-57.25 127.1-128L384 99.62l82.25-19.87c18.25-4.375 18.25-27 0-31.5l-190.4-46c-13-3-26.62-3-39.63 0l-190.6 46C27.5 52.63 27.5 75.38 45.63 79.75zM359.2 312.8l-103.2 103.2l-103.2-103.2c-69.93 22.3-120.8 87.2-120.8 164.5C32 496.5 47.53 512 66.67 512h378.7C464.5 512 480 496.5 480 477.3C480 400 429.1 335.1 359.2 312.8z" />
                    </svg>
                    Student
                  </div>
                ) : (
                  ""
                )}

                {userJob == "Developer" ? (
                  <div className="text-sm py-2 flex">
                    <svg
                      className="h-5 w-5 fill-blue-900 mr-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path d="M352 128C352 198.7 294.7 256 224 256C153.3 256 96 198.7 96 128C96 57.31 153.3 0 224 0C294.7 0 352 57.31 352 128zM209.1 359.2L176 304H272L238.9 359.2L272.2 483.1L311.7 321.9C388.9 333.9 448 400.7 448 481.3C448 498.2 434.2 512 417.3 512H30.72C13.75 512 0 498.2 0 481.3C0 400.7 59.09 333.9 136.3 321.9L175.8 483.1L209.1 359.2z" />
                    </svg>
                    Developer
                  </div>
                ) : (
                  ""
                )}

                {userJob == "Other" ? (
                  <div className="text-sm py-2 flex">
                    <svg
                      className="h-5 w-5 fill-blue-900 mr-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                    >
                      <path d="M377.7 338.8l37.15-92.87C419 235.4 411.3 224 399.1 224h-57.48C348.5 209.2 352 193 352 176c0-4.117-.8359-8.057-1.217-12.08C390.7 155.1 416 142.3 416 128c0-16.08-31.75-30.28-80.31-38.99C323.8 45.15 304.9 0 277.4 0c-10.38 0-19.62 4.5-27.38 10.5c-15.25 11.88-36.75 11.88-52 0C190.3 4.5 181.1 0 170.7 0C143.2 0 124.4 45.16 112.5 88.98C63.83 97.68 32 111.9 32 128c0 14.34 25.31 27.13 65.22 35.92C96.84 167.9 96 171.9 96 176C96 193 99.47 209.2 105.5 224H48.02C36.7 224 28.96 235.4 33.16 245.9l37.15 92.87C27.87 370.4 0 420.4 0 477.3C0 496.5 15.52 512 34.66 512H413.3C432.5 512 448 496.5 448 477.3C448 420.4 420.1 370.4 377.7 338.8zM176 479.1L128 288l64 32l16 32L176 479.1zM271.1 479.1L240 352l16-32l64-32L271.1 479.1zM320 186C320 207 302.8 224 281.6 224h-12.33c-16.46 0-30.29-10.39-35.63-24.99C232.1 194.9 228.4 192 224 192S215.9 194.9 214.4 199C209 213.6 195.2 224 178.8 224h-12.33C145.2 224 128 207 128 186V169.5C156.3 173.6 188.1 176 224 176s67.74-2.383 96-6.473V186z" />
                    </svg>
                    Other
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          ) : (
            ""
          )}
        </Box>
      </Modal>
    </div>
  );
}
