import './CreateWorld.css'
import React, { useState, useEffect } from 'react';
import axios from 'axios'

const CreateWorld = () => {
    const [checkOnline, setCheckOnline] = useState(true);
    const [turnOffServerMsg, setTurnOffServerMsg] = useState(false);

    const [worldName, setWorldName] = useState("");
    const [creating, setCreating] = useState(false);

    const [worlds, setWorlds] = useState([]);

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
                    setTurnOffServerMsg(false);
                }

                setCheckOnline(false);
            })
            .catch(error => {
                console.log(error.message)
                setCheckOnline(false);
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

    const executeCreation = () => {
        setCreating(true);
        var url = herokuurl + "createWorld?world=" + worldName;
        axios.post(url)
            .then(res => {
                setCreating(false);
                setCheckOnline(true);
                setTurnOffServerMsg(false);
                setWorldName('');
                checkServerStatus();
            })
            .catch(error => {
                console.log('error but not really');
            })
    }

    return (
        <div className="create_world">
            { creating ? (
                <div id="overlay">
                    <div className="restoring-loading-symbol"></div>
                    <div className="loading-msg">Creating world with name {worldName}..</div>
                </div>
            ) : (
                    <></>
                )}

            <div className="cw_header">
                <h1>Create World</h1>
            </div>

            {checkOnline ? (
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
                                    <div className="cw_process">
                                        <h1>Enter the name of your new world</h1>
                                        <div className="textarea-wrap">
                                            <textarea
                                                placeholder="WORLD NAME"
                                                name="world_name_bar"
                                                id="world_name_bar"
                                                rows="1"
                                                value={worldName}
                                                onChange={(e) => setWorldName(e.target.value)}
                                                onKeyPress={(event) => {
                                                    if (event.key === 'Enter') {
                                                        event.preventDefault()
                                                    }
                                                }}
                                            />
                                        </div>

                                        {worldName === '' || worlds.indexOf(worldName) > -1 || worldName.indexOf(' ') > -1 ? (
                                            <div className="no_pick">
                                                <button>Confirm and Create</button>
                                            </div>
                                        ) : (
                                                <>
                                                    <button onClick={() => executeCreation()}>Confirm and Create</button>
                                                </>
                                            )}

                                        <p><b>Note:</b> Your world name must not contain spaces and cannot be the same as an existing world.</p>
                                    </div>

                                </>
                            )}
                    </>
                )}
        </div>
    )
}

export default CreateWorld;