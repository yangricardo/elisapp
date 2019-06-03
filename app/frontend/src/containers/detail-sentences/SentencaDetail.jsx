import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles, createMuiTheme ,Box, Tooltip, Fab, Grid, Typography, AppBar, Tabs ,Tab } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { Info, Link as LinkIcon } from '@material-ui/icons';
import {cyan, indigo, common} from '@material-ui/core/colors/';
import { createMessage, returnError } from '../../actions/message';
import { getProcess, setSearchedProcess } from '../../actions/similarprocesses';

const detailProcessTheme = createMuiTheme({
    palette: {
        primary: {
            main: indigo[500],
            contrastText: common.white,
        },
        secondary: {
            main: cyan[800],
            contrastText: common.white,
        },
        default : {
            main : common.white
        }
    },
});

const processLabelTheme = createMuiTheme({
    palette: {
        primary: {
            main: "#fff",
        },
        secondary: {
            main: "#fff",
        },
        default : {
            main : "#fff"
        }
    },
});
  
const BorderBox = props => {
    return (
        <Box bgcolor={`${props.bgcolor}.main`} borderRadius={10}>
            {props.children}
        </Box>
    );
}

const SectionBox = props => {
    return (
        <Box p={1}>{props.children}</Box>
    );
}


const HtmlTooltip = withStyles(theme => ({
    tooltip: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 450,
      fontSize: theme.typography.pxToRem(22),
      '& b': {
        fontWeight: theme.typography.fontWeightMedium,
      },
    },
  }))(Tooltip);

const ButtonToolTip = props => {
    const disable = props.text.length === 0
    return (
        <div>
            <HtmlTooltip 
                disableFocusListener={disable}
                disableHoverListener={disable}
                disableTouchListener={disable}
                title={
                    <Fragment>
                        {props.text.split("\n").map((item, key) => {
                            return  <Typography color="inherit" key={key}>
                                        {item}<br/>
                                    </Typography>})
                  }</Fragment> 
                }
                placement="bottom"
            >
                <Fab variant="extended" size="small" color={props.bgcolor} disabled={disable}>
                    <Info/>&nbsp;{props.button}
                </Fab>
            </HtmlTooltip>
        </div>
    )
}

const ProcessLabel = props => {
    return (
        <ThemeProvider theme={processLabelTheme}>
            <Grid container direction="column" justify="center" alignItems="center" spacing={0}>
                <Grid item><Typography color="primary" variant="caption">Código {props.cnj?'CNJ':'TJ'}</Typography></Grid>
                <Grid item><Typography color="primary" variant="button">{props.cod}</Typography></Grid>
            </Grid>
        </ThemeProvider>
    );
}

