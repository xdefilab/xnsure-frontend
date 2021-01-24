import React from 'react'
import styled from 'styled-components'
import { Tabs } from 'antd'
import './index.css'

const { TabPane } = Tabs

export default function PCApp() {
  //
  return (
    <div className="options-tabs">
      <Tabs tabPosition="left">
        <TabPane tab="交易期权" key={1}></TabPane>
        <TabPane tab="发行期权" key={2}></TabPane>
        <TabPane tab="我的期权" key={2}></TabPane>
      </Tabs>
    </div>
  )
}
