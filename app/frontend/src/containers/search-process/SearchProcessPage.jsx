import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios';
import PropTypes from 'prop-types'
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux'
import { withStyles, CssBaseline, Box, List, Typography, Divider,ListItem, ListItemText, TextField, Grid, Button } from '@material-ui/core';
import { createMessage, returnError } from '../../actions/message';
import { setSimilarProcessResults, clearSearchedProcess, loadSimilarProcesses, cachedProcesses ,
    setSearchedProcess,
    setSimilarProcess,} from '../../actions/similarprocesses';
import { setLoadingTrue, setLoadingFalse } from '../../actions/loading';
import MaskedInput from 'react-text-mask';
import { buildTokenHeader } from '../../actions/auth';
import {cyan} from '@material-ui/core/colors/';

const styles = theme => ({
    main: {
        width: 'auto',
        display: 'flex', // Fix IE 11 issue.
    },
    paper: {
        marginLeft: theme.spacing(-10),
        marginTop: theme.spacing(20),
        display: 'flex',
        alignContent: 'center',
        alignItems: 'center',
        borderColor: 'primary',
        width: 600,
        padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    button: {       
        marginTop: theme.spacing(2.5),
    },
    formControl: {
        margin: theme.spacing(1),
    },
})

const TextMaskCustom = props => {
    const { inputRef, ...other } = props;
    
    return (
    <MaskedInput
        {...other}
        ref={ref => {
        inputRef(ref ? ref.inputElement : null);
        }}
        mask={[
            /\d/,/\d/,/\d/,/\d/,'.',/\d/,/\d/,/\d/,'.',/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,'-',/\d/,/[A-Za-z]?/
        ]}
        placeholderChar={'\u2000'}
        keepCharPositions={false}
    />
    );
}
  
TextMaskCustom.propTypes = {
inputRef: PropTypes.func.isRequired,
};

class SearchProcessPage extends Component {
    constructor (props) {
        super(props);
        this.props.clearSearchedProcess();
        this.state = {
            processo : "",
            found : false,
            searched : false,
            canSearch : false,
        };
    }

    componentDidMount(){
        axios.get(`/api/models/processossimilaresreport/?random=15`, buildTokenHeader(this.props.token))
            .then(res => {
                const found = res.data.results !== undefined
                if (found) {
                    this.setState({
                        sugestions : res.data.results
                    })
                } 
            })
            .catch(err => {
                setLoadingFalse();
                returnError(err.response.data, err.response.status);
            });
    }

    onChange = e => {
        const reTJ = new RegExp('\\d{4}\\.\\d{3}\\.\\d{6}-\\d(\\s|\\w)?');
        this.setState({
            [e.target.name]: e.target.name === 'processo' ? e.target.value.replace("(\s+\.?-?)",'') : e.target.value,
            canSearch : reTJ.test(e.target.value)
            ,searched : false,  found: false
        })
    }

    onListClick = e => {
        this.setState({processo:e.processo_base_tj, canSearch : true})
    }

    onClick = e => {
        e.preventDefault();
        const {token, cachedProcesses, setSimilarProcessResults,loadSimilarProcesses,
            setSearchedProcess, setSimilarProcess,clearSearchedProcess,setLoadingFalse,
            setLoadingTrue,createMessage,returnError} = this.props
        const { processo } = this.state;
        setLoadingTrue();
        this.setState({searched:true})
        if (cachedProcesses.hasOwnProperty(processo.trim())){
            const searchedProcess = cachedProcesses[processo.trim()]
            if (cachedProcesses.hasOwnProperty(searchedProcess.processos_similares[0].processo_similar_tj)){
                const similarProcess = cachedProcesses[searchedProcess.processos_similares[0].processo_similar_tj]
                setSearchedProcess(searchedProcess);
                setSimilarProcess(similarProcess);
                this.setState({found:true,  canSearch:false})
            }
        } else {
            axios.get(`/api/models/processossimilaresreport/?processo_tj=${processo.trim()}`, buildTokenHeader(token))
            .then(res => {
                const found = res.data.results !== undefined
                if (found) {
                    const {results} = res.data
                    setSimilarProcessResults(results);
                    loadSimilarProcesses(results[0]['processo_base_tj'], true)
                    this.setState({
                        found, 
                        canSearch:false
                    })
                } else {
                    clearSearchedProcess();
                    createMessage({ notFound: "Código de Processo Não Disponível" });
                    this.setState({found,canSearch:true})
                    setLoadingFalse();
                }
            })
            .catch(err => {
                setLoadingFalse();
                this.setState({loading:false, canSearch:true})
                createMessage({ notFound: "Código de Processo Não Disponível" });
                returnError(err.response.data, err.response.status);
            });
        }
    }

    sugestionBox = sugestions =>{
        return (
            sugestions !== undefined ?
            <Box boxShadow={2} borderRadius={10} component={List} dense>
            { sugestions !== undefined ?
                sugestions.map((item,index)=>{
                return (
                <Fragment key={index} >
                    <ListItem button onClick={this.onListClick.bind(this, item)}>
                        <ListItemText primary={
                            <Typography variant="button">{item.processo_base_tj}</Typography>
                        }/>
                    </ListItem>
                    <Divider component="li"  light />
                </Fragment>
                )})
                : undefined
            }
            </Box> : undefined
        )
    }

    render() {
        const {loading, sugestions ,found, canSearch } = this.state
        const {isAuthenticated, createMessage, classes} = this.props
        if(!isAuthenticated){
            createMessage({ loginRequired: "Autenticação necessária" });
            return <Redirect to="/login"/>
        }
        if (found && !canSearch && this.props.searchedProcess.hasOwnProperty('processo_tj') && this.props.similarProcess.hasOwnProperty('processo_tj')){
            return <Redirect to='/detalharsentencas'/>
        }

        return (
            <main className={classes.main}>
            <CssBaseline/>
            <Grid container direction="row" justify="center"
                        alignItems="center" alignContent="center" spacing={2}>
                <Grid item xs/>
                <Grid item xs={5} >
                <Grid container direction="column" justify="center"
                        alignItems="center" alignContent="center" spacing={5}>
                    <Grid item xs md/>
                    <Grid item md={10}>
                    <Box borderColor="primary.main"
                        border={2}
                        borderRadius={10}
                        boxShadow={5}
                        className={classes.paper}>
                        <form onSubmit={this.onClick} autoComplete="on">
                            <TextField
                                id="processo"
                                name="processo"
                                label="Processo"
                                disabled={loading}
                                className={classes.textField}
                                value={this.state.processo}
                                onChange={this.onChange}
                                margin="normal"
                                variant="outlined"
                                InputProps={{
                                    inputComponent: TextMaskCustom,
                                }}
                                >
                            </TextField>
                            <Button size='large' type="button" disabled={!canSearch} color="primary" 
                                className={classes.button} onClick={this.onClick} variant="contained" 
                                >
                                    Consultar Processo 
                            </Button>
                        </form>
                    </Box>
                    </Grid>
                    <Grid item>
                        <Box mt={2} maxWidth={600}>
                            { 
                                sugestions !== undefined ?
                                <Fragment>
                                <Typography variant='overline'>Sugestões de Processos</Typography>
                                <Grid container
                                    spacing={2}
                                >
                                    <Grid item>{this.sugestionBox(sugestions.slice(0,5))}</Grid>
                                    <Grid item>{this.sugestionBox(sugestions.slice(5,10))}</Grid>
                                    <Grid item>{this.sugestionBox(sugestions.slice(10,15))}</Grid>
                                </Grid>
                                </Fragment>
                                : undefined
                            }
                            </Box>
                        </Grid>
                    <Grid item xs md/>
                </Grid>
                </Grid>
                <Grid item xs/>
            </Grid>
            </main>
        )
    }

}


const mapStateToProps = (state) => ({
    token : state.authReducer.token,
    isAuthenticated: state.authReducer.isAuthenticated,
    searchedProcess : state.similarProcessesReducer.searchedProcess,
    similarProcess : state.similarProcessesReducer.similarProcess,
    cachedProcesses : state.similarProcessesReducer.cachedProcesses,
})

const mapDispatchToProps = {
    returnError,
    createMessage,
    clearSearchedProcess,
    loadSimilarProcesses,
    setLoadingFalse,
    setLoadingTrue,
    setSimilarProcessResults,
    setSearchedProcess,
    setSimilarProcess,
}


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(SearchProcessPage)));