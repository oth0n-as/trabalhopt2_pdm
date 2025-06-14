import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import AddSubscriptionScreen from './screens/AddSubscriptionScreen';
import SubscriptionListScreen from './screens/SubscriptionListScreen';
import EditSubscriptionScreen from './screens/EditSubscriptionScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#2196F3',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Minhas Assinaturas',
          }}
        />
        <Stack.Screen
          name="AddSubscription"
          component={AddSubscriptionScreen}
          options={{
            title: 'Adicionar Assinatura',
          }}
        />
        <Stack.Screen
          name="SubscriptionList"
          component={SubscriptionListScreen}
          options={{
            title: 'Todas as Assinaturas',
          }}
        />
        <Stack.Screen
          name="EditSubscription"
          component={EditSubscriptionScreen}
          options={{
            title: 'Editar Assinatura',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}