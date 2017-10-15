import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Col, Row } from 'antd'
import { Link } from 'react-router-dom'

import Model from 'models/project'

import Details from 'components/Project/Details'
import NonprofitMini from 'components/Nonprofit/Mini'
import PrimaryInfo from 'components/Project/PrimaryInfo'
import UserMini from 'components/User/Mini'

export function ProjectPage ({loading, error, data}) {
  if (!data) return <div>Loading...</div>

  const {
    // causes,
    date,
    description,
    id,
    location,
    name,
    nonprofit,
    storytellers
  } = data
  return [
    <Row key='primary info' gutter={16}>
      <Col xs={24}>
        <PrimaryInfo name={name} date={date} location={location} />
        <Link to={`/project/${id}/edit`}>
          <Button>Edit</Button>
        </Link>
      </Col>
    </Row>,
    <Row key='main info' gutter={16}>
      <Col xs={24} md={12}>
        <Details description={description} />
        {/* {causes && causes.map(cause => <Tag>{cause.name}</Tag>)} */}
        <ul className='project__storytellers-list'>
          {storytellers.map(({firstname, lastname}) => (
            <li key={`${firstname} ${lastname}`} className='project__storyteller'>
              <UserMini firstname={firstname} lastname={lastname} type='Storyteller' />
            </li>
          ))}
        </ul>
        <Button type='primary'>
          Add Storyteller
        </Button>
      </Col>
      <Col xs={24} md={12}>
        <NonprofitMini {...nonprofit} />
        {/* Event History */}
      </Col>
    </Row>
  ]
}

function mapStateToProps (state, props) {
  console.log('mapStateToProps', arguments)
  return {data: state.projects[props.id] || null}
}

const Connected = connect(mapStateToProps)(ProjectPage)

export default class ProjectPageQuery extends Component {
  componentWillMount () {
    this.getProject(this.props.match.params.id)
  }
  componentWillReceiveProps (nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id) {
      this.getProject(nextProps.match.params.id)
    }
  }
  getProject (id) {
    Model.get(id)
  }
  render () {
    return <Connected {...this.props} id={this.props.match.params.id} />
  }
}
