import {View, Text} from 'react-native';
import React from 'react';
import CreateScreenShot from './src/pages/CreateScreenShot';

const App = () => {
  return (
    <View>
      <CreateScreenShot
        playerName="John Doe"
        score="1500"
        backgroundImage={require('./src/assets/BG.png')}
        onShare={status => console.log('Share status:', status)}
      />
    </View>
  );
};

export default App;
