import React from 'react';
import StackNavigator from './StackNavigator';
import { UserContext } from './userContext';

const App = () => {
  return (
   <>
   <UserContext>
   <StackNavigator/>
   </UserContext>
   
   </>
  );
};

export default App;
