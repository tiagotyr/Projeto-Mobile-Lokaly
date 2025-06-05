import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '@/constants/theme';
import { useUser } from '@/contexts/UserContext';
import Header from '@/components/Header';
import Card from '@/components/Card';
import { Building, Users, Calendar, CircleAlert as AlertCircle, FileText, ChevronRight, CircleCheck as CheckCircle, Clock, Chrome as Home } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function LandlordHomeScreen() {
  const { user } = useUser();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  // Sample stats data
  const stats = {
    properties: 12,
    tenants: 18,
    complaints: {
      new: 3,
      processing: 2,
      resolved: 8
    },
    bills: {
      pending: 5,
      overdue: 2,
      paid: 15
    }
  };

  // Sample recent complaints
  const recentComplaints = [
    {
      id: '1',
      property: 'Residencial Flores, Apt 302',
      title: 'Vazamento na pia do banheiro',
      tenant: 'João Silva',
      date: '28/07/2025',
      status: 'new' as const,
    },
    {
      id: '2',
      property: 'Residencial Parque, Apt 105',
      title: 'Problema com o chuveiro elétrico',
      tenant: 'Maria Pereira',
      date: '27/07/2025',
      status: 'processing' as const,
    }
  ];

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getStatusColor = (status: 'new' | 'processing' | 'resolved'): string => {
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
  
  const getStatusText = (status: 'new' | 'processing' | 'resolved'): string => {
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
  
  const getStatusIcon = (status: 'new' | 'processing' | 'resolved') => {
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Painel do Locador" showNotifications onNotificationsPress={() => alert('Notificações')} />
      
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
          <Text style={styles.welcomeSubtext}>Gerencie seus imóveis e locatários</Text>
        </View>
        
        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <Card variant="elevated" style={styles.statsCard}>
            <View style={styles.statsIconContainer}>
              <Building size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.statsValue}>{stats.properties}</Text>
            <Text style={styles.statsLabel}>Imóveis</Text>
          </Card>
          
          <Card variant="elevated" style={styles.statsCard}>
            <View style={styles.statsIconContainer}>
              <Users size={24} color={COLORS.secondary} />
            </View>
            <Text style={styles.statsValue}>{stats.tenants}</Text>
            <Text style={styles.statsLabel}>Moradores</Text>
          </Card>
          
          <Card variant="elevated" style={styles.statsCard}>
            <View style={styles.statsIconContainer}>
              <Calendar size={24} color={COLORS.accent} />
            </View>
            <Text style={styles.statsValue}>{new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</Text>
            <Text style={styles.statsLabel}>Hoje</Text>
          </Card>
        </View>
        
        {/* Complaints Summary */}
        <Card variant="elevated" style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Chamados</Text>
          
          <View style={styles.summaryContent}>
            <View style={styles.summaryItem}>
              <View style={[styles.summaryIconContainer, { backgroundColor: COLORS.error + '20' }]}>
                <AlertCircle size={20} color={COLORS.error} />
              </View>
              <Text style={styles.summaryValue}>{stats.complaints.new}</Text>
              <Text style={styles.summaryLabel}>Novos</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <View style={[styles.summaryIconContainer, { backgroundColor: COLORS.warning + '20' }]}>
                <Clock size={20} color={COLORS.warning} />
              </View>
              <Text style={styles.summaryValue}>{stats.complaints.processing}</Text>
              <Text style={styles.summaryLabel}>Em Andamento</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <View style={[styles.summaryIconContainer, { backgroundColor: COLORS.success + '20' }]}>
                <CheckCircle size={20} color={COLORS.success} />
              </View>
              <Text style={styles.summaryValue}>{stats.complaints.resolved}</Text>
              <Text style={styles.summaryLabel}>Resolvidos</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => router.push}
          >
            <Text style={styles.viewAllText}>Ver Todos</Text>
            <ChevronRight size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </Card>
        
        {/* Bills Summary */}
        <Card variant="elevated" style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Boletos</Text>
          
          <View style={styles.summaryContent}>
            <View style={styles.summaryItem}>
              <View style={[styles.summaryIconContainer, { backgroundColor: COLORS.warning + '20' }]}>
                <FileText size={20} color={COLORS.warning} />
              </View>
              <Text style={styles.summaryValue}>{stats.bills.pending}</Text>
              <Text style={styles.summaryLabel}>Pendentes</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <View style={[styles.summaryIconContainer, { backgroundColor: COLORS.error + '20' }]}>
                <AlertCircle size={20} color={COLORS.error} />
              </View>
              <Text style={styles.summaryValue}>{stats.bills.overdue}</Text>
              <Text style={styles.summaryLabel}>Atrasados</Text>
            </View>
            
            <View style={styles.summaryItem}>
              <View style={[styles.summaryIconContainer, { backgroundColor: COLORS.success + '20' }]}>
                <CheckCircle size={20} color={COLORS.success} />
              </View>
              <Text style={styles.summaryValue}>{stats.bills.paid}</Text>
              <Text style={styles.summaryLabel}>Pagos</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => router.push}
          >
            <Text style={styles.viewAllText}>Ver Todos</Text>
            <ChevronRight size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </Card>
        
        {/* Recent Complaints */}
        <View style={styles.recentContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Chamados Recentes</Text>
            <TouchableOpacity 
              style={styles.viewAllButtonSmall}
              onPress={() => router.push}
            >
              <Text style={styles.viewAllText}>Ver Todos</Text>
              <ChevronRight size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
          
          {recentComplaints.map((complaint) => (
            <Card key={complaint.id} variant="outlined" style={styles.complaintCard}>
              <View style={styles.complaintHeader}>
                <Text style={styles.complaintTitle}>{complaint.title}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(complaint.status) + '20' }]}>
                  {getStatusIcon(complaint.status)}
                  <Text style={[styles.statusText, { color: getStatusColor(complaint.status) }]}>
                    {getStatusText(complaint.status)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.complaintProperty}>
                <Home size={16} color={COLORS.textLight} />
                <Text style={styles.complaintPropertyText}>{complaint.property}</Text>
              </View>
              
              <View style={styles.complaintFooter}>
                <Text style={styles.complaintDate}>
                  {complaint.date} • {complaint.tenant}
                </Text>
                
                <TouchableOpacity 
                  style={styles.viewDetailButton}
                  onPress={() => alert(`Ver detalhes do chamado ${complaint.id}`)}
                >
                  <Text style={styles.viewDetailText}>Responder</Text>
                  <ChevronRight size={16} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            </Card>
          ))}
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.l,
  },
  statsCard: {
    width: '31%',
    alignItems: 'center',
    padding: SPACING.m,
  },
  statsIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  statsValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: COLORS.text,
  },
  statsLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  summaryCard: {
    padding: SPACING.l,
    marginBottom: SPACING.l,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: COLORS.text,
    marginBottom: SPACING.m,
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.m,
  },
  summaryItem: {
    alignItems: 'center',
    width: '30%',
  },
  summaryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  summaryValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: COLORS.text,
  },
  summaryLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.s,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: SPACING.xs,
  },
  viewAllButtonSmall: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: COLORS.primary,
    marginRight: SPACING.xs,
  },
  recentContainer: {
    marginBottom: SPACING.l,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  complaintCard: {
    padding: SPACING.m,
    marginBottom: SPACING.m,
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
  complaintProperty: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  complaintPropertyText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: COLORS.textLight,
    marginLeft: SPACING.xs,
  },
  complaintFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  complaintDate: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: COLORS.textLight,
  },
  viewDetailButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: COLORS.primary,
    marginRight: SPACING.xs,
  },
});