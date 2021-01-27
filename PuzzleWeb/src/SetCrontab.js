import './SetCrontab.css'
import React, { useState, useEffect } from 'react';
import axios from 'axios'

const SetCron = () => {
    const [currentBackup, setCurrentBackup] = useState('N/A');

    const [backupOptions, setBackupOptions] = useState(['Everyday', 'Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays']);
    const [curBackupOpt, setCurBackupOpt] = useState(0);
    const [openBackupOpt, setOpenBackupOpt] = useState(false);

    const [timeOptions, setTimeOptions] = useState(['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00',
        '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']);
    const [curTime, setCurTime] = useState(5);
    const [openTime, setOpenTime] = useState(false);

    const [applyingCron, setApplyingCron] = useState(false);

    var herokuurl = "https://agile-taiga-59578.herokuapp.com/";

    useEffect(() => {
        getCurrentCrontab();
    });

    const getCurrentCrontab = () => {
        var url = herokuurl + "getCurrentCron";
        axios.post(url)
            .then(res => {
                setCurrentBackup(res.data.data.BackupSchedule);
            })
            .catch(error => {
                console.log(error.message)
            })
    }

    const toggleBackupDd = () => {
        setOpenBackupOpt(!openBackupOpt);
        setOpenTime(false);
    }

    const setBackupOption = (selectedOption) => {
        toggleBackupDd();
        setCurBackupOpt(selectedOption);
    }

    const toggleTimeDd = () => {
        setOpenTime(!openTime);
        setOpenBackupOpt(false);
    }

    const setTimeSelect = (selectedOption) => {
        toggleTimeDd();
        setCurTime(selectedOption);
    }

    const executeCrontab = () => {
        if(openBackupOpt || openTime) return;

        setApplyingCron(true);

        var crontab = "0 " + curTime + " \"*\" \"*\" ";
        crontab += (curBackupOpt === 0) ? "\"*\"" : (curBackupOpt - 1);

        var url = herokuurl + "setCrontab?cron=" + crontab;
        axios.post(url)
            .then(res => {
                getCurrentCrontab();
                setApplyingCron(false);
            })
            .catch(error => {
                console.log(error.message)
            })

    }

    return (
        <div className="set_crontab">
            { applyingCron ? (
                <div id="overlay">
                    <div className="restoring-loading-symbol"></div>
                    <div className="loading-msg">Applying changes...</div>
                </div>
            ) : (
                    <></>
                )}

            <div className="sc_header">
                <h1>Set Auto-Backups</h1>
                <h2>Your current backup schedule is</h2>
                <p>{currentBackup}</p>
            </div>

            <div className="sc_box">
                <h1>Select New Schedule</h1>

                <div className="sc_dropdowns">
                    <div className="sc_freq">
                        <div className="sc_freq_title">
                            <p>Frequency</p>
                        </div>
                        <div className="sc_freq_dd">
                            <div className="sc_freq_dd_header" onClick={() => toggleBackupDd()}>
                                <p>{backupOptions[curBackupOpt]}</p>
                            </div>

                            {openBackupOpt && <ul className="sc_freq_dd_list">
                                {backupOptions.map((item, index) => (
                                    <li className="sc_freq_dd_items" key={item} onClick={() => setBackupOption(index)}>{backupOptions[index]}</li>
                                ))}
                            </ul>}
                        </div>
                    </div>
                    <div className="sc_time">
                        <div className="sc_time_title">
                            <p>Time</p>
                        </div>
                        <div className="sc_time_select">
                            <div className="sc_time_select_header" onClick={() => toggleTimeDd()}>
                                <p>{timeOptions[curTime]}</p>
                            </div>

                            {openTime && <ul className="sc_time_select_list">
                                {timeOptions.map((item, index) => (
                                    <li className="sc_time_select_items" key={item} onClick={() => setTimeSelect(index)}>{timeOptions[index]}</li>
                                ))}
                            </ul>}
                        </div>
                    </div>
                </div>
                <div className="sc_confirm">
                    <button onClick={() => executeCrontab()}>Confirm and Apply</button>
                </div>
            </div>
        </div>
    )
}

export default SetCron;