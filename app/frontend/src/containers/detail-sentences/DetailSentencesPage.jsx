import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { buildTokenHeader } from '../../actions/auth';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";
import { withStyles, Paper, Typography,Box, Grid, List, ListItem, ListItemText, ListItemIcon, Divider,Chip, createMuiTheme, Button } from '@material-ui/core';
import SentencaDetail from './SentencaDetail.jsx';
import { createMessage, returnError } from '../../actions/message';
import { setLoading } from '../../actions/loading';
import { clearSearchedProcess, setSearchedProcess } from '../../actions/similarprocesses';
import { teal, amber, deepOrange, common } from '@material-ui/core/colors';
import { ThemeProvider } from '@material-ui/styles';

const styles = theme => ({
    content: {
        height : 'auto',
        overflowY: 'auto',
        overflowX: 'hidden'
    },
    gridRow : {
        display:'block',
    },
    similarList : {
        maxHeight : 418,
        width : 'auto',
        overflowY : 'auto',
    }
})

export const similarTheme = createMuiTheme({
    palette: {
        sim100: {
            main: teal[800],
            contrastText: common.white,
        },
        sim70:{
            main: teal[300],
            contrastText: common.white,
        },
        sim50:{
            main: amber[800],
            contrastText: common.white,
        },
        sim30: {
            main: deepOrange[500],
            contrastText: common.white,
        }
    },
});

class DetailSentencesPage extends Component {
    constructor (props){
        super(props)
        this.state = {
            loading : false
        }
    }

    onListClick = e => {
        console.log(e)
        const { token, cachedSimilarProcesses, setSearchedProcess, setLoading, returnError } = this.props
        const urlRE = new RegExp('https?:\\/\\/(\\w\\.?)+');
        const similarProcessIDRE = new RegExp('https?:\\/\\/(\\w\\.?)+\\/api\\/models\\/processossimilaresreport\\/(\\d+)\\/');
        const id = similarProcessIDRE.exec(e.id)[2]
        if (id  in cachedSimilarProcesses ){
           setSearchedProcess(cachedSimilarProcesses[id]);
        } else {
            const similarProcessURL = e.id.replace(urlRE,"")
            this.setState({loading:true})
            setLoading();
            axios.get(similarProcessURL, buildTokenHeader(token))
            .then(res => {
                setSearchedProcess(res.data);
                this.setState({loading:false})
                setLoading();
            })
            .catch(err => {
                this.props.returnError(err.response.data, err.response.status);
                this.setState({loading:false})
                setLoading();
            });
        }
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
            <div >
            <Grid container direction="row" 
                justify="center"
                alignItems="baseline" 
                spacing={2}
            >
                <Grid item md={5} xs={10} className={classes.gridRow}>
                    <SentencaDetail/>
                </Grid>
                <Grid item md={5} xs={10} className={classes.gridRow}>
                    <SentencaDetail isSimilar/>
                </Grid>
                <Grid item md={2} className={classes.gridRow}>
                        <Grid container direction="column" 
                        justify="center"
                        alignItems="center"
                        alignContent="stretch" 
                        spacing={4}
                    >
                        <Grid item xs className={classes.gridRow} >
                            <Typography variant='caption'>Índice de Similaridade</Typography>
                            <ThemeProvider theme={similarTheme}> 
                            <Box 
                            color={(similaridade <= 30 ? 'sim30' : similaridade <= 50 ? 'sim50' : similaridade <= 70 ? 'sim70' : 'sim100')+'.main'} >
                                <Typography variant='h2'>
                                    {similaridade}%
                                </Typography>
                            </Box>
                            </ThemeProvider>
                        </Grid>
                        <Grid item xs>
                            <Button className={classes.gridRow} variant="outlined" color="primary">
                            Avaliar Similaridade
                            </Button>
                        </Grid>
                        <Grid item xs className={classes.gridRow}>
                            <Button variant="outlined" color="primary">
                            Salvar para Análise
                            </Button>
                        </Grid>
                        <Grid item xs>
                        <Typography variant='caption'>{`${processos_similares.length} processos similares`}</Typography>
                        <Box boxShadow={2} borderRadius={10} component={List} dense className={classes.similarList}>
                            { processos_similares !== undefined ?
                                processos_similares.map((item,index)=>{
                                return (
                                <Fragment key={index} >
                                    <ListItem 
                                        button onClick={this.onListClick.bind(this, item)}
                                        style={{backgroundColor : (item.similaridade <= 30 ? deepOrange[50] : item.similaridade <= 50 ? amber[50] : teal[50]) }}
                                        selected={item.processo_similar_tj === searchedProcess.processo_similar_tj} 
                                        disable={this.state.loading.toString()}>
                                        <ListItemText primary={item.processo_similar_tj} secondary={item.processo_similar_cnj}/>
                                    </ListItem>
                                    <Divider component="li"  light />
                                </Fragment>
                                )})
                                : undefined
                            }
                        </Box>
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
    cachedSimilarProcesses : state.similarProcessesReducer.cachedSimilarProcesses
})

const mapDispatchToProps = {
    returnError,
    createMessage,
    clearSearchedProcess,
    setSearchedProcess,
    setLoading,
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(DetailSentencesPage));