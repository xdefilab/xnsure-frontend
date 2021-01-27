import React from 'react'
import styled from 'styled-components'
import './index.scss'
import { HorizontalScroll } from '../../../components/common/common'
import { Select } from 'antd'

const { Option } = Select

const TabPage = styled.div`
  width: 100%;
  height: 100%;
  background: #272958;
  display: flex;
  flex-direction: column;
`

const Label = styled.div`
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #a4a6f2;
  margin-left: 20px;
  margin-right: 20px;
`

export default function Trade() {
  //
  return (
    <TabPage>
      <HorizontalScroll height={'40px'} width={'100%'}>
        <Label>{'Which Token'}</Label>
        <div className="options-select-container">
          <Select className="options-select" defaultValue="lucy">
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="Yiminghe">yiminghe</Option>
          </Select>
        </div>

        <Label>{'Expiry'}</Label>

        <div className="options-select-container">
          <Select className="options-select" defaultValue="lucy">
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="Yiminghe">yiminghe</Option>
          </Select>
        </div>
      </HorizontalScroll>
    </TabPage>
  )
}
