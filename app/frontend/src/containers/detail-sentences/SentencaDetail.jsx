import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Box, Tooltip, Fab, Grid, Typography, AppBar, Tabs ,Tab } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { Link as LinkIcon } from '@material-ui/icons';
import { detailProcessTheme,BorderBox,SectionBox, ButtonToolTip, ProcessLabel } from './DetailSentenceHelpers';
import { createMessage, returnError } from '../../actions/message';

const SentencaDetail = props => {
    const { isSimilar, searchedProcess, similarProcess } = props;

    const bgcolor = isSimilar ? "secondary" : "primary"
    const indicatorColor = isSimilar ? "primary" : "secondary"
    const process = isSimilar ? similarProcess : searchedProcess
    console.log(process)
    const cod_tj = process.processo_tj
    const cod_cnj = process.processo_cnj
    const assunto = process.assunto
    const classe = process.classe
    const comarca = process.comarca
    const serventia = process.serventia
    const sentencas = process.sentencas
    const personagens = process.personagens
    const advogados = process.advogados
    const documentos = process.documentos
    
    const [sentenca, setSentenca] = React.useState(0);

    function handleChange(event, newValue) {
        setSentenca(newValue);
    }

    const _advogados = advogados
        .map(advogado => {
                return `• ${advogado.oab}: ${advogado.nome} ${advogado.polo == 'A' ? '[Autor]' : advogado.polo == 'P' ? '[Réu]' : ''}`
        }).join('\n')

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
                                <ProcessLabel cod={cod_cnj !== undefined ? cod_cnj : '-'} cnj/>
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
                                <ButtonToolTip bgcolor={bgcolor}  button='Comarca' text={comarca !== undefined ? comarca : undefined} />
                            </Grid>
                            <Grid item >
                                <ButtonToolTip bgcolor={bgcolor}  button='Serventia' text={serventia !== undefined ? serventia : undefined} />
                            </Grid>
                            <Grid item >
                                <ButtonToolTip bgcolor={bgcolor}  button='Classe' text={classe !== undefined ? classe : undefined} />
                            </Grid>
                            <Grid item>
                                <ButtonToolTip bgcolor={bgcolor}  button='Assunto' text={assunto !== undefined ? assunto : undefined} />
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
                                <ButtonToolTip bgcolor={bgcolor}  button='Juiz' text={ sentencas[sentenca].nome_juiz !== undefined ? `${sentencas[sentenca].nome_juiz} - ${sentencas[sentenca].cargo_juiz}` : undefined} />
                            </Grid>
                            <Grid item>
                                <ButtonToolTip bgcolor={bgcolor}  button='Advogado' text={_advogados} />
                            </Grid>
                            <Grid item >
                                <ButtonToolTip bgcolor={bgcolor}  button='Autor' text={autores} />
                            </Grid>
                            <Grid item >
                                <ButtonToolTip bgcolor={bgcolor}  button='Réu' text={reus} />
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
                                <ButtonToolTip bgcolor={bgcolor}  button='Ato' text={sentencas[sentenca].ato_juiz !== undefined ? `${sentencas[sentenca].ato_juiz}` : undefined} />
                            </Grid>
                            <Grid item>
                                <Fab variant="extended" size="small" color={bgcolor} disabled={iniciais[0]===undefined} target="_blank" href={`http://gedweb.tjrj.jus.br/gedcacheweb/default.aspx?gedid=${iniciais[0]}`}>
                                    <LinkIcon/>&nbsp;Inicial
                                </Fab>
                            </Grid>
                            <Grid item >
                                <Fab variant="extended" size="small" color={bgcolor} disabled={contestacoes[0]===undefined} target="_blank" href={`http://gedweb.tjrj.jus.br/gedcacheweb/default.aspx?gedid=${contestacoes[0]}`}>
                                    <LinkIcon/>&nbsp;Contestação
                                </Fab>
                            </Grid>
                            <Grid item >
                                <Fab variant="extended" size="small" color={bgcolor} target="_blank" href={`http://www4.tjrj.jus.br/consultaProcessoWebV2/consultaMov.do?v=2&numProcesso=${cod_tj}&acessoIP=internet&tipoUsuario=`}>
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
                                <Box height={420} p={1.5} bgcolor="#f5f5f9" borderRadius={3} style={{overflow: 'auto', flexGrow:1 }}>
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
    isAuthenticated: state.authReducer.isAuthenticated,
    searchedProcess : state.similarProcessesReducer.searchedProcess,
    similarProcess : state.similarProcessesReducer.similarProcess,
})
const mapDispatchToProps = {
    returnError,
    createMessage,
}


export default connect(mapStateToProps, mapDispatchToProps)(SentencaDetail);