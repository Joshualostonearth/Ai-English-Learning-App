//Reading Test Page
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, Image, View, Button, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Appbar } from 'react-native-paper';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GOOGLE_API_KEY } from '@env';
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

const Reading = ({ navigation }) => {
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
      Can you generate a random paragraph from (Space exploration, Climate change, Renewable energy, Artificial intelligence, Genetic engineering, Animal migration, Coral reefs, Ancient civilizations, The history of aviation, Volcanoes, Earthquakes, Urbanization, Water conservation, The human brain, Language acquisition, Time management, Recycling, Fast fashion, Biodiversity, The internet, Social media impact, Food preservation, Nutrition, Exercise science, Plastic pollution, Solar power, Transportation systems, Archaeological discoveries, Music and the brain, Memory and learning, Education systems, Wildlife conservation, Robotics, Ocean currents, Global warming, Natural disasters, Communication technology, The printing press, Historical inventions, DNA and heredity, Space telescopes, Air pollution, Climate zones, The ozone layer, Renewable materials, Carbon footprint, Environmental activism, Deforestation, Energy efficiency, The Industrial Revolution) topics in about 500 words and generate five questions in MCQ format based on the paragraph given. Make the paragraph in the B1 English Level. I need you to generate everything inside an array in the following format and do not write anything (don't write json or javascript))before or after the square bracket:
      [
        "In the early 1900s, the invention of the airplane transformed how people traveled and connected. Before airplanes, long-distance travel relied on ships or trains, which took days or weeks. The Wright brothers, Orville and Wilbur, built and flew the first successful airplane in 1903. This new machine allowed people to travel across countries and oceans much faster. At first, airplanes were simple and could only carry a few passengers. They were also expensive, so only wealthy people could afford to fly. Over time, airplanes became safer, larger, and more affordable. By the 1950s, many people used planes for vacations or business trips. Airplanes also helped during emergencies, like delivering food or medicine to faraway places. They changed how countries traded goods, as products could now reach markets quickly. For example, fresh fruit from one country could be sold in another within hours. Air travel also brought cultures closer, as people could visit different countries and learn about new traditions. However, early airplanes were noisy and not very comfortable, but improvements made flying a popular choice. Today, airplanes are a key part of global travel, connecting people and places like never before.",
        {
          "question": "Who invented the first successful airplane?",
          "options": ["Thomas Edison", "The Wright brothers", "Henry Ford", "Alexander Bell"],
          "correctAnswer": "The Wright brothers"
        },
        {
          "question": "What does the word 'transformed' mean in the context of the paragraph?",
          "options": ["Stopped", "Changed completely", "Slowed down", "Kept the same"],
          "correctAnswer": "Changed completely"
        },
        {
          "question": "What was a major benefit of airplanes for trade?",
          "options": ["Slower delivery", "Products reached markets quickly", "Fewer goods produced", "Higher costs"],
          "correctAnswer": "Products reached markets quickly"
        },
        {
          "question": "Why could only some people afford to fly at first?",
          "options": ["Planes were too small", "Planes were expensive", "Planes were too fast", "Planes were noisy"],
          "correctAnswer": "Planes were expensive"
        },
        {
          "question": "Which of the following was NOT an impact of the airplane’s invention?",
          "options": ["Faster travel", "Cultural exchange", "Building skyscrapers", "Emergency aid delivery"],
          "correctAnswer": "Building skyscrapers"
        }
      ];`;

    try {
      const result = await model.generateContent(userInput);
      const response = await result.response;
      const parsedData = JSON.parse(response.text().replace(/^\s*```json\n?/, '').replace(/\n?```\s*$/, ''));
      setEssayData(parsedData);
    } catch (error) {
      runChatbot();
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
            <Image source={require('./assets/LogoDark.png')} style={currentStyles.logo} />
            <Appbar.Content title="EngBot" titleStyle={currentStyles.appBarTitle} />
          </Appbar.Header>

          <View style={currentStyles.container}>
            <Text style={currentStyles.text}>Answer the questions based on the paragraph given</Text>
            {essayData.length > 0 && (
              <View style={currentStyles.paragraphBox}>
                <Text style={currentStyles.subText}>{essayData[0]}</Text>
              </View>
            )}

            {essayData.slice(1).map((q, index) => (
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
              <Text style={currentStyles.submitButtonText}>Submit</Text>
            </TouchableOpacity>

            {submitted && (
              <View style={currentStyles.resultDialog}>
                <Text style={currentStyles.resultText}>Your score is :</Text>
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
    backgroundColor: '#007bff',
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

export default Reading;
