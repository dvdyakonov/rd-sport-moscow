import React, { useState } from 'react';
import { useParams } from "react-router-dom"
import { Helmet } from "react-helmet";

import points from 'config/points.json';
import types from 'config/types.json';

// Components
import Button from 'components/Button';
import Select from 'react-select';

import firebase from "firebase/compat/app";
import "firebase/compat/analytics";
import "firebase/compat/database";

const TrackActivity = ({ user, showAuthPopup }) => {
    const { id: activityId } = useParams();
    const [activityType, setActivityType] = useState();

    const pointData = points.find(item => item.id === Number(activityId));

    const [activityKey, setActivityKey] = useState(localStorage.getItem('activityKey'));
    const [activityStart, setActivityStart] = useState(localStorage.getItem('activityStart'));

    const options = types.map(type => ({ "value": type.id, "label": type.title }) )

    const sendRequest = () => {
        if (!user.email) {
            showAuthPopup(true);
        } else {
            if (activityKey) {
                firebase.database().ref('users/' + user.uid + '/activities/' + activityKey).update({
                    "end": Date.now(),
                })
                setActivityKey(null);
                setActivityStart(null);
                localStorage.removeItem('activityKey');
                localStorage.removeItem('ActivityStart');
            } else {
                const start = Date.now();
                firebase.database().ref('users/' + user.uid + '/activities/').push({
                    "point_id": activityId,
                    "type": activityType,
                    "start": start,
                }).then(res => {
                    const key = res.getKey();
                    setActivityKey(key);
                    setActivityStart(start);
                    localStorage.setItem('activityKey', key);
                    localStorage.setItem('activityStart', start);
                }).catch(error => console.log(error));
            }
        }
    }

    return (
        <>
            <div className="">
                <Helmet>
                    <title>Тут будет текст</title>
                </Helmet>
                <div className="panel panel--results">
                    {pointData.title}
                    {pointData.id}
                    <Select options={options} onChange={(option) => setActivityType(option.value)}/>

                    и тут будет текст
                    {activityKey ? (
                        <>
                        {activityStart}
                        <Button size="l" kind="subscribe" onClick={() => sendRequest()}>Завершить активность</Button>
                        </>
                    ) : (
                        <Button size="l" kind="subscribe" onClick={() => sendRequest()}>Начать активность</Button>
                    )}
                </div>
            </div>
        </>
    )
}

export default TrackActivity;
