import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        margin: 20,
        padding: 20
    },
    paper: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
});

const Error = (props) => {
    const classes = props.classes;

    return (
        <div className={classes.root}>
            <Grid container spacing={24}>
                <Paper className={classes.paper} elevation={1} square={true}>
                    Oops. There was an error processing this request. Please try again.
                </Paper>
            </Grid>
        </div>
    );
}

export default withStyles(styles)(Error);
