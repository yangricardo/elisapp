import React from 'react'
import PropTypes from 'prop-types'
import { withStyles, Paper, TextField, Grid, Button } from '@material-ui/core';

const styles = theme => ({
    button: {
      margin: theme.spacing.unit,
    },
    paper: {
        marginTop: theme.spacing.unit * 25,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderColor: 'primary',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    input: {
      display: 'none',
    },
});

const SentencaDetail = props => {
    const { classes } = props;
    return (
        <Paper className={classes.paper}>
            a
        </Paper>
    );
}

SentencaDetail.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SentencaDetail);