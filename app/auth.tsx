import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Animated, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '@/contexts/UserContext';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Lock, User, ArrowRight, Info } from 'lucide-react-native';
import { COLORS, SPACING } from '@/constants/theme';
import Button from '@/components/Button';

export default function AuthScreen() {
  const [selectedRole, setSelectedRole] = useState<'tenant' | 'landlord' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useUser();
  
  const animationValue = useRef(new Animated.Value(0)).current;
  
  const handleRoleSelection = (role: 'tenant' | 'landlord') => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedRole(role);
    
    // Set default credentials based on role
    if (role === 'tenant') {
      setEmail('locatario@example.com');
      setPassword('123456');
    } else {
      setEmail('locador@example.com');
      setPassword('123456');
    }
    
    // Animation for role selection
    Animated.spring(animationValue, {
      toValue: 1,
      useNativeDriver: true,
      tension: 40,
      friction: 7
    }).start();
  };
  
  const handleLogin = () => {
    if (!email || !password || !selectedRole) return;
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    // For demo purposes, we'll just simulate a successful login
    setUser({
      id: '1',
      email,
      role: selectedRole,
      name: selectedRole === 'tenant' ? 'João Silva' : 'Imobiliária ABC',
    });
    
    // Navigate to the appropriate screen based on role
    if (selectedRole === 'tenant') {
      router.replace('/(tenant)');
    } else {
      router.replace('/(landlord)');
    }
  };
  
  const formTranslateY = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0]
  });
  
  const formOpacity = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        style={styles.headerGradient}
      />
      
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>Lokaly</Text>
        <Text style={styles.tagline}>Gestão de imóveis simplificada</Text>
      </View>
      
      <View style={styles.roleSelectionContainer}>
        <Text style={styles.roleSelectionTitle}>Quem é você?</Text>
        
        <View style={styles.roleOptions}>
          <TouchableOpacity
            style={[
              styles.roleOption,
              selectedRole === 'landlord' && styles.roleOptionSelected
            ]}
            onPress={() => handleRoleSelection('landlord')}
          >
            <View style={styles.roleIconContainer}>
              <User size={24} color={selectedRole === 'landlord' ? COLORS.white : COLORS.text} />
            </View>
            <Text style={[
              styles.roleText,
              selectedRole === 'landlord' && styles.roleTextSelected
            ]}>
              Sou Locador
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.roleOption,
              selectedRole === 'tenant' && styles.roleOptionSelected
            ]}
            onPress={() => handleRoleSelection('tenant')}
          >
            <View style={styles.roleIconContainer}>
              <User size={24} color={selectedRole === 'tenant' ? COLORS.white : COLORS.text} />
            </View>
            <Text style={[
              styles.roleText,
              selectedRole === 'tenant' && styles.roleTextSelected
            ]}>
              Sou Locatário
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {selectedRole && (
        <Animated.View 
          style={[
            styles.formContainer,
            { opacity: formOpacity, transform: [{ translateY: formTranslateY }] }
          ]}
        >
          <View style={styles.inputContainer}>
            <User size={20} color={COLORS.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor={COLORS.textLight}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Lock size={20} color={COLORS.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor={COLORS.textLight}
            />
          </View>
          
          <Button 
            title="Entrar" 
            onPress={handleLogin} 
            disabled={!email || !password}
            icon={<ArrowRight size={20} color={COLORS.white} />}
          />

          <View style={styles.testCredentialsContainer}>
            <Info size={16} color={COLORS.textLight} />
            <Text style={styles.testCredentialsText}>
              Credenciais de teste preenchidas automaticamente
            </Text>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 220,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.xxl,
  },
  logo: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 40,
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  tagline: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.9,
  },
  roleSelectionContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginHorizontal: SPACING.l,
    padding: SPACING.l,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: SPACING.xl,
  },
  roleSelectionTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: COLORS.text,
    marginBottom: SPACING.m,
    textAlign: 'center',
  },
  roleOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleOption: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 12,
    padding: SPACING.m,
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  roleOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  roleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  roleText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: COLORS.text,
    textAlign: 'center',
  },
  roleTextSelected: {
    color: COLORS.white,
  },
  formContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginHorizontal: SPACING.l,
    padding: SPACING.l,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 12,
    marginBottom: SPACING.m,
    paddingHorizontal: SPACING.m,
  },
  inputIcon: {
    marginRight: SPACING.s,
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: SPACING.m,
  },
  testCredentialsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.m,
    paddingTop: SPACING.m,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  testCredentialsText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: COLORS.textLight,
    marginLeft: SPACING.xs,
  },
});