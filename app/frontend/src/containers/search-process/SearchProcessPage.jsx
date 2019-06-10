import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios';
import PropTypes from 'prop-types'
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux'
import { withStyles, CssBaseline, Box, TextField, Grid, Button } from '@material-ui/core';
import { createMessage, returnError } from '../../actions/message';
import { setSimilarProcessResults, clearSearchedProcess, loadSimilarProcesses } from '../../actions/similarprocesses';
import { setLoading } from '../../actions/loading';
import MaskedInput from 'react-text-mask';
import { buildTokenHeader } from '../../actions/auth';

const styles = theme => ({
    main: {
        width: 'auto',
        display: 'flex', // Fix IE 11 issue.
    },
    paper: {
        marginLeft: theme.spacing(-2),
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
            loading : false, 
            canSearch : false,
        };
    }

    onChange = e => {
        this._isMounted = true
        const reTJ = new RegExp('\\d{4}\\.\\d{3}\\.\\d{6}-\\d(\\s|\\w)?');
        if(this._isMounted)
            this.setState({
                [e.target.name]: e.target.value,
                canSearch : reTJ.test(e.target.value)
                ,searched : false, loading : false, found: false
            })
    }

    onClick = e => {
        e.preventDefault();
        const {token, setSimilarProcessResults,loadSimilarProcesses,clearSearchedProcess,setLoading,returnError} = this.props
        const { processo } = this.state;
        setLoading();
        this.setState({searched:true, loading:true})
        axios.get(`/api/models/processossimilaresreport/?processo_tj=${processo.trim()}`, buildTokenHeader(token))
        .then(res => {
            const found = res.data.results !== undefined
            if (found) {
                const {results} = res.data
                setSimilarProcessResults(results);
                loadSimilarProcesses(results[0]['processo_base_tj'], true)
            } else {
                clearSearchedProcess();
            }
            this.setState({found, loading:false})
        })
        .catch(err => {
            setLoading();
            console.log(err)
            // returnError(err.response.data, err.response.status);
        });
    }

    // shouldComponentUpdate(nextProps) {
    //     if (this.props.found && !loading && nextProps.searchedProcess !== {} && nextProps.similarProcess !== {}){
    //         return false
    //     }
    //     return true
    // }

    componentDidUpdate(prevProps,prevState) {
        if (prevState.found && !prevState.loading && prevProps.searchedProcess.hasOwnProperty('processo_tj') && prevProps.similarProcess.hasOwnProperty('processo_tj')){
            this.props.history.push('/detalharsentencas')
        }
    }

    componentWillUnmount() {
        this._isMounted = false
    }


    render() {
        const {loading, searched, found, canSearch } = this.state
        const {isAuthenticated, createMessage, classes} = this.props
        if(!isAuthenticated){
            createMessage({ loginRequired: "Autenticação necessária" });
            return <Redirect to="/login"/>
        }
        if (found && !loading && this.props.searchedProcess.hasOwnProperty('processo_tj') && this.props.similarProcess.hasOwnProperty('processo_tj')){
            return <Redirect to='/detalharsentencas'/>
        }
        
        // if (searched && !found & !loading) {
        //     createMessage({ notFound: "Código de Processo Não Disponível" });
        // }

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
                                value={this.state.name}
                                onChange={this.onChange}
                                margin="normal"
                                variant="outlined"
                                InputProps={{
                                    inputComponent: TextMaskCustom,
                                }}
                                >
                            </TextField>
                            <Button size='large' type="button" disabled={!canSearch || loading} color="primary" 
                                className={classes.button} onClick={this.onClick} variant="contained" 
                                >
                                    Consultar Processo 
                            </Button>
                        </form>
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
})

const mapDispatchToProps = {
    returnError,
    createMessage,
    clearSearchedProcess,
    loadSimilarProcesses,
    setLoading,
    setSimilarProcessResults
}


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(SearchProcessPage)));