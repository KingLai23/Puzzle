import './SwitchWorld.css'
import React, { useState, useEffect } from 'react';
import axios from 'axios'

const SwitchWorld = () => {
    const [checkOnline, setCheckOnline] = useState(true);
    const [turnOffServerMsg, setTurnOffServerMsg] = useState(false);

    const [currentWorld, setCurrentWorld] = useState("N/A");
    const [worlds, setWorlds] = useState([]);
    const [chosen, setChosen] = useState('N/A');

    const [choseCurrent, setChoseCurrent] = useState(false);

    const [switching, setSwitching] = useState(false);

    var herokuurl = "https://agile-taiga-59578.herokuapp.com/";

    useEffect(() => {
        checkServerStatus();
    }, [])

    const checkServerStatus = () => {
        var url = herokuurl + "mcServerStatus";
        axios.post(url)
            .then(res => {
                if (res.data.data.ExitStatus === 0) {
                    setTurnOffServerMsg(true);
                } else {
                    getAllWorlds();
                    getCurrentWorld();
                }

                setCheckOnline(false);
            })
            .catch(error => {
                console.log(error.message)
                setCheckOnline(false);
            })
    }

    const getCurrentWorld = () => {
        var url = herokuurl + "getCurrentWorld";
        axios.post(url)
            .then(res => {
                setCurrentWorld((res.data.data.InputStream[0]).trim());
            })
            .catch(error => {
                console.log(error.message)
            })
    }

    const getAllWorlds = () => {
        var url = herokuurl + "getAllWorlds";
        axios.post(url)
            .then(res => {
                setWorlds(res.data.data.worlds);
            })
            .catch(error => {
                console.log(error.message)
            })
    }

    const setChosenWorld = (world) => {
        if (world.world_name === currentWorld) {
            setChoseCurrent(true);
        } else {
            setChoseCurrent(false);
            setChosen(world.world_name);
        }
    }

    const executeSwitch = () => {
        setSwitching(true);
        var url = herokuurl + "switchWorld?world=" + chosen;
        axios.post(url)
            .then(res => {
                setSwitching(false);
                setCheckOnline(true);
                setTurnOffServerMsg(false);
                setChoseCurrent(false);
                setChosen('N/A');
                checkServerStatus();
            })
            .catch(error => {
                console.log(error.message)
            })
    }

    return (
        <div className="switch_world">
            { switching ? (
                <div id="overlay">
                    <div className="restoring-loading-symbol"></div>
                    <div className="loading-msg">Switching into {chosen}..</div>
                </div>
            ) : (
                    <></>
                )}

            <div className="sw_header">
                <h1>Switch World</h1>
            </div>

            {checkOnline || worlds.length === 0 && !turnOffServerMsg ? (
                <div className="loading">
                    <div className="finding-world-loading-symbol"></div>
                    <div className="loading-msg">Checking world manage requirements..</div>
                </div>
            ) : (
                    <>
                        {turnOffServerMsg ? (
                            <div className="turn_off_server_msg">
                                <h1>You need to turn off the server before proceeding.</h1>
                            </div>
                        ) : (
                                <>
                                    <h3>Pick a world to switch into</h3>
                                    <div className="sw_btns">
                                        {worlds.map(world_name => (
                                            <button onClick={() => setChosenWorld({ world_name })}>{world_name}</button>
                                        ))}
                                    </div>
                                    <div className="sw_msg">
                                        {choseCurrent ? (
                                            <div className="sw_msg_chose_current">
                                                <h1>You cannot choose the current world.</h1>
                                            </div>
                                        ) : (
                                                <>
                                                    <h1>You have chosen</h1>
                                                    <h2>{chosen}</h2>
                                                </>
                                            )}

                                        <div className="sw_msg_btn">
                                            {chosen === 'N/A' || choseCurrent ? (
                                                <div className="no_pick">
                                                    <button>Confirm and Switch</button>
                                                </div>
                                            ) : (
                                                    <>
                                                        <button onClick={() => executeSwitch()}>Confirm and Switch</button>
                                                    </>
                                                )}
                                        </div>

                                    </div>
                                </>
                            )}
                    </>
                )}
        </div>
    )
}

export default SwitchWorld;