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
import Appccc from "./src/containers/home/a";


const App: () => Node = () => {

  return (
    <SafeAreaView style={{flex:1}}>
      <Home/>
      {/*<Appccc/>*/}
    </SafeAreaView>
  );
};

export default App;
