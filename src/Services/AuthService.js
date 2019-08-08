import { UserManager } from 'oidc-client';
import { history } from '../App';

const settings = window.APP_SETTINGS;

const oidcClientSettings = {
    authority: settings.IDP_AUTHORITY,
    client_id: 'integrated-frontend',
    response_type: 'id_token token',
    scope: 'openid myo-api',
    redirect_uri: window.location.origin + '/signin-callback.html',
    silent_redirect_uri: window.location.origin + '/silent-callback.html',
    acr_values: "idp:guidewire-okta-test",
    automaticSilentRenew : true
}

const userManager = new UserManager(oidcClientSettings);

userManager.events.addSilentRenewError(function(){
    history.push({pathname:'/tokenfetcherror', from: window.location.pathname});
});

export const login = (returnPath) => {
    return userManager.signinRedirect({state: {returnPath}});
}

export const getUser = () => {
    return userManager.getUser();
}