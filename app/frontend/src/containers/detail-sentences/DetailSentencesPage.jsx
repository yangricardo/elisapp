import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles, CssBaseline, Paper, TextField, Grid, Button } from '@material-ui/core';
import { createMessage } from '../../actions/message';
import SentencaDetail from './SentencaDetail.jsx';

const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
    },
    paper: {
        marginTop: theme.spacing(25),
        marginRight: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderColor: 'primary',
        padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    button: {
        margin: theme.spacing(1),
        marginTop: theme.spacing(2.5),
    },
    formControl: {
        margin: theme.spacing(1),
    },
})

class DetailSentencesPage extends Component {
    state = {}

    onChange = e => {
        this.setState({[e.target.name]: e.target.value})
    }

    render() {
        // if(!this.props.isAuthenticated){
        //     this.props.createMessage({ loginRequired: "Login Required" });
        //     return <Redirect to="/login"/>
        // }
        const { classes } = this.props;
        return (
            <main className={classes.main}>
            <CssBaseline/>
            <Grid container direction="row" 
                justify="center"
                alignItems="baseline" 
                spacing={2}
            >
                <Grid item xs={5} >
                    <SentencaDetail/>
                </Grid>
                <Grid item xs={5} >
                    <SentencaDetail/>
                </Grid>
                <Grid item xs={2} >
                    <Paper></Paper>
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