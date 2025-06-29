//Vocabulary test page
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, Image, View, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Appbar } from 'react-native-paper';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GOOGLE_API_KEY } from '@env';
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

const Vocab = ({ navigation }) => {
  const [essayData, setEssayData] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleOptionSelect = (qIndex, option) => {
    setSelectedAnswers(prev => ({ ...prev, [qIndex]: option }));
  };

  const handleSubmit = () => {
    let newScore = 0;
    essayData.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
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
      Generate 5 random words from the English dictionary with 4 options with meanings in MCQ format for each word. Choose the words at B1 English level. Return the output as an array in the following format:
      [
        {
          "question": "What does the word 'borrow' mean?",
          "options": ["To give something for free", "To take something for a short time", "To break something", "To sell something"],
          "correctAnswer": "To take something for a short time"
        },
        {
          "question": "What does the word 'lazy' mean?",
          "options": ["Very fast", "Not wanting to work", "Full of energy", "Good at sports"],
          "correctAnswer": "Not wanting to work"
        },
        {
          "question": "What does the word 'repair' mean?",
          "options": ["To paint something", "To clean something", "To fix something that is broken", "To buy something new"],
          "correctAnswer": "To fix something that is broken"
        },
        {
          "question": "What does the word 'hungry' mean?",
          "options": ["Feeling tired", "Wanting to eat", "Being cold", "Needing sleep"],
          "correctAnswer": "Wanting to eat"
        },
        {
          "question": "What does the word 'teacher' mean?",
          "options": ["A person who writes books", "A person who works in a hospital", "A person who teaches students", "A person who drives a bus"],
          "correctAnswer": "A person who teaches students"
        }
      ]
    `;

    try {
      const result = await model.generateContent(userInput);
      const response = await result.response;
      const parsedData = JSON.parse(response.text().replace(/^\s*```json\n?/, '').replace(/\n?```\s*$/, ''));
      setEssayData(parsedData);
    } catch (error) {
      console.error("Error fetching vocab questions:", error.message);
      // Retry once after a delay to avoid infinite loop
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
            <Text style={currentStyles.text}>Choose the option that correctly describes the words.</Text>
            {essayData.length === 0 && (
              <Text style={currentStyles.subText}>Loading questions...</Text>
            )}
            {essayData.map((q, index) => (
              <View key={index} style={{ marginBottom: 20 }}>
                <Text style={{ fontWeight: 'bold', marginBottom: 5, marginLeft: 10 }}>{index + 1}. {q.question}</Text>
                {q.options.map((option, optIdx) => {
                  const isSelected = selectedAnswers[index] === option;
                  let optionStyle = currentStyles.optionButton;
                  if (!submitted) {
                    optionStyle = [
                      currentStyles.optionButton,
                      { backgroundColor: isSelected ? '#d3d3d3' : '#f0f0f0' }
                    ];
                  } else {
                    if (option === q.correctAnswer) {
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
                      <Text style={{ paddingLeft: 10 }}>{option}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}

            <TouchableOpacity
              style={[
                currentStyles.submitButton,
                Object.keys(selectedAnswers).length !== 5 && { backgroundColor: '#cccccc' }
              ]}
              onPress={handleSubmit}
              disabled={Object.keys(selectedAnswers).length !== 5}
            >
              <Text style={currentStyles.submitButtonText}>
                {Object.keys(selectedAnswers).length !== 5
                  ? `Select ${5 - Object.keys(selectedAnswers).length} more`
                  : 'Submit'}
              </Text>
            </TouchableOpacity>

            {submitted && (
              <View style={currentStyles.resultDialog}>
                <Text style={currentStyles.resultText}>Your score is:</Text>
                <Text style={currentStyles.scoreText}>{score}/5</Text>
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
    paddingHorizontal: 10,
    marginTop: 20,
  },
  text: {
    color: 'black',
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom:10,
  },
  subText: {
    color: 'black',
    fontSize: 15,
    marginLeft: 10,
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
    backgroundColor: 'black',
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

export default Vocab;
