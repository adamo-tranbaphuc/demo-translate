/**
 * @format
 */
require('./App');
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['new NativeEventEmitter','Require cycle:','Warning: Each child in a list should have a unique "key" prop']);
AppRegistry.registerComponent(appName, () => App);
