import React from 'react'

function DashboardHeading(props) {
  return (
    <div className="alert alert-success fixed-top" style={{marginTop:"55px"}} role="alert">
        {props.text}
    </div>
  )
}

export default DashboardHeading