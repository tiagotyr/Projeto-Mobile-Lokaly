import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '@/constants/theme';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import ComplaintCard from '@/components/ComplaintCard';
import { Plus, Camera, Filter } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export default function ComplaintsScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'new' | 'processing' | 'resolved'>('all');
  const [showNewComplaint, setShowNewComplaint] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  
  // Sample complaints data
  const complaints = [
    {
      id: '1',
      title: 'Vazamento na pia do banheiro',
      description: 'A pia do banheiro está com um vazamento na conexão com a parede. Já tentei apertar, mas continua pingando.',
      date: '28/07/2025',
      status: 'processing' as const,
      imageUrl: 'https://images.pexels.com/photos/5728342/pexels-photo-5728342.jpeg',
      responses: [
        {
          id: '1',
          message: 'Iremos enviar um encanador para verificar o problema.',
          date: '29/07/2025',
          isLandlord: true,
        }
      ]
    },
    {
      id: '2',
      title: 'Infiltração no teto da sala',
      description: 'Apareceu uma mancha de umidade no teto da sala, próximo à janela. Parece estar aumentando de tamanho.',
      date: '15/07/2025',
      status: 'resolved' as const,
      imageUrl: 'https://images.pexels.com/photos/5734582/pexels-photo-5734582.jpeg',
      responses: [
        {
          id: '1',
          message: 'Verificamos e consertamos o vazamento do apartamento superior. A mancha deve secar nos próximos dias.',
          date: '18/07/2025',
          isLandlord: true,
        }
      ]
    },
    {
      id: '3',
      title: 'Interruptor da cozinha não funciona',
      description: 'O interruptor da luz da cozinha parou de funcionar. As lâmpadas estão boas, testei em outros lugares.',
      date: '01/08/2025',
      status: 'new' as const,
      responses: []
    },
  ];
  
  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  
  const handleViewComplaint = (id: string) => {
    // Navigate to complaint details
    alert(`Visualizar detalhes do chamado ${id}`);
  };
  
  const handleFilter = (filter: 'all' | 'new' | 'processing' | 'resolved') => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setActiveFilter(filter);
  };
  
  const filteredComplaints = complaints.filter(complaint => {
    if (activeFilter === 'all') return true;
    return complaint.status === activeFilter;
  });
  
  const handleNewComplaint = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setShowNewComplaint(true);
  };
  
  const handleCancel = () => {
    setShowNewComplaint(false);
    setTitle('');
    setDescription('');
    setImage(null);
  };
  
  const handleSubmit = () => {
    if (!title || !description) {
      alert('Por favor, preencha o título e a descrição do chamado.');
      return;
    }
    
    // Here you would typically send the data to your server
    alert('Chamado registrado com sucesso!');
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    // Reset form and hide it
    setTitle('');
    setDescription('');
    setImage(null);
    setShowNewComplaint(false);
  };
  
  const handleTakePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.granted === false) {
        alert('É necessário permissão para acessar a câmera');
        return;
      }
      
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      alert('Erro ao capturar imagem');
    }
  };
  
  const handlePickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        alert('É necessário permissão para acessar a galeria');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      alert('Erro ao selecionar imagem');
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Meus Chamados" />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
        }
      >
        {/* New Complaint Button */}
        {!showNewComplaint && (
          <TouchableOpacity 
            style={styles.newButton}
            onPress={handleNewComplaint}
          >
            <Plus size={20} color={COLORS.white} />
            <Text style={styles.newButtonText}>Novo Chamado</Text>
          </TouchableOpacity>
        )}
        
        {/* New Complaint Form */}
        {showNewComplaint && (
          <Card variant="elevated" style={styles.formCard}>
            <Text style={styles.formTitle}>Novo Chamado</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Título</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Vazamento na cozinha"
                value={title}
                onChangeText={setTitle}
                placeholderTextColor={COLORS.textLight}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Descrição</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Descreva o problema em detalhes..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholderTextColor={COLORS.textLight}
              />
            </View>
            
            <View style={styles.imageSection}>
              <Text style={styles.inputLabel}>Adicionar Foto (opcional)</Text>
              
              <View style={styles.imageButtonsContainer}>
                <TouchableOpacity
                  style={styles.imageButton}
                  onPress={handleTakePhoto}
                >
                  <Camera size={20} color={COLORS.primary} />
                  <Text style={styles.imageButtonText}>Tirar Foto</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.imageButton}
                  onPress={handlePickImage}
                >
                  <Plus size={20} color={COLORS.primary} />
                  <Text style={styles.imageButtonText}>Galeria</Text>
                </TouchableOpacity>
              </View>
              
              {image && (
                <View style={styles.imagePreviewContainer}>
                  <Image
                    source={{ uri: image }}
                    style={styles.imagePreview}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => setImage(null)}
                  >
                    <Text style={styles.removeImageText}>Remover</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            
            <View style={styles.formButtons}>
              <Button
                title="Cancelar"
                onPress={handleCancel}
                variant="outline"
                style={styles.cancelButton}
              />
              <Button
                title="Enviar"
                onPress={handleSubmit}
                disabled={!title || !description}
              />
            </View>
          </Card>
        )}
        
        {/* Filters */}
        <View style={styles.filtersContainer}>
          <Text style={styles.filtersLabel}>
            <Filter size={16} color={COLORS.textLight} /> Filtrar:
          </Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScrollView}>
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
                activeFilter === 'new' && styles.activeFilterButton
              ]}
              onPress={() => handleFilter('new')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  activeFilter === 'new' && styles.activeFilterButtonText
                ]}
              >
                Novos
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.filterButton,
                activeFilter === 'processing' && styles.activeFilterButton
              ]}
              onPress={() => handleFilter('processing')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  activeFilter === 'processing' && styles.activeFilterButtonText
                ]}
              >
                Em Andamento
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.filterButton,
                activeFilter === 'resolved' && styles.activeFilterButton
              ]}
              onPress={() => handleFilter('resolved')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  activeFilter === 'resolved' && styles.activeFilterButtonText
                ]}
              >
                Resolvidos
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        
        {/* Complaints List */}
        <View style={styles.complaintsContainer}>
          {filteredComplaints.length > 0 ? (
            filteredComplaints.map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                onViewDetails={handleViewComplaint}
              />
            ))
          ) : (
            <Card variant="outlined" style={styles.emptyStateCard}>
              <Text style={styles.emptyStateText}>
                Nenhum chamado encontrado para o filtro selecionado.
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
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.l,
    borderRadius: 12,
    marginBottom: SPACING.l,
  },
  newButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: COLORS.white,
    marginLeft: SPACING.s,
  },
  formCard: {
    marginBottom: SPACING.l,
    padding: SPACING.l,
  },
  formTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: COLORS.text,
    marginBottom: SPACING.m,
  },
  inputContainer: {
    marginBottom: SPACING.m,
  },
  inputLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  input: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 8,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: SPACING.m,
  },
  imageSection: {
    marginBottom: SPACING.m,
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.m,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.backgroundLight,
    paddingVertical: SPACING.s,
    paddingHorizontal: SPACING.m,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginRight: SPACING.m,
  },
  imageButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: COLORS.primary,
    marginLeft: SPACING.xs,
  },
  imagePreviewContainer: {
    marginTop: SPACING.s,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: SPACING.s,
    right: SPACING.s,
    backgroundColor: COLORS.error,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.s,
    borderRadius: 4,
  },
  removeImageText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: COLORS.white,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    marginRight: SPACING.m,
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
  },
  filtersScrollView: {
    flexGrow: 0,
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
  complaintsContainer: {
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