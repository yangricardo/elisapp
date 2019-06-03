import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";
import { withStyles, Paper, Typography, Grid, Button } from '@material-ui/core';
import SentencaDetail from './SentencaDetail.jsx';
import { createMessage, returnError } from '../../actions/message';
import { getProcess, clearSearchedProcess, setSearchedProcess, setLoadingProcess } from '../../actions/similarprocesses';
import { buildTokenHeader } from '../../actions/auth';

const styles = theme => ({
    content: {
        height: 'auto',
        width: 'auto',
        display: 'block',
        padding: theme.spacing(1),
    },
})

export const GetSimilarProcess = (similarProcessURL) => {
    axios.get(similarProcessURL, buildTokenHeader(this.props.token))
    .then(res => {
        const { results } = res.data
        if (results.hasOwnProperty('id')){
            this.setState({found:true});
            this.props.setSearchedProcess(results);
        }
    })
    .catch(err => dispatch(returnError(err.response.data, err.response.status)));
}



class DetailSentencesPage extends Component {
    state = {}

    render() {
        if(!this.props.isAuthenticated){
            this.props.createMessage({ loginRequired: "Login Required" });
            return <Redirect to="/login"/>
        }
        const { classes, searchedProcess } = this.props;
        if (!searchedProcess.hasOwnProperty('id')){
            return <Redirect to="/buscarprocesso"/>
        }

        const { similaridade , processos_similares } = searchedProcess;
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
                        <Grid container direction="column" 
                        justify="center"
                        alignItems="baseline" 
                        spacing={2}
                    >
                        <Grid item xs>
                            <Paper>
                                <Typography>{similaridade}</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs>
                            <Paper>
                            {processos_similares.map((item, key) => {
                                return  <Typography color="inherit" key={key}>
                                            {`• ${item[0]} - ${item[2]}`}<br/>
                                        </Typography>})
                            }}
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            </div>
        )
    }

}


const mapStateToProps = (state) => ({
    isAuthenticated: state.authReducer.isAuthenticated,
    token : state.authReducer.token,
    searchedProcess : state.similarProcessesReducer.searchedProcess,
})

const mapDispatchToProps = {
    getProcess,
    returnError,
    createMessage,
    clearSearchedProcess,
    setSearchedProcess,
    setLoadingProcess,
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(DetailSentencesPage));