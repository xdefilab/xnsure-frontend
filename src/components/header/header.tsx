import React from 'react';
import styled from 'styled-components';
import logo from '../../assets/logo.png';
import { HorizontalScroll, CenteredDiv } from '../common/common';
import { isMobile } from 'react-device-detect'

const HeaderWrap = styled.div`
  background: #161638;
  width: 100%;
  height: ${isMobile ? '4.5rem' : '3.75rem'};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const Bar = styled.div`
    height: 100%;
    flex-grow: 1;
    flex-shrink: 1;
    max-width: 35rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow: hidden;
`;

export const Logo = styled.img`
    height: 1.875rem;
    width: 6.875rem;
    margin-right: 2rem;
`;

const NavButton = styled.div`
    width: 10rem;
    margin-left: 1rem;
    margin-right: 1rem;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: PingFangSC-Semibold;
    font-size: 1rem;
    color: #7E7F9C;
    letter-spacing: 0;
    text-align: center;
    cursor: pointer;
`;

const CurrentNavBtn = styled(NavButton)`
    color: #FFFFFF;
    position: relative;
`;

const InkBar = styled.div`
    position: absolute;
    bottom: 0.7rem;
    height: 4px;
    width: 1.25rem;
    display: block;
    background-image: linear-gradient(136deg, #2BF7DD 0%, #3A8FF7 51%, #DA37FA 100%);
    border-radius: 3px;
    border-radius: 3px;
`;


export default function Header() {
    const navBtnsName = ["HalfLife", "Swap", "Pool", "Farming", "DAO", "Statistics", "Community"]

    const PCHeader = (<>
        <Bar>
            <Logo src={logo}></Logo>
            <Bar>
                <HorizontalScroll width="30rem" height="100%">
                    {navBtnsName.map((name) => <NavButton>{name}</NavButton>)}
                </HorizontalScroll>
            </Bar>
            <CurrentNavBtn>
                {'xNsure'}
                <InkBar></InkBar>
            </CurrentNavBtn>
        </Bar>
        <Bar></Bar>
    </>)


    const MobileHeader = (<Bar>
        <Bar><Logo style={{paddingLeft: 10}} src={logo}></Logo></Bar>
        <Bar></Bar>
        <CenteredDiv height="100%">
            <CurrentNavBtn>
                {'xNsure'}
                <InkBar></InkBar>
            </CurrentNavBtn>
        </CenteredDiv>
    </Bar>)
    
    return <HeaderWrap>
        {isMobile ? MobileHeader : PCHeader}
    </HeaderWrap>
}