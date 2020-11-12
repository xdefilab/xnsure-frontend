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

interface CurrencySearchModalProps {
  isOpen: boolean
  onDismiss: () => void
  onDateSelect: (date: string) => void
}

export default function ExpireDateModal({ isOpen, onDismiss, onDateSelect }: CurrencySearchModalProps) {
  const [listView, setListView] = useState<boolean>(false)
  const lastOpen = useLast(isOpen)

  useEffect(() => {
    if (isOpen && !lastOpen) {
      setListView(false)
    }
  }, [isOpen, lastOpen])

  const selectedListUrl = useSelectedListUrl()
  const noListSelected = !selectedListUrl
  const itemData: string[] = ['2020-11-13', '2020-11-14', '2020-11-15']

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={90} minHeight={listView ? 40 : noListSelected ? 0 : 80}>
      <Column style={{ width: '100%', flex: '1 1' }}>
        <PaddedColumn gap="14px">
          <RowBetween>
            <Text fontWeight={500} fontSize={16}>
              Select a Expire Date
            </Text>
            <CloseIcon onClick={onDismiss} />
          </RowBetween>
        </PaddedColumn>
        <Separator />

        <div style={{ flex: '1' }}>
          <ExpireDateList>
            <ContentList>
              {itemData.map(item => {
                return (
                  <div
                    onClick={() => {
                      onDateSelect(item)
                      onDismiss()
                    }}
                  >
                    <ListItem>{item}</ListItem>
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
