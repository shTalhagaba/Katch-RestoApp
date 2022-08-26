import GS from '../../GlobeStyle';
import styled from 'styled-components';
import { TouchableOpacity } from 'react-native';

const ProductImage = {
  margin: 'auto',
  marginRight: 'auto',
  borderRadius: 8,
  overflow: 'hidden',
};

const ProductContainer = styled.View`
  flex-grow: 1;
  flex-direction: row;
`;

const NumericInputContainer = styled.View`
  background-color: ${GS.buttonTextColor};
`;

const AddTouchable = styled(TouchableOpacity)`
  background-color: ${GS.buttonTextColor};
  padding: 1px 15px;
  border-width: 1px;
  border-color: silver;
  min-height: 30px;
  min-width: 40px;
  justify-content: center;
  align-items: center;
  border-radius: 7px;
`;

export { ProductImage, ProductContainer, NumericInputContainer, AddTouchable };
