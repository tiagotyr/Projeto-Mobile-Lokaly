import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS, SPACING } from '@/constants/theme';
import Card from './Card';
import { MapPin, Bed, Bath, Maximize } from 'lucide-react-native';

interface PropertyCardProps {
  property: {
    id: string;
    name: string;
    address: string;
    imageUrl: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    rent: number;
  };
  onPress?: () => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onPress }) => {
  return (
    <Card variant="elevated" style={styles.card} onPress={onPress}>
      <Image source={{ uri: property.imageUrl }} style={styles.image} />
      
      <View style={styles.contentContainer}>
        <Text style={styles.propertyName}>{property.name}</Text>
        
        <View style={styles.addressContainer}>
          <MapPin size={16} color={COLORS.textLight} />
          <Text style={styles.addressText}>{property.address}</Text>
        </View>
        
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Bed size={16} color={COLORS.text} />
            <Text style={styles.featureText}>{property.bedrooms} Quartos</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Bath size={16} color={COLORS.text} />
            <Text style={styles.featureText}>{property.bathrooms} Banheiros</Text>
          </View>
          
          <View style={styles.featureItem}>
            <Maximize size={16} color={COLORS.text} />
            <Text style={styles.featureText}>{property.area} m²</Text>
          </View>
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Aluguel:</Text>
          <Text style={styles.priceValue}>
            R$ {property.rent.toLocaleString('pt-BR')}
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: SPACING.l,
  },
  propertyName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  addressText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: COLORS.textLight,
    marginLeft: SPACING.xs,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.m,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: COLORS.text,
    marginLeft: SPACING.xs,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  priceLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: COLORS.text,
    marginRight: SPACING.xs,
  },
  priceValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: COLORS.primary,
  },
});

export default PropertyCard;