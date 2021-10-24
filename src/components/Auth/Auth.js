import React from 'react';
import './Auth.scss';
import Button from '../Button';
import {ReactComponent as FacebookIcon} from './facebook.svg';
import {ReactComponent as GoogleIcon} from './google.svg';
import firebase from "firebase/compat/app";
import "firebase/compat/analytics";

const Auth = ({user, setUserData}) => {
  const signIn = (type) => {
    let provider = false;

    switch (type) {
      case 'google':
          provider = new firebase.auth.GoogleAuthProvider();
        break;
      case 'facebook':
          provider = new firebase.auth.FacebookAuthProvider();
        break;
      default:
        provider = false;
    }
    if (provider) {
      firebase.auth().currentUser.linkWithPopup(provider).then(result => {
        const providerData = result.user.providerData[0];
        const profile = {
          name: providerData.displayName,
          email: providerData.email,
          photo: providerData.photoURL,
        }

        setUserData({
          uid: user.uid,
          email: profile.email,
          photo: profile.photo,
        });

        firebase.analytics().logEvent('signup_success', {
          provider: provider,
        });

        firebase.database().ref(`users/${result.user.uid}`).update(profile);

      }).catch(function(error) {
        firebase.auth().signInWithCredential(error.credential).then(result => {

          firebase.analytics().logEvent('signup_success', {
            provider: provider,
          });

        }).catch(error => {
          firebase.analytics().logEvent('signup_fail', {
            provider: provider,
            error_message: error,
          });
        });
        firebase.database().ref(`users/${user.uid}`).remove();
      });
    }
  }

  return (
    <div className="auth">
      <div className="auth__title">Вход на сайт</div>
      <Button kind="google" onClick={() => signIn('google')}>
        <GoogleIcon/>
        <span>Продолжить с Google</span>
      </Button>
      <Button kind="facebook" onClick={() => signIn('facebook')}>
        <FacebookIcon/>
        <span>Продолжить с Facebook</span>
      </Button>
      <p>Авторизуясь, вы даете <a href="/privacy.html" target="_blank">согласие на обработку своих персональных данных</a>.</p>
    </div>
  )
}

export default Auth;
