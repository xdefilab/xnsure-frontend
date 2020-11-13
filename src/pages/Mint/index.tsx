import React, { useState, useEffect, useContext } from 'react'
import AppBody from '../AppBody'
import { TradeMintTabs } from '../../components/NavigationTabs'
import CurrencySelectButton from '../../components/CurrencySelectButton'
import { Currency } from '@uniswap/sdk'
import styled, { ThemeContext } from 'styled-components'
import ExpireDateSelectButton from '../../components/ExpireDateSelectButton'
import { darken } from 'polished'
import Column from '../../components/Column'
import Row, { RowBetween } from '../../components/Row'
import { TYPE } from '../../theme'
import { Input as NumericalInput } from '../../components/NumericalInput'
import { ButtonError, ButtonLight, ButtonPrimary, ButtonConfirmed } from '../../components/Button'
import { Text } from 'rebass'
import ConfirmSwapModal from '../../components/swap/ConfirmSwapModal'

const CallPutButton = styled.button<{ selected: boolean }>`
  align-items: center;
  height: 2.2rem;
  font-size: 20px;
  font-weight: 500;
  background-color: ${({ selected, theme }) => (!selected ? theme.bg1 : theme.primary1)};
  color: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
  border-radius: 12px;
  box-shadow: ${({ selected }) => (selected ? 'none' : '0px 6px 10px rgba(0, 0, 0, 0.075)')};
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 0 0.5rem;
  opacity: ${({ selected }) => (selected ? 1 : 0.4)}
  margin-left:10px
`

const OptionList = styled.div`
  width: 100%;
  height: 150px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`

const OptionContentList = styled.div`
  display: block;
`

const OptionItem = styled.div<{ selected: boolean }>`
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 8px;
  height: 50px;
  color: #bcbcbc;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 16px;
  background-color: ${({ selected }) => (selected ? '#2172E5' : 'transparency')};
  &: hover {
    background: ${({ selected }) => (selected ? '#2172E5' : '#2D2F36')};
  }
`

const OptionTitle = styled.div`
  padding-left: 20px;
  padding-right: 20px;
  height: 50px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 16px;
  margin-top: 10px;
`

const OptionInfoLeft = styled.div`
  width: 10%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`

const OptionInfoMid = styled.div`
  width: 25%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const OptionInfoRight = styled.div`
  width: 10%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

const Separator = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.bg2};
`

const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  background-color: ${({ theme }) => theme.bg2};
  z-index: 1;
`

const LabelRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.text1};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0 1rem;
  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.text2)};
  }
`
const InputRow = styled.div<{ selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  height: 80px;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
`

export const NumberInput = styled.input`
  position: relative;
  display: flex;
  padding: 16px;
  align-items: center;
  width: 50%;
  white-space: nowrap;
  background: none;
  border: none;
  outline: none;
  border-radius: 20px;
  color: ${({ theme }) => theme.text1};
  border-style: solid;
  border: 1px solid ${({ theme }) => theme.bg3};
  -webkit-appearance: none;

  font-size: 18px;

  ::placeholder {
    color: ${({ theme }) => theme.text3};
  }
  transition: border 100ms;
  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
    outline: none;
  }

  [type='number'] {
    -moz-appearance: textfield;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
`

const CostLabel = styled.div`
  width: 50%;
  color: #bcbcbc;
  text-align: end;
`

const Container = styled.div<{ hideInput: boolean }>`
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  border: 1px solid ${({ theme }) => theme.bg2};
  background-color: ${({ theme }) => theme.bg1};
`

interface OptionParams {
    token: string;
    deadline: string;
    targets: number[];
}

function useUpdater(): [number[], React.Dispatch<React.SetStateAction<OptionParams | undefined>>] {
    const [priceList, setPriceList] = useState<number[]>([]);
    const [optionParams, setOptionParams] = useState<OptionParams>();
    // TODO: 设置了interval 里面有 state 变量, 不会跟着变化的吧
    setInterval(() => {
        if (!optionParams) {
            return
        }
        const prices: number[] = []
        optionParams.targets.forEach(param => {
            prices.push(Math.random() * 10);
        })
        console.log(prices)
        setPriceList(prices)
    }, 1000);
    return [priceList, setOptionParams];
}

