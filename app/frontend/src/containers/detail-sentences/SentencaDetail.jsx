import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { withStyles, Box, Tooltip, Button, Avatar, Grid, Chip, Typography } from '@material-ui/core';
import { Info } from '@material-ui/icons';

const styles = theme => ({
    // paper: {
    //     // marginTop: theme.spacing.unit * 5,
    //     display: 'flex',
    //     flexDirection: 'column',
    //     alignItems: 'center',
    //     borderColor: 'primary',
    //     padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    // },
    input: {
        display: 'none',
    },
});


const BorderBox = props => {
    return (
        <Box borderColor="primary.main"
            borderLeft={2}
            borderRight={2}
            borderTop={2}
            borderBottom={0}
            bgcolor="primary.main"
            boxShadow={0.5}
            borderRadius={5}
        >
            {props.children}
        </Box>
    );
}

const BottomBorderBox = props => {
    return (
        <Box borderColor="primary.main"
            bgcolor={props.bgcolor ? props.bgcolor : "primary.main"}
            borderRadius={10}
            borderBottom={5}
            pb={1}
            pt={1}
            pl={1}
            pr={1}
        >
            {props.children}
        </Box>
    );
}

const ContentBox = props => {
    return (
        <Box>
            {props.children}
        </Box>
    );
}

const HtmlTooltip = withStyles(theme => ({
    tooltip: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 250,
      fontSize: theme.typography.pxToRem(18),
      border: '2px solid #3F51B5',
      '& b': {
        fontWeight: theme.typography.fontWeightRegular,
      },
    },
  }))(Tooltip);

const ToolTipContent = props => {
    return (
        <Fragment>
            <Typography color="inherit">{props.text}</Typography>
        </Fragment>
    )
};



const ButtonToolTip = props => {
    return (
        <Fragment>
            <HtmlTooltip title={<ToolTipContent text={props.text} />} placement="bottom">
                <Chip color="primary" label={props.button} icon={<Info />} />
            </HtmlTooltip>
        </Fragment>
    )
}

const ProcessButton = props => {
    return (
        <Fragment>
            <Chip color="primary" 
                label={
                () => {
                    <Typography>
                        <strong>Código {props.isCNJ ? 'CNJ' : 'TJ'}:</strong>
                        {props.processCode}}
                    </Typography>
                }
            }/>
        </Fragment>
    );
}

const SentencaDetail = props => {
    const { classes } = props;
    return (
        <Fragment>
            <BorderBox>
                <Grid container direction="column" spacing={0}>
                    <Grid item>
                        <BottomBorderBox bgcolor="background.paper">

                        <Grid container direction="row"
                            justify="center"
                            alignItems="center"
                            spacing={6}
                        >
                            <Grid item>
                                {/* <ProcessButton processCode='2016.204.039133-6'/> */}
                            </Grid>
                            <Grid item>
                                <Chip color="primary" label='Código CNJ: 0039914-80.2016.8.19.0204' />
                            </Grid>
                        </Grid>
                        </BottomBorderBox>
                    </Grid>
                    <Grid item>
                        <BottomBorderBox>
                        <Grid container direction="row"
                            justify="center"
                            alignItems="center"
                            spacing={3}
                        >
                            <Grid item>
                                <ButtonToolTip button='Comarca' text='Comarca' />
                            </Grid>
                            <Grid item >
                                <ButtonToolTip button='Serventia' text='Serventia' />
                            </Grid>
                            <Grid item >
                                <ButtonToolTip button='Classe' text='Classe' />
                            </Grid>
                            <Grid item>
                                <ButtonToolTip button='Assunto' text='Assunto' />
                            </Grid>
                        </Grid>
                        </BottomBorderBox>
                    </Grid>
                    <Grid item>
                        <BottomBorderBox>
                        <Grid container direction="row"
                            justify="center"
                            alignItems="center"
                            spacing={3}
                        >
                            <Grid item>
                                <ButtonToolTip button='Juiz' text='Juiz' />
                            </Grid>
                            <Grid item>
                                <ButtonToolTip button='Advogado' text='Advogado' />
                            </Grid>
                            <Grid item >
                                <ButtonToolTip button='Autor' text='Autor' />
                            </Grid>
                            <Grid item >
                                <ButtonToolTip button='Réu' text='Réu' />
                            </Grid>
                        </Grid>
                        </BottomBorderBox>
                    </Grid>
                    <Grid item>
                        <BottomBorderBox>
                        <Grid container direction="row"
                            justify="center"
                            alignItems="center"
                            spacing={4}
                        >
                            <Grid item>
                                <ButtonToolTip button='Inicial' text='Inicial' />
                            </Grid>
                            <Grid item >
                                <ButtonToolTip button='Contestação' text='Contestação' />
                            </Grid>
                            <Grid item >
                                <ButtonToolTip button='Movimentos' text='Movimentos' />
                            </Grid>
                        </Grid>
                        </BottomBorderBox>
                    </Grid>
                    <Grid item>
                        <BottomBorderBox>
                        <Grid container direction="row"
                            justify="center"
                            alignItems="center"
                            spacing={0}
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
                        </BottomBorderBox>
                    </Grid>
                </Grid>
            </BorderBox>
        </Fragment>
    );
}

SentencaDetail.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SentencaDetail);