import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
} from 'react-native';

//3rd party
import {AirbnbRating} from 'react-native-ratings';
import {useMutation, useLazyQuery} from '@apollo/react-hooks';
import auth from '@react-native-firebase/auth';
import Lottie from 'lottie-react-native';

//others
import GS, {BoldText, RText} from '../../GlobeStyle';
import {GET_ORDERS_TO_REVIEW, REVIEW_STORE} from '../../components/GraphQL';
import {ReviewStar} from '../../assets/Lottie';
import { connect } from 'react-redux';
import { animateLayout } from '../../components/Helpers';

const OrderReview = (props) => {
  if (auth().currentUser) {
    const [showAppreciation, setShowAppreciation] = useState(false);

    const [order, setOrder] = useState(null);
    const [rating, setRating] = useState(0);
    const currentSelectedService = useRef(props.selectedService);
    const didFetch = useRef(false);
    const [reviewStore] = useMutation(REVIEW_STORE);

    const [getOrderToReview] = useLazyQuery(GET_ORDERS_TO_REVIEW, {
      onCompleted: (data) => {
        setOrder(data.getOrdersToReview);
      },
    });

    useEffect(() => {
      if(props.selectedService !== currentSelectedService.current){
        if(!didFetch.current){
          didFetch.current = true;
          getOrderToReview();
        }
      }
    },[props.selectedService]);

    const onClose = () => {
      setOrder(null);
    };

    const onConfirm = () => {
			animateLayout();
      reviewStore({
        variables: {
          review: {
            storeId: order.storeId,
            orderId: order._id,
            rating: rating,
          },
        },
      });

			setShowAppreciation(true);
			setTimeout(() => {
				onClose()
			},1500)
    };

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={order !== null}
        onRequestClose={onClose}>
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          
          <TouchableOpacity
            onPress={onClose}
            style={{
              flexGrow: 1,
              backgroundColor: '#00000010',
            }}
          />
          <View>
            <View>
              <View
                style={{
                  borderRadius: 10,
                  backgroundColor: '#00000010',
                }}>
                <View
                  style={{
                    backgroundColor: '#fff',
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    overflow: 'hidden',
                    paddingHorizontal: 15,
                    paddingBottom: 20,
                  }}>
                  {/* rating */}
                  <View
										style={{
											height:!showAppreciation? 'auto': 0,
											overflow: !showAppreciation? 'visible': 'hidden',
										}}>
                    <BoldText
											style={{
												fontSize: 18,
												marginTop: 15,
												marginBottom: 20
											}}>
                      How was your experience with {order?.storeName} ?
                    </BoldText>
                    <AirbnbRating
                      count={5}
                      showRating={false}
                      defaultRating={rating}
                      size={40}
                      onFinishRating={(value) => {
                        if (rating === 0) {
                          animateLayout();
                        }
                        setRating(value);
                      }}
                    />

                    <TouchableOpacity
                      onPress={onConfirm}
                      style={{
                        backgroundColor: GS.secondaryColor,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: rating !== 0 ? 15 : 0,
                        borderRadius: 10,
                        marginTop: 15,
                        height: rating !== 0 ? 'auto' : 0,
                      }}>
                      <RText style={{color: '#fff', fontSize: 18}}>
                        Confirm
                      </RText>
                    </TouchableOpacity>
                  </View>
                  {/* rating */}
                  {/* lottie */}
                  <View
                    style={{
                      height: showAppreciation? 'auto': 0,
                      overflow: 'hidden',
                      paddingVertical: showAppreciation? 10:0,
                      justifyContent: 'center',
                      alignItems: 'center',
                    
                    }}>
                      <View style={{height:200}}>
                        {showAppreciation && <Lottie
                      autoPlay={true}
                      loop={false}
                      source={ReviewStar}
                      style={{height: 200,width:400}}
                      resizeMode="cover"
                    />}
                      
                      </View>
                    
                    <BoldText
                      style={{fontSize: 30}}>
                      Thank you
                    </BoldText>
                  </View>
                  {/* lottie */}
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  } else {
    return null;
  }
};

const mapStateToProps = (state) => {
  return {
    selectedService: state.user.selectedService,
  };
};

export default connect(mapStateToProps, null)(OrderReview);
