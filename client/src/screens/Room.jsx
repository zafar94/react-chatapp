import React, { useCallback, useEffect } from "react";
import { useSocket } from "../context/SocketProvider";


const RoomPage = () => {
    const socket = useSocket();

    const handleUserJoined = useCallback((email, id) => {
        console.log(`Email ${email}, user joined room`)
    })

    useEffect(() => {
        socket.on('user:joined', handleUserJoined)

        return () => (
            socket.off("user:joined", handleUserJoined)
        )
    }, [socket, handleUserJoined])

    return (
        <div>
            <h1>Room Page</h1>
        </div>
    )
}

export default RoomPage;