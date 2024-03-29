import { StyleSheet, FlatList } from 'react-native'
import React from 'react'
import { sizes, themes } from '../constants/layout'
import { Button } from './Buttons'
import { useSettingsContext } from '../context/settingsContext'

const data = [
  { key: 'photorealistic', text: 'Photorealistic' },
  { key: 'oilpainting', text: 'DaVincci' },
  { key: 'illustration', text: 'Illustration' },
  { key: 'cartoon', text: 'Cartoon', },
  { key: 'anime', text: 'Anime'},
];
interface AIImageStylesWrapperProps {
  textColor?: string;
   buttonColor?: string;
  }

const AIImageStylesWrapper = ({

}: AIImageStylesWrapperProps) => {
  const {theme} = useSettingsContext()
  const darkTheme = theme === 'dark'

  const renderItem = ({ item }: any) => (
    <Button
      onPress={() => {}}
      text={item.text}
      backgroundColor={darkTheme? themes.dark.card: themes.light.card}
      color={darkTheme? themes.dark.text: themes.light.text}
      width={"auto"}
      height={40}
      fontSize={sizes.font.xSmall}
      borderColor={darkTheme? themes.dark.primary: themes.light.primary}
      borderWidth={2}
      // icon={item.icon}
      iconSize={18}
    />
  );

  return (
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.key}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.navRowButtons}
      />
  );
}

export default AIImageStylesWrapper;

const styles = StyleSheet.create({
  navRowButtons: {
    flexDirection: 'row',
    justifyContent: "space-evenly",
    alignItems: 'center',
    maxHeight: 80,
  },
  label: {
    fontSize: sizes.font.small,
    color: themes.dark.text,
    marginVertical:sizes.layout.xSmall,
    
  },
});
