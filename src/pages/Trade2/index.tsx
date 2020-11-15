import React, { useState, useEffect, useContext } from 'react'
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
import { useContract } from '../../hooks/useContract'
import { getContractMeta } from '../../xnsure'

import { useActiveWeb3React } from '../../hooks'
import { useHistory } from 'react-router-dom'

import axios from 'axios'


export const BodyWrapper = styled.div`
  position: relative;
  max-width: 920px;
  width: 100%;
  background: ${({ theme }) => theme.bg1};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 30px;
  padding: 1rem;
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return <BodyWrapper>{children}</BodyWrapper>
}


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
  height: 300px;
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
    targets: string[];
}

function useUpdater(): [number[], number[], number[], React.Dispatch<React.SetStateAction<OptionParams | undefined>>] {
  const contractMeta = getContractMeta('OptionController');  
  const contract = useContract(contractMeta.address, contractMeta.abi);

  const { chainId, account, connector } = useActiveWeb3React()
  const timestamp = (new Date()).valueOf() + 300000;
  console.log(timestamp)
  console.log(contract)
  
  if (contract) {
  }
    
    const [priceList, setPriceList] = useState<number[]>([]);
    const [ivCallList, setIvCallList] = useState<number[]>([]);
    const [ivPutList, setIvPutList] = useState<number[]>([]);
    const [optionParams, setOptionParams] = useState<OptionParams>();
    useEffect(() => {
      if (!optionParams) {
        return
      }

      const priceCall = [63, 70.56, 34.86, 4.2]
      const pricePut = [1, 10, 65, 120]

      const civCall: number[] = [0, 0, 0, 0]
      const civPut: number[] = [0,0,0,0]
      optionParams.targets.forEach((target: string, index: number) => {
        async function call() {
          //const calliv = await axios.get('asd')
          if (index < priceCall.length) {
            const calliv = await axios.get(`http://localhost:9876/?direction=CALL&spotprice=420&price=${priceCall[index] / 420}&strikestart=${target}&strikeend=${Number(target) / 0.8}&totalTime=40000&fundingAPY=0.02`)
            //civCall[index] = calliv
          }
          if (index < pricePut.length) {
            const putdiv = await axios.get(`http://localhost:9876/?direction=PUT&spotprice=420&price=${pricePut[index]}&strikestart=${target}&strikeend=${Number(target) * 0.8}&totalTime=40000&fundingAPY=0.02`)
            //civPut[index] = putdiv
          }

          if (index === civPut.length - 1) {
            setIvPutList(civPut)
          }
          
          if (index === civCall.length - 1) {
            setIvCallList(civCall)
          }
          
        }

        call()
        
      })
      


    }, [optionParams])
    // TODO: 设置了interval 里面有 state 变量, 不会跟着变化的吧
    setInterval(() => {
        if (!optionParams) {
            return
        }
        const prices: number[] = []
        optionParams.targets.forEach(async (target: string) => {
          if( !contract ) {
            prices.push(0)
            return
          }
          console.log(contract)
          console.log(optionParams.deadline)
          const price = 0
          //const price = await contract.getUnderlyingIn(optionParams.deadline, target, "1000000000000000000")
          //prices.push(Math.random() * 10);
          prices.push(price)
          console.log("niko 测试价格")
          console.log(price)
        })
        
        //setPriceList(prices)
    }, 1500);
    return [priceList, ivCallList, ivPutList, setOptionParams];
}

export function Trade2() {
  const [callput, setCallput] = useState('CALL')

  const [currency, setCurrency] = useState<Currency>()
  
  const [selectedDate, setSelectedDate] = useState('2020-11-20')
  const [selectedTarget, setSelectedTarget] = useState<string>()

  const [tradeAmount, setTradeAmount] = useState('0')

  const [buysell, setBuySell] = useState('BUY')
  const [showConfirm, setShowConfirm] = useState(false)
  
  const [targets, setTargets] = useState<string[]>([])
  const [deadlines, setDeadlines] = useState<string[]>([])

  const [priceList,  ivCallList, ivPutList, setOptionParams] = useUpdater();

  const meta = getContractMeta('OptionController')
  const contract = useContract(meta.address, meta.abi)

  const history = useHistory()

  const priceCall = [63, 70.56, 34.86, 4.2]
  const pricePut = [1, 10, 65, 120]
  
  useEffect( () => {
    async function call () {
      console.log()
      if (!contract) {
        console.log('niuko useEffect getDeadlines!!!CANGT')
        return
      }
      console.log('niuko useEffect getDeadlines')
      const ddl = await contract.getDeadlines()
      console.log(ddl)
      setDeadlines(ddl)
      const targets = await contract.getTargets()
      console.log('这就是target 了吗')
      console.log(targets)
      const t = targets.map( (item:string) => parseInt(item, 10)   )
      setTargets(t)
    }
    setTimeout(() => call(), 1000)
  }, [])

  useEffect(() => {
    if (!currency || !selectedDate || !targets) {
        return
    }
    setOptionParams({
        token: currency && currency.symbol ?  currency.symbol : '',
        deadline: deadlines[0],
        targets,
    })
  }, [currency, selectedDate, targets])

  const unclose = [7, 15,9 ,22, 10, 12, 8, 8]
  const unclose2 = [6, 14, 20 ,20, 8, 14, 12, 6]

  const theme = useContext(ThemeContext)

  // TODO: TokenWarningModal
  return (
    <AppBody>
      <TradeMintTabs active={'trade'} />
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
            <CallPutButton onClick={() => {console.log("history asdasd"); history.push('/trade')}} selected={false}>
              {'Expert Mode'}
            </CallPutButton>
          </div>
          <div>
            <CallPutButton onClick={() => setBuySell(buysell === 'BUY' ? 'SELL' : 'BUY')} selected={true}>
              {buysell}
            </CallPutButton>
          </div>
        </RowBetween>

        <Row>
          <OptionTitle>
            <OptionInfoLeft>{'CALL'}</OptionInfoLeft>
            <OptionInfoRight>{'PUT'}</OptionInfoRight>
          </OptionTitle>
        </Row>

        <Row>
          <OptionTitle>
            <OptionInfoLeft>{'Price'}</OptionInfoLeft>
            <OptionInfoMid>{'Unclosed'}</OptionInfoMid>
            <OptionInfoMid>{'IV'}</OptionInfoMid>
            <OptionInfoMid>{'Strike Window'}</OptionInfoMid>
            <OptionInfoMid>{'IV'}</OptionInfoMid>
            <OptionInfoMid>{'Unclosed'}</OptionInfoMid>
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
                    <OptionInfoLeft>{priceCall.length > index && index >= 0 && priceCall[index]}</OptionInfoLeft>
                    <OptionInfoMid>{unclose[index]}</OptionInfoMid>
                    <OptionInfoMid>{ivCallList && ivCallList.length>index && index > 0 && ivCallList[index].toFixed(3)}</OptionInfoMid>
                    <OptionInfoMid>{`${target} - ${Number(target) / 0.8}`}</OptionInfoMid>
                    <OptionInfoMid>{ivPutList && ivPutList.length>index && index > 0 && ivPutList[index].toFixed(3)}</OptionInfoMid>
                    <OptionInfoMid>{unclose2[index]}</OptionInfoMid>
                    <OptionInfoRight>{pricePut.length > index && index >= 0 && pricePut[index]}</OptionInfoRight>
                  </OptionItem>
                )
              })}
            </OptionContentList>
          </OptionList>
        </Row>

        <Separator></Separator>
        <div style={{ height: 10 }}></div>
      </Column>
    </AppBody>
  )
}
