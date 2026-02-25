import React, { useMemo } from 'react';
import { View, Text, Linking, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import { useLanguage } from "../../utils/LanguageService";
import BackButton from "../atoms/button/BackButton";
import packageJson from '../../package.json';

const SWIPE_THRESHOLD = 80;
const MIN_VELOCITY = 200;

const InfoPage = ({ navigation }) => {
    const { translations } = useLanguage();
    const insets = useSafeAreaInsets();

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetY([-20, 20])
        .failOffsetX([-20, 20])
        .onEnd((e) => {
          const { translationY, velocityY } = e;
          if (translationY > SWIPE_THRESHOLD || velocityY > MIN_VELOCITY) {
            navigation.goBack();
          }
        }),
    [navigation]
  );

  return (
    <GestureDetector gesture={panGesture}>
    <View style={styles.container}>
      <ScrollView  contentContainerStyle={[styles.scrollContainer, { paddingBottom: 90 + insets.bottom }]}>
        <View style={styles.body}>
          <Text style={styles.header}>{translations.appName}</Text>
          <Image
            source={require('../../assets/icon.png' )}
            style={{ width: 200, height: 200 }}
          />
          <Text style={{marginBottom: 25}}>{translations.version} {packageJson.version}</Text>

          <Text style={styles.header}>{translations.appDescHead}</Text>
          <Text style={styles.text}>{translations.appDescBody}</Text>

          <Text style={styles.header}>{translations.usageHead}</Text>
          <Text style={styles.text}>{translations.usageBody}</Text>
          
        </View>

        <View style={styles.footer}>

          <View style={styles.iconSection}>
            <TouchableOpacity style={styles.icon} onPress={() => Linking.openURL('https://github.com/ThuWorks/FillUp-n-Fuel')}>
              <FontAwesome name="github" size={50} color="#FFF" />
              <Text style={styles.iconText}>GitHub</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.icon} onPress={() => Linking.openURL('mailto:tor.henrik@thuworks.com')}>
              <FontAwesome name="envelope" size={50} color="#FFF" />
              <Text style={styles.iconText}>{translations.email}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.iconSection}>
            <TouchableOpacity style={styles.icon} onPress={() => Linking.openURL('https://github.com/ThuWorks/FillUp-n-Fuel/blob/main/LICENSE')}>
              <FontAwesome name="file-text" size={50} color="#FFF" />
              <Text style={styles.iconText}>{translations.license}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.icon} onPress={() => Linking.openURL('https://github.com/ThuWorks/FillUp-n-Fuel/blob/main/privacyPolicy.md')}>
              <FontAwesome name="user-secret" size={50} color="#FFF" />
              <Text style={styles.iconText}>{translations.privacyPolicy}</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView >

      <BackButton />

    </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 90,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'justify',
  },
  footer: {
    flex: 1,
    alignItems: 'center',
    textAlign: "center",
    justifyContent: 'center',
    backgroundColor: "#a8bfad",
    borderRadius: 20,
  },
  iconSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  icon: {
    width: '50%',
    maxWidth: 160,
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 80,
  },
  iconText: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 5,
    fontSize: 15,
    color: 'white',
    textAlign: 'center',
  },
});

export default React.memo(InfoPage);