const SentencaDetail = props => {
    const { isSimilar, searchedProcess } = props;

    const bgcolor = isSimilar ? "secondary" : "primary"
    const indicatorColor = isSimilar ? "primary" : "secondary"

    const similaridade = searchedProcess.similaridade
    const cod_tj = isSimilar ? searchedProcess.processo_similar_tj : searchedProcess.processo_base_tj
    const cod_cnj = isSimilar ? searchedProcess.processo_similar_cnj : searchedProcess.processo_base_cnj
    const assunto = isSimilar ? searchedProcess.processo_similar_assunto : searchedProcess.processo_base_assunto
    const classe = isSimilar ? searchedProcess.processo_similar_classe : searchedProcess.processo_base_classe
    const comarca = isSimilar ? searchedProcess.processo_similar_comarca : searchedProcess.processo_base_comarca
    const serventia = isSimilar ? searchedProcess.processo_similar_serventia : searchedProcess.processo_base_serventia
    const sentencas = isSimilar ? searchedProcess.sentencas_similar: searchedProcess.sentencas_base
    const personagens = isSimilar ? searchedProcess.personagens_similar : searchedProcess.personagens_base
    const advogados = isSimilar ? searchedProcess.advogados_similar : searchedProcess.advogados_base
    const documentos = isSimilar ? searchedProcess.documentos_similar : searchedProcess.documentos_base
    const estatistica = isSimilar ? searchedProcess.estatistica_similar : searchedProcess.estatistica_base
    
    const [sentenca, setSentenca] = React.useState(0);

    function handleChange(event, newValue) {
        setSentenca(newValue);
    }

    const _advogados = advogados
        .map(advogado => {
                return `• ${advogado.nome} - ${advogado.oab}`
        })
        .concat(
            personagens
                .filter(personagem => {return personagem.participacao === 'T';})
                .map(personagem => { return `• ${personagem.nome_personagem}` })
            )
        .join('\n')

    const reus = personagens
            .filter(personagem => {return personagem.participacao === 'P';})
            .map(personagem => { return `• ${personagem.nome_personagem}` }).join('\n')

    const autores = personagens
            .filter(personagem => {return personagem.participacao === 'A';})
            .map(personagem => { return `• ${personagem.nome_personagem}` }).join('\n')

    const iniciais = documentos
            .filter(documento => {return documento.id_tipo_documento === '14'})
            .map(documento => {return documento.cod_documento})

    const contestacoes = documentos
            .filter(documento => {return documento.id_tipo_documento === '74'})
            .map(documento => {return documento.cod_documento})

    return (
        <ThemeProvider theme={detailProcessTheme}>
            <BorderBox bgcolor={bgcolor}>
                <Grid container direction="column" spacing={0}>
                    <Grid item>
                        <SectionBox bgcolor={bgcolor}>
                        <Grid container direction="row"
                            justify="center"
                            alignItems="center"
                            spacing={2}
                        >
                            <Grid item>
                                <ProcessLabel cod={cod_tj} />
                            </Grid>
                            <Grid item>
                                <ProcessLabel cod={cod_cnj} cnj/>
                            </Grid>
                        </Grid>
                        </SectionBox>
                    </Grid>
                    <Grid item>
                        <SectionBox bgcolor={bgcolor}>
                        <Grid container direction="row"
                            justify="center"
                            alignItems="center"
                            spacing={2}
                        >
                            <Grid item>
                                <ButtonToolTip bgcolor={bgcolor} button='Comarca' text={comarca} />
                            </Grid>
                            <Grid item >
                                <ButtonToolTip bgcolor={bgcolor} button='Serventia' text={serventia} />
                            </Grid>
                            <Grid item >
                                <ButtonToolTip bgcolor={bgcolor} button='Classe' text={classe} />
                            </Grid>
                            <Grid item>
                                <ButtonToolTip bgcolor={bgcolor} button='Assunto' text={assunto} />
                            </Grid>
                        </Grid>
                        </SectionBox>
                    </Grid>
                    <Grid item>
                        <SectionBox bgcolor={bgcolor}>
                        <Grid container direction="row"
                            justify="center"
                            alignItems="center"
                            spacing={2}
                        >
                            <Grid item>
                                <ButtonToolTip bgcolor={bgcolor} button='Juiz' text={`${sentencas[sentenca].nome_juiz} - ${sentencas[sentenca].cargo_juiz}`} />
                            </Grid>
                            <Grid item>
                                <ButtonToolTip bgcolor={bgcolor} button='Advogado' text={_advogados} />
                            </Grid>
                            <Grid item >
                                <ButtonToolTip bgcolor={bgcolor} button='Autor' text={autores} />
                            </Grid>
                            <Grid item >
                                <ButtonToolTip bgcolor={bgcolor} button='Réu' text={reus} />
                            </Grid>
                        </Grid>
                        </SectionBox>
                    </Grid>
                    <Grid item>
                        <SectionBox bgcolor={bgcolor}>
                        <Grid container direction="row"
                            justify="center"
                            alignItems="center"
                            spacing={2}
                        >
                            <Grid item>
                                <ButtonToolTip bgcolor={bgcolor} button='Ato' text={`${sentencas[sentenca].ato_juiz}`} />
                            </Grid>
                            <Grid item>
                                <Fab variant="extended" size="small" color={bgcolor} target="_blank" href={`http://gedweb.tjrj.jus.br/gedcacheweb/default.aspx?gedid=${iniciais[0]}`}>
                                    <LinkIcon/>&nbsp;Inicial
                                </Fab>
                            </Grid>
                            <Grid item >
                                <Fab variant="extended" size="small" color={bgcolor} target="_blank" href={`http://gedweb.tjrj.jus.br/gedcacheweb/default.aspx?gedid=${contestacoes[0]}`}>
                                    <LinkIcon/>&nbsp;Contestação
                                </Fab>
                            </Grid>
                            <Grid item >
                                <Fab variant="extended" size="small" color={bgcolor} target="_blank" href={`http://www4.tjrj.jus.br/consultaProcessoWebV2/consultaMov.do?v=2&numProcesso=${cod_cnj}&acessoIP=internet&tipoUsuario=`}>
                                    <LinkIcon/>&nbsp;Movimentos
                                </Fab>
                            </Grid>
                        </Grid>
                        </SectionBox>
                    </Grid>
                    <Grid item>
                        <SectionBox bgcolor={bgcolor}>
                        <Grid container direction="row"
                            justify="center"
                            alignItems="center"
                        >
                            <Grid item>
                                <Box height={420} p={1.5} bgcolor="#f5f5f9" borderRadius={3} style={{overflow: 'auto'}}>
                                    <Typography variant='body1' wrap="nowrap">
                                        {sentencas[sentenca].texto_sentenca.split("\n").map((item, key) => {
                                                return <Fragment key={key}>{item}<br/></Fragment>
                                          })
                                        }
                                    </Typography>
                                </Box>
                                <AppBar position="static" color={bgcolor}>
                                <Tabs
                                    value={sentenca}
                                    onChange={handleChange}
                                    indicatorColor={indicatorColor}
                                    scrollButtons="auto"
                                    centered
                                    >
                                    {sentencas.map((sentenca, index)=><Tab key={index+1} label={index+1}  />)}
                                </Tabs>

                                </AppBar>
                            </Grid>
                        </Grid>
                        </SectionBox>
                    </Grid>
                </Grid>
            </BorderBox>
        </ThemeProvider>
    );
}

SentencaDetail.propTypes = {
};


const mapStateToProps = (state) => ({
    token : state.authReducer.token,
    searchedProcess : state.similarProcessesReducer.searchedProcess,
})

const mapDispatchToProps = {
    getProcess,
    returnError,
    createMessage,
    setSearchedProcess,
}


export default connect(mapStateToProps, mapDispatchToProps)(SentencaDetail);