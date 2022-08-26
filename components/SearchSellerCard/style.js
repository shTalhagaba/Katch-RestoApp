import styled from 'styled-components';

const Touchable = styled.TouchableOpacity`
  background-color: #fff;
  width: 100%;
  margin: 0 auto;
  padding: 10px;
  flex-direction: row;
`;

const Image = {
  height: 80,
  width: 80,
  borderRadius: 10,
};

const MiniInfoContainer = styled.View`
  flex-direction: row;
  margin-top: 5px;
  justify-content: space-between;
  padding: 5px 20px 0 20px;
  border-top-width: 0.2px;
  border-top-color: silver;
  border-top-width: 1px
`;

const IconTextContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const IconText = styled.Text`
  color: gray;
  margin-left: 5px;
`;

export {Touchable, Image, MiniInfoContainer,IconTextContainer,IconText};
