import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import MaterialTable from 'material-table'
import { useTheme } from '@material-ui/core/styles';
import {addSimilarProcessesToGroup,openGroupDialog,setSearchedProcess,setSimilarProcess, loadSimilarProcessFromList} from '../../actions/similarprocesses';
import CreatableSelect from 'react-select/creatable';
import { dialogComponents, useStyles } from '../../components/SelectComponents';
import NewSimilarGroup from '../detail-sentences/NewSimilarGroup';
import { Redirect } from "react-router-dom";

class ProcessTable extends Component {
    static propTypes = {
        // listSimilar : PropTypes.array.isRequired,
    }

    constructor(props) {
        super(props)
        this.state = {
            codigo : 'TJ',
            similarProcesses:[],
            selectedGroups:[],
            selectedRow:{},
            redirect:false
        }
    }

    onOpenGroupProcessesDialog(data) {
        this.setState({
            similarProcesses : data
        })
        this.props.openGroupDialog()
    }

    onRowClick(rowData){
        this.props.loadSimilarProcessFromList(rowData)
        this.setState({redirect:true,selectedRow:rowData})
    }

    render() {
        const {selectedRow} = this.state
        const {processo_base_tj,processo_similar_tj} = selectedRow
        const {searchedProcess, similarProcess } = this.props
        if(searchedProcess.hasOwnProperty('processo_tj')
            && similarProcess.hasOwnProperty('processo_tj') 
            && searchedProcess.processo_tj===processo_base_tj 
            && similarProcess.processo_tj===processo_similar_tj
            && this.state.redirect){
                this.setState({redirect:false})
                return <Redirect to='/detalharsentencas'/>
        }
        return (
            <Fragment>
                <NewSimilarGroup similarProcesses={this.state.similarProcesses}  hideButton/>
                <MaterialTable
                    style={{zIndex:10}}
                    title="Processos Similares"
                    columns={[
                        {title: 'Processo Referência', field:this.state.codigo==='TJ'?'processo_base_tj':'processo_base_cnj'},
                        // {title: 'Processo Referência', field:'processo_base_cnj'},
                        {title: 'Processo Similar', field:this.state.codigo==='TJ'?'processo_similar_tj':'processo_similar_cnj'},
                        // {title: 'Processo Similar', field:'processo_similar_cnj'},
                        {title: 'Similaridade', field:'similaridade', type: 'numeric'},
                    ]}
                    options={{
                        selection: true,
                        grouping:true,
                        pageSizeOptions:[9],
                        pageSize:9,
                        initialPage:1
                    }}
                    data={this.props.listSimilar.results}
                    localization={{
                        pagination: {
                            labelDisplayedRows: '{from}-{to} de {count}'
                        },
                        toolbar: {
                            nRowsSelected: '{0} itens selecionados',
                            searchTooltip: 'Buscar',
                            searchPlaceholder: 'Buscar'
                        },
                        header: {
                            actions: 'Ações'
                        },
                        body: {
                            emptyDataSourceMessage: 'Não há registros correspondentes aos parâmetros indicados',
                            filterRow: {
                                filterTooltip: 'Filtrar'
                            }
                        },
                        grouping : {
                            placeholder: 'Arraste aqui para agrupar por Processo Referência ou Processo Similar'
                        }
                    }}
                    actions={[
                        {
                            icon: 'find_replace',
                            tooltip: `Visualizar Código do ${this.state.codigo==='TJ'?'CNJ':'TJ'}`,
                            isFreeAction: true,
                            onClick: (event) => this.setState({codigo:this.state.codigo==='TJ'?'CNJ':'TJ'})
                        },
                        {
                            icon: 'group_work',
                            tooltip: `Agrupar processos selecionados`,
                            onClick: (event,data) => this.onOpenGroupProcessesDialog(data)
                        },
                    ]}
                    onRowClick={(
                        (event,rowData)=>this.onRowClick(rowData)
                    )}
                />
            </Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    token : state.authReducer.token,
    similarGroups : state.similarProcessesReducer.similarGroups,
    cachedProcesses : state.similarProcessesReducer.cachedProcesses,
    searchedProcess : state.similarProcessesReducer.searchedProcess,
    similarProcess : state.similarProcessesReducer.similarProcess,
})

const mapDispatchToProps = {
    addSimilarProcessesToGroup,
    openGroupDialog,
    setSimilarProcess,
    setSearchedProcess,
    loadSimilarProcessFromList
}

export default connect(mapStateToProps, mapDispatchToProps)(ProcessTable)
