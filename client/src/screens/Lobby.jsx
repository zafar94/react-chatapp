import React, { useState, useCallback } from "react";


const LobbyScreen = () => {

    const [email, setEmail] = useState('');
    const [room, setRoom] = useState('');

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        console.log(
            email,
            room
        )
    }, [email, room])

    return (
        <div>
            <h1>Lobby</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email Id</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <br />
                <label htmlFor="room">Room Number</label>
                <input type="text" id="room" value={room} onChange={(e) => setRoom(e.target.value)} />
                <br />
                <button>Submit</button>
            </form>
        </div>
    )
}

export default LobbyScreen;