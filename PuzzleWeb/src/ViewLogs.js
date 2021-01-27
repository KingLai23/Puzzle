import './ViewLogs.css'
import React, { useState, useEffect } from 'react';
import axios from 'axios'

const ViewLogs = () => {
    const [worlds, setWorlds] = useState([]);
    const [init, setInit] = useState(1);
    const [chosen, setChosen] = useState('N/A');
    const [foundWorlds, setFoundWorlds] = useState(true);
    const [grabbingLog, setGrabbingLog] = useState(false);
    const [log, setLog] = useState("");
    const [showLog, setShowLog] = useState(false);
    const [msg, setMsg] = useState("Pick a world to view its logs");

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

    const fetchLog = (world) => {
        setChosen(world.world_name);
        setGrabbingLog(true);

        var url = herokuurl + "getLog?world=" + world.world_name;
        console.log(url);
        axios.post(url)
            .then(res => {
                setLog(res.data.data.InputStream[0])
                setGrabbingLog(false);
                setShowLog(true);
                setMsg("Showing log for: " + world.world_name);
            })
            .catch(error => {
                console.log(error.message)
                setGrabbingLog(false);
            })
    }

    const closeLog = () => {
        setShowLog(false);
        setMsg("Pick a world to view its logs");
    }

    return (
        <div className="view_log">
            { grabbingLog ? (
                <div id="overlay">
                    <div className="grab-log-loading-symbol"></div>
                    <div className="loading-msg">Grabbing the log for {chosen}..</div>
                </div>
            ) : (
                    <></>
                )}

            <div className="vl_header">
                <h1>View Logs</h1>
                <h2>{msg}</h2>
            </div>

            {foundWorlds ? (
                <div className="loading">
                    <div className="finding-world-loading-symbol"></div>
                    <div className="loading-msg">Finding Saved Worlds..</div>
                </div>
            ) : (
                    <>
                        {showLog && !grabbingLog ? (
                            <div className="log_display">
                                <p><b>{chosen}-log.txt</b></p>
                                <p>{log}</p>
                                <button onClick={() => closeLog()}>close</button>
                            </div>
                        ) : (
                                <>
                                    <div className="vl_btns">
                                        {worlds.map(world_name => (
                                            <button onClick={() => fetchLog({ world_name })}>{world_name}</button>
                                        ))}
                                    </div>
                                </>
                            )}
                    </>
                )}


        </div>
    )
}

export default ViewLogs;

