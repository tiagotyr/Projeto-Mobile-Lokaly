import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '@/constants/theme';
import { useUser } from '@/contexts/UserContext';
import Header from '@/components/Header';
import Card from '@/components/Card';
import PropertyCard from '@/components/PropertyCard';
import BillCard from '@/components/BillCard';
import { FileText, CircleAlert as AlertCircle, Bell, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { user } = useUser();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  // Sample property data
  const property = {
    id: '1',
    name: 'Residencial Flores, Nº 302',
    address: 'Rua das Acácias, Xique-Xique, Jupi-PE',
    imageUrl: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
    bedrooms: 4,
    bathrooms: 2,
    area: 147,
    rent: 1850.00,
  };

  // Sample upcoming bill
  const upcomingBill = {
    id: '1',
    description: 'Aluguel de Agosto/2025',
    amount: 1850.00,
    dueDate: '05/08/2025',
    status: 'pending' as const,
  };

  // Sample recent complaint
  const recentComplaint = {
    id: '1',
    title: 'Vazamento na pia do banheiro',
    date: '28/07/2025',
    status: 'processing' as const,
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleViewProperty = () => {
    // Navigate to property details
    alert('Ver detalhes do imóvel');
  };

  const handleViewBill = (id: string) => {
    router.push('/(tenant)/bills');
  };

  const handleUploadReceipt = (id: string) => {
    router.push('/(tenant)/bills');
  };

  const handleViewComplaint = (id: string) => {
    router.push('/(tenant)/complaints');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Início" showNotifications onNotificationsPress={() => alert('Notificações')} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
        }
      >
        {/* Welcome Message */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Olá, {user?.name}</Text>
          <Text style={styles.welcomeSubtext}>Veja a situação do seu imóvel</Text>
        </View>
        
        {/* Property Overview */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Seu Imóvel</Text>
          <PropertyCard property={property} onPress={handleViewProperty} />
        </View>
        
        {/* Quick Status */}
        <View style={styles.statusContainer}>
          <Card variant="elevated" style={styles.statusCard}>
            <View style={styles.statusIconContainer}>
              <FileText size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.statusValue}>1</Text>
            <Text style={styles.statusLabel}>Boleto Pendente</Text>
          </Card>
          
          <Card variant="elevated" style={styles.statusCard}>
            <View style={styles.statusIconContainer}>
              <AlertCircle size={24} color={COLORS.warning} />
            </View>
            <Text style={styles.statusValue}>1</Text>
            <Text style={styles.statusLabel}>Chamados Abertos</Text>
          </Card>
          
          <Card variant="elevated" style={styles.statusCard}>
            <View style={styles.statusIconContainer}>
              <Bell size={24} color={COLORS.error} />
            </View>
            <Text style={styles.statusValue}>3</Text>
            <Text style={styles.statusLabel}>Notificações</Text>
          </Card>
        </View>
        
        {/* Upcoming Bill */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Próximo Boleto</Text>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => router.push('/(tenant)/bills')}
            >
              <Text style={styles.viewAllText}>Ver Todos</Text>
              <ChevronRight size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
          
          <BillCard 
            bill={upcomingBill} 
            onViewDetails={handleViewBill}
            onUploadReceipt={handleUploadReceipt}
          />
        </View>
        
        {/* Recent Complaint */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Chamado Recente</Text>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => router.push('/(tenant)/complaints')}
            >
              <Text style={styles.viewAllText}>Ver Todos</Text>
              <ChevronRight size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
          
          <Card variant="outlined" style={styles.complaintCard}>
            <View style={styles.complaintHeader}>
              <Text style={styles.complaintTitle}>{recentComplaint.title}</Text>
              <View style={[styles.statusBadge, { backgroundColor: COLORS.warning + '20' }]}>
                <Text style={[styles.statusText, { color: COLORS.warning }]}>
                  Em Andamento
                </Text>
              </View>
            </View>
            
            <View style={styles.complaintDate}>
              <Text style={styles.complaintDateText}>Enviado em: {recentComplaint.date}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.viewDetailButton}
              onPress={() => handleViewComplaint(recentComplaint.id)}
            >
              <Text style={styles.viewDetailText}>Ver Detalhes</Text>
              <ChevronRight size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </Card>
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
  welcomeContainer: {
    marginBottom: SPACING.l,
  },
  welcomeText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    color: COLORS.text,
  },
  welcomeSubtext: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: COLORS.textLight,
  },
  sectionContainer: {
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: COLORS.text,
    marginBottom: SPACING.s,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: COLORS.primary,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  statusCard: {
    width: '31%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.m,
  },
  statusIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.s,
  },
  statusValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: COLORS.text,
  },
  statusLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  complaintCard: {
    padding: SPACING.m,
  },
  complaintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.s,
  },
  complaintTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: COLORS.text,
    flex: 1,
    marginRight: SPACING.s,
  },
  statusBadge: {
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.xs / 2,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
  },
  complaintDate: {
    marginBottom: SPACING.m,
  },
  complaintDateText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: COLORS.textLight,
  },
  viewDetailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  viewDetailText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: COLORS.primary,
    marginRight: SPACING.xs,
  },
});