import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useLanguage } from './LanguageProvider';
//import ReactCurvedText from 'react-curved-text';

const translations = {
  en: {
    chooseMode: 'Choose Mode',
    distanceCalculator: 'Distance Calculator',
    fillUpCalculator: 'Fill Up Calculator',
  },
  no: {
    chooseMode: 'Velg modus',
    distanceCalculator: 'Avstandskalkulator',
    fillUpCalculator: 'Fyll opp kalkulator',
  },
};

const HomePage = ({ navigation }) => {
  const { language } = useLanguage();

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}> 
        <Image 
          style={styles.logo}
          source={require('../assets/icon.png')} 
        />
        
        {/*<ReactCurvedText
            width={300}
            height={300}
            cx={150}
            cy={150}
            rx={100}
            ry={100}
            startOffset={50}
            reversed={false}
            text="react-curved-text"
            textProps={{ style: { fontSize: 24 } }}
            textPathProps={null}
            tspanProps={null}
            ellipseProps={null}
            svgProps={null}
        />*/}
      </View>
      

      <Text style={styles.heading}>{translations[language].chooseMode}</Text>
      <View style={styles.buttons}>
      <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('DistancePage')}
        >
          <Text style={styles.buttonText}>
            {translations[language].distanceCalculator}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('FillUpPage')}
        >
          <Text style={styles.buttonText}>
            {translations[language].fillUpCalculator}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    flexDirection: "column",
  },
  logo: {
    marginBottom: 50,
    justifyContent: 'center',
  },
  logoText: {
    textAlign: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 50,
  },
  buttons: {
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#00b300',
    paddingVertical: 15,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomePage;
