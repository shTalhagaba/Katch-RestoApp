import { useLazyQuery } from '@apollo/react-hooks';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  SafeAreaView,
  SectionList,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import {
  SPENT_WALLET,
  TOPUP_WALLET,
  WALLET_BACKGROUND,
  WALLET_ICON,
  NO_TRANSACTION,
} from '../../assets/images';
import Header from '../../components/AccountHeader';
import {
  GET_USER_WALLET,
  GET_USER_WALLET_TRANSACTION,
} from '../../components/GraphQL';
import { hydrateUserWallet } from '../../components/Redux/Actions/userActions';
import { customFont, priceSymbol, RText } from '../../GlobeStyle';
import styles from './styles';
import CustomLoading from '../../components/Loading/More';

const Wallet = (props) => {
  const navigation = useNavigation();
  const { reduxWallet: walletDetail } = props;
  // const [walletDetail, setWalletDetail] = useState(null);
  const [transactionsGroup, setTransactionsGroup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [getUserWallet] = useLazyQuery(GET_USER_WALLET, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (walletData) => {
      props.hydrateUserWallet(walletData);
    },
    onError: () => {
      props.hyderateUserWallet({ wallet: { walletTotal: '0.000' } });
    },
  });
  const [getUserWalletTransaction] = useLazyQuery(GET_USER_WALLET_TRANSACTION, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      const dateMap = {};
      data.walletTransactions.forEach((transaction) => {
        const timestamp = parseInt(transaction.transDate, 10);
        const date = moment(timestamp).format('DD MMMM YYYY');
        (dateMap[date] || (dateMap[date] = [])).push(transaction);
        transaction.sectionTitle = date;
      });
      setTransactionsGroup(
        Object.keys(dateMap).map((x) => {
          return {
            sectionTitle: x,
            data: dateMap[x],
          };
        }),
      );
      setLoading(false);
    },
  });

  useEffect(() => {
    setLoading(true);
    getUserWalletTransaction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = () => {
    getUserWallet(); // refresh wallet total in the redux
    getUserWalletTransaction();
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.headerContainer}>
        <View style={styles.headerInnerContainer}>
          <Header
            goBack={() => navigation.goBack()}
            title="My Wallet"
            icon={WALLET_ICON}
          />
        </View>
      </View>
      <View>
        <ImageBackground
          source={WALLET_BACKGROUND}
          resizeMode="cover"
          style={styles.walletDetailContainer}>
          <RText style={styles.walletText} fontName={customFont.axiformaItalic}>
            {walletDetail?.wallet?.walletTotal} {priceSymbol}
          </RText>
          <RText style={styles.walletTextSmaller}>
            {'Total Wallet Balance'}
          </RText>
        </ImageBackground>
      </View>

      <View style={styles.tcontainer}>
        <View style={styles.bar} />
        <RText style={styles.transactionText}>Transaction History</RText>
      </View>
      {loading && <Loading />}
      {!loading && transactionsGroup && transactionsGroup.length > 0 && (
        <SectionList
          sections={transactionsGroup}
          keyExtractor={(item, index) => item.transDate + index}
          renderSectionHeader={renderSectionHeader}
          renderItem={renderItem}
          stickySectionHeadersEnabled={false}
          refreshing={loading}
          showsVerticalScrollIndicator={false}
          onRefresh={refresh}
          // Performance settings
          removeClippedSubviews={true} // Unmount components when outside of window
          // initialNumToRender={2} // Reduce initial render amount
          // maxToRenderPerBatch={1} // Reduce number in each render batch
          // updateCellsBatchingPeriod={100} // Increase time between renders
          // windowSize={7} // Reduce the window size
        />
      )}
      {!loading && transactionsGroup && transactionsGroup.length === 0 && (
        <View style={styles.wrapper}>
          <Image
            source={NO_TRANSACTION}
            resizeMode="contain"
            style={styles.notransaction}
          />
          <RText style={styles.notransactiontext}>No Transaction</RText>
        </View>
      )}
    </SafeAreaView>
  );
};

const renderItem = ({ item }) => <TransactionCard {...item} />;

const renderSectionHeader = ({ section: { sectionTitle } }) => (
  <SectionHeader title={sectionTitle} />
);

class SectionHeader extends React.PureComponent {
  render() {
    return (
      <View style={styles.sectionHeaderContainer}>
        <RText style={styles.sectionHeaderText}>{this.props.title}</RText>
      </View>
    );
  }
}
const getTime = (/** @type {string} */ time) => {
  if (!time) {
    return '';
  }
  const timeStamp = parseInt(time, 10);
  return moment(timeStamp).format('hh:mm a');
};

class TransactionCard extends React.PureComponent {
  render() {
    return (
      <View style={styles.translationContainer}>
        <View>
          {this.props.type !== 'deduct' ? (
            <Image
              source={TOPUP_WALLET}
              resizeMode="contain"
              style={styles.debitCreditImage}
            />
          ) : (
            <Image
              source={SPENT_WALLET}
              resizeMode="contain"
              style={styles.debitCreditImage}
            />
          )}
        </View>
        <View style={styles.flex1}>
          <RText style={styles.orderText}>{this.props.transId}</RText>
          <View style={styles.commentContainer}>
            <RText style={styles.desc}>{this.props.title}</RText>
          </View>
          <RText style={styles.time}>{getTime(this.props.transDate)}</RText>
        </View>
        <RText
          style={[
            styles.price,
            this.props.type !== 'deduct' ? styles.positive : styles.negative,
          ]}>
          {this.props.type !== 'deduct' ? '+' : ''}
          {this.props.amount}
          {''}
          {priceSymbol}
        </RText>
      </View>
    );
  }
}

const Loading = () => (
  <View style={styles.loadingContainer}>
    <CustomLoading iconSize="large" style={styles.loadingStyle} />
  </View>
);

const mapStateToProps = (state) => {
  return {
    reduxWallet: state.user.wallet,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    hydrateUserWallet: (wallet) => dispatch(hydrateUserWallet(wallet)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
