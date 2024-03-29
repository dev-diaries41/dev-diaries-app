import {View, StyleSheet} from 'react-native';
  
  const RedDot = () => {
    return <View style={styles.redDot} />;
  };

  const styles = StyleSheet.create({
    redDot: {
      position: 'absolute',
      top: 0,
      right: 45,
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: 'red',
    },
  });
  export default RedDot;