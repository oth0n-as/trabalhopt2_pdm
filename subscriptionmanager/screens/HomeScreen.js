import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function HomeScreen({ navigation }) {
  const [subscriptions, setSubscriptions] = useState([]);
  const [totalGasto, setTotalGasto] = useState(0);

  useEffect(() => {
    const q = query(collection(db, 'subscriptions'), orderBy('dataRenovacao', 'asc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const subscriptionsData = [];
      querySnapshot.forEach((doc) => {
        subscriptionsData.push({ id: doc.id, ...doc.data() });
      });
      setSubscriptions(subscriptionsData);
      
      // Calcular o gasto total
      const total = subscriptionsData.reduce((sum, sub) => sum + sub.valor, 0);
      setTotalGasto(total);
    });

    return () => unsubscribe();
  }, []);

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

  const getNextSubscriptions = () => {
    const today = new Date();
    const nextSubscriptions = subscriptions
      .filter(sub => {
        const renewalDate = sub.dataRenovacao.toDate ? sub.dataRenovacao.toDate() : new Date(sub.dataRenovacao);
        return renewalDate >= today;
      })
      .slice(0, 5);
    return nextSubscriptions;
  };

  const renderSubscriptionItem = ({ item }) => (
    <View style={styles.subscriptionItem}>
      <View style={styles.subscriptionInfo}>
        <Text style={styles.subscriptionName}>{item.nome}</Text>
        <Text style={styles.subscriptionCategory}>{item.categoria}</Text>
      </View>
      <View style={styles.subscriptionDetails}>
        <Text style={styles.subscriptionValue}>{formatCurrency(item.valor)}</Text>
        <Text style={styles.subscriptionDate}>{formatDate(item.dataRenovacao)}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Minhas Assinaturas</Text>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Gasto Total Mensal:</Text>
          <Text style={styles.totalValue}>{formatCurrency(totalGasto)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Próximas Renovações</Text>
        {getNextSubscriptions().length > 0 ? (
          <FlatList
            data={getNextSubscriptions()}
            renderItem={renderSubscriptionItem}
            keyExtractor={(item) => item.id}
            style={styles.list}
          />
        ) : (
          <Text style={styles.emptyText}>Nenhuma assinatura cadastrada</Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('AddSubscription')}
        >
          <Text style={styles.buttonText}>+ Adicionar Assinatura</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('SubscriptionList')}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>Ver Todas</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  totalContainer: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    color: 'white',
    marginBottom: 5,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  section: {
    flex: 1,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  list: {
    flex: 1,
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
  },
  subscriptionDetails: {
    alignItems: 'flex-end',
  },
  subscriptionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  subscriptionDate: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 50,
  },
  buttonContainer: {
    gap: 10,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#2196F3',
  },
});

