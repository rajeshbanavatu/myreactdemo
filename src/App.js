import React, { useEffect, useState }from 'react'
import { Router, Route, Switch } from "react-router-dom";
import OrderForm from './OrderForm';
import Error from './Error';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import pink from '@material-ui/core/colors/pink';
import blue from '@material-ui/core/colors/blue';
import Login from './Components/Login';
import ProtectedRoute from './Components/ProtectedRoute';
import {getUser} from './Services/AuthService';
import GuidewireWorkStatus from './Components/GuidewireWorkStatus';
import TokenFetchError from './Components/TokenFetchError'
import { createBrowserHistory } from 'history';
import './AxiosInterceptors';

export const history =  createBrowserHistory();
const palette = { 
    // primary: { 
    //     contrastText: "#fff",
    //     main: "rgba(245, 130, 32, )",
    //     light: "rgba(245, 130, 32, 1)",
    //     dark: "rgba(245, 130, 32, 1)"
    // }

    // palette: {
    //     primary: indigo,
    //     secondary: pink,
    //     error: red,
    //     // Used by `getContrastText()` to maximize the contrast between the background and
    //     // the text.
    //     contrastThreshold: 3,
    //     // Used to shift a color's luminance by approximately
    //     // two indexes within its tonal palette.
    //     // E.g., shift from Red 500 to Red 300 or Red 700.
    //     tonalOffset: 0.2,
    //   },

        primary: blue,
        secondary: pink,
}

const themeName = 'Ontellus Colors';

const theme = createMuiTheme({ 
    palette,
    themeName,
    typography: {
        useNextVariants: true,
    },
    overrides: {
        MuiInput: {
          underline: {
            "&&&&:hover:before": {
              borderBottom: "1px solid rgba(0, 0, 0, 0.42)"
            }
          }
        }
    }
});
 
const App = () => {
    
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isFetchUserComplete, setIsFetchUserComplete] = useState(false);

    useEffect(() => {

        const fetchUser = async () => {
            const user = await getUser();
           
            if (user != null && user.access_token && !user.expired) {
                setIsAuthenticated(true);
            }

            setIsFetchUserComplete(true);
        }

        fetchUser();
    }, []);

    return (
        <MuiThemeProvider theme={theme}>
            <Router history={history}>
                <div>
                    { !isFetchUserComplete ? (
                            <div>Please wait...</div>
                        ) : (
                            <Switch>
                                <Route path="/login" render={(props) => <Login 
                                    {...props} 
                                    isAuthenticated={isAuthenticated} />} 
                                />
                                <Route path="/error" component={Error} />
                                <Route path="/tokenfetcherror" component={TokenFetchError} />
                                <ProtectedRoute exact path="/" isAuthenticated={isAuthenticated} component={OrderForm} />
                                <ProtectedRoute path={"/order/status/:id"} isAuthenticated={isAuthenticated} component={GuidewireWorkStatus} />
                            </Switch>
                        )
                    }
                </div>

            </Router>
        </MuiThemeProvider>
    );
}

export default App;
