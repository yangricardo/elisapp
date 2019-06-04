import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { buildTokenHeader } from '../../actions/auth';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";
import { withStyles, Paper, Typography,LinearProgress, Grid, Button,List, ListItem, ListItemText, ListItemIcon, Divider,Chip } from '@material-ui/core';
import SentencaDetail from './SentencaDetail.jsx';
import { createMessage, returnError } from '../../actions/message';
import { setLoading } from '../../actions/loading';
import { clearSearchedProcess, setSearchedProcess, setLoadingProcess } from '../../actions/similarprocesses';
import SimilarList from './DetailSentenceHelpers.jsx';

const styles = theme => ({
    content: {
        height: 'auto',
        width: 'auto',
        display: 'block',
    },
    similarList : {
        maxHeight : 300,
        width : 'auto',
        overflowY : 'auto',
        backgroundColor: theme.palette.background.paper,
    }
})

class DetailSentencesPage extends Component {
    constructor (props){
        super(props)
        this.state = {
            loading : false
        }
    }

    onListClick = e => {
        console.log(e)
        const urlRE = new RegExp('https?:\\/\\/(\\w\\.?)+');
        const similarProcessURL = e[1].replace(urlRE,"")
        const { token } = this.props
        this.setState({loading:true})
        this.props.setLoading();
        axios.get(similarProcessURL, buildTokenHeader(token))
        .then(res => {
            this.props.setSearchedProcess(res.data);
            this.setState({loading:false})
            this.props.setLoading();
        })
        .catch(err => {
            this.props.returnError(err.response.data, err.response.status);
            this.setState({loading:false})
            this.props.setLoading();
        });
    }


    render() {
        if(!this.props.isAuthenticated){
            this.props.createMessage({ loginRequired: "Login Required" });
            return <Redirect to="/login"/>
        }
        const { classes, searchedProcess, token } = this.props;
        if(searchedProcess !== undefined){
            if (!searchedProcess.hasOwnProperty('id')){
                return <Redirect to="/buscarprocesso"/>
            }
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
                        <List dense className={classes.similarList}>
                            { processos_similares !== undefined ?
                                processos_similares.map((item,index)=>{
                                return (
                                <ListItem key={index} disable={this.state.loading.toString()} button onClick={this.onListClick.bind(this, item)}>
                                    <ListItemIcon>
                                        <Chip size="small" label={`${item[0]}%`}/>
                                    </ListItemIcon>
                                    <ListItemText primary={item[2]} />
                                </ListItem>
                                )})
                                : undefined
                            }
                        </List>
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
    returnError,
    createMessage,
    clearSearchedProcess,
    setSearchedProcess,
    setLoading,
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(DetailSentencesPage));