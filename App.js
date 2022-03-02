/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
} from 'react-native';

import Home from "./src/containers/home";


const App: () => Node = () => {

  return (
    <SafeAreaView style={{flex:1, backgroundColor:'red'}}>
      <Home/>
    </SafeAreaView>
  );
};

export default App;
