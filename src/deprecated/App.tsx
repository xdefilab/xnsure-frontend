import React from 'react';
import styled from 'styled-components';
import Header from './components/header/header';

export const Page = styled.div`
  background-color: #1E2049;
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  flex-direction: column;
`;


function App() {
  return <Page>
    <Header></Header>
  </Page>;
}

export default App;
