import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import ReactPlayer from 'react-player';
import peer from "../service/peer";


const RoomPage = () => {
    const socket = useSocket();
    const [remoteSocketId, setRemoteSocketId] = useState(null)
    const [myStream, setMyStream] = useState()

    const handleUserJoined = useCallback(({ email, id }) => {
        console.log(`Email ${email}, user joined room`)
        setRemoteSocketId(id)
    })

    const handleCallUser = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        })
        const offer = await peer.getOffer();
        socket.emit("user:call", { to: remoteSocketId, offer })
        setMyStream(stream)
    }, [remoteSocketId, socket])

    const handleIncomingCall = useCallback(async ({ from, offer }) => {
        setRemoteSocketId(from);
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        })
        setMyStream(stream)
        const ans = await peer.getAnswer(offer);
        socket.emit('call:accepted', { to: from, ans })
    }, [socket])

    const handleCallAccepted = useCallback(async ({ from, ans }) => {

    }, [])


    useEffect(() => {
        socket.on('user:joined', handleUserJoined)
        socket.on('incoming:call', handleIncomingCall)
        socket.on('call:accepted', handleCallAccepted)

        return () => {
            socket.off("user:joined", handleUserJoined)
            socket.off("incoming:call", handleIncomingCall)
            socket.off('call:accepted', handleCallAccepted)

        }
    }, [socket, handleUserJoined, handleIncomingCall])

    return (
        <div>
            <h1>Room Page</h1>
            <h4>{remoteSocketId ? 'Connected' : 'No in room'}</h4>
            {
                remoteSocketId && <button onClick={handleCallUser}>Call</button>
            }
            {

                myStream &&
                <>
                    <h1>My Stream</h1>
                    <ReactPlayer playing muted height="100px" width="200px" url={myStream} />
                </>
            }
        </div>
    )
}

export default RoomPage;