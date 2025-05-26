import React from 'react';
import { 
  View, 
  StyleSheet, 
  StyleProp, 
  ViewStyle,
  TouchableOpacity
} from 'react-native';
import { COLORS, SPACING } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'small' | 'medium' | 'large';
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  variant = 'default',
  padding = 'medium'
}) => {
  // Determine card style based on variant and padding
  const getCardStyle = () => {
    let baseStyle: ViewStyle = {};
    
    // Variant styles
    switch(variant) {
      case 'elevated':
        baseStyle = {
          backgroundColor: COLORS.white,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 5,
        };
        break;
      case 'outlined':
        baseStyle = {
          backgroundColor: COLORS.white,
          borderWidth: 1,
          borderColor: COLORS.border,
        };
        break;
      case 'default':
      default:
        baseStyle = {
          backgroundColor: COLORS.white,
        };
    }
    
    // Padding styles
    switch(padding) {
      case 'none':
        baseStyle = {
          ...baseStyle,
          padding: 0,
        };
        break;
      case 'small':
        baseStyle = {
          ...baseStyle,
          padding: SPACING.s,
        };
        break;
      case 'large':
        baseStyle = {
          ...baseStyle,
          padding: SPACING.xl,
        };
        break;
      case 'medium':
      default:
        baseStyle = {
          ...baseStyle,
          padding: SPACING.l,
        };
    }
    
    return baseStyle;
  };

  const CardComponent = onPress ? TouchableOpacity : View;
  
  return (
    <CardComponent
      style={[
        styles.card,
        getCardStyle(),
        style
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.9 : 1}
    >
      {children}
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginBottom: SPACING.m,
  },
});

export default Card;