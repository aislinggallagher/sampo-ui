import React, { lazy, useRef, useEffect, useState } from 'react'
import { getSpacing } from '../../helpers/helpers'

const FederatedSearchPerspective = props => {
  const {
    portalConfig, layoutConfig, perspective,
    screenSize, rootUrl, apexChartsConfig, networkConfig,
    leafletConfig
  } = props
  const perspectiveID = perspective.id

  const MainClientFS = lazy(() => import(`../../components/perspectives/${portalConfig.portalID}/MainClientFS`))

  return (
    <MainClientFS />
  )
}

export default FederatedSearchPerspective
