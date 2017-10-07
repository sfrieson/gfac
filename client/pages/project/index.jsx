import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'

import Model from 'models/project'

import Details from 'components/Project/Details'
import NonprofitMini from 'components/Nonprofit/Mini'
import PrimaryInfo from 'components/Project/PrimaryInfo'
import UserMini from 'components/User/Mini'

export function ProjectPage ({loading, error, data}) {
  if (!data) return <div>Loading...</div>

  const {
    date,
    description,
    // causes,
    location,
    name,
    nonprofit,
    storytellers
  } = data
  return [
    <div className='row' key='primary info'>
      <div className='col-sm-12'>
        <PrimaryInfo name={name} date={date} location={location} />
      </div>
    </div>,
    <div className='row' key='main info'>
      <div className='col-sm-12 col-md-6'>
        <Details description={description} />
        {/* {causes && causes.map(cause => <Tag>{cause.name}</Tag>)} */}
        <ul className='project__storytellers-list'>
          {storytellers.map(({firstname, lastname}) => (
            <li key={`${firstname} ${lastname}`} className='project__storyteller'>
              <UserMini firstname={firstname} lastname={lastname} type='Storyteller' />
            </li>
          ))}
        </ul>
        <Button>
          Add Storyteller
        </Button>
      </div>
      <div className='col-sm-12 col-md-6'>
        <NonprofitMini {...nonprofit} />
        {/* Event History */}
      </div>
    </div>
  ]
}

function mapStateToProps (state, props) {
  console.log('mapStateToProps', arguments)
  return {data: state.projects[props.id] || null}
}

const Connected = connect(mapStateToProps)(ProjectPage)

export default class ProjectPageQuery extends Component {
  componentWillMount () {
    Model.get(this.props.match.params.id)
  }

  render () {
    return <Connected {...this.props} id={this.props.match.params.id} />
  }
}
