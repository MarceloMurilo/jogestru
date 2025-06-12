import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { listarGrupos, criarGrupo, listarMembrosGrupo, adicionarMembroGrupo } from '../services/groupService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GroupsScreen = ({ navigation }) => {
  const [grupos, setGrupos] = useState([]);
  const [novoGrupo, setNovoGrupo] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [membros, setMembros] = useState([]);

  useEffect(() => {
    fetchGrupos();
  }, []);

  const fetchGrupos = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userId = JSON.parse(atob(token.split('.')[1])).id;

      const gruposData = await listarGrupos(userId);
      setGrupos(gruposData);
    } catch (error) {
      console.error('Erro ao buscar grupos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os grupos.');
    }
  };

  const handleCriarGrupo = async () => {
    if (!novoGrupo.trim()) {
      Alert.alert('Erro', 'O nome do grupo não pode estar vazio.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const userId = JSON.parse(atob(token.split('.')[1])).id;

      const novoGrupoData = await criarGrupo({ organizador_id: userId, nome_grupo: novoGrupo });
      setGrupos((prevGrupos) => [...prevGrupos, novoGrupoData]);
      setNovoGrupo('');
      Alert.alert('Sucesso', 'Grupo criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar grupo:', error);
      Alert.alert('Erro', 'Não foi possível criar o grupo.');
    }
  };

  const handleSelecionarGrupo = async (grupoId) => {
    try {
      const membrosData = await listarMembrosGrupo(grupoId);
      setSelectedGroup(grupoId);
      setMembros(membrosData);
    } catch (error) {
      console.error('Erro ao listar membros do grupo:', error);
      Alert.alert('Erro', 'Não foi possível carregar os membros do grupo.');
    }
  };

  const handleAdicionarMembro = async (grupoId, amigoId) => {
    try {
      await adicionarMembroGrupo(grupoId, amigoId);
      Alert.alert('Sucesso', 'Membro adicionado com sucesso!');
      handleSelecionarGrupo(grupoId);
    } catch (error) {
      console.error('Erro ao adicionar membro ao grupo:', error);
      Alert.alert('Erro', 'Não foi possível adicionar o membro ao grupo.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Grupos</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do novo grupo"
        value={novoGrupo}
        onChangeText={setNovoGrupo}
      />
      <TouchableOpacity style={styles.createButton} onPress={handleCriarGrupo}>
        <Text style={styles.buttonText}>Criar Grupo</Text>
      </TouchableOpacity>

      <FlatList
        data={grupos}
        keyExtractor={(item) => item.id_grupo.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.groupItem}
            onPress={() => handleSelecionarGrupo(item.id_grupo)}
          >
            <Text style={styles.groupName}>{item.nome_grupo}</Text>
          </TouchableOpacity>
        )}
      />

      {selectedGroup && (
        <View style={styles.membersContainer}>
          <Text style={styles.membersTitle}>Membros do Grupo</Text>
          <FlatList
            data={membros}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.memberItem}>
                <Text>{item.nome}</Text>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  createButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  groupItem: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  groupName: {
    fontSize: 16,
  },
  membersContainer: {
    marginTop: 20,
  },
  membersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  memberItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
});

export default GroupsScreen;
