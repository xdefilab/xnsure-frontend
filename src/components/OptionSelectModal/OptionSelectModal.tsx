import { Currency } from '@uniswap/sdk'
import React, { useCallback, useEffect, useState } from 'react'
import ReactGA from 'react-ga'
import useLast from '../../hooks/useLast'
import { useSelectedListUrl } from '../../state/lists/hooks'
import Modal from '../Modal'
import styled, { ThemeContext } from 'styled-components'
import { CurrencySearch } from './CurrencySearch'
import ListIntroduction from './ListIntroduction'
import { ListSelect } from './ListSelect'
import CommonBases from '../SearchModal/CommonBases'
import Row, { RowBetween } from '../Row'
import { PaddedColumn, SearchInput, Separator } from './styleds'
import { Text } from 'rebass'
import { CloseIcon, LinkStyledButton, TYPE } from '../../theme'
import Card from '../Card'
import Column from '../Column'
import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'
import { useContract } from '../../hooks/useContract'
import { getContractMeta } from '../../xnsure'

const ExpireDateList = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`

const ContentList = styled.div`
  display: block;
`

const ListItem = styled.div`
  padding-left: 10px;
  height: 50px;
  display: flex;
  align-items: center;
  font-size: 18px;
  &: hover {
    background: #2d2f36;
  }
`
export interface OptionItem {
  title: string;
  deadline: number;
  target: number;
}

interface CurrencySearchModalProps {
  isOpen: boolean
  onDismiss: () => void
  onDateSelect: (date: OptionItem) => void
}

function getDateByDeadline(deadline: number) {
  return '2020-11-20';
}

export default function OptionSelectModal({ isOpen, onDismiss, onDateSelect }: CurrencySearchModalProps) {
  const [listView, setListView] = useState<boolean>(false)
  const lastOpen = useLast(isOpen)

  useEffect(() => {
    if (isOpen && !lastOpen) {
      setListView(false)
    }
  }, [isOpen, lastOpen])

  

  const [deadlines, setDeadlines] = useState<number[]>([])
  const [targets, setTargets] = useState<number[]>([])
  const [optionList, setOptionList] = useState<OptionItem[]>([])

  const meta = getContractMeta('OptionController')

  const contract = useContract(meta.address, meta.abi);

  useEffect(() => {
    async function getItems() {
      if (contract) {
        const deadlines = await contract.getDeadlines();
        console.log('测试 contract.getDeadlines() contract.getDeadlines()')
        console.log(deadlines)
        setDeadlines(deadlines)
        const targets = await contract.getTargets();
        console.log('测试 contract.getTargets()')
        console.log(targets)
        setTargets(targets)
      }
    }
    getItems()
  }, [isOpen])

  useEffect(() => {
    const optionlist:OptionItem[] = []
    for (let i = 0; i < deadlines.length; i++) {
      for (let j = 0; j < targets.length; j ++) {
        optionlist.push({
          title: `CALL AT ${targets[j]} expired at ${getDateByDeadline(deadlines[i])}`,
          target: targets[j],
          deadline: deadlines[i]
        })
        optionlist.push({
          title: `PUT AT ${targets[j]} expired at ${getDateByDeadline(deadlines[i])}`,
          target: targets[j],
          deadline: deadlines[i]
        })
      }
    }
    setOptionList(optionlist)
  }, [deadlines, targets])


  const selectedListUrl = useSelectedListUrl()
  const noListSelected = !selectedListUrl
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={90} minHeight={listView ? 40 : noListSelected ? 0 : 80}>
      <Column style={{ width: '100%', flex: '1 1' }}>
        <PaddedColumn gap="14px">
          <RowBetween>
            <Text fontWeight={500} fontSize={16}>
              Select a Option Contract
            </Text>
            <CloseIcon onClick={onDismiss} />
          </RowBetween>
        </PaddedColumn>
        <Separator />

        <div style={{ flex: '1' }}>
          <ExpireDateList>
            <ContentList>
              {optionList.map((item: OptionItem) => {
                return (
                  <div
                    onClick={() => {
                      onDateSelect(item)
                      onDismiss()
                    }}
                  >
                    <ListItem>{item.title}</ListItem>
                    <Separator />
                  </div>
                )
              })}
            </ContentList>
          </ExpireDateList>
        </div>

        <Separator />
      </Column>
    </Modal>
  )
}
