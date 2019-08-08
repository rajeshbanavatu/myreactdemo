import React from "react";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
// import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import ErrorIcon from "@material-ui/icons/ErrorOutline";

const styles = theme => ({
  paper: {
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit}px ${
      theme.spacing.unit
    }px ${theme.spacing.unit * 2}px`,
    marginTop: `${theme.spacing.unit}px`
  },
  avatar: {
    backgroundColor: theme.palette.primary.main
  }
});

function Banner(props) {
  const classes = props.classes;
  const { message } = props;
  return (
    <React.Fragment>
      <Paper elevation={0} className={classes.paper}>
        <Grid container wrap="nowrap" spacing={16} alignItems="center">
          <Grid item>
            <Avatar className={classes.avatar}>
              <ErrorIcon />
            </Avatar>
          </Grid>
          <Grid item>
            <Typography color="error">
              {message}
            </Typography>
          </Grid>
        </Grid>
        {/* <Grid container justify="flex-end" spacing={8}>
          <Grid item>
            <Button color="primary">Turn on wifi</Button>
          </Grid>
        </Grid> */}
      </Paper>
      <Divider />
      <CssBaseline />
    </React.Fragment>
  );
}

export default withStyles(styles)(Banner);