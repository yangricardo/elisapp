import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";
import { withStyles, Typography,Box, Grid, List, ListItem, ListItemText, ListItemIcon, Divider,Chip, createMuiTheme, Button } from '@material-ui/core';
import SentencaDetail from './SentencaDetail.jsx';
import { createMessage, returnError } from '../../actions/message';
import { setLoading } from '../../actions/loading';
import { setSimilarProcess, setSearchedProcess, loadSimilarProcesses } from '../../actions/similarprocesses';
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
            loading : false,
        }
        this.props.setLoading()
    }

    componentDidMount(){
        const {loadSimilarProcesses, searchedProcess, setLoading} = this.props
        loadSimilarProcesses(searchedProcess['processo_tj'], false)
    }

    onListClick = e => {
        console.log(e)
        const { cachedProcesses, setSimilarProcess, loadSimilarProcesses } = this.props
        if (cachedProcesses.hasOwnProperty(e.processo_similar_tj) ){
            setSimilarProcess(cachedProcesses[e.processo_similar_tj]);
        } else {
            loadSimilarProcesses(e.processo_similar_tj, false)
        }
    }


    render() {
        if(!this.props.isAuthenticated){
            this.props.createMessage({ loginRequired: "Login Required" });
            return <Redirect to="/login"/>
        }
        const { classes, searchedProcess, similarProcess } = this.props;
        if(searchedProcess === {}){
            if (!searchedProcess.hasOwnProperty('id')){
                return <Redirect to="/buscarprocesso"/>
            }
        }
        const { processos_similares } = searchedProcess;
        
        const similaridade = processos_similares.filter( similarData => {
            return similarData.processo_base_tj === searchedProcess.processo_tj &&
                similarData.processo_similar_tj === similarProcess.processo_tj
        } )[0].similaridade || undefined

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
                                    {similaridade ? `${similaridade}%`:''}
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

DetailSentencesPage.propTypes = {
    searchedProcess : PropTypes.object.isRequired,
    similarProcess : PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.authReducer.isAuthenticated,
    token : state.authReducer.token,
    searchedProcess : state.similarProcessesReducer.searchedProcess,
    similarProcess : state.similarProcessesReducer.similarProcess,
    cachedProcesses: state.similarProcessesReducer.cachedProcesses,
})

const mapDispatchToProps = {
    returnError,
    createMessage,
    setSearchedProcess,
    setSimilarProcess,
    setLoading,
    loadSimilarProcesses
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(DetailSentencesPage));