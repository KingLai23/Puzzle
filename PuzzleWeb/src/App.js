import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RestoreWorld from './RestoreWorld.js';
import SetCron from './SetCrontab.js';

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginMsg, setLoginMsg] = useState("");

  const [serverStatus, setServerStatus] = useState('N/A');
  const [loadingMsg, setLoadingMsg] = useState('Grabbing Server Status..');
  const [showLoading, setShowLoading] = useState(false);
  const [activePlayers, setActivePlayers] = useState('N/A');
  const [showRestore, setShowRestore] = useState(false);
  const [showCron, setShowCron] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  var herokuurl = "https://agile-taiga-59578.herokuapp.com/";

  useEffect(() => {
    const loggedInLS = localStorage.getItem('loginCheck');
    if (loggedInLS != null) {
      signinSuccess();
    }
  },[])

  const signinSuccess = () => {
    setLoginMsg("");
    clearUP();
    setLoggedIn(true);
    setShowLoading(true);
    fetchActivePlayers();
    fetchServerStatus();
  }

  const clearUP = () => {
    setUsername("");
    setPassword("");
  }

  const logout = () => {
    localStorage.clear();
    setLoggedIn(false);
  }

  const authenticate = () => {
    var url = herokuurl + "authenticate?username=" + username + "&password=" + password;
    axios.post(url)
      .then(res => {
        if (res.data.status === "1") {
          localStorage.setItem('loginCheck', true);
          signinSuccess();
        } else {
          setLoginMsg("Invalid login credentials..");
        }
      })
      .catch(error => {
        console.log(error.message)
      })
  }

  const executeServerControl = (type) => {
    setShowLoading(true);

    var url;

    switch (type) {
      case 0:
        url = herokuurl + "startMCServer";
        setLoadingMsg('Starting Minecraft Server..');
        break;
      case 1:
        url = herokuurl + "stopMCServer";
        setLoadingMsg('Stopping Minecraft Server..');
        break;
      case 2:
        url = herokuurl + "restartMCServer";
        setLoadingMsg('Restarting Minecraft Server..');
        break;
      case 3:
        url = herokuurl + "backupMCServer";
        setLoadingMsg('Backing the Minecraft Server up..');
        break;
    }

    console.log(url)

    axios.post(url)
      .then(res => {
        console.log(res.data);
        setShowLoading(false);
        fetchServerStatus();
      })
      .catch(error => {
        console.log(error.message)
        setShowLoading(false);
      })


  }

  const fetchServerStatus = () => {
    var url = herokuurl + "mcServerStatus";
    axios.post(url)
      .then(res => {
        if (res.data.data.ExitStatus === 0) {
          setServerStatus('Online');
        } else {
          setServerStatus('Offline');
        }

        setShowLoading(false);
      })
      .catch(error => {
        console.log(error.message)
        setShowLoading(false);
      })
  }

  const fetchActivePlayers = () => {
    var url = herokuurl + "getActivePlayers";
    axios.post(url)
      .then(res => {
        setActivePlayers(res.data.data.InputStream[0]);
      })
      .catch(error => {
        console.log(error.message)
      })
  }

  const toggleRestore = () => {
    setShowRestore(!showRestore);
    setShowCron(false);
  }

  const toggleCron = () => {
    setShowCron(!showCron);
    setShowRestore(false);
  }

  return (
    <div className="App">
      { !loggedIn ? (
        <div id="loginoverlay">
          <div className="login-prompt">
            <h1>Sign In</h1>
            <h2>Puzzle Web</h2>

            <div className="textarea-wrap">
              <textarea
                placeholder="USERNAME"
                name="username_bar"
                id="username_bar"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="textarea-wrap">
              <input 
                type="password" 
                placeholder="PASSWORD"
                maxlength="25"
                id="password_bar" 
                name="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button onClick = {() => authenticate()}>Sign In</button>
            <p>{loginMsg}</p>
          </div>
        </div>
      ) : (
          <></>
        )}

      { showLoading ? (
        <div id="overlay">
          <div className="loading-symbol"></div>
          <div className="loading-msg">{loadingMsg}</div>
        </div>
      ) : (
          <></>
        )}

      <div className="header">
        <h1>Puzzle <span className="version">v2.0</span></h1>
        <button onClick = {() => logout()}>Log Out</button>
      </div>

      <div className="server_status">
        <div className="ss_title">
          <p>Server Status</p>
        </div>
        <div className="ss_status">
          <p>{serverStatus}</p>
        </div>
      </div>

      <div className="active_players">
        <div className="ap_title">
          <p>Active Players</p>
        </div>
        <div className="ap_info">
          <p>{activePlayers}</p>
        </div>
      </div>

      <div className="server_controls">
        <button id='scl' onClick={() => executeServerControl(0)}>Start</button>
        <button id='scl' onClick={() => executeServerControl(1)}>Stop</button>
        <button id='scl' onClick={() => executeServerControl(2)}>Restart</button>
        <button onClick={() => executeServerControl(3)}>Backup</button>
      </div>

      <div className="server_controls_2">
        <button id='scl' onClick={() => toggleRestore()}>Restore World</button>
        <button onClick={() => toggleCron()}>Set Auto-Backups</button>
      </div>

      { showRestore ? (
        <div className="restore">
          <div className="restore_close">
            <button onClick={() => toggleRestore()}>x</button>
          </div>
          <RestoreWorld />
        </div>
      ) : (
          <></>
        )}

      { showCron ? (
        <div className="crontab">
          <div className="crontab_close">
            <button onClick={() => toggleCron()}>x</button>
          </div>
          <SetCron />
        </div>
      ) : (
          <></>
        )}

      {/* <div className="footer">
          <p>Puzzle v2.0 2020 - by King Lai and ZiCheng Huang</p>
        </div> */}
    </div>
  );
}

export default App;
