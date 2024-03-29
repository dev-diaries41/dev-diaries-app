import { StyleSheet, Image, ImageSourcePropType } from 'react-native';
import React from 'react';
import { MotiView } from 'moti';
import { themes } from '../constants/layout';

interface AnimatedImageProps {
    size?: number;
    translateY?: number;
    darkTheme?: boolean;
    source?: ImageSourcePropType;
}

const AnimatedImage = ({
  size = 200, 
  translateY = -50, 
  darkTheme = true, 
  source = require('../../assets/logo.png')
}: AnimatedImageProps) => {
  return (
    <MotiView
      style={styles.container}
      from={{ opacity: 0.5, translateY: translateY }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 1000, loop:true }}
    >
      <Image
        source={source}
        style={{width: size, height:size, tintColor: darkTheme? themes.dark.text:themes.light.text}}
      />
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  image: {
    width: 200,
    height: 200,
  },
});

export default AnimatedImage;
