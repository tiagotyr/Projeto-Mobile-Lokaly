import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING } from '@/constants/theme';
import Card from './Card';
import { Calendar, Clock, Check, Upload, CircleAlert as AlertCircle } from 'lucide-react-native';
import Button from './Button';

type BillStatus = 'pending' | 'paid' | 'overdue';

interface BillCardProps {
  bill: {
    id: string;
    description: string;
    amount: number;
    dueDate: string;
    status: BillStatus;
    paidDate?: string;
  };
  onViewDetails: (id: string) => void;
  onUploadReceipt: (id: string) => void;
}

const BillCard: React.FC<BillCardProps> = ({ bill, onViewDetails, onUploadReceipt }) => {
  const getStatusColor = (status: BillStatus): string => {
    switch (status) {
      case 'paid':
        return COLORS.success;
      case 'overdue':
        return COLORS.error;
      case 'pending':
      default:
        return COLORS.warning;
    }
  };
  
  const getStatusText = (status: BillStatus): string => {
    switch (status) {
      case 'paid':
        return 'Pago';
      case 'overdue':
        return 'Atrasado';
      case 'pending':
      default:
        return 'Pendente';
    }
  };
  
  const getStatusIcon = (status: BillStatus) => {
    const color = getStatusColor(status);
    
    switch (status) {
      case 'paid':
        return <Check size={16} color={color} />;
      case 'overdue':
        return <AlertCircle size={16} color={color} />;
      case 'pending':
      default:
        return <Clock size={16} color={color} />;
    }
  };
  
  return (
    <Card variant="outlined" style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.description}>{bill.description}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(bill.status) + '20' }]}>
          {getStatusIcon(bill.status)}
          <Text style={[styles.statusText, { color: getStatusColor(bill.status) }]}>
            {getStatusText(bill.status)}
          </Text>
        </View>
      </View>
      
      <View style={styles.amountContainer}>
        <Text style={styles.amountLabel}>Valor:</Text>
        <Text style={styles.amountValue}>
          R$ {bill.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </Text>
      </View>
      
      <View style={styles.dateContainer}>
        <View style={styles.dateItem}>
          <Calendar size={16} color={COLORS.textLight} />
          <Text style={styles.dateLabel}>Vencimento:</Text>
          <Text style={styles.dateValue}>{bill.dueDate}</Text>
        </View>
        
        {bill.status === 'paid' && bill.paidDate && (
          <View style={styles.dateItem}>
            <Check size={16} color={COLORS.success} />
            <Text style={styles.dateLabel}>Pago em:</Text>
            <Text style={styles.dateValue}>{bill.paidDate}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.actionsContainer}>
        <Button 
          title="Ver Detalhes" 
          onPress={() => onViewDetails(bill.id)} 
          variant="outline"
          size="small"
          style={styles.detailsButton}
        />
        
        {bill.status !== 'paid' && (
          <Button 
            title="Anexar Comprovante" 
            onPress={() => onUploadReceipt(bill.id)}
            size="small"
            icon={<Upload size={16} color={COLORS.white} />}
          />
        )}
      </View>
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
    marginBottom: SPACING.m,
  },
  description: {
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
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  amountLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: COLORS.text,
    marginRight: SPACING.xs,
  },
  amountValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: COLORS.primary,
  },
  dateContainer: {
    marginBottom: SPACING.m,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  dateLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: COLORS.textLight,
    marginLeft: SPACING.xs,
    marginRight: SPACING.xs,
  },
  dateValue: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: COLORS.text,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailsButton: {
    marginRight: SPACING.s,
  },
});

export default BillCard;