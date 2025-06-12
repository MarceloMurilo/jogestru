import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AuthContext from '../contexts/AuthContext';

// Stacks existentes
import AuthStackNavigator from './AuthStackNavigator';
import AdminStackNavigator from './AdminStackNavigator';
import AppNavigator from './AppNavigator';
import GestorStackNavigator from './GestorStackNavigator';

// Telas extras
import InviteHandlerScreen from '../screens/InviteHandlerScreen';
import ViewProfileScreen from '../features/perfil/screens/ViewProfileScreen';

// ✅ Novo fluxo de onboarding
import OnboardingNavigator from '../features/admin/onboarding/OnboardingNavigator';

const Stack = createStackNavigator();

export default function RootNavigator() {
  const { user } = useContext(AuthContext);
  const isSuperAdmin = user?.role === 'superadmin';
  const isGestor = user?.role === 'gestor';

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="AuthStack" component={AuthStackNavigator} />
      ) : isSuperAdmin ? (
        <Stack.Screen name="AdminStack" component={AdminStackNavigator} />
      ) : isGestor ? (
        <Stack.Screen name="GestorStack" component={GestorStackNavigator} />
      ) : (
        <Stack.Screen name="MainApp" component={AppNavigator} />
      )}

      {/* Telas extras */}
      <Stack.Screen
        name="InviteHandler"
        component={InviteHandlerScreen}
        options={{ headerShown: true, title: 'Gerenciar Convite' }}
      />
      <Stack.Screen
        name="ViewProfile"
        component={ViewProfileScreen}
        options={{ headerShown: true, title: 'Perfil' }}
      />

      {/* ✅ Fluxo de onboarding Stripe */}
      <Stack.Screen
        name="OnboardingFlow"
        component={OnboardingNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
