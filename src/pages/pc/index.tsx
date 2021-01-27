import React from 'react'
import styled from 'styled-components'
import { Tabs } from 'antd'
import './index.css'
import Trade from './trade'

const { TabPane } = Tabs

export default function PCApp() {
  //
  return (
    <Tabs className="options-tabs" tabPosition="left">
      <TabPane tab="交易期权" key={1}>
        <Trade></Trade>
      </TabPane>
      <TabPane tab="发行期权" key={2}></TabPane>
      <TabPane tab="我的期权" key={3}></TabPane>
    </Tabs>
  )
}
