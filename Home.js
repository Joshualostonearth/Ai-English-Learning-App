//Home page
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, Image,View,Button, TouchableOpacity,StatusBar,ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Appbar } from 'react-native-paper';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GOOGLE_API_KEY } from '@env';
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

const Home = ({ navigation }) => {
  const [wordData, setWordData] = useState(null);

  const runChatbot = async () => {
    setWordData(null);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const userInput = `
      Generate a random word and its meaning from the English dictionary that can be used in day to day conversations and profession and respond only with an array containing a single object in the form {"word": "example", "meaning": "definition"}.
    `;

    try {
      const result = await model.generateContent(userInput);
      const response = await result.response;
      const parsedData = JSON.parse(response.text().replace(/^\s*```json\n?/, '').replace(/\n?```\s*$/, ''));
      setWordData(parsedData[0]);
    } catch (error) {
      console.error("Error fetching word:", error.message);
      runChatbot();
    }
  };

  useEffect(() => {
    runChatbot();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={currentStyles.safeArea}>
        <StatusBar barStyle={'light-content'} backgroundColor={'white'} />
        <Appbar.Header style={currentStyles.appBar}>
          <Image source={require('./assets/LogoDark.png')} style={currentStyles.logo} />
          <Appbar.Content title="EngBot" titleStyle={currentStyles.appBarTitle} />
          <TouchableOpacity style={currentStyles.settingsButton}>
            <Text style={currentStyles.text}>...</Text>
          </TouchableOpacity>
        </Appbar.Header>
        {wordData && wordData.word && wordData.meaning ? (
          <View style={currentStyles.wordMeaningBox}>
            <Text style={currentStyles.boldText}>The meaning of 
              </Text>
              <Text style={currentStyles.wordFont}>{wordData.word} </Text>
            <Text>{wordData.meaning}</Text>
          </View>
        ) : (
          <View style={currentStyles.wordMeaningBox}>
            <Text>Loading word...</Text>
          </View>
        )}
        <ScrollView style={currentStyles.container}>
          <View style={currentStyles.buttonContainer}>
            <View style={currentStyles.buttonRow}>
              <TouchableOpacity style={currentStyles.button} onPress={() => navigation.navigate('Vocab')}>
                <Image source={require('./assets/Vocab.png')} style={currentStyles.image} />
                <Text style={currentStyles.buttonText}>Vocabulary Test</Text>
              </TouchableOpacity>
              <TouchableOpacity style={currentStyles.button} onPress={() => navigation.navigate('FillinBlanks')}>
                <Image source={require('./assets/FillBlanks.png')} style={currentStyles.image} />
                <Text style={currentStyles.buttonText}>Fill in the blanks</Text>
              </TouchableOpacity>
            </View>
            <View style={currentStyles.buttonRow}>
              <TouchableOpacity style={currentStyles.button} onPress={() => navigation.navigate('Reading')}>
                <Image source={require('./assets/reading.png')} style={currentStyles.image} />
                <Text style={currentStyles.buttonText}>Reading Test</Text>
              </TouchableOpacity>
              <TouchableOpacity style={currentStyles.button} onPress={() => navigation.navigate('Writing')}>
                <Image source={require('./assets/WritingDark.png')} style={currentStyles.image} />
                <Text style={currentStyles.buttonText}>Writing Test</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};


const currentStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  appBar: {
    backgroundColor: 'white',
    borderBottomWidth: 3,
    borderBottomColor: 'black',
  },
  appBarTitle: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  settingsButton: {
    padding: 10,
  },
  headText: {
    marginTop: 20,
    marginLeft: 10,
  },
  text: {
    color: 'black',
    fontSize: 25,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 5,
  },
  button: {
    width: 160,
    height: 165,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 5,
    marginVertical: 5,
    elevation: 5,
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    marginTop: 10,
  },
  wordMeaningBox: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    marginVertical: 20,
    marginHorizontal: 10,
  },
  wordFont:{
    color:"black",
    fontSize:20,
    fontWeight: 'bold',
  },
  image: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
    boldText: {
    color: '#9B9999',
    fontSize: 16,
  },
  logo: {
    marginLeft: 10,
    marginRight: 5,
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
});

export default Home;
