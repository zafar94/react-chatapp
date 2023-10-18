import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import ReactPlayer from 'react-player';
import peer from "../service/peer";


const RoomPage = () => {
    const socket = useSocket();
    const [remoteSocketId, setRemoteSocketId] = useState(null)
    const [myStream, setMyStream] = useState()
    const [remoteStream, setRemoteStream] = useState()

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
        peer.setLocalDescription(ans)
        console.log('CALL ACCEPTED!')
        for (const track of myStream.getTracks()) {
            peer.peer.addTrack(track, myStream)
        }
    }, [myStream])


    const handleNegoNeededIncoming = useCallback(({ from, offer }) => {
        const ans = peer.getAnswer(offer);
        socket.emit('peer:nego:done', { to: from, ans })
    }, [])

    useEffect(() => {
        socket.on('user:joined', handleUserJoined)
        socket.on('incoming:call', handleIncomingCall)
        socket.on('call:accepted', handleCallAccepted)
        socket.on('peer:nego:needed', handleNegoNeededIncoming)

        return () => {
            socket.off("user:joined", handleUserJoined)
            socket.off("incoming:call", handleIncomingCall)
            socket.off('call:accepted', handleCallAccepted)

        }
    }, [socket, handleUserJoined, handleIncomingCall, handleCallAccepted])

    useEffect(() => {
        peer.peer.addEventListener('track', async ev => {
            const remoteStream = ev.streams;
            setRemoteStream(remoteStream);
        })
    }, [])

    const hanldeNegotiationNeeded = useCallback(async () => {
        const offer = await peer.getOffer();
        socket.emit('peer:nego:needed', { offer, to: remoteSocketId })
    }, [remoteSocketId, socket])

    useEffect(() => {
        peer.peer.addEventListener('negotiationneeded', hanldeNegotiationNeeded)
        return () => {
            peer.peer.removeEventListener('negotiationneeded', hanldeNegotiationNeeded)
        }
    }, [hanldeNegotiationNeeded])

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
            {

                remoteStream &&
                <>
                    <h1>Remote Stream</h1>
                    <ReactPlayer playing muted height="100px" width="200px" url={remoteStream} />
                </>
            }
        </div>
    )
}

export default RoomPage;