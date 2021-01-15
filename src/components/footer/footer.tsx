import React from 'react';
import styled from 'styled-components';
import logo from '../../assets/logo.png';
import imgTelegram from '../../assets/telegram.png';
import imgMedium from '../../assets/medium.png';
import imgGithub from '../../assets/github.png';
import imgLinkedin from '../../assets/linkedin.png';
import imgTwitter from '../../assets/twitter.png';
import { Logo } from '../header/header';
import { isMobile } from 'react-device-detect'

const FooterWrap = styled.div`
  background: #161638;
  width: 100%;
  height: ${isMobile ? '5rem' : '7.5rem'};
  display: flex;
  align-items: center;
  justify-content: center;
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

const RightBar = styled(Bar)`
  flex-direction: row-reverse;
`;

const ContactBtn = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  margin: 0.625rem;
`;

const CopyRight = styled.div`
  font-family: PingFangSC-Regular;
  font-size: 0.75rem;
  color: #535484;
  line-height: 1.375rem;
`;

export default function Footer() {

  const contactBtn = [imgTwitter, imgLinkedin, imgGithub, imgMedium, imgTelegram]

  const pcFooter = (<>
    <Bar>
      <Logo src={logo}/>
      <CopyRight>{'Copyright © 2020 Bidex Inc. All rights reserved.'}</CopyRight>
    </Bar>
    <RightBar>
      {contactBtn.map((img) => <ContactBtn src={img}></ContactBtn>)}
    </RightBar>
  </>);
  return <FooterWrap>
    {isMobile ? <></> : pcFooter}
  </FooterWrap>
}