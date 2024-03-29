import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { themes, sizes } from '../constants/layout';
import { OrderCardProps } from '../constants/types';



const OrderCard = ({ order }: OrderCardProps) => {
  const { orderId, totalPrice, status, transactionHash } = order;

  const handleTransactionLink = () => {
    const blockchainURL = `https://blockchain.com/eth/tx/${transactionHash}`;
    Linking.openURL(blockchainURL);
  };

  return (
    <View style={[styles.card, { backgroundColor: themes.light.card }]}>
      <View style={styles.orderInfo}>
        <Text style={[styles.label, { color: themes.light.text }]}>Order ID:</Text>
        <Text style={[styles.text, { color: themes.light.text, fontSize: sizes.font.medium }]}>#{orderId}</Text>
      </View>
      <View style={styles.orderInfo}>
        <Text style={[styles.label, { color: themes.light.text }]}>Total Price:</Text>
        <Text style={[styles.text, { color: themes.light.text, fontSize: sizes.font.medium }]}>${totalPrice}</Text>
      </View>
      <View style={styles.orderInfo}>
        <Text style={[styles.label, { color: themes.light.text }]}>Status:</Text>
        <Text style={[styles.text, { color: themes.light.text, fontSize: sizes.font.medium }]}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Text>
      </View>
      <View style={styles.orderInfo}>
        <Text style={[styles.label, { color: themes.light.text }]}>Transaction Hash:</Text>
        <Text style={[styles.transactionHash, { color: themes.light.primary, fontSize: sizes.font.medium }]} onPress={handleTransactionLink}>
          {transactionHash}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: sizes.layout.medium,
    marginVertical: sizes.layout.small,
    borderRadius: sizes.layout.small,
    borderWidth: 1,
    borderColor: themes.light.border,
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: sizes.layout.small,
  },
  label: {
    fontSize: sizes.font.medium,
    color: themes.placeholder,
    fontFamily: 'Montserrat-Regular',
  },
  text: {
    fontSize: sizes.font.medium,
    color: themes.light.text,
    fontFamily: 'Montserrat-Regular',
  },
  transactionHash: {
    textDecorationLine: 'underline',
  },
});

export default OrderCard;
