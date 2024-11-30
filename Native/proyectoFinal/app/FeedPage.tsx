import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

const API_BASE_URL = 'http://192.168.1.49:3001/api'; // Reemplaza con tu IP local

const FeedPage: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [commentingOn, setCommentingOn] = useState<string | null>(null);
  const navigation = useNavigation();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const savedToken = await AsyncStorage.getItem('token');
      setToken(savedToken);
    };

    fetchToken();
  }, []);

  useEffect(() => {
    const fetchFeed = async () => {
      if (!token) {
        setError('No hay token de autenticación.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/posts/feed`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('No autorizado. Verifica tu token.');
          }
          throw new Error('Error al obtener el feed.');
        }

        const data = await response.json();
        setPosts(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (token) fetchFeed();
  }, [token]);

  const handleLike = async (postId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setPosts(posts.map(post => (post._id === postId ? updatedPost : post)));
      }
    } catch (error) {
      Alert.alert('Error', 'Error al dar like.');
    }
  };

  const handleComment = async (postId: string) => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (response.ok) {
        const comment = await response.json();
        setPosts(posts.map(post =>
          post._id === postId
            ? { ...post, comments: [...post.comments, comment] }
            : post
        ));
        setNewComment('');
        setCommentingOn(null);
      }
    } catch (error) {
      Alert.alert('Error', 'Error al agregar el comentario.');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0095f6" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  const renderPost = ({ item }: { item: any }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image
          source={{ uri: item.user?.profilePicture || '/default-avatar.png' }}
          style={styles.avatar}
        />
        <Text style={styles.username}>{item.user?.username || 'Usuario desconocido'}</Text>
      </View>

      <Image source={{ uri: `${API_BASE_URL}/${item.imageUrl}` }} style={styles.postImage} />

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleLike(item._id)}>
          <FontAwesome
            name={item.likes.includes(token) ? 'heart' : 'heart-o'}
            size={24}
            color={item.likes.includes(token) ? '#ed4956' : '#262626'}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCommentingOn(item._id)}>
          <Ionicons name="chatbubble-outline" size={24} color="#262626" />
        </TouchableOpacity>
      </View>

      <Text style={styles.likes}>{item.likes.length} Me gusta</Text>

      {item.caption && (
        <Text style={styles.caption}>
          <Text style={styles.username}>{item.user?.username}: </Text>
          {item.caption}
        </Text>
      )}

      {commentingOn === item._id && (
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Escribe un comentario..."
          />
          <TouchableOpacity
            onPress={() => handleComment(item._id)}
            disabled={!newComment.trim()}
          >
            <Text style={styles.sendButton}>Publicar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <FlatList
      data={posts}
      renderItem={renderPost}
      keyExtractor={item => item._id}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fafafa',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 16,
    padding: 16,
    elevation: 1,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  likes: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  caption: {
    marginBottom: 10,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
    padding: 5,
  },
  sendButton: {
    color: '#0095f6',
    fontWeight: 'bold',
  },
});

export default FeedPage;
