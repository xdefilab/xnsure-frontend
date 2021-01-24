import React from 'react';
import styled from 'styled-components';
import Header from '../components/header/header';
import Footer from '../components/footer/footer';
import { PlaceHolder, ColumnLayout } from '../components/common/common';
import { isMobile } from 'react-device-detect';
import PCApp from './pc';


const Page = styled.div`
  background-color: #1E2049;
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  flex-direction: column;
`;

const PCAppWrap = styled.div`
  background-color: #272958;
  height: 85%;
  width: 90%;
  max-width: 62.5rem;
  min-width: 35rem;
  max-height: 32rem;
  min-height: 25rem;
  flex-grow: 1;
  flex-shrink: 1;
  display: flex;
  flex-direction: column;
  border-radius: 0.75rem;
`;

const H5AppWrap = styled.div`
    background-color: #272958;
    height: 90%;
    width: 90%;
    border-radius: 0.75rem;
    position: absolute;
`;

function AppBody() {
    const mobileBody = <H5AppWrap></H5AppWrap>
    const pcBody = <PCAppWrap><PCApp /></PCAppWrap>
    return <PlaceHolder>
        {isMobile ? mobileBody : pcBody}
    </PlaceHolder>
}


export default function App() {
    //
    return <Page>
        <Header></Header>
        <AppBody/>
        <Footer></Footer>
    </Page>
}