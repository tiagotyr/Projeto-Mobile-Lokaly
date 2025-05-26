import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  View,
  StyleProp,
  ViewStyle,
  TextStyle
} from 'react-native';
import { COLORS, SPACING } from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  iconPosition = 'right'
}) => {
  // Determine styles based on variant and size
  const getButtonStyle = () => {
    let baseStyle: ViewStyle = {};
    
    // Variant styles
    switch(variant) {
      case 'secondary':
        baseStyle = {
          backgroundColor: COLORS.secondary,
        };
        break;
      case 'outline':
        baseStyle = {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: COLORS.primary,
        };
        break;
      case 'primary':
      default:
        baseStyle = {
          backgroundColor: COLORS.primary,
        };
    }
    
    // Size styles
    switch(size) {
      case 'small':
        baseStyle = {
          ...baseStyle,
          paddingVertical: SPACING.s,
          paddingHorizontal: SPACING.m,
        };
        break;
      case 'large':
        baseStyle = {
          ...baseStyle,
          paddingVertical: SPACING.l,
          paddingHorizontal: SPACING.xl,
        };
        break;
      case 'medium':
      default:
        baseStyle = {
          ...baseStyle,
          paddingVertical: SPACING.m,
          paddingHorizontal: SPACING.l,
        };
    }
    
    // Disabled state
    if (disabled) {
      baseStyle = {
        ...baseStyle,
        opacity: 0.5,
      };
    }
    
    return baseStyle;
  };
  
  // Determine text color based on variant
  const getTextStyle = () => {
    switch(variant) {
      case 'outline':
        return { color: COLORS.primary };
      default:
        return { color: COLORS.white };
    }
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      <View style={styles.contentContainer}>
        {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
        
        {loading ? (
          <ActivityIndicator 
            color={variant === 'outline' ? COLORS.primary : COLORS.white} 
            size="small"
          />
        ) : (
          <Text style={[
            styles.text,
            getTextStyle(),
            size === 'small' && { fontSize: 14 },
            size === 'large' && { fontSize: 18 },
            textStyle
          ]}>
            {title}
          </Text>
        )}
        
        {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: SPACING.s,
  },
  iconRight: {
    marginLeft: SPACING.s,
  }
});

export default Button;