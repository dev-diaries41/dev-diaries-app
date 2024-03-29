import React, { useState, useLayoutEffect, useEffect } from 'react';
import {View, StyleSheet, StatusBar, } from 'react-native';
import {useSettingsContext } from '../context/settingsContext';
import {themes, sizes } from '../constants/layout';
import {createFlashMsg, DatePicker } from '../components';


const Schedule = ({navigation, route}: any) => {
  const {theme} = useSettingsContext();
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date()); 
  const [selectedTime, setSelectedTime] = useState(new Date()); 
  const {showMessage, FlashMessage} = createFlashMsg();
  const isDark = theme === 'dark';
  const {isScheduling} = route.params || {}

  useEffect(() => {
    setIsDatePickerVisible(isScheduling)
  }, [])

  const toggleDatePickerVisibility = () => {
    setIsDatePickerVisible(!isDatePickerVisible);
    setIsTimePickerVisible(false);
  };

  const toggleTimePickerVisibility = () => {
    setIsTimePickerVisible(!isTimePickerVisible);
    setIsDatePickerVisible(false);
  };

  const handleDatePicked = (pickedDate: Date) => {
    setSelectedDate(pickedDate);
  };

  const handleTimePicked = (pickedTime: Date) => {
    setSelectedTime(pickedTime);
  };
    
  return (
    <View style = {[styles.container, {backgroundColor: isDark? themes.dark.background: themes.light.background}]}>
      <DatePicker
        mode={'date'}
        visible={isDatePickerVisible}
        onClose={toggleDatePickerVisibility}
        onSelectedValueChanged={handleDatePicked}
      />
      <DatePicker
        mode={'time'}
        visible={isTimePickerVisible}
        onClose={toggleTimePickerVisibility}
        onSelectedValueChanged={handleTimePicked}
      />
    <FlashMessage/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position:'relative',
    backgroundColor: themes.dark.background,
    padding: sizes.layout.small,
    paddingTop: StatusBar.currentHeight! * 2,
  },
  
 
});
export default Schedule;
