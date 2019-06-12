import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from "react-router-dom";
import { withStyles, Typography,Box, Grid, List, ListItem, ListItemText, ListItemIcon, Divider,Chip, createMuiTheme, Button } from '@material-ui/core';
import SentencaDetail from './SentencaDetail.jsx';
import { createMessage, returnError } from '../../actions/message';
import { setLoadingTrue, setLoadingFalse } from '../../actions/loading';
import { setSimilarProcess, setSearchedProcess, loadSimilarProcesses } from '../../actions/similarprocesses';
import { teal, amber, deepOrange, common } from '@material-ui/core/colors';
import { ThemeProvider } from '@material-ui/styles';
import AvailSimilarProcess from './AvailSimilarProcess.jsx';

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
        this.props.setLoadingTrue()
    }

    componentDidMount(){
        const {loadSimilarProcesses, searchedProcess} = this.props
        loadSimilarProcesses(searchedProcess['processo_tj'], false)
    }

    onListClick = e => {
        const { cachedProcesses, setSimilarProcess, loadSimilarProcesses, createMessage } = this.props
        if (cachedProcesses.hasOwnProperty(e.processo_similar_tj) ){
            setSimilarProcess(cachedProcesses[e.processo_similar_tj]);
        } else {
            createMessage({loading: `Por favor aguarde enquanto os dados do processo ${e.processo_similar_tj} estão sendo carregados.`})
            loadSimilarProcesses(e.processo_similar_tj, false)
        }
    }

    render() {
        if(!this.props.isAuthenticated){
            this.props.createMessage({ loginRequired: "Autenticação Necessária" });
            return <Redirect to="/login"/>
        }
        const { classes, searchedProcess, similarProcess, cachedProcesses } = this.props;
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
                    <SentencaDetail isSimilar sentenca={0}/>
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
                            color={(similaridade <= 40 ? 'sim30' : similaridade <= 70 ? 'sim50' : 'sim100')+'.main'} >
                                <Typography variant='h2'>
                                    {similaridade ? `${similaridade}%`:''}
                                </Typography>
                            </Box>
                            </ThemeProvider>
                        </Grid>
                        <Grid item xs>
                            <Box className={classes.gridRow}>
                            <AvailSimilarProcess/>
                            </Box>
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
                                        selected={item.processo_similar_tj === similarProcess.processo_tj} 
                                        disable={cachedProcesses.hasOwnProperty(item.processo_similar_tj).toString()}>
                                        <ListItemText primary={
                                           <Typography 
                                           variant="button">{cachedProcesses.hasOwnProperty(item.processo_similar_tj)?this.props.setLoadingFalse():this.props.setLoadingTrue()}
                                            {item.processo_similar_tj}
                                            { item.processo_similar_tj === similarProcess.processo_tj ? '  •': undefined }
                                            </Typography>
                                        } secondary={item.processo_similar_cnj}/>
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
    setLoadingFalse,
    setLoadingTrue,
    loadSimilarProcesses
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(DetailSentencesPage));