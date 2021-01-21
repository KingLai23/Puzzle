import './RestoreWorld.css'
import React, { useState, useEffect } from 'react';
import axios from 'axios'

const RestoreWorld = () => {
    const [worlds, setWorlds] = useState([]);
    const [init, setInit] = useState(1);
    const [chosen, setChosen] = useState('N/A');
    const [foundWorlds, setFoundWorlds] = useState(true);
    const [restoring, setRestoring] = useState(false);

    var herokuurl = "https://agile-taiga-59578.herokuapp.com/";

    useEffect(() => {
        var world_names = []

        var url = herokuurl + "getWorldSaves";
        axios.post(url)
            .then(res => {
                world_names = res.data.data.InputStream[0].split("\n");
                world_names.pop();
                setWorlds(world_names);
                setFoundWorlds(false);
            })
            .catch(error => {
                console.log(error.message)
            })
    }, [init]);

    const setChosenWorld = (world) => {
        setChosen(world.world_name);
    }

    const executeRestore = () => {
        setRestoring(true);

        var url = herokuurl + "restoreWorld?world-name=" + chosen;
        axios.post(url)
            .then(res => {
                setRestoring(false);
            })
            .catch(error => {
                console.log(error.message)
                setRestoring(false);
            })
    }

    return (
        <div className="restore_world">
            { restoring ? (
                <div id="overlay">
                    <div className="restoring-loading-symbol"></div>
                    <div className="loading-msg">Restoring {chosen}..</div>
                </div>
            ) : (
                    <></>
                )}

            <div className="rw_header">
                <h1>Restore a World</h1>
                <h2>Pick a world</h2>
            </div>

            {foundWorlds ? (
                <div className="loading">
                    <div className="finding-world-loading-symbol"></div>
                    <div className="loading-msg">Finding Saved Worlds..</div>
                </div>
            ) : (
                    <>
                        <div className="rw_btns">
                            {worlds.map(world_name => (
                                <button onClick={() => setChosenWorld({ world_name })}>{world_name}</button>
                            ))}
                        </div>

                        <div className="confirm_pick">
                            <p>You have chosen to restore</p>
                            <h2>{chosen}</h2>

                            {chosen === 'N/A' ? (
                                <div className="no_pick">
                                    <button>Confirm and Restore</button>
                                </div>
                            ) : (
                                    <>
                                        <button onClick={() => executeRestore()}>Confirm and Restore</button>
                                    </>
                                )}
                        </div>
                    </>
                )}


        </div>
    )
}

export default RestoreWorld;

