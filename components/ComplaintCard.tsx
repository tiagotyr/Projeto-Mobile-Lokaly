import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS, SPACING } from '@/constants/theme';
import Card from './Card';
import { MessageSquare, CircleAlert as AlertCircle, CircleCheck as CheckCircle, Clock } from 'lucide-react-native';
import Button from './Button';

type ComplaintStatus = 'new' | 'processing' | 'resolved';

interface ComplaintCardProps {
  complaint: {
    id: string;
    title: string;
    description: string;
    date: string;
    status: ComplaintStatus;
    imageUrl?: string;
    responses?: Array<{
      id: string;
      message: string;
      date: string;
      isLandlord: boolean;
    }>;
  };
  onViewDetails: (id: string) => void;
}

const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint, onViewDetails }) => {
  const getStatusColor = (status: ComplaintStatus): string => {
    switch (status) {
      case 'resolved':
        return COLORS.success;
      case 'processing':
        return COLORS.warning;
      case 'new':
      default:
        return COLORS.error;
    }
  };
  
  const getStatusText = (status: ComplaintStatus): string => {
    switch (status) {
      case 'resolved':
        return 'Resolvido';
      case 'processing':
        return 'Em Andamento';
      case 'new':
      default:
        return 'Novo';
    }
  };
  
  const getStatusIcon = (status: ComplaintStatus) => {
    const color = getStatusColor(status);
    
    switch (status) {
      case 'resolved':
        return <CheckCircle size={16} color={color} />;
      case 'processing':
        return <Clock size={16} color={color} />;
      case 'new':
      default:
        return <AlertCircle size={16} color={color} />;
    }
  };
  
  return (
    <Card variant="outlined" style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{complaint.title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(complaint.status) + '20' }]}>
          {getStatusIcon(complaint.status)}
          <Text style={[styles.statusText, { color: getStatusColor(complaint.status) }]}>
            {getStatusText(complaint.status)}
          </Text>
        </View>
      </View>
      
      <Text style={styles.description} numberOfLines={2}>
        {complaint.description}
      </Text>
      
      {complaint.imageUrl && (
        <Image
          source={{ uri: complaint.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      
      <View style={styles.footer}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>Enviado em:</Text>
          <Text style={styles.dateValue}>{complaint.date}</Text>
        </View>
        
        <View style={styles.responsesContainer}>
          <MessageSquare size={16} color={COLORS.textLight} />
          <Text style={styles.responsesText}>
            {complaint.responses ? complaint.responses.length : 0} respostas
          </Text>
        </View>
      </View>
      
      <Button
        title="Ver Detalhes"
        onPress={() => onViewDetails(complaint.id)}
        variant="primary"
        size="small"
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: SPACING.l,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.s,
  },
  title: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: COLORS.text,
    flex: 1,
    marginRight: SPACING.s,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.xs / 2,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    marginLeft: 4,
  },
  description: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: COLORS.text,
    marginBottom: SPACING.m,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: SPACING.m,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: COLORS.textLight,
    marginRight: SPACING.xs,
  },
  dateValue: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: COLORS.text,
  },
  responsesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  responsesText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: COLORS.textLight,
    marginLeft: SPACING.xs,
  },
});

export default ComplaintCard;