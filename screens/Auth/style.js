import styled from 'styled-components';

const ValidationContainer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background-color: #e2e2e2;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  z-index: 9;
  padding: 60px 20px 10px 20px;
  flex-direction: row;
  align-items: center;
`;

const ErrorContainer = styled.View`
  justify-content: center;
  margin: 0 10px 0 20px;
  flex:1;
`;

export {
    ErrorContainer,
    ValidationContainer
}
