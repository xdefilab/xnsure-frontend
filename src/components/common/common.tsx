import styled from 'styled-components';

export const HorizontalScroll = styled.div<{ height: string; width: string }>`
    width: ${({width}) => width};
    height: ${({height}) => height};
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow-x: scroll;
    overflow-y: hidden;
    &::-webkit-scrollbar {
        display:none;
    }
`;

export const PlaceHolder = styled.div`
    flex-shrink: 1;
    flex-grow: 1;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
`;

export const ColumnLayout = styled.div<{ height: string; width: string; center?: boolean }>`
    width: ${({width}) => width};
    height: ${({height}) => height};
    display: flex;
    flex-direction: column;
    ${({center}) => center ? 'align-items: center;' : ''}
    ${({center}) => center ? 'justify-content: center;' : ''}
`;

export const CenteredDiv = styled.div<{ height?: string; width?: string }>`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    ${({height}) => height ? `height: ${height};` : ''}
    ${({width}) => width ? `width: ${width};` : ''}
`;