import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import intl from 'react-intl-universal'
import bgImage from '../../../img/main_page/bg2.jpg'
import ParishesMap from '../../facet_results/mapbox/ParishesMap'
import CountiesMap from '../../facet_results/mapbox/CountiesMap'
import TownlandsMap from '../../facet_results/mapbox/TownlandsMap'
import BaroniesMap from '../../facet_results/mapbox/BaroniesMap'
import ProvincesMap from '../../facet_results/mapbox/ProvincesMap'
import MapComponent from '../../facet_results/mapbox/MapComponent'

const styles = theme => ({
  paper: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    backgroundImage: `url(${bgImage})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover'
  },
  textContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    margin: theme.spacing(3),
    padding: theme.spacing(3),
    [theme.breakpoints.down('lg')]: {
      padding: theme.spacing(1)
    }
  },
  frontPageHeading: {
    [theme.breakpoints.down('lg')]: {
      fontSize: '1.2rem'
    }
  },
  frontPageText: {
    [theme.breakpoints.down('lg')]: {
      fontSize: '1.0rem'
    }
  }

})

const MainClientFS = props => {
  const { classes } = props
  return (
    <MapComponent />
  )
}

MainClientFS.propTypes = {
  classes: PropTypes.object
}

export default withStyles(styles)(MainClientFS)
