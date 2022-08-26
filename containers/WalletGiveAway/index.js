import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import GS, { normalizedFontSize, BoldText, RText } from '../../GlobeStyle';
import { KATCH_ELEMENTS, STAR } from '../../assets/images';

const WalletGiveAway = (props) => {
  const { marketingData } = props;
  const [showModal, setShowModal] = useState(false);
  const nav = useNavigation();
  const user = auth().currentUser;

  useEffect(() => {
    if (marketingData?.giveAway?.active && !user) {
      setShowModal(true);
    }
  }, [marketingData, user]);

  const onDismiss = () => {
    setShowModal(false);
  };

  const onSignUp = () => {
    onDismiss();
    nav.navigate('Account', {
      screen: 'SignUp',
    });
  };

  const text = [
    `It's great to see you! `,
    '',
    `Hello and welcome to Katch. `,
    `Let us treat you to one of the best online food ordering experiences`,
    `with exciting Offers and Coupons for Hundreds of restaurants.`,
    `ordering experiences ever.`,
    '',
    `Please sign-up for a wallet bonus of`,
  ];

  /**
OPION 1:  
It's great to see you! 
Hello and welcome to Katch. 
With Exciting Offers and Coupons for Great Savings at Hundreds of Restaurants,
We can't wait for you to enjoy one of the finest online meal ordering experiences ever.

Please sign-up for a wallet bonus of 
KD 3

See you around
Why Wait? Just Katch!


OPTION 2
It's great to see you! 
Hello and welcome to Katch. 
Let us treat you to one of the best online food ordering experiences with exciting Offers and Coupons for Hundreds of restaurants.
Please sign-up for a wallet bonus of 
KD 3

See you around
Why Wait? Just Katch!
   */
  const backdropColor = 'rgba(0,0,0,0.79)';
  return (
    <Modal
      onDismiss={onDismiss}
      isVisible={showModal}
      onBackdropPress={onDismiss}
      useNativeDriver={true}
      useNativeDriverForBackdrop={true}
      style={styles.modalStyle}
      backdropOpacity={1}
      backdropColor={backdropColor}>
      <StatusBar backgroundColor={backdropColor} />
      <View style={styles.container}>
        <View style={styles.container2}>
          <Image source={KATCH_ELEMENTS} style={styles.elements} />
          {/* {text.map((x, i) => {
            if (x === '') return <View key={i} style={{ height: 10 }} />;
            return (
              <RText key={x} style={styles.text}>
                {x}
              </RText>
            );
          })} */}
          <RText style={styles.text}>
            {`It's great to see you!\n
Hello and welcome to Katch!.\n
Let us treat you to one of the best online food ordering experiences
with exciting`}{' '}
            <BoldText style={[styles.text, { color: GS.logoGreen }]}>
              Offers
            </BoldText>{' '}
            and{' '}
            <BoldText style={[styles.text, { color: GS.logoGreen }]}>
              Coupons
            </BoldText>
            {` from hundreds of restaurants.`}
          </RText>
          <RText style={styles.text}>
          <BoldText style={[styles.text, { color: GS.logoGreen }]}>
          Sign up now
            </BoldText>
            {`\nand\nGet free wallet credit of`}
          </RText>

          <View style={{height: 150, width: 200, alignSelf: 'center', justifyContent: 'center', alignItems: 'center'}}>
            <Image source={STAR} style={styles.star}/>
            <BoldText style={styles.value}>
              {marketingData?.giveAway?.value}
              <BoldText
                style={[
                  styles.value,
                  {
                    fontSize: normalizedFontSize(15),
                  
                  },
                ]}>
                KD
              </BoldText>
            </BoldText>
          </View>

          <RText
            style={
              styles.text
            }>{`See you around\nWhy Wait? Just Katch!`}</RText>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={onSignUp}>
            <BoldText style={styles.buttonText}>REDEEM NOW</BoldText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '80%',
    alignSelf: 'center',
    marginBottom: 'auto',
    marginTop: 'auto',
    maxWidth: 330,
  },
  container2: {
    backgroundColor: '#fff',
    paddingBottom: 60,
    borderBottomLeftRadius: 170,
    borderBottomRightRadius: 170,
  },
  modalStyle: {
    padding: 0,
    margin: 0,
    flex: 1,
  },
  elements: {
    width: '100%',
    height: 55,
    resizeMode: 'contain',
    bottom: 28,
  },
  text: {
    textAlign: 'center',
    paddingBottom: 10,
    lineHeight: 25,
    fontSize: normalizedFontSize(8),
    marginHorizontal: 10,
  },
  star: {
    resizeMode: 'contain',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    width: '100%'
  },
  value: {
    color: '#fff',
    fontSize: normalizedFontSize(30),
    textAlign: 'center',
    marginVertical: 10,
  },
  buttonContainer: {
    alignSelf: 'center',
    bottom: -30,
    height: 80,
    width: 80,
    position: 'absolute',
  },
  button: {
    backgroundColor: GS.secondaryColor,
    height: 80,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  buttonText: {
    // fontSize: normalizedFontSize(8),
    color: '#fff',
    textAlign: 'center',
    paddingTop: 5,
  },
});

const mapStateToProps = (state) => {
  return {
    marketingData: state.app.marketingData,
  };
};

export default connect(mapStateToProps, null)(WalletGiveAway);