export function Mint() {
  const [callput, setCallput] = useState('CALL')

  const [currency, setCurrency] = useState<Currency>()
  
  const [selectedDate, setSelectedDate] = useState('2020-11-15')
  const [selectedTarget, setSelectedTarget] = useState<number>()

  const [tradeAmount, setTradeAmount] = useState('0')

  const [buysell, setBuySell] = useState('BUY')
  const [showConfirm, setShowConfirm] = useState(false)
  
  const [targets, setTargets] = useState<number[]>([])
  const [deadlines, setDeadlines] = useState<number[]>([])

  const [priceList, setOptionParams] = useUpdater();
  

  useEffect(() => {
    setTargets([300, 350, 370, 380, 400]);
    setDeadlines([1,2,3,4,5])
  }, [])

  useEffect(() => {
    if (!currency || !selectedDate || !targets) {
        return
    }
    setOptionParams({
        token: currency && currency.symbol ?  currency.symbol : '',
        deadline: selectedDate,
        targets,
    })
  }, [currency, selectedDate, targets])

  const theme = useContext(ThemeContext)

  // TODO: TokenWarningModal
  return (
    <AppBody>
      <TradeMintTabs active={'mint'} />
      <ConfirmSwapModal
        isOpen={showConfirm}
        attemptingTxn={true}
        recipient={null}
        allowedSlippage={0.2}
        onAcceptChanges={() => {}}
        onConfirm={() => setShowConfirm(false)}
        onDismiss={() => setShowConfirm(false)}
        trade={undefined}
        originalTrade={undefined}
        txHash={undefined}
        swapErrorMessage={undefined}
      />

      <Column style={{ width: '100%', flex: '1 1' }}>
        <RowBetween>
          <div>
            <CurrencySelectButton
              value={'0'}
              onUserInput={() => {}}
              label={'To'}
              showMaxButton={false}
              currency={currency}
              onCurrencySelect={(currency: Currency) => {
                setCurrency(currency)
              }}
              otherCurrency={undefined}
              id="swap-currency-output"
            />
            <ExpireDateSelectButton onDateSelected={setSelectedDate} />
          </div>
          <div>
            <CallPutButton onClick={() => setCallput(callput === 'CALL' ? 'PUT' : 'CALL')} selected={true}>
              {callput}
            </CallPutButton>
            <CallPutButton onClick={() => setBuySell(buysell === 'BUY' ? 'SELL' : 'BUY')} selected={true}>
              {buysell}
            </CallPutButton>
          </div>
        </RowBetween>

        <Row>
          <OptionTitle>
            <OptionInfoLeft>{'Token'}</OptionInfoLeft>
            <OptionInfoMid>{'Call/Put'}</OptionInfoMid>
            <OptionInfoMid>{'Expire Date'}</OptionInfoMid>
            <OptionInfoMid>{'Strike Price'}</OptionInfoMid>
            <OptionInfoRight>{'Price'}</OptionInfoRight>
          </OptionTitle>
        </Row>

        <Separator></Separator>

        <Row>
          <OptionList>
            <OptionContentList>
              { currency?.symbol === 'ETH' && selectedDate && targets?.map((target, index) => {
                return (
                  <OptionItem onClick={() => setSelectedTarget(target)} selected={selectedTarget === target}>
                    <OptionInfoLeft>{currency?.symbol}</OptionInfoLeft>
                    <OptionInfoMid>{callput}</OptionInfoMid>
                    <OptionInfoMid>{selectedDate}</OptionInfoMid>
                    <OptionInfoMid>{target}</OptionInfoMid>
                    <OptionInfoRight>{priceList && priceList.length > index && index >= 0 && priceList[index].toFixed(3)}</OptionInfoRight>
                  </OptionItem>
                )
              })}
            </OptionContentList>
          </OptionList>
        </Row>

        <Separator></Separator>
        <div style={{ height: 10 }}></div>

        <Container hideInput={false}>
          <LabelRow>
            <RowBetween>
              <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                {`Lock ${callput === 'CALL' ? 'ETH' : 'USDT'} as Collateral`}
              </TYPE.body>

              <TYPE.body color={theme.text2} fontWeight={500} fontSize={14}>
                {`Option Token to Generate`}
              </TYPE.body>
            </RowBetween>
          </LabelRow>

          <InputRow selected={false}>
            <NumericalInput
              className="token-amount-input"
              value={tradeAmount}
              onUserInput={val => {
                setTradeAmount(val)
              }}
            />

            <CostLabel>
              {`Total Options to Generate: ${(Number(tradeAmount) *
                (selectedTarget ? priceList[targets.indexOf(selectedTarget)] : 0)).toFixed(3)}`}
            </CostLabel>
          </InputRow>
        </Container>
        <Row>
          <ButtonError
            onClick={() => {
              setShowConfirm(true)
            }}
            disabled={!(selectedTarget && Number(tradeAmount) > 0)}
            error={undefined}
          >
            <Text fontSize={20} fontWeight={500}>
              {selectedTarget && Number(tradeAmount) > 0
                ? `Confirm ${buysell} Trade`
                : !currency
                ? 'Select a Token'
                : !selectedTarget
                ? 'Select a Option'
                : 'Input Amount'}
            </Text>
          </ButtonError>
        </Row>
      </Column>
    </AppBody>
  )
}
