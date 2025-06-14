import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function EditSubscriptionScreen({ route, navigation }) {
  const { subscription } = route.params;
  
  const [nome, setNome] = useState(subscription.nome);
  const [valor, setValor] = useState(subscription.valor.toString().replace('.', ','));
  const [dataRenovacao, setDataRenovacao] = useState('');
  const [categoria, setCategoria] = useState(subscription.categoria);
  const [loading, setLoading] = useState(false);

  const categorias = ['Streaming', 'Educação', 'Software', 'Fitness', 'Outros'];

  useEffect(() => {
    // Formatar a data inicial
    if (subscription.dataRenovacao) {
      const date = subscription.dataRenovacao.toDate ? 
        subscription.dataRenovacao.toDate() : 
        new Date(subscription.dataRenovacao);
      
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      setDataRenovacao(`${day}/${month}/${year}`);
    }
  }, [subscription]);

  const handleUpdateSubscription = async () => {
    if (!nome.trim() || !valor.trim() || !dataRenovacao.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const valorNumerico = parseFloat(valor.replace(',', '.'));
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      Alert.alert('Erro', 'Por favor, insira um valor válido.');
      return;
    }

    // Validar formato da data (DD/MM/AAAA)
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dataRenovacao.match(dateRegex);
    if (!match) {
      Alert.alert('Erro', 'Por favor, insira a data no formato DD/MM/AAAA.');
      return;
    }

    const [, day, month, year] = match;
    const date = new Date(year, month - 1, day);
    
    if (date.getDate() != day || date.getMonth() != month - 1 || date.getFullYear() != year) {
      Alert.alert('Erro', 'Por favor, insira uma data válida.');
      return;
    }

    setLoading(true);

    try {
      const subscriptionRef = doc(db, 'subscriptions', subscription.id);
      await updateDoc(subscriptionRef, {
        nome: nome.trim(),
        valor: valorNumerico,
        dataRenovacao: Timestamp.fromDate(date),
        categoria: categoria,
        dataAtualizacao: Timestamp.now(),
      });

      Alert.alert('Sucesso', 'Assinatura atualizada com sucesso!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('Erro ao atualizar assinatura:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a assinatura. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatDateInput = (text) => {
    // Remove caracteres não numéricos
    const cleaned = text.replace(/\D/g, '');
    
    // Aplica a máscara DD/MM/AAAA
    if (cleaned.length <= 2) {
      return cleaned;
    } else if (cleaned.length <= 4) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    } else {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    }
  };

  const handleDateChange = (text) => {
    const formatted = formatDateInput(text);
    setDataRenovacao(formatted);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Editar Assinatura</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nome da Assinatura *</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Ex: Netflix, Spotify, Gympass..."
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Valor Mensal (R$) *</Text>
          <TextInput
            style={styles.input}
            value={valor}
            onChangeText={setValor}
            placeholder="Ex: 29,90"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Data de Próxima Renovação *</Text>
          <TextInput
            style={styles.input}
            value={dataRenovacao}
            onChangeText={handleDateChange}
            placeholder="DD/MM/AAAA"
            placeholderTextColor="#999"
            keyboardType="numeric"
            maxLength={10}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Categoria</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={categoria}
              onValueChange={(itemValue) => setCategoria(itemValue)}
              style={styles.picker}
            >
              {categorias.map((cat) => (
                <Picker.Item key={cat} label={cat} value={cat} />
              ))}
            </Picker>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleUpdateSubscription}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Atualizando...' : 'Atualizar Assinatura'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#333',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#333',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 2,
    borderColor: '#999',
  },
  cancelButtonText: {
    color: '#999',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

