/*
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import AsyncStorage from '@react-native-async-storage/async-storage';

const titoImage = require('../assets/images/tito.png');

const API_BASE_URL = 'http://192.168.1.10:3001/api';

interface User {
  _id: string;
  username: string;
  profilePicture: string;
}

interface Comment {
  _id: string;
  user: User;
  content: string;
}

interface Post {
  _id: string;
  user: User;
  imageUrl: string;
  likes: string[];
  comments: Comment[];
  caption: string;
}

type RootStackParamList = {
  Feed: undefined;
  Profile: undefined;
  Notifications: undefined;
  Upload: undefined;
  Search: undefined;
};

type FeedPageNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Feed'>;

const FeedPage: React.FC<{ user: User | null }> = ({ user }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [commentingOn, setCommentingOn] = useState<string | null>(null);
  const navigation = useNavigation<FeedPageNavigationProp>();

  const token = AsyncStorage.getItem('token'); // Almacenar token en AsyncStorage es mejor en apps móviles

  useEffect(() => {
    const examplePosts: Post[] = [
      {
        _id: '1',
        user: {
          _id: 'user1',
          username: 'Tito',
          profilePicture: titoImage,  // Usando la imagen importada
        },
        imageUrl: titoImage,  // Usando la imagen importada
        likes: [],
        comments: [],
        caption: 'Esta es una publicación de ejemplo.',
      },
      {
        _id: '2',
        user: {
          _id: 'user2',
          username: 'Tito',
          profilePicture: titoImage,  // Usando la imagen importada
        },
        imageUrl: titoImage,  // Usando la imagen importada
        likes: [],
        comments: [],
        caption: 'Otra publicación de ejemplo.',
      },
    ];

    setPosts(examplePosts);
    setLoading(false);
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/feed`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar las publicaciones');
      }

      const data = await response.json();
      setPosts(data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar el feed');
      setLoading(false);
    }
  };

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
      console.error('Error al dar like:', error);
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
          post._id === postId ? { ...post, comments: [...post.comments, comment] } : post
        ));
        setNewComment('');
        setCommentingOn(null);
      }
    } catch (error) {
      console.error('Error al comentar:', error);
    }
  };

  if (!user) {
    return <Text>Inicia sesión para ver el contenido del feed.</Text>;
  }

  return (
    <View style={styles.feedContainer}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Fakestagram</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <View style={styles.postCard}>
              <View style={styles.postHeader}>
                <Text style={styles.username}>{item.user.username}</Text>
              </View>
              <View style={styles.postActions}>
                <TouchableOpacity onPress={() => handleLike(item._id)}>
                  <Text style={styles.likeButton}>{item.likes.length}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setCommentingOn(item._id)}>
                  <Text style={styles.commentButton}></Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.caption}>
                {item.user.username} {item.caption}
              </Text>

              <View>
                {item.comments.map(comment => (
                  <Text key={comment._id} style={styles.comment}>
                    <Text style={styles.username}>{comment.user.username}: </Text>
                    {comment.content}
                  </Text>
                ))}
              </View>

              <TextInput
                style={styles.commentInput}
                placeholder="Añade un comentario..."
                value={newComment}
                onChangeText={setNewComment}
                onSubmitEditing={() => handleComment(item._id)}
              />
            </View>
          )}
        />
      )}

      <View style={styles.navigationBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Feed')} style={styles.navIcon}>
          <Text>Feed</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Search')} style={styles.navIcon}>
          <Text>Buscar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Upload')} style={styles.navIcon}>
          <Text>Subir foto</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={styles.navIcon}>
          <Text>Notificaciones</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.navIcon}>
          <Text>Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  feedContainer: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#dbdbdb',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#262626',
  },
  errorText: { // Aquí agregamos la propiedad errorText
    color: 'red',
    fontSize: 14,
    marginTop: 10,
  },
  postCard: {
    backgroundColor: 'white',
    marginBottom: 10,
    padding: 10,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  postImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
  },
  likeButton: {
    color: '#ed4956',
  },
  commentButton: {
    color: '#0095f6',
  },
  caption: {
    padding: 8,
    fontSize: 14,
  },
  comment: {
    padding: 8,
    fontSize: 14,
  },
  commentInput: {
    borderTopWidth: 1,
    borderColor: '#dbdbdb',
    padding: 8,
    fontSize: 14,
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#dbdbdb',
  },
  navIcon: {
    padding: 10,
  },
});

export default FeedPage;
*/