import { Alert, StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { sizes, themes } from '../constants/layout'
import { Tag } from '../constants/types'
import TextWithIconButton from './TextWithIconButton'
import IconButton from './IconButton'


  interface TagsWrapperProps {
    darkTheme: boolean;
    tags: Tag[]
    onClose: () => void;
    onTagSelect: (tag: Tag) => void;
    deleteTag: (tagToDelete: Tag) => void;
  }
const TagsWrapper = ({darkTheme, tags, onClose, onTagSelect, deleteTag}: TagsWrapperProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null)

  const handleSelectedTag = (tag: Tag) => {
    onTagSelect(tag)        
    onClose();
  }

  const handleEditTag = (tagToEdit: Tag) => {
    setIsEditing(true)
    setSelectedTag(tagToEdit)
  }

  const handleConfirmDelete = (tagToDelete: Tag) => {
    deleteTag(tagToDelete);
    setSelectedTag(null);
    setIsEditing(false)
    onClose();
  }

  const handleDeleteTag = (tagToDelete: Tag) => {
    Alert.alert(
      `Delete tag`,
      `Are you sure you want to delete '${tagToDelete.tagName}'?`,
      [
        {
          text: 'Cancel',
          onPress: () => onClose(),
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => handleConfirmDelete(tagToDelete)
        },
      ],
      { cancelable: false } // Whether tapping outside the alert cancels it (default: true)
    );
  };

  return (
    <View style={styles.channelsContainer}>
        {
        tags.map((tag, index) => 
        <View key ={index} style={styles.rowContainer}>
          <TextWithIconButton
            onLongPress={()=>handleEditTag(tag)}
            onPress={()=>handleSelectedTag(tag)}
            buttonText={tag.tagName}
            color={darkTheme? themes.dark.text:themes.light.text}  
            icon={'pricetag'}
            iconColor={darkTheme? themes.dark.primary:themes.light.primary}
            />
          {isEditing && selectedTag === tag && 
          <IconButton
            onPress={()=>handleDeleteTag(tag) }
            color={themes.colors.red}  
            icon={'trash'}
            />}
        </View>
        )}
       
    </View>
  )
}

export default TagsWrapper

const styles = StyleSheet.create({
    channelsContainer: {
        flex:1,
        paddingTop: sizes.layout.small,
        gap: sizes.layout.xSmall,
        justifyContent:'center',
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom:sizes.layout.small,
        borderRadius:sizes.layout.medium,
      },  
      label: {
        fontSize: sizes.font.small,
        color: themes.dark.text,
        marginBottom:sizes.layout.small,
        
        marginLeft: 8
      },

      // Circle
      circle: {
        width: 15,
        height: 15,
        borderRadius: 7.5,
        borderWidth: 1,
        borderColor: themes.placeholder,
        marginHorizontal: 10,
      },
      filledCircle: {
        backgroundColor: themes.dark.primary,
        borderColor: themes.placeholder,
      },

})