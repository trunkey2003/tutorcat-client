import { useState, useEffect } from 'react'
import { Axios } from '../../config/axios';
import { io } from 'socket.io-client';
import Loading from '../../components/Loading';

const socket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}/live`);

export default function Index() {
  const [roomID, setRoomID] = useState("");
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    setLoading(true);
    Axios.get('/api/room')
      .then(({ data }) => {
        setRooms(data);
        console.log(data);
      })
      .catch(() => { })
    socket.on('myID', (myID) => {
      setRoomID(myID);
      setLoading(false);
    })
  }, []);

  const handleDeleteRoom = (e, roomID) => {
    e.stopPropagation();
    setLoading(true);

    Axios.delete(`/api/room/delete/${roomID}`)
    .then(() =>{
      const newRooms = rooms.filter((room) => room.roomID != roomID);
      setRooms(newRooms);
    })
    .catch(() =>{

    })
    .finally(() =>{
      setLoading(false);
    })
  }

  const handleCreateRoom = () => {
    if (!roomID) return;
    const room = {
      roomID: roomID,
      userID: "anonymous"
    }

    Axios.post('/api/room/add', room)
      .then(() => {
        window.location.href = window.location.origin + '/live/' + roomID;
      })
      .catch(() => {
        alert('fail to create room');
      })
  }

  const handleJoinRoom = (roomID) => {
    window.location.href = window.location.origin + '/live/' + roomID + '?created=true';
  }

  return (

    <div className='mt-16 mx-[15%] rounded-t-2xl p-5 bg-purple-100 h-screen'>
      {(loading)? <Loading/> : ''}
      <div className='text-center font-bold text-2xl'>Your ID : {roomID}</div>
      <div className='flex flex-wrap mt-16'>
        <div onClick={() => handleCreateRoom()} className='flex w-[18%] mb-5 h-[170px] mx-[0.5%] bg-cyan-100 border-2 border-black rounded hover:border-sky-500 hover:cursor-pointer'>
          <div className='mx-auto text-[80px] leading-[150px] font-bold text-black'>+</div>
        </div>
        {rooms.length ? rooms.map((room) =>
          <div onClick={() => handleJoinRoom(room.roomID)} key={room.roomID} className='relative p-5 mb-5 w-[18%] h-[170px] mx-[0.5%] bg-cyan-100 border-2 border-black rounded hover:border-sky-500 hover:cursor-pointer'>
            <svg onClick={(e) => handleDeleteRoom(e, room.roomID)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className='absolute right-1 top-1 w-6 h-6 fill-red-500 hover:fill-red-700'>
              <path d="M135.2 17.69C140.6 6.848 151.7 0 163.8 0H284.2C296.3 0 307.4 6.848 312.8 17.69L320 32H416C433.7 32 448 46.33 448 64C448 81.67 433.7 96 416 96H32C14.33 96 0 81.67 0 64C0 46.33 14.33 32 32 32H128L135.2 17.69zM31.1 128H416V448C416 483.3 387.3 512 352 512H95.1C60.65 512 31.1 483.3 31.1 448V128zM111.1 208V432C111.1 440.8 119.2 448 127.1 448C136.8 448 143.1 440.8 143.1 432V208C143.1 199.2 136.8 192 127.1 192C119.2 192 111.1 199.2 111.1 208zM207.1 208V432C207.1 440.8 215.2 448 223.1 448C232.8 448 240 440.8 240 432V208C240 199.2 232.8 192 223.1 192C215.2 192 207.1 199.2 207.1 208zM304 208V432C304 440.8 311.2 448 320 448C328.8 448 336 440.8 336 432V208C336 199.2 328.8 192 320 192C311.2 192 304 199.2 304 208z" />
            </svg>
            <div className='font-medium text-sm'>roomID: {room.roomID}</div>
            <div className='font-medium text-sm'>userID: {room.userID}</div>
          </div>) : ''}
      </div>
    </div>
  )
}
