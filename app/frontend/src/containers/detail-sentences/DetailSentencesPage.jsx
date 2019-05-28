import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles, CssBaseline, Paper, TextField, Grid, Button } from '@material-ui/core';
import { createMessage } from '../../actions/message';
import SentencaDetail from './SentencaDetail.jsx';

const styles = theme => ({
    content: {
        overflow: 'hidden',
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
            <div className={classes.content} >
            <Grid container direction="row" 
                justify="center"
                alignItems="baseline" 
                spacing={2}
            >
                <Grid item md={5} >
                    <SentencaDetail/>
                </Grid>
                <Grid item md={5} >
                    <SentencaDetail isSimilar/>
                </Grid>
                <Grid item md={2} >
                    <Paper></Paper>
                </Grid>
            </Grid>
            </div>
        )
    }

}


const mapStateToProps = (state) => ({
    isAuthenticated: state.authReducer.isAuthenticated
})

export default connect(mapStateToProps, { createMessage })(withStyles(styles)(DetailSentencesPage));