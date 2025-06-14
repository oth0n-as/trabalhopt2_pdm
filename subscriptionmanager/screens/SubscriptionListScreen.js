import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';
import { collection, onSnapshot, query, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function SubscriptionListScreen({ navigation }) {
  const [subscriptions, setSubscriptions] = useState([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'subscriptions'), orderBy('nome', 'asc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const subscriptionsData = [];
      querySnapshot.forEach((doc) => {
        subscriptionsData.push({ id: doc.id, ...doc.data() });
      });
      setSubscriptions(subscriptionsData);
      setFilteredSubscriptions(subscriptionsData);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredSubscriptions(subscriptions);
    } else {
      const filtered = subscriptions.filter(sub =>
        sub.nome.toLowerCase().includes(searchText.toLowerCase()) ||
        sub.categoria.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredSubscriptions(filtered);
    }
  }, [searchText, subscriptions]);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Data não definida';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleDeleteSubscription = (subscription) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir a assinatura "${subscription.nome}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'subscriptions', subscription.id));
              Alert.alert('Sucesso', 'Assinatura excluída com sucesso!');
            } catch (error) {
              console.error('Erro ao excluir assinatura:', error);
              Alert.alert('Erro', 'Não foi possível excluir a assinatura. Tente novamente.');
            }
          },
        },
      ]
    );
  };

  const handleEditSubscription = (subscription) => {
    navigation.navigate('EditSubscription', { subscription });
  };

  const renderSubscriptionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.subscriptionItem}
      onLongPress={() => handleDeleteSubscription(item)}
    >
      <View style={styles.subscriptionInfo}>
        <Text style={styles.subscriptionName}>{item.nome}</Text>
        <Text style={styles.subscriptionCategory}>{item.categoria}</Text>
        <Text style={styles.subscriptionDate}>
          Próxima renovação: {formatDate(item.dataRenovacao)}
        </Text>
      </View>
      <View style={styles.subscriptionActions}>
        <Text style={styles.subscriptionValue}>{formatCurrency(item.valor)}</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditSubscription(item)}
        >
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const getTotalValue = () => {
    return filteredSubscriptions.reduce((sum, sub) => sum + sub.valor, 0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Todas as Assinaturas</Text>
        <Text style={styles.totalText}>
          Total: {formatCurrency(getTotalValue())} ({filteredSubscriptions.length} assinaturas)
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Buscar assinaturas..."
          placeholderTextColor="#999"
        />
      </View>

      {filteredSubscriptions.length > 0 ? (
        <FlatList
          data={filteredSubscriptions}
          renderItem={renderSubscriptionItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {searchText.trim() !== '' 
              ? 'Nenhuma assinatura encontrada para a busca.'
              : 'Nenhuma assinatura cadastrada ainda.'
            }
          </Text>
          {searchText.trim() === '' && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('AddSubscription')}
            >
              <Text style={styles.addButtonText}>+ Adicionar Primeira Assinatura</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('AddSubscription')}
      >
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  totalText: {
    fontSize: 16,
    color: '#666',
  },
  searchContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#333',
  },
  list: {
    flex: 1,
    padding: 20,
  },
  subscriptionItem: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  subscriptionInfo: {
    flex: 1,
    marginRight: 15,
  },
  subscriptionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subscriptionCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  subscriptionDate: {
    fontSize: 12,
    color: '#999',
  },
  subscriptionActions: {
    alignItems: 'flex-end',
  },
  subscriptionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  editButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#4CAF50',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  floatingButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

