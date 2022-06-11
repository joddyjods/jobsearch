import React from 'react';
import { GoogleLogin } from 'react-google-login';

const clientId = "152798730660-61397c89b64orq4a0d0i56p74p0ljks2.apps.googleusercontent.com";

function Login( props ) {

    const onSuccess = (res) => {
        console.log( "LOGIN SUCCESS! Current user: ", res );
    }

    const onFailure = (res) => {
        console.log( "LOGIN FILED! res: ", res );
    }

    return(
        <div id="signInButton">
            <GoogleLogin
                clientId={clientId}
                buttonText="Login"
                onSuccess={props.onSuccess}
                onFailure={props.onFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
            />
        </div>
    );
}

export default Login;