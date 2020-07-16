import React from 'react'
import { Link } from 'gatsby'
import { FormatNumber } from '~components/utils/format'
import statisticStyles from './statistic.module.scss'

const Statistic = ({
  title,
  value,
  suffix,
  children,
  hasCalculatedDrillDowns,
}) => (
  <div className={statisticStyles.statistic}>
    <div className={statisticStyles.title}>{title}</div>
    <div className={statisticStyles.value}>
      <FormatNumber number={value} />
      {suffix}
    </div>
    <div className={statisticStyles.info}>{children}</div>
    {hasCalculatedDrillDowns && (
      <div className={statisticStyles.calculatedLabel}>
        <span>* Calculated values</span>
      </div>
    )}
  </div>
)

const StatisticLink = ({ to, children }) => (
  <Link to={to} className={statisticStyles.link}>
    {children}
  </Link>
)

const DefinitionLink = ({ to }) => (
  <StatisticLink to={to}>Definition</StatisticLink>
)

const StatisticGroup = ({ children }) => (
  <div className={statisticStyles.group}>{children}</div>
)

const DrillDown = ({ label, value, suffix, calculated = false }) => (
  <div className={statisticStyles.drillDown}>
    <span className={statisticStyles.label}>
      {label} {calculated && '*'}
    </span>
    <span className={statisticStyles.value}>
      <FormatNumber number={value} />
      {suffix}
    </span>
  </div>
)

export { DrillDown, Statistic, StatisticGroup, StatisticLink, DefinitionLink }
