import React, { useState } from 'react';
import { useParams } from "react-router-dom"

import points from 'config/points.json';

import { Helmet } from "react-helmet";
import firebase from "firebase/compat/app";

import Button from 'components/Button';

import "firebase/compat/analytics";
import "firebase/compat/database";

const TrackActivity = ({ user }) => {
    const { id } = useParams();
    const pointData = points.filter(item => item.id === id);
    console.log(pointData);
    const [isRequestSent, changeRequestStatus] = useState(false);
    // const [prevEmail, setPrevEmail] = useState(user.email);

    // useEffect(() => {
    //     if (prevEmail !== user.email) {
    //         setPrevEmail(user.email, sendRequest());
    //     }
    // }, [user.email])

    const sendRequest = () => {
        // firebase.analytics().logEvent('notifications_subscribe');
        if (!user.email) {
            // showAuthPopup(true);
        } else {
            firebase.database().ref('users/' + user.uid + '/activities/').push({

            });
            changeRequestStatus(true);
        }
    }

    return (
        <>
            <div className="">
                <Helmet>
                    <title>Тут будет текст</title>
                </Helmet>
                <div className="panel panel--results">
                    и тут будет текст
                    {isRequestSent ? (
                        <p className="message message--success">Мы отправим вам уведомление!</p>
                    ) : (
                        <Button size="l" kind="subscribe" onClick={() => sendRequest()}>Подписаться на уведомления</Button>
                    )}
                </div>
            </div>
        </>
    )
}

export default TrackActivity;
