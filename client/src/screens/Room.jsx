import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../context/SocketProvider";


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
    }, [])

    useEffect(() => {
        socket.on('user:joined', handleUserJoined)

        return () => (
            socket.off("user:joined", handleUserJoined)
        )
    }, [socket, handleUserJoined])

    return (
        <div>
            <h1>Room Page</h1>
            <h4>{remoteSocketId ? 'Connected' : 'No in room'}</h4>
            {
                remoteSocketId && <button onClick={handleCallUser}>Call</button>
            }
        </div>
    )
}

export default RoomPage;