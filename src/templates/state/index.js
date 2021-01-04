import React from 'react'
import { graphql } from 'gatsby'
import Layout from '~components/layout'
import StateNavWrapper from '~components/pages/data/state-nav-wrapper'
import StatePreamble from '~components/pages/state/preamble'
import SummaryCharts from '~components/pages/data/summary-charts'
import StateSummary from '~components/pages/data/summary'
import StateNotes from '~components/pages/state/state-notes'
import StateTweets from '~components/pages/state/state-tweets'

const getRaceData = data => {
  if (data.allCovidRaceDataCombined.nodes.length > 0) {
    return data.allCovidRaceDataCombined.nodes[0]
  }
  if (data.allCovidRaceDataSeparate.nodes.length > 0) {
    return data.allCovidRaceDataSeparate.nodes[0]
  }
  return data.allCovidRaceDataSeparate.nodes[0]
}

const StateTemplate = ({ pageContext, data, path }) => {
  const state = pageContext
  const {
    covidState,
    allCovidStateDaily,
    allCovidStateInfo,
    covidStateInfo,
    allCovidUsDaily,
    allContentfulChartAnnotation,
    sevenDaysAgo,
    contentfulStateOrTerritory,
    allTweets,
    allCovidAnnotation,
    allHhsHospitalizationCovid,
    urls,
  } = data
  return (
    <Layout
      title={state.name}
      returnLinks={[{ link: '/data' }]}
      path={path}
      showWarning
    >
      <StatePreamble state={state} urls={urls} covidState={covidState} />
      <SummaryCharts
        name={state.name}
        chartTables={`/data/state/${state.childSlug.slug}/chart-tables`}
        history={allCovidStateDaily.nodes}
        usHistory={allCovidUsDaily.nodes}
        annotations={allContentfulChartAnnotation}
        testSource={
          covidStateInfo.covidTrackingProjectPreferredTotalTestField ===
          'posNeg'
            ? 'totalTestResults'
            : covidStateInfo.covidTrackingProjectPreferredTotalTestField
        }
        testUnits={covidStateInfo.covidTrackingProjectPreferredTotalTestUnits}
      />
      <StateNavWrapper stateList={allCovidStateInfo.nodes} single>
        <StateSummary
          stateName={state.name}
          stateAbbreviation={state.state}
          sevenDaysAgo={sevenDaysAgo}
          stateSlug={state.slug}
          data={covidState}
          population={covidStateInfo.childPopulation.population}
          metadata={contentfulStateOrTerritory}
          lastUpdated={covidState.lastUpdateEt}
          annotations={allCovidAnnotation.nodes}
          raceData={getRaceData(data)}
          longTermCare={data.covidStateInfo.childLtc}
          hhsHospitalization={
            allHhsHospitalizationCovid && allHhsHospitalizationCovid.nodes[0]
          }
        />
        {state.notes && <StateNotes notes={state.notes} />}
        <StateTweets
          tweets={allTweets}
          name={state.name}
          stateAbbreviation={state.state}
        />
      </StateNavWrapper>
    </Layout>
  )
}

export default StateTemplate

