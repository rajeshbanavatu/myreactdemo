import React from 'react';
import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';

const styles = theme => ({
    root: {
        margin: 20,
        padding: 20
    },
});

const TokenFetchError = (props) => {
    const classes = props.classes;
    
    return (
        <div className={classes.root}>
            We were unable to renew your session. <Link to={props.location.from}>Click here</Link> log in again.
        </div>
    );
}

export default withRouter(withStyles(styles)(TokenFetchError));

