import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { login } from '../Services/AuthService';

/**
 * Login component sends the user to the login page if they aren't logged in.
 * After they log in, the user is sent back to this component so that it can decided
 * where to send the user. We determine where to send the user in this component
 * because the return URL is part of the login process. However, this functionality
 * is still a good candidate to be refactored out to simplify this component.
 * 
 * The login effect is executed only once during mount. This logic ensures that
 * the user isn't sent to the login page unless the user object is invalid.
 * 
 * This component also registers a request interceptor that ensures we have
 * a fresh token before making API calls.
 */
const Login = (props) => {

    // Save where the user came from and pass it to the 
    // oidc-client user manager so that we can send them back to the route
    // they originally tried to access.
    const from = props.location.state ? 
        props.location.state.from.pathname : '/';
    
    const [isSigninError, setIsSigninError] = useState(false);
    const [isFetchUserError, setIsFetchUserError] = useState(false);
    const [redirectToReferrer, setRedirectToReferer] = useState(false);

    useEffect(() => {

        const fetchUser = async () => {
            try {
                
                if (props.isAuthenticated) {
                    setRedirectToReferer(true);
                }
                else {
                    try {
                        await login(from);
                    }
                    catch(e) {
                        setIsSigninError(true);
                    }
                }
            }
            catch(e) {
                setIsFetchUserError(true);
            }
        }

        fetchUser();
    });

    
    if (redirectToReferrer) {
        let { from } = props.location.state || { from: { pathname: "/"} };
        return <Redirect to={from} />;
    }
    else if (isSigninError) {
        // TODO: Redirec to error page.
    }
    else if (isFetchUserError) {
        // TODO: redirect to error page.
    }

    return (<div data-testid="logging-in">Logging in...</div>);
}

export default Login;