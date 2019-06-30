import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles, Typography, TextField, Grid, Table, Box, Button, TableHead, TableCell, TableBody, TableRow, Checkbox, Paper, TablePagination } from '@material-ui/core';
import Slider from '@material-ui/lab/Slider';
import { createMessage } from '../../actions/message';
import { getClassesAssuntos, getComarcasServentias, getAno, getAdvogados, getJuizes, getPersonagens,listSimilarProcesses} from '../../actions/similarprocesses';
import { FilterSelect } from '../../components/SelectComponents';
import { ThemeProvider } from '@material-ui/styles';

const styles = theme => ({
    root: {
        paddingLeft: theme.spacing(1),
        zIndex:1
    }
})


class ListProcessPage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            comarcas : [],
            comarcaSelected : { label:"Sem filtro", value: ""},
            serventias : [],
            serventiaSelected : { label:"Sem filtro", value: ""},
            anos : [],
            anoSelected : { label:"Sem filtro", value: ""},
            classes : [],
            classeSelected : { label:"Sem filtro", value: ""},
            assuntos : [],
            assuntoSelected : { label:"Sem filtro", value: ""},
            advogados : [],
            advogadoSelected : { label:"Sem filtro", value: ""},
            personagens : [],
            personagemSelected : { label:"Sem filtro", value: ""},
            juizes : [],
            juizSelected : { label:"Sem filtro", value: ""},
            similaridade : [90,100],
            page:1,
        }
    }

    componentDidMount() {
        this.props.getComarcasServentias({})
        this.props.getClassesAssuntos({})
        this.props.getAno({})
        this.props.getAdvogados({})
        this.props.getPersonagens({})
        this.props.getJuizes({})
    }

    onComarcaChange = (newValue,actionMeta) => {
        console.log(newValue, actionMeta)
        if(actionMeta.action !== 'menu-close') {
            if(actionMeta.action === 'select-option' || actionMeta.action === 'input-change' ){
                this.setState({comarcaSelected: newValue})
                this.props.getComarcasServentias({
                    comarca: newValue !== "Sem filtro" ? newValue : "",
                    serventia: this.state.serventiaSelected
                })
            } else if(actionMeta.action !== 'input-blur'){
                this.setState({comarcaSelected:''})
            }
        }
    }

    onServentiaChange = (newValue,actionMeta) => {
        if(actionMeta.action !== 'menu-close') {
            if(actionMeta.action === 'select-option' || actionMeta.action === 'input-change' ){
                this.setState({serventiaSelected:newValue})
                this.props.getComarcasServentias({
                    comarca: this.state.comarcaSelected,
                    serventia: newValue !== "Sem filtro" ? newValue : ""
                })
            } else if(actionMeta.action !== 'input-blur'){
                this.setState({serventiaSelected:''})
            }
        }
    }

    onClasseChange = (newValue,actionMeta) => {
        console.log(newValue, actionMeta)
        if(actionMeta.action !== 'menu-close') {
            if(actionMeta.action === 'select-option' || actionMeta.action === 'input-change' ){
                this.setState({classeSelected: newValue})
                this.props.getClassesAssuntos({
                    classe: newValue !== "Sem filtro" ? newValue : "" ,
                    assunto: this.state.assuntoSelected
                })
            } else if(actionMeta.action !== 'input-blur'){
                this.setState({classeSelected:''})
            }
        }
    }

    onAssuntoChange = (newValue,actionMeta) => {
        if(actionMeta.action !== 'menu-close') {
            if(actionMeta.action === 'select-option' || actionMeta.action === 'input-change' ){
                this.setState({assuntoSelected:newValue})
                this.props.getClassesAssuntos({
                    classe: this.state.classeSelected,
                    assunto: newValue !== "Sem filtro" ? newValue : ""
                })
            } else if(actionMeta.action !== 'input-blur'){
                this.setState({assuntoSelected:''})
            }
        }
    }

    onAnoChange = (newValue,actionMeta) => {
        if(actionMeta.action !== 'menu-close') {
            if(actionMeta.action === 'select-option' || actionMeta.action === 'input-change' ){
                this.setState({anoSelected:newValue})
                this.props.getAno({
                    ano: newValue !== "Sem filtro" ? newValue : "",
                })
            } else if(actionMeta.action !== 'input-blur'){
                this.setState({anoSelected:''})
            }
        }
    }
    
    onAdvogadoChange = (newValue,actionMeta) => {
        if(actionMeta.action !== 'menu-close') {
            if(actionMeta.action === 'select-option' || actionMeta.action === 'input-change' ){
                this.setState({advogadoSelected:newValue})
                this.props.getAdvogados({
                    advogado: newValue !== "Sem filtro" ? newValue : "",
                })
            } else if(actionMeta.action !== 'input-blur'){
                this.setState({advogadoSelected:''})
            }
        }
    }
    
    onPersonagemChange = (newValue,actionMeta) => {
        if(actionMeta.action !== 'menu-close') {
            if(actionMeta.action === 'select-option' || actionMeta.action === 'input-change' ){
                this.setState({personagemSelected:newValue})
                this.props.getPersonagens({
                    personagem: newValue !== "Sem filtro" ? newValue : "",
                })
            } else if(actionMeta.action !== 'input-blur'){
                this.setState({personagemSelected:''})
            }
        }
    }
    
    onJuizChange = (newValue,actionMeta) => {
        if(actionMeta.action !== 'menu-close') {
            if(actionMeta.action === 'select-option' || actionMeta.action === 'input-change' ){
                this.setState({juizSelected:newValue})
                this.props.getJuizes({
                    juiz: newValue !== "Sem filtro" ? newValue : "",
                })
            } else if(actionMeta.action !== 'input-blur'){
                this.setState({juizSelected:''})
            }
        }
    }

    onListSimilarClick = e => {
        this.setState({page:1})
        this.props.listSimilarProcesses({
            page: 1,
            comarca : this.state.comarcaSelected,
            serventia: this.state.serventiaSelected,
            classe: this.state.classeSelected,
            ano: this.state.anoSelected,
            assunto: this.state.assuntoSelected,
            juiz : this.state.juizSelected,
            advogado : this.state.advogadoSelected,
            personagem : this.state.personagemSelected,
            similaridade : this.state.similaridade,
        })
    }

    static getDerivedStateFromProps(props, state) {
        const getComarcas = comarcas => {
            return comarcas !== undefined ?
                [{label:'Sem filtro',value:''}].concat(
                    comarcas.map((comarca)=>{
                    return { label:comarca, value:comarca}
                })): []
        }
    
        const getServentias = serventias => {
            return serventias !== undefined ?
                [{label:'Sem filtro',value:''}].concat(
                    serventias.map((serventia)=>{
                    return { label:serventia, value:serventia}
                })): []
        }

        const getAnos = anos => {
            return anos !== undefined ?
            [{label:'Sem filtro',value:''}].concat(
                anos.map((ano)=>{
                    return { label:ano, value:ano}
            })): []
        }

        const getClasses = classes => {
            return classes !== undefined ?
                [{label:'Sem filtro',value:''}].concat(
                    classes.map((classe)=>{
                        return { label:classe, value:classe}
                })): []
        }
    
        const getAssuntos = assuntos => {
            return assuntos !== undefined ?
                [{label:'Sem filtro',value:''}].concat(
                    assuntos.map((assunto)=>{
                    return { label:assunto, value:assunto}
                })): []
        }

        const getAdvogados = advogados => {
            return advogados !== undefined ?
                [{label:'Sem filtro',value:''}].concat(
                    advogados.map((advogado)=>{
                    return { label:advogado, value: advogado}
                })): []
        }

        const getPersonagens = personagens => {
            return personagens !== undefined ?
                [{label:'Sem filtro',value:''}].concat(
                    personagens.map((personagem)=>{
                    return { label:personagem, value: personagem}
                })): []
        }

        const getJuizes = juizes => {
            return juizes !== undefined ?
                [{label:'Sem filtro',value:''}].concat(
                    juizes.map((juiz)=>{
                    return { label:juiz, value: juiz}
                })): []
        }

        const comarcas = getComarcas(props.comarcas)
        const serventias = getServentias(props.serventias)
        const classes = getClasses(props.classesDisponiveis)
        const assuntos = getAssuntos(props.assuntos)
        const anos = getAnos(props.anos)
        const advogados = getAdvogados(props.advogados)
        const personagens = getPersonagens(props.personagens)
        const juizes = getJuizes(props.juizes)
        if (
            comarcas !== state.comarcas || 
            serventias !== state.comarcas ||
            anos !== state.anos ||
            classes !== state.classes ||
            assuntos !== state.assuntos ||
            advogados !== state.advogados ||
            personagens !== state.personagens ||
            juizes !== state.juizes 
        ) {
            return {
                comarcas,
                serventias,
                anos,
                classes,
                assuntos,
                advogados,
                personagens,
                juizes
            }
        }     
        return null
    }

    render() {
        if(!this.props.isAuthenticated){
            this.props.createMessage({ loginRequired: "Login Required" });
            return <Redirect to="/login"/>
        }

        const {listSimilar} = this.props

        return (
            
            <Grid container direction="row" 
            justify="flex-start"
            alignItems="stretch" 
            spacing={2}
            >
                <Grid item md={4}>
                <Paper component={Box} p={1.2} borderColor="primary.main" border={2} 
                        borderRadius={10}>
                <Grid container direction="column" 
                    justify="flex-start"
                    alignItems="stretch" 
                    spacing={2}
                    >
                        <Grid item >
                        <FilterSelect
                            label='Comarca'
                            options={this.state.comarcas}
                            value={this.state.comarcaSelected}
                            onChange={this.onComarcaChange}
                            onInputChange={this.onComarcaChange}
                            htmlFor='select-comarca'
                        />
                        </Grid>
                        <Grid item >
                        <FilterSelect
                            label='Serventia'
                            options={this.state.serventias}
                            value={this.state.serventiaSelected}
                            onChange={this.onServentiaChange}
                            onInputChange={this.onServentiaChange}
                            htmlFor='select-serventias'
                        />
                        </Grid>
                        <Grid item >
                        <FilterSelect
                            label='Ano'
                            options={this.state.anos}
                            value={this.state.anoSelected}
                            onChange={this.onAnoChange}
                            onInputChange={this.onAnoChange}
                            htmlFor='select-anos'
                        />
                        </Grid>
                        <Grid item >
                        <FilterSelect
                            label='Classe'
                            options={this.state.classes}
                            value={this.state.classeSelected}
                            onChange={this.onClasseChange}
                            onInputChange={this.onClasseChange}
                            htmlFor='select-classes'
                        />
                        </Grid>
                        <Grid item >
                        <FilterSelect
                            label='Assunto'
                            options={this.state.assuntos}
                            value={this.state.assuntoSelected}
                            onChange={this.onAssuntoChange}
                            onInputChange={this.onAssuntoChange}
                            htmlFor='select-assuntos'
                        />
                        </Grid>
                        <Grid item >
                        <FilterSelect
                            label='Advogado'
                            options={this.state.advogados}
                            value={this.state.advogadoSelected}
                            onChange={this.onAdvogadoChange}
                            onInputChange={this.onAdvogadoChange}
                            htmlFor='select-advogados'
                        />
                        </Grid>
                        <Grid item >
                        <FilterSelect
                            label='Personagem'
                            options={this.state.personagens}
                            value={this.state.personagemSelected}
                            onChange={this.onPersonagemChange}
                            onInputChange={this.onPersonagemChange}
                            htmlFor='select-personagens'
                        />
                        </Grid>
                        <Grid item >
                        <FilterSelect
                            label='Juiz'
                            options={this.state.juizes}
                            value={this.state.juizSelected}
                            onChange={this.onJuizChange}
                            onInputChange={this.onJuizChange}
                            htmlFor='select-juiz'
                        />
                        </Grid>
                        <Grid item >
                        <Typography variant='caption' id="range-slider" gutterBottom>
                            Intervalo de Similaridade
                        </Typography>
                        <Slider
                            value={this.state.similaridade}
                            onChange={(event,value)=>{this.setState({similaridade:value})}}
                            valueLabelDisplay="auto"
                        />
                        </Grid>
                        <Grid item >
                            <Button variant='contained' color='primary' fullWidth
                                onClick={this.onListSimilarClick}
                            >
                                Listar Processos Similares
                            </Button>
                        </Grid>
                </Grid>
                </Paper>
                </Grid>
                <Grid item md={8}>
                    <Paper component={Box} p={1.2} borderColor="primary.main" border={2} 
                        borderRadius={10}>
                    <Table
                        size={'small'}
                    >
                        <TableHead>
                            <TableCell>
                                <Checkbox
                                    color='primary'
                                />
                            </TableCell>
                            <TableCell>Similaridade</TableCell>
                            <TableCell>Processo Referência</TableCell>
                            <TableCell>Processo Similar</TableCell>
                        </TableHead>
                        <TableBody>
                            {  listSimilar.results !== undefined ? listSimilar.results.map((value, index, self)=>{
                                return (
                                    <TableRow key={`${value.processo_base_tj}-${value.processo_similar_tj}`}>
                                        <TableCell>
                                            <Checkbox
                                                color='primary'
                                            />
                                        </TableCell>
                                        <TableCell>{value.similaridade}</TableCell>
                                        <TableCell>
                                        <Grid container direction='column'>
                                        <Grid item>
                                            <Typography variant='overline'>{value.processo_base_tj}</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant='caption'>{value.processo_base_cnj}</Typography>
                                        </Grid>
                                        </Grid>
                                        </TableCell>
                                        <TableCell>
                                        <Grid container direction='column'>
                                        <Grid item>
                                            <Typography variant='overline'>{value.processo_similar_tj}</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant='caption'>{value.processo_similar_cnj}</Typography>
                                        </Grid>
                                        </Grid>
                                        </TableCell>
                                    </TableRow>
                                )
                            }) : undefined
                        }
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPage={8}
                        rowsPerPageOptions={[8]}
                        labelRowsPerPage='Sentenças por Página'
                        
                    />
                    </Paper>
                </Grid>

            </Grid>
        )
    }

}


const mapStateToProps = (state) => ({
    isAuthenticated: state.authReducer.isAuthenticated,
    comarcas : state.similarProcessesReducer.comarcas,
    serventias : state.similarProcessesReducer.serventias,
    classesDisponiveis : state.similarProcessesReducer.classes,
    assuntos : state.similarProcessesReducer.assuntos,
    advogados : state.similarProcessesReducer.advogados,
    personagens : state.similarProcessesReducer.personagens,
    juizes : state.similarProcessesReducer.juizes,
    anos : state.similarProcessesReducer.anos,
    listSimilar : state.similarProcessesReducer.listSimilar,
})

const mapDispatchToProps = {
    listSimilarProcesses,
    getClassesAssuntos,  
    getComarcasServentias,
    getAno,
    getAdvogados,
    getJuizes, 
    getPersonagens
}


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ListProcessPage));