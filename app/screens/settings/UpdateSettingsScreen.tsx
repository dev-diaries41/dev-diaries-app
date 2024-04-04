import { SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import { themes, sizes } from '../../constants/layout';
import { useSettingsContext } from '../../context/SettingsContext';
import CreateSettings from '../../components/CreateSettings';

const UpdateSettingsScreen = ({ route, navigation }: any) => {

  const {updatingCreateSettings} = route?.params || {};
  const { theme } = useSettingsContext();
  const darkTheme = theme === "dark";

  
  return (
    <SafeAreaView style={[{ flex: 1 },{backgroundColor:darkTheme? themes.dark.background : themes.light.background}]}>
      <ScrollView contentContainerStyle={[styles.container]}>
        {updatingCreateSettings && <CreateSettings/>}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: sizes.layout.small,
  },
  buttonContainer:{
    marginTop: 'auto',
    width: "100%"
},
});

export default UpdateSettingsScreen;