export const query = graphql`
  query($state: String!, $sevenDaysAgo: Date, $nameRegex: String!) {
    sevenDaysAgo: covidStateDaily(
      date: { eq: $sevenDaysAgo }
      state: { eq: $state }
    ) {
      positive
    }
    allCovidStateInfo(sort: { fields: name }) {
      nodes {
        state
        name
        childSlug {
          slug
        }
      }
    }
    covidStateInfo(state: { eq: $state }) {
      state
      covidTrackingProjectPreferredTotalTestField
      covidTrackingProjectPreferredTotalTestUnits
      childPopulation {
        population
      }
      childLtc {
        current {
          date
          total_cases
          total_death
          outbrkfac_alf
          outbrkfac_ltc
          outbrkfac_other
          outbrkfac_nh
        }
        last {
          date
          total_cases
          total_death
        }
      }
    }
    allCovidUsDaily {
      nodes {
        date(formatString: "YYYYMMDD")
        childPopulation {
          deathIncrease {
            percent
          }
          positiveIncrease {
            percent
          }
          hospitalizedCurrently {
            percent
          }
        }
      }
    }
    covidState(state: { eq: $state }) {
      state
      positive
      positiveIncrease
      negative
      lastUpdateEt
      dateModified(formatString: "MMM D, YYYY h:mm a")
      hospitalizedCurrently
      hospitalizedCumulative
      inIcuCurrently
      inIcuCumulative
      recovered
      onVentilatorCurrently
      onVentilatorCumulative
      death
      deathProbable
      deathConfirmed
      totalTestResults
      dataQualityGrade
      probableCases
      positiveCasesViral
      positiveTestsViral
      negativeTestsViral
      totalTestsPeopleViral
      totalTestsViral
      totalTestEncountersViral
      totalTestsAntibody
      totalTestsPeopleAntibody
      totalTestResultsSource
    }
    allCovidStateDaily(
      filter: { state: { eq: $state } }
      sort: { fields: date, order: DESC }
    ) {
      nodes {
        totalTestEncountersViralIncrease
        totalTestsViralIncrease
        totalTestsPeopleViralIncrease
        totalTestResultsIncrease
        positiveIncrease
        hospitalizedCurrently
        deathIncrease
        date(formatString: "YYYYMMDD")
        childPopulation {
          deathIncrease {
            percent
          }
          hospitalizedCurrently {
            percent
          }
          positiveIncrease {
            percent
          }
          totalTestEncountersViralIncrease {
            percent
          }
          totalTestsViralIncrease {
            percent
          }
          totalTestsPeopleViralIncrease {
            percent
          }
          totalTestResultsIncrease {
            percent
          }
        }
      }
    }
    contentfulStateOrTerritory(code: { eq: $state }) {
      testUnitsUnknown
    }
    allContentfulChartAnnotation(
      filter: { state: { code: { eq: $state } } }
      sort: { fields: date, order: DESC }
    ) {
      nodes {
        title
        description {
          description
        }
        date(formatString: "YYYYMMDD")
        dataElement
        contentful_id
        childContentfulChartAnnotationDescriptionTextNode {
          childMarkdownRemark {
            html
          }
        }
      }
    }
    allTweets(
      filter: { full_text: { regex: $nameRegex } }
      sort: { fields: date, order: DESC }
      limit: 5
    ) {
      nodes {
        full_text
        id_str
        date(formatString: "MMMM D, yyyy")
      }
    }
    allCovidRaceDataCombined(filter: { state: { eq: $state } }) {
      nodes {
        state
        name
        blackSmallN
        latinXSmallN
        asianSmallN
        aianSmallN
        whiteSmallN
        apiSmallN
        nhpiSmallN
        blackPosPerCap
        blackDeathPerCap
        latinXPosPerCap
        latinXDeathPerCap
        asianPosPerCap
        asianDeathPerCap
        aianPosPerCap
        aianDeathPerCap
        whitePosPerCap
        whiteDeathPerCap
        nhpiPosPerCap
        nhpiDeathPerCap
        apiPosPerCap
        apiDeathPerCap
        lastCheckDate {
          value
        }
      }
    }
    allCovidRaceDataSeparate(filter: { state: { eq: $state } }) {
      nodes {
        state
        name
        knownRacePos
        knownRaceDeath
        knownEthPos
        knownEthDeath
        blackSmallN
        latinXSmallN
        asianSmallN
        aianSmallN
        whiteSmallN
        apiSmallN
        nhpiSmallN
        blackPosPerCap
        blackDeathPerCap
        latinXPosPerCap
        latinXDeathPerCap
        asianPosPerCap
        asianDeathPerCap
        aianPosPerCap
        aianDeathPerCap
        whitePosPerCap
        whiteDeathPerCap
        nhpiPosPerCap
        nhpiDeathPerCap
        apiPosPerCap
        apiDeathPerCap
        lastCheckDate {
          value
        }
      }
    }
    allCovidAnnotation(filter: { state: { eq: $state } }) {
      nodes {
        airtable_id
        field
        lastChecked(formatString: "MMMM DD yyyy")
        warning
      }
    }
    allHhsHospitalizationCovid(
      filter: { state: { eq: $state } }
      sort: { fields: date, order: DESC }
      limit: 1
    ) {
      nodes {
        state
        date
        inpatient_beds_used_covid
        staffed_icu_adult_patients_confirmed_and_suspected_covid
        total_adult_patients_hospitalized_confirmed_covid
        total_pediatric_patients_hospitalized_confirmed_covid
      }
    }
    urls: file(childTacoYaml: { state: { eq: $state } }) {
      childTacoYaml {
        links {
          url
          name
        }
        state
      }
    }
  }
`
