//App.js

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './Home';
import Reading from './Reading'; 
import Writing from './Writing'; 
import FillinBlanks from './FillinBlanks';
import Vocab from './Vocab';
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}  /> 
        <Stack.Screen name="Reading" component={Reading} options={{ headerShown: false }} />
        <Stack.Screen name="Writing" component={Writing} options={{ headerShown: false }} />
        <Stack.Screen name="FillinBlanks" component={FillinBlanks} options={{ headerShown: false }} />
        <Stack.Screen name="Vocab" component={Vocab} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
