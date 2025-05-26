import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '@/constants/theme';
import Header from '@/components/Header';
import BillCard from '@/components/BillCard';
import Card from '@/components/Card';
import { FileText, Check, CircleAlert as AlertCircle, Filter } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export default function BillsScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'paid'>('all');
  
  // Sample bills data
  const bills = [
    {
      id: '1',
      description: 'Aluguel de Agosto/2025',
      amount: 1850.00,
      dueDate: '05/08/2025',
      status: 'pending' as const,
    },
    {
      id: '2',
      description: 'Aluguel de Julho/2025',
      amount: 1850.00,
      dueDate: '05/07/2025',
      status: 'paid' as const,
      paidDate: '03/07/2025',
    },
    {
      id: '3',
      description: 'Aluguel de Junho/2025',
      amount: 1850.00,
      dueDate: '05/06/2025',
      status: 'paid' as const,
      paidDate: '04/06/2025',
    },
    {
      id: '4',
      description: 'Taxa de Condomínio - Agosto/2025',
      amount: 450.00,
      dueDate: '10/08/2025',
      status: 'pending' as const,
    },
    {
      id: '5',
      description: 'Taxa de Condomínio - Julho/2025',
      amount: 450.00,
      dueDate: '10/07/2025',
      status: 'paid' as const,
      paidDate: '08/07/2025',
    },
  ];
  
  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  
  const handleViewBill = (id: string) => {
    // Navigate to bill details
    alert(`Visualizar detalhes do boleto ${id}`);
  };
  
  const handleUploadReceipt = async (id: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedFile = result.assets[0];
        
        // Here you would typically upload the file to your server
        alert(`Comprovante anexado com sucesso!\nNome: ${selectedFile.name}\nTamanho: ${(selectedFile.size / 1024).toFixed(2)} KB`);
        
        if (Platform.OS !== 'web') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
    } catch (error) {
      alert('Erro ao selecionar o arquivo. Tente novamente.');
    }
  };
  
  const filteredBills = bills.filter(bill => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'pending') return bill.status === 'pending';
    if (activeFilter === 'paid') return bill.status === 'paid';
    return true;
  });
  
  const pendingCount = bills.filter(bill => bill.status === 'pending').length;
  const paidCount = bills.filter(bill => bill.status === 'paid').length;
  
  const handleFilter = (filter: 'all' | 'pending' | 'paid') => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setActiveFilter(filter);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Meus Boletos" />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
        }
      >
        {/* Bills Summary */}
        <View style={styles.summaryContainer}>
          <Card variant="elevated" style={[styles.summaryCard, {backgroundColor: COLORS.primary + '20'}]}>
            <View style={styles.summaryIconContainer}>
              <FileText size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.summaryValue}>{bills.length}</Text>
            <Text style={styles.summaryLabel}>Total</Text>
          </Card>
          
          <Card variant="elevated" style={[styles.summaryCard, {backgroundColor: COLORS.error + '20'}]}>
            <View style={styles.summaryIconContainer}>
              <AlertCircle size={24} color={COLORS.error} />
            </View>
            <Text style={styles.summaryValue}>{pendingCount}</Text>
            <Text style={styles.summaryLabel}>Pendentes</Text>
          </Card>
          
          <Card variant="elevated" style={[styles.summaryCard, {backgroundColor: COLORS.success + '20'}]}>
            <View style={styles.summaryIconContainer}>
              <Check size={24} color={COLORS.success} />
            </View>
            <Text style={styles.summaryValue}>{paidCount}</Text>
            <Text style={styles.summaryLabel}>Pagos</Text>
          </Card>
        </View>
        
        {/* Filters */}
        <View style={styles.filtersContainer}>
          <Text style={styles.filtersLabel}>
            <Filter size={16} color={COLORS.textLight} /> Filtrar:
          </Text>
          
          <View style={styles.filtersButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                activeFilter === 'all' && styles.activeFilterButton
              ]}
              onPress={() => handleFilter('all')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  activeFilter === 'all' && styles.activeFilterButtonText
                ]}
              >
                Todos
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.filterButton,
                activeFilter === 'pending' && styles.activeFilterButton
              ]}
              onPress={() => handleFilter('pending')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  activeFilter === 'pending' && styles.activeFilterButtonText
                ]}
              >
                Pendentes
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.filterButton,
                activeFilter === 'paid' && styles.activeFilterButton
              ]}
              onPress={() => handleFilter('paid')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  activeFilter === 'paid' && styles.activeFilterButtonText
                ]}
              >
                Pagos
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Bills List */}
        <View style={styles.billsContainer}>
          {filteredBills.length > 0 ? (
            filteredBills.map((bill) => (
              <BillCard
                key={bill.id}
                bill={bill}
                onViewDetails={handleViewBill}
                onUploadReceipt={handleUploadReceipt}
              />
            ))
          ) : (
            <Card variant="outlined" style={styles.emptyStateCard}>
              <Text style={styles.emptyStateText}>
                Nenhum boleto encontrado para o filtro selecionado.
              </Text>
            </Card>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: SPACING.l,
    paddingBottom: SPACING.xxl,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.l,
  },
  summaryCard: {
    width: '31%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.m,
  },
  summaryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.s,
  },
  summaryValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: COLORS.text,
  },
  summaryLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  filtersLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: COLORS.textLight,
    marginRight: SPACING.m,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filtersButtonsContainer: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.m,
    borderRadius: 16,
    marginRight: SPACING.xs,
    backgroundColor: COLORS.backgroundLight,
  },
  activeFilterButton: {
    backgroundColor: COLORS.primary,
  },
  filterButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: COLORS.textLight,
  },
  activeFilterButtonText: {
    color: COLORS.white,
  },
  billsContainer: {
    marginBottom: SPACING.l,
  },
  emptyStateCard: {
    padding: SPACING.l,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});