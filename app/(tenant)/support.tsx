import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING } from '@/constants/theme';
import Header from '@/components/Header';
import Card from '@/components/Card';
import { Send, Phone, MessageCircle, Info, Mail } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useUser } from '@/contexts/UserContext';

export default function SupportScreen() {
  const { user } = useUser();
  const [message, setMessage] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Sample chat messages
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Olá! Como posso ajudar você hoje?',
      sender: 'support',
      timestamp: '09:30',
    },
  ]);
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Add user message to chat
    const newUserMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages([...messages, newUserMessage]);
    setMessage('');
    
    // Simulate response from support after a short delay
    setTimeout(() => {
      const supportResponses = [
        'Entendi. Vamos verificar isso para você.',
        'Obrigado por entrar em contato. Um atendente irá analisar sua solicitação.',
        'Certo, já registramos seu pedido. Em breve entraremos em contato.',
        'Poderia fornecer mais detalhes sobre essa questão?',
      ];
      
      const randomResponse = supportResponses[Math.floor(Math.random() * supportResponses.length)];
      
      const newSupportMessage = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'support',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      
      setMessages(prevMessages => [...prevMessages, newSupportMessage]);
      
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }, 1000);
  };
  
  // Scroll to bottom whenever messages change
  React.useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header title="Suporte" />
      
      <View style={styles.content}>
        {/* Support Options */}
        <View style={styles.optionsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Card variant="elevated" style={styles.optionCard}>
              <View style={[styles.optionIconContainer, {backgroundColor: COLORS.primary + '20'}]}>
                <Phone size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.optionTitle}>Ligar</Text>
              <Text style={styles.optionSubtitle}>Fale Conosco</Text>
            </Card>
            
            <Card variant="elevated" style={styles.optionCard}>
              <View style={[styles.optionIconContainer, {backgroundColor: COLORS.secondary + '20'}]}>
                <MessageCircle size={24} color={COLORS.secondary} />
              </View>
              <Text style={styles.optionTitle}>Chat</Text>
              <Text style={styles.optionSubtitle}>Mensagem</Text>
            </Card>
            
            <Card variant="elevated" style={styles.optionCard}>
              <View style={[styles.optionIconContainer, {backgroundColor: COLORS.accent + '20'}]}>
                <Mail size={24} color={COLORS.accent} />
              </View>
              <Text style={styles.optionTitle}>Email</Text>
              <Text style={styles.optionSubtitle}>Contato</Text>
            </Card>
            
            <Card variant="elevated" style={styles.optionCard}>
              <View style={[styles.optionIconContainer, {backgroundColor: COLORS.warning + '20'}]}>
                <Info size={24} color={COLORS.warning} />
              </View>
              <Text style={styles.optionTitle}>FAQ</Text>
              <Text style={styles.optionSubtitle}>Dúvidas</Text>
            </Card>
          </ScrollView>
        </View>
        
        {/* Chat Interface */}
        <Card variant="elevated" style={styles.chatCard}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatTitle}>Chat com Suporte</Text>
            <View style={styles.statusIndicator} />
            <Text style={styles.statusText}>Online</Text>
          </View>
          
          <ScrollView 
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
          >
            {messages.map((msg) => (
              <View 
                key={msg.id} 
                style={[
                  styles.messageBubble,
                  msg.sender === 'user' ? styles.userMessage : styles.supportMessage
                ]}
              >
                <Text style={styles.messageText}>{msg.text}</Text>
                <Text style={styles.messageTimestamp}>{msg.timestamp}</Text>
              </View>
            ))}
          </ScrollView>
          
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={100}
          >
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Digite sua mensagem..."
                value={message}
                onChangeText={setMessage}
                multiline
                placeholderTextColor={COLORS.textLight}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  !message.trim() && styles.sendButtonDisabled
                ]}
                onPress={handleSendMessage}
                disabled={!message.trim()}
              >
                <Send size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Card>
        
        {/* Support Information */}
        <Card variant="outlined" style={styles.infoCard}>
          <Text style={styles.infoTitle}>Horário de Atendimento</Text>
          <Text style={styles.infoText}>Segunda a Sexta: 8h às 18h</Text>
          <Text style={styles.infoText}>Sábado: 9h às 13h</Text>
          <Text style={styles.infoTitle} style={{marginTop: SPACING.m}}>Telefone</Text>
          <Text style={styles.infoText}>(11) 3456-7890</Text>
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.l,
  },
  optionsContainer: {
    marginBottom: SPACING.l,
  },
  optionCard: {
    padding: SPACING.m,
    marginRight: SPACING.m,
    width: 120,
    alignItems: 'center',
  },
  optionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  optionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: COLORS.text,
  },
  optionSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: COLORS.textLight,
  },
  chatCard: {
    flex: 1,
    padding: 0,
    overflow: 'hidden',
    marginBottom: SPACING.l,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.primary,
  },
  chatTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: COLORS.white,
    marginRight: SPACING.s,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
    marginRight: SPACING.xs,
  },
  statusText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: COLORS.white,
  },
  messagesContainer: {
    flex: 1,
    padding: SPACING.m,
  },
  messagesContent: {
    paddingBottom: SPACING.m,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: SPACING.m,
    borderRadius: 16,
    marginBottom: SPACING.s,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary + '20',
    borderBottomRightRadius: 4,
  },
  supportMessage: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.backgroundLight,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: COLORS.text,
  },
  messageTimestamp: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: COLORS.textLight,
    alignSelf: 'flex-end',
    marginTop: SPACING.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 20,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    paddingRight: 40,
    minHeight: 40,
    maxHeight: 100,
  },
  sendButton: {
    position: 'absolute',
    right: SPACING.m + SPACING.xs,
    backgroundColor: COLORS.primary,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.textLight,
  },
  infoCard: {
    padding: SPACING.m,
  },
  infoTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  infoText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: COLORS.text,
  },
});