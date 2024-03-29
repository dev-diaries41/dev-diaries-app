import React, { useState, useLayoutEffect } from 'react';
import {View, SafeAreaView, StyleSheet, Text, Alert, StatusBar} from 'react-native';
import {useSettingsContext } from '../context/settingsContext';
import {themes, sizes } from '../constants/layout';
import {InfoCard, RedDot, IconButton, createFlashMsg, Button, CustomPicker, DatePicker, TextWithIconButton, Spacer } from '../components';
import { availableTasks } from '../constants/defaultSettings';


const ScheduleScreen = ({navigation}: any) => {
  const {theme} = useSettingsContext();
  const [loading, setLoading] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date()); 
  const [selectedTime, setSelectedTime] = useState(new Date()); 
  const [newNotification, setNewNotification] = useState('');
  const {showMessage, FlashMessage} = createFlashMsg();
  const isDark = theme === 'dark';


  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.navRowButtons}>
         <IconButton icon={"notifications-outline"} onPress={handleNotificationPress} color={isDark? themes.dark.icon:themes.light.icon}/>
          {newNotification && <RedDot />}
          <IconButton icon={"settings-outline"} onPress={() => navigation.navigate('Settings Screen')} color={isDark? themes.dark.icon:themes.light.icon}/>
        </View>
      ),
    });
  }, [navigation, newNotification, theme]);

  useLayoutEffect(()=>{
    navigation.setOptions({
      tabBarStyle:{
        backgroundColor: isDark? themes.dark.card: themes.light.card,
        marginHorizontal:sizes.layout.small,
        borderRadius:sizes.layout.medium,
        height:70,
        position:'absolute',
        bottom:10,
        paddingBottom: sizes.layout.small,
        elevation: 2,
        shadowColor: themes.light.text,
        shadowOffset: {
          width: 5,
          height: 10,
        },
        shadowOpacity: 1,
        shadowRadius: sizes.layout.small,
      },
      tabBarActiveTintColor: themes.colors.darkWhite,
      tabBarInactiveTintColor: themes.placeholder,
    });
  }, [theme] )



  const handleNotificationPress = () => {
    if(newNotification){
      Alert.alert("Results", newNotification);
      setNewNotification('');
    }
    else{
      Alert.alert("No Notifications", "You have not got any new notififcations.");
    }
  };


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

  const handleSelectedTask = (task: string) => {
    setSelectedTask(task);
  };

  const handleScheduleService = () =>{
    console.log('Task scheduled')
  }

    
  return (
    <SafeAreaView style = {[styles.container, {backgroundColor: isDark? themes.dark.background: themes.light.background}]}>
      <StatusBar backgroundColor="transparent" barStyle={isDark? 'light-content':'dark-content'} translucent />
      <InfoCard 
        title={"Schedule Tasks"} 
        metadata={`Articles task schedule for: ${new Date(Date.now()).toLocaleString()}`} 
        icon={'alarm'} 
        backgroundColor={isDark? themes.dark.card:themes.light.card}
        color={isDark? themes.dark.text:themes.light.text}
        iconColor={isDark? themes.dark.icon:themes.light.icon}
      />
    <View>
      <Text style={[styles.label, {color: themes.placeholder}]}>Task:</Text>
      <CustomPicker
        label={'Select Task'}
        dropdownIconColor={isDark? themes.dark.icon:themes.secondaryIcon}
        dropdownIconRippleColor={isDark? themes.dark.primary:themes.light.primary}
        textColor={isDark? themes.dark.text:themes.light.text}
        options={availableTasks}
        selectedValue={selectedTask}
        onValueChange={handleSelectedTask}
      />
    </View>
    <Spacer/>
    <View >
      <Text style={[styles.label, {color: themes.placeholder}]}>Schedule Time:</Text>
      <View style={{flexDirection:'row', justifyContent:'flex-start', alignItems:'center'}}>
        <TextWithIconButton
          onPress={toggleDatePickerVisibility}
          buttonText={'Select Date'}
          icon={'calendar'}
          justifyContent='flex-start'
          color={isDark? themes.dark.primary:themes.light.primary}
          />
        <Text style={[styles.label,{color:isDark? themes.dark.text:themes.light.text}]}>{selectedTime.toLocaleTimeString()}</Text>
      </View>

      <View style={{flexDirection:'row', justifyContent:'flex-start', alignItems:'center'}}>
      <TextWithIconButton
          onPress={toggleTimePickerVisibility}
          buttonText={'Select Time'}
          icon={'time'}
          justifyContent='flex-start'
          color={isDark? themes.dark.primary:themes.light.primary}
        />
        <Text style={[styles.label,{color:isDark? themes.dark.text:themes.light.text}]}>{selectedTime.toLocaleTimeString()}</Text>
      </View>
    </View>

      <View style={styles.buttonContainer}>
        <Button
          onPress={handleScheduleService}
          text={'Schedule Task'}
          backgroundColor={isDark? themes.dark.primary:themes.light.primary}
          icon = {'alarm'}
          loading={loading}
          color={themes.dark.text}
        />
      </View>
      {/* Pass the correct prop values based on visibility */}
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
    </SafeAreaView>
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
  navRowButtons:{
    flexDirection: 'row', 
    justifyContent:"space-evenly",
    alignItems:'center',
    marginRight: sizes.layout.medium,
    gap:sizes.layout.medium
  },
  inputContainer: {
    justifyContent: 'center',
    backgroundColor:themes.dark.card,
    borderRadius:sizes.layout.medium,
    padding:sizes.layout.medium,
    elevation:5,
    shadowColor:themes.light.text,
    shadowOffset:{
      width:5,
      height:10
    },
    shadowOpacity:1,
    shadowRadius:sizes.layout.medium,
  },
  input: {
    width: '100%',
    maxHeight: 300,
    borderRadius: sizes.layout.small,
    paddingBottom: sizes.layout.medium,
    marginBottom: sizes.layout.medium,
    borderColor: themes.dark.primary,
     
  },
  label: {
    fontSize: sizes.font.small,
    color: themes.dark.text,
    marginBottom:sizes.layout.xSmall,
      
  },
   inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: sizes.font.small,
      
    marginTop: 5,
  },
  buttonContainer: {
    paddingBottom: sizes.layout.medium,
    width:'100%',
    marginTop:sizes.layout.medium
  },
 
});
export default ScheduleScreen;
