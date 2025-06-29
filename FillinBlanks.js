//Fill in the Blanks page
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, Image, View, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Appbar } from 'react-native-paper';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GOOGLE_API_KEY } from '@env';
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

const FillinBlanks = ({ navigation }) => {
  const [essayData, setEssayData] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleOptionSelect = (qIndex, option) => {
    setSelectedAnswers(prev => ({ ...prev, [qIndex]: option }));
  };

  const handleSubmit = () => {
    let newScore = 0;
    essayData.slice(1).forEach((q, idx) => {
      if (JSON.stringify(selectedAnswers[idx]) === JSON.stringify(q.correctAnswer)) {
        newScore++;
      }
    });
    setScore(newScore);
    setSubmitted(true);
  };

  const runChatbot = async () => {
    setEssayData([]);
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(0);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const userInput = `
      Generate a random fill-in-the-blanks paragraph (max 10 sentences) on a topic from (Space exploration, Climate change, Renewable energy, Artificial intelligence, Genetic engineering, Animal migration, Coral reefs, Ancient civilizations, The history of aviation, Volcanoes, Earthquakes, Urbanization, Water conservation, The human brain, Language acquisition, Time management, Recycling, Fast fashion, Biodiversity, The internet, Social media impact, Food preservation, Nutrition, Exercise science, Plastic pollution, Solar power, Transportation systems, Archaeological discoveries, Music and the brain, Memory and learning, Education systems, Wildlife conservation, Robotics, Ocean currents, Global warming, Natural disasters, Communication technology, The printing press, Historical inventions, DNA and heredity, Space telescopes, Air pollution, Climate zones, The ozone layer, Renewable materials, Carbon footprint, Environmental activism, Deforestation, Energy efficiency, The Industrial Revolution). Create 5 blanks in the paragraph at B1 English level. Provide one set of MCQs with 4 options (each an array of 5 words) to fill all blanks. Return the output as an array in this format:
      [
        "<paragraph with blanks marked as ___>",
        {
          "question": "Choose the correct words to complete the paragraph.",
          "options": [
            ["correctWord1", "correctWord2", "correctWord3", "correctWord4", "correctWord5"],
            ["wrongWord1", "wrongWord2", "wrongWord3", "wrongWord4", "wrongWord5"],
            ["wrongWord1", "wrongWord2", "wrongWord3", "wrongWord4", "wrongWord5"],
            ["wrongWord1", "wrongWord2", "wrongWord3", "wrongWord4", "wrongWord5"]
          ],
          "correctAnswer": ["correctWord1", "correctWord2", "correctWord3", "correctWord4", "correctWord5"]
        }
      ]
    `;

    try {
      const result = await model.generateContent(userInput);
      const response = await result.response;
      const parsedData = JSON.parse(response.text().replace(/^\s*```json\n?/, '').replace(/\n?```\s*$/, ''));
      setEssayData(parsedData);
    } catch (error) {
      console.error("Error fetching content:", error.message);
      setTimeout(() => runChatbot(), 1000);
    }
  };

  useEffect(() => {
    runChatbot();
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
            <Text style={currentStyles.text}>Welcome to the Fill in the Blanks Section</Text>
            {essayData.length === 0 && (
              <Text style={currentStyles.subText}>Loading paragraph...</Text>
            )}
            {essayData.length > 0 && (
              <View style={currentStyles.paragraphBox}>
                <Text style={currentStyles.subText}>{essayData[0]}</Text>
              </View>
            )}

            {essayData.slice(1).map((q, index) => (
              <View key={index} style={{ marginBottom: 20 }}>
                <Text style={{ fontWeight: 'bold', marginBottom: 5, marginLeft: 10 }}>{index + 1}. {q.question}</Text>
                {q.options.map((option, optIdx) => {
                  const isSelected = JSON.stringify(selectedAnswers[index]) === JSON.stringify(option);
                  let optionStyle = currentStyles.optionButton;
                  if (!submitted) {
                    optionStyle = [
                      currentStyles.optionButton,
                      { backgroundColor: isSelected ? '#d3d3d3' : '#f0f0f0' }
                    ];
                  } else {
                    if (JSON.stringify(option) === JSON.stringify(q.correctAnswer)) {
                      optionStyle = [currentStyles.optionButton, { backgroundColor: '#d4edda' }];
                    } else if (isSelected) {
                      optionStyle = [currentStyles.optionButton, { backgroundColor: '#f8d7da' }];
                    } else {
                      optionStyle = [currentStyles.optionButton, { backgroundColor: '#f0f0f0' }];
                    }
                  }
                  return (
                    <TouchableOpacity
                      key={optIdx}
                      onPress={() => handleOptionSelect(index, option)}
                      style={optionStyle}
                      disabled={submitted}
                    >
                      <Text style={{ paddingLeft: 10 }}>{option.join(', ')}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}

            <TouchableOpacity
              style={[
                currentStyles.submitButton,
                Object.keys(selectedAnswers).length !== 1 && { backgroundColor: '#cccccc' }
              ]}
              onPress={handleSubmit}
              disabled={Object.keys(selectedAnswers).length !== 1}
            >
              <Text style={currentStyles.submitButtonText}>
                {Object.keys(selectedAnswers).length !== 1 ? 'Select an answer' : 'Submit'}
              </Text>
            </TouchableOpacity>

            {submitted && (
              <View style={currentStyles.resultDialog}>
                <Text style={currentStyles.resultText}>Your score is:</Text>
                <Text style={currentStyles.scoreText}>{score}/1</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
                  <TouchableOpacity style={currentStyles.actionButton} onPress={runChatbot}>
                    <Text style={currentStyles.actionButtonText}>New Test</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={currentStyles.actionButton} onPress={() => navigation.navigate('Home')}>
                    <Text style={currentStyles.actionButtonText}>Home</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
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
    paddingHorizontal: 20,
    marginTop: 20,
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
  },
  paragraphBox: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    marginHorizontal: 5,
  },
  optionButton: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 3,
    marginHorizontal: 5,
  },
  submitButton: {
    backgroundColor: 'black`',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 20,
    width: 200,
    alignSelf: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultDialog: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 10,
  },
  resultText: {
    fontSize: 18,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
    width: 100,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
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

export default FillinBlanks;
