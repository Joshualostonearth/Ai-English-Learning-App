//Writing test page
import { GoogleGenerativeAI } from "@google/generative-ai";
import React, { useState, useEffect } from 'react';
import { ScrollView,StyleSheet,TextInput,Text, Image,View,StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Appbar } from 'react-native-paper';
import { GOOGLE_API_KEY } from '@env';
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

let globalUserText = '';
export const setGlobalUserText = (text) => {
  globalUserText = text;
};
export const getGlobalUserText = () => globalUserText;

const Writing = ({ navigation }) => {
  const [userText, setUserText] = useState(globalUserText);
  const [questionText, setQuestionText] = useState('');
  const [essayData, setEssayData] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleTextChange = (text) => {
    setUserText(text);
    setGlobalUserText(text);
  };

  const genQuestion = async () => {
    setQuestionText('');
    setEssayData({});
    setIsSubmitted(false);
    setUserText('');
    setGlobalUserText('');
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const userInput = `
      Generate a random question from topics (Space exploration, Climate change, Renewable energy, Artificial intelligence, Genetic engineering, Animal migration, Coral reefs, Ancient civilizations, The history of aviation, Volcanoes, Earthquakes, Urbanization, Water conservation, The human brain, Language acquisition, Time management, Recycling, Fast fashion, Biodiversity, The internet, Social media impact, Food preservation, Nutrition, Exercise science, Plastic pollution, Solar power, Transportation systems, Archaeological discoveries, Music and the brain, Memory and learning, Education systems, Wildlife conservation, Robotics, Ocean currents, Global warming, Natural disasters, Communication technology, The printing press, Historical inventions, DNA and heredity, Space telescopes, Air pollution, Climate zones, The ozone layer, Renewable materials, Carbon footprint, Environmental activism, Deforestation, Energy efficiency, The Industrial Revolution) asking the user to write an essay at B1 English level. Return the question as a string, e.g., "Write an essay about the importance of recycling."
    `;

    try {
      const result = await model.generateContent(userInput);
      const response = await result.response;
      const text = response.text();
      setQuestionText(text);
    } catch (error) {
      console.error('Error generating question:', error.message);
      setTimeout(() => genQuestion(), 1000);
    }
  };

  const checkAnswer = async () => {
    setEssayData({});
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const command = `
      Evaluate the user's essay based on the provided question.
      Question: ${questionText}
      User's Answer: ${userText}
      Return a JSON object with the following keys and their corresponding percentage scores (0-100):
      - Grammar
      - SpellingMistakes
      - Vocabulary
      - SentenceStructure
      - OverallScore
      For example:
      {
        "Grammar": 85,
        "SpellingMistakes": 90,
        "Vocabulary": 75,
        "SentenceStructure": 80,
        "OverallScore": 82
      }
    `;

    try {
      const result = await model.generateContent(command);
      const response = await result.response;
      const text = response.text();
      const cleanedText = text.replace(/^\s*```json\n?/, '').replace(/\n?```\s*$/, '');
      const parsedData = JSON.parse(cleanedText);
      if (
        parsedData.Grammar !== undefined &&
        parsedData.SpellingMistakes !== undefined &&
        parsedData.Vocabulary !== undefined &&
        parsedData.SentenceStructure !== undefined &&
        parsedData.OverallScore !== undefined
      ) {
        setEssayData(parsedData);
      } else {
        console.error('AI response does not match the expected format.');
        setEssayData({
          Grammar: 0,
          SpellingMistakes: 0,
          Vocabulary: 0,
          SentenceStructure: 0,
          OverallScore: 0,
        });
      }
    } catch (error) {
      console.error('Error checking answer:', error.message);
      setEssayData({
        Grammar: 0,
        SpellingMistakes: 0,
        Vocabulary: 0,
        SentenceStructure: 0,
        OverallScore: 0,
      });
    }
  };

  const handleSubmit = async () => {
    if (userText.trim()) {
      await checkAnswer();
      setIsSubmitted(true);
    }
  };

  useEffect(() => {
    genQuestion();
  }, []);

  return (
    <ScrollView>
      <SafeAreaProvider>
        <SafeAreaView style={currentStyles.safeArea}>
          <StatusBar barStyle={'light-content'} backgroundColor={'white'} />
          <Appbar.Header style={currentStyles.appBar}>
            <Appbar.BackAction onPress={() => navigation.navigate('Home')} />
            <Image source={require('./assets/LogoDark.png')} style={currentStyles.logo} />
            <Appbar.Content title="EngBot" titleStyle={currentStyles.appBarTitle} />
          </Appbar.Header>
          <View style={currentStyles.container}>
            <Text style={currentStyles.text}>Answer the Question with an Essay of around 200 words</Text>
            {questionText ? (
              <View style={currentStyles.paragraphBox}>
                <Text style={currentStyles.subText}>{questionText}</Text>
              </View>
            ) : (
              <Text style={currentStyles.subText}>Loading question...</Text>
            )}
            <View style={currentStyles.answerBox}>
              <TextInput
                style={[currentStyles.subText, currentStyles.textInput]}
                placeholder="Write your answer here"
                value={userText}
                onChangeText={handleTextChange}
                multiline={true}
                textAlignVertical="top"
              />
              {!isSubmitted ? (
                <TouchableOpacity
                  style={[currentStyles.submitButton, !userText.trim() && { backgroundColor: '#cccccc' }]}
                  onPress={handleSubmit}
                  disabled={!userText.trim()}
                >
                  <Text style={currentStyles.buttonText}>Submit</Text>
                </TouchableOpacity>
              ) : (
               <View style={currentStyles.resultsContainer}>
                  <Text style={currentStyles.resultText}>Grammar: {essayData.Grammar || 0}%</Text>
                  <Text style={currentStyles.resultText}>Spelling: {essayData.SpellingMistakes || 0}%</Text>
                  <Text style={currentStyles.resultText}>Vocabulary: {essayData.Vocabulary || 0}%</Text>
                  <Text style={currentStyles.resultText}>Sentence Structure: {essayData.SentenceStructure || 0}%</Text>
                  <Text style={currentStyles.resultText}>Overall Score: {essayData.OverallScore || 0}%</Text>
                  <View style={currentStyles.buttonRow}>
                    <TouchableOpacity
                      style={[currentStyles.navButton, { marginRight: 10 }]}
                      onPress={() => navigation.navigate('Home')}
                    >
                      <Text style={currentStyles.buttonText}>Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={currentStyles.navButton}
                      onPress={() => {
                        setUserText('');
                        setGlobalUserText('');
                        setEssayData({});
                        setIsSubmitted(false);
                        genQuestion();
                      }}
                    >
                      <Text style={currentStyles.buttonText}>New Test</Text>
                    </TouchableOpacity>
                  </View>
                </View>            
              )}
            </View>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </ScrollView>
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
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  text: {
    color: 'black',
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  subText: {
    color: 'black',
    fontSize: 15,
    marginBottom: 10,
    marginHorizontal: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    minHeight: 100,
    marginBottom: 10,
  },
  answerBox: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    marginHorizontal: 10,
  },
  paragraphBox: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    marginHorizontal: 10,
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 10,
  },
  navButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  resultsContainer: {
    marginTop: 10,
    marginHorizontal: 10,
  },
  resultText: {
    color: 'black',
    fontSize: 15,
    marginBottom: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  logo: {
    marginLeft: 10,
    marginRight: 5,
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
});

export default Writing;
