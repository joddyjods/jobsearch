import React from 'react';
import { GoogleLogout } from 'react-google-login';

const clientId = "152798730660-61397c89b64orq4a0d0i56p74p0ljks2.apps.googleusercontent.com";

function Logout( props ) {
    const onSuccess = () => {
        console.log( "Logged  out" );
    }

    return (
        <div id="signOutButton">
            <GoogleLogout 
                clientId={clientId}
                buttonText={"Logout"}
                onLogoutSuccess={props.onLogoutSuccess}
            />
        </div>
    );
}

export default Logout;