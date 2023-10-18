import React, { useCallback, useEffect } from "react";
import { useSocket } from "../context/SocketProvider";


const RoomPage = () => {
    const socket = useSocket();

    const hanldeUserJoined = useCallback((email, id) => {
        console.log(`Email ${email}, user joined`)
    })

    useEffect(() => {
        socket.on('user:joined', hanldeUserJoined)
        return (
            socket.off('user:joined', hanldeUserJoined)
        )
    }, [socket, hanldeUserJoined])

    return (
        <div>
            <h1>Room Page</h1>
        </div>
    )
}

export default RoomPage;