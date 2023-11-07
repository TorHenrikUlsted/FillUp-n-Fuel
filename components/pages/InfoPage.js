import React from 'react';
import { View, Text, Linking, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useLanguage } from "../../utils/LanguageService";
import BackButton from "../atoms/button/BackButton";
import { version } from '../../package.json';

const InfoPage = () => {
    const { translations } = useLanguage();

  return (
    <View style={styles.container}>
      <ScrollView  contentContainerStyle={styles.scrollContainer}>
        <View style={styles.body}>
          <Text style={styles.header}>{translations.appName}</Text>
          <Image
            source={require('../../assets/icon.png' )}
            style={{ width: 200, height: 200 }}
          />
          <Text style={{marginBottom: 25}}>{translations.version} {version}</Text>

          <Text style={styles.header}>{translations.appDescHead}</Text>
          <Text style={styles.text}>{translations.appDescBody}</Text>

          <Text style={styles.header}>{translations.usageHead}</Text>
          <Text style={styles.text}>{translations.usageBody}</Text>
          
        </View>

        <View style={styles.footer}>

          <View style={styles.iconSection}>
            <TouchableOpacity style={styles.icon} onPress={() => Linking.openURL('https://github.com/ThuWorks/FillUp-n-Fuel')}>
              <Icon name="github" size={50} color="#FFF" />
              <Text style={styles.iconText}>GitHub</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.icon} onPress={() => Linking.openURL('mailto:tor.henrik@thuworks.com')}>
              <Icon name="envelope" size={50} color="#FFF" />
              <Text style={styles.iconText}>{translations.email}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.iconSection}>
            <TouchableOpacity style={styles.icon} onPress={() => Linking.openURL('https://github.com/ThuWorks/FillUp-n-Fuel/blob/main/LICENSE')}>
              <Icon name="file-text-o" size={50} color="#FFF" />
              <Text style={styles.iconText}>{translations.license}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.icon} onPress={() => Linking.openURL('https://github.com/ThuWorks/FillUp-n-Fuel/blob/main/privacyPolicy.md')}>
              <Icon name="user-secret" size={50} color="#FFF" />
              <Text style={styles.iconText}>{translations.privacyPolicy}</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView >

      <BackButton />

    </View>
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
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  icon: {
    flex: 1/2.5,
    marginHorizontal: 20,
    marginVertical: 20,
    alignItems: "center",
  },
  iconText: {
    paddingTop: 5,
    fontSize: 15,
    color: "white",
  }
});

export default InfoPage;
