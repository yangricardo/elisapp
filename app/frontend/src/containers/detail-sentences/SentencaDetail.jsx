import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { withStyles, createMuiTheme ,Box, Tooltip, Button, Fab, Grid, Chip, Typography } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { Info, Link as LinkIcon } from '@material-ui/icons';
import {cyan, indigo} from '@material-ui/core/colors/';

const detailProcessTheme = createMuiTheme({
    palette: {
        primary: {
            main: indigo[500],
            contrastText: "#fff",
        },
        secondary: {
            main: cyan[800],
            contrastText: "#fff",
        },
        default : {
            main : "#fff"
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
      maxWidth: 250,
      fontSize: theme.typography.pxToRem(22),
      '& b': {
        fontWeight: theme.typography.fontWeightMedium,
      },
    },
  }))(Tooltip);

const ButtonToolTip = props => {
    return (
        <HtmlTooltip 
            title={<Typography color="inherit">{props.text}</Typography>} 
            placement="bottom"
        >
            <Fab variant="extended" size="small" color={props.bgcolor}>
                <Info/>&nbsp;{props.button}
            </Fab>
        </HtmlTooltip>
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
    const { isSimilar } = props;
    const bgcolor = isSimilar ? "secondary" : "primary"
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
                                <ProcessLabel cod='2014.204.034102-0' />
                            </Grid>
                            <Grid item>
                                <ProcessLabel cod='0034204-50.2014.8.19.0204' cnj/>
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
                                <ButtonToolTip bgcolor={bgcolor} button='Comarca' text='Comarca' />
                            </Grid>
                            <Grid item >
                                <ButtonToolTip bgcolor={bgcolor} button='Serventia' text='Serventia' />
                            </Grid>
                            <Grid item >
                                <ButtonToolTip bgcolor={bgcolor} button='Classe' text='Classe' />
                            </Grid>
                            <Grid item>
                                <ButtonToolTip bgcolor={bgcolor} button='Assunto' text='Assunto' />
                            </Grid>
                        </Grid>
                        </SectionBox>
                    </Grid>
                    <Grid item>
                        <SectionBox bgcolor={bgcolor}>
                        <Grid container direction="row"
                            justify="center"
                            alignItems="center"
                            spacing={1}
                        >
                            <Grid item>
                                <ButtonToolTip bgcolor={bgcolor} button='Juiz' text='Juiz' />
                            </Grid>
                            <Grid item>
                                <ButtonToolTip bgcolor={bgcolor} button='Advogado' text='Advogado' />
                            </Grid>
                            <Grid item >
                                <ButtonToolTip bgcolor={bgcolor} button='Autor' text='Autor' />
                            </Grid>
                            <Grid item >
                                <ButtonToolTip bgcolor={bgcolor} button='Réu' text='Réu' />
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
                                <Fab variant="extended" size="small" color={bgcolor} target="_blank" href={`http://gedweb.tjrj.jus.br/gedcacheweb/default.aspx?gedid=${''}`}>
                                    <LinkIcon/>&nbsp;Inicial
                                </Fab>
                            </Grid>
                            <Grid item >
                                <Fab variant="extended" size="small" color={bgcolor} target="_blank" href={`http://gedweb.tjrj.jus.br/gedcacheweb/default.aspx?gedid=${''}`}>
                                    <LinkIcon/>&nbsp;Contestação
                                </Fab>
                            </Grid>
                            <Grid item >
                                <Fab variant="extended" size="small" color={bgcolor} target="_blank" href={`http://www4.tjrj.jus.br/consultaProcessoWebV2/consultaMov.do?v=2&numProcesso=${''}&acessoIP=internet&tipoUsuario=`}>
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
                                        {"XXVI JUIZADO ESPECIAL CÍVEL DA COMARCA DA CAPITAL\nProcesso nº: 0049986-94.2014.8.19.0205\nAutor: ANGELA CHAM\nRéu: TEKA DAN-LOUR ELETRODOMESTICOS LTDA-ME\n\nProjeto de Sentença\n\nDispensado o relatório, nos termos do artigo 38 da Lei 9099/95, passo a decidir."
                                        .split("\n").map((item, key) => {
                                            return <Fragment key={key}>{item}<br/></Fragment>
                                          })}
                                    </Typography>
                                </Box>
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

export default SentencaDetail;