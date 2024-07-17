import React from 'react'
import { useGlobalContext } from '../context/GlobalContext';

function LoadPrevMsgSingle({oldMessages}) {
    const { userID } = useGlobalContext();
    
    return (
        <>
            {oldMessages.map((msg, index) => {
                    <div
                        key={index}
                        className={`msg-item ${msg.sender === userID ? 'user-msg-item' : ''}`}
                    >
                        {msg.sender !== userID && <p>DP</p>}
                        <div className="msg-info">
                            <p className='msg-text'>{msg.content}</p>
                            <div className="msg-meta">
                                <span><b>{msg.author}</b></span>
                                <span>{msg.time}</span>
                            </div>
                        </div>
                    </div>
            })}
        </>
    );
}

export default LoadPrevMsgSingle