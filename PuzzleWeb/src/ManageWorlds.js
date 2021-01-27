import './ManageWorlds.css'
import React, { useState, useEffect } from 'react';
import axios from 'axios'
import SwitchWorld from './world_manage/SwitchWorld';
import RemoveWorld from './world_manage/RemoveWorld';
import CreateWorld from './world_manage/CreateWorld';

const ManageWorlds = () => {
    const [applyChanges, setApplyChanges] = useState(false);

    const [worlds, setWorlds] = useState([]);
    const [foundWorlds, setFoundWorlds] = useState(true);
    const [currentWorld, setCurrentWorld] = useState('N/A');

    const [showCreate, setShowCreate] = useState(false);
    const [showSwitch, setShowSwitch] = useState(false);
    const [showRemove, setShowRemove] = useState(false);

    var herokuurl = "https://agile-taiga-59578.herokuapp.com/";

    useEffect(() => {
        getAllWorlds();
        getCurrentWorld();
    });

    const getAllWorlds = () => {
        var url = herokuurl + "getAllWorlds";
        axios.post(url)
            .then(res => {
                setWorlds(res.data.data.worlds);
                setFoundWorlds(false);
            })
            .catch(error => {
                console.log(error.message)
            })
    }

    const getCurrentWorld = () => {
        var url = herokuurl + "getCurrentWorld";
        axios.post(url)
            .then(res => {
                try {
                    setCurrentWorld((res.data.data.InputStream[0]).trim());
                } catch (error) {
                    console.log("manage world error setting current world");
                }
                
            })
            .catch(error => {
                console.log(error.message)
            })
    }

    const toggleCreate = () => {
        toggleEverythingOff();
        setShowCreate(!showCreate);
    }

    const toggleSwitch = () => {
        toggleEverythingOff();
        setShowSwitch(!showSwitch);
    }

    const toggleRemove = () => {
        toggleEverythingOff();
        setShowRemove(!showRemove);
    }

    const toggleEverythingOff = () => {
        setShowCreate(false);
        setShowSwitch(false);
        setShowRemove(false);
    }

    return (
        <div className="mw">
            { applyChanges ? (
                <div id="overlay">
                    <div className="restoring-loading-symbol"></div>
                    <div className="loading-msg">Applying changes...</div>
                </div>
            ) : (
                    <></>
                )}

            <div className="mw_header">
                <h1>Manage Worlds</h1>
            </div>

            {foundWorlds ? (
                <div className="loading">
                    <div className="finding-world-loading-symbol"></div>
                    <div className="loading-msg">Finding your worlds information..</div>
                </div>
            ) : (
                    <>
                        <div className="mw_current_world">
                            <h2>Current world: <span className="mwcw">{currentWorld}</span></h2>
                        </div>

                        <div className="mw_world_list">
                            <h2>The worlds in your repository are:</h2>
                            {worlds.map(world_name => (
                                <p>{world_name}</p>
                            ))}
                        </div>

                        <div className="mw_buttons">
                            <button id='mw_scl' onClick={() => toggleCreate()}>Create World</button>
                            <button id='mw_scl' onClick={() => toggleSwitch()}>Switch World</button>
                            <button onClick={() => toggleRemove()}>Remove World</button>
                        </div>

                        {showCreate ? (
                            <div className="mw_create">
                                <div className="mw_create_close">
                                    <button onClick={() => toggleCreate()}>x</button>
                                </div>
                                <CreateWorld />
                            </div>
                        ) : (
                                <></>
                            )}

                        {showSwitch ? (
                            <div className="mw_switch">
                                <div className="mw_switch_close">
                                    <button onClick={() => toggleSwitch()}>x</button>
                                </div>
                                <SwitchWorld />
                            </div>
                        ) : (
                                <></>
                            )}

                        {showRemove ? (
                            <div className="mw_remove">
                                <div className="mw_remove_close">
                                    <button onClick={() => toggleRemove()}>x</button>
                                </div>
                                <RemoveWorld />
                            </div>
                        ) : (
                                <></>
                            )}
                    </>
                )}

        </div>
    )
}

export default ManageWorlds;