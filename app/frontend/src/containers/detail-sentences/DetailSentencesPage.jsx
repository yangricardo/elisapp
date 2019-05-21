import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles, CssBaseline, Paper, TextField, Grid, Button } from '@material-ui/core';
import { createMessage } from '../../actions/message';
import { SentencaDetail } from './SentencaDetail.jsx';

const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
    },
    paper: {
        marginTop: theme.spacing.unit * 25,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderColor: 'primary',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    button: {
        margin: theme.spacing.unit,
        marginTop: theme.spacing.unit * 2.5,
    },
    formControl: {
        margin: theme.spacing.unit,
    },
})

class DetailSentencesPage extends Component {
    state = {}

    onChange = e => {
        this.setState({[e.target.name]: e.target.value})
    }

    render() {
        if(!this.props.isAuthenticated){
            this.props.createMessage({ loginRequired: "Login Required" });
            return <Redirect to="/login"/>
        }
        const { classes } = this.props;
        return (
            <main className={classes.main}>
            <CssBaseline/>
            <Grid container direction="row" spacing={24}>
                <Grid item xs={5} >
                    <SentencaDetail></SentencaDetail>
                </Grid>
                <Grid item xs={5} >
                    <Paper>b</Paper>
                </Grid>
                <Grid item xs={2} >
                    <Paper>c</Paper>
                </Grid>
            </Grid>
            </main>
        )
    }

}


const mapStateToProps = (state) => ({
    isAuthenticated: state.authReducer.isAuthenticated
})

export default connect(mapStateToProps, { createMessage })(withStyles(styles)(DetailSentencesPage));