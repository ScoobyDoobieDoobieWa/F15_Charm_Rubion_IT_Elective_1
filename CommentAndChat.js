import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';

export default function App() {
  const [activeTab, setActiveTab] = useState('chat'); 
  const [input, setInput] = useState('');
  const [replyInput, setReplyInput] = useState({}); 

  const [messages, setMessages] = useState([
    { id: '1', text: 'Hello!', sender: 'other' },
    { id: '2', text: 'Hi! How are you?', sender: 'me' },
  ]);

  const [comments, setComments] = useState([
    { id: '1', text: 'This is awesome! 🔥', user: 'Alice', replies: [] },
    { id: '2', text: 'Totally agree with you.', user: 'Bob', replies: [] },
  ]);


  const sendMessage = () => {
    if (!input.trim()) return;
    const newMessage = { id: Date.now().toString(), text: input, sender: 'me' };
    setMessages([...messages, newMessage]);
    setInput('');
  };


  const addComment = () => {
    if (!input.trim()) return;
    const newComment = { id: Date.now().toString(), text: input, user: 'You', replies: [] };
    setComments([...comments, newComment]);
    setInput('');
  };

  const addReply = (commentId) => {
    if (!replyInput[commentId]?.trim()) return;

    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...comment.replies, { id: Date.now().toString(), user: 'You', text: replyInput[commentId] }],
        };
      }
      return comment;
    });

    setComments(updatedComments);
    setReplyInput({ ...replyInput, [commentId]: '' });
  };

  const renderMessage = ({ item }) => (
    <View style={[styles.message, item.sender === 'me' ? styles.myMessage : styles.otherMessage]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  const renderComment = ({ item }) => (
    <View style={styles.commentBox}>
      <Text style={styles.username}>{item.user}</Text>
      <Text style={styles.commentText}>{item.text}</Text>

      {/* Replies */}
      {item.replies.map((reply) => (
        <View key={reply.id} style={styles.replyBox}>
          <Text style={styles.replyUser}>{reply.user}</Text>
          <Text style={styles.replyText}>{reply.text}</Text>
        </View>
      ))}

      <View style={styles.replyInputContainer}>
        <TextInput
          style={styles.replyInput}
          placeholder="Write a reply..."
          value={replyInput[item.id] || ''}
          onChangeText={(text) => setReplyInput({ ...replyInput, [item.id]: text })}
        />
        <TouchableOpacity style={styles.replyButton} onPress={() => addReply(item.id)}>
          <Text style={styles.replyButtonText}>Reply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'chat' && styles.activeTab]}
          onPress={() => setActiveTab('chat')}
        >
          <Text style={styles.tabText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'comments' && styles.activeTab]}
          onPress={() => setActiveTab('comments')}
        >
          <Text style={styles.tabText}>Comments</Text>
        </TouchableOpacity>
      </View>

      {/* Main View */}
      <FlatList
        data={activeTab === 'chat' ? messages : comments}
        keyExtractor={(item) => item.id}
        renderItem={activeTab === 'chat' ? renderMessage : renderComment}
        contentContainerStyle={activeTab === 'chat' ? styles.chatContainer : styles.commentList}
      />

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={activeTab === 'chat' ? 'Type a message...' : 'Write a comment...'}
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={activeTab === 'chat' ? sendMessage : addComment}
        >
          <Text style={styles.sendText}>{activeTab === 'chat' ? 'Send' : 'Post'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },


  tabContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, backgroundColor: '#f5f5f5', borderBottomWidth: 1, borderColor: '#ddd' },
  tabButton: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20 },
  activeTab: { backgroundColor: '#007AFF' },
  tabText: { color: '#000', fontWeight: 'bold' },


  chatContainer: { padding: 10 },
  message: { padding: 10, borderRadius: 10, marginVertical: 5, maxWidth: '70%' },
  myMessage: { backgroundColor: '#DCF8C6', alignSelf: 'flex-end' },
  otherMessage: { backgroundColor: '#EEE', alignSelf: 'flex-start' },
  messageText: { fontSize: 16 },

 
  commentList: { padding: 10 },
  commentBox: { marginBottom: 12, padding: 10, backgroundColor: '#F3F4F6', borderRadius: 8 },
  username: { fontWeight: 'bold', marginBottom: 4 },
  commentText: { fontSize: 15, color: '#333' },


  replyBox: { marginLeft: 20, marginTop: 5, backgroundColor: '#E5E7EB', padding: 8, borderRadius: 6 },
  replyUser: { fontWeight: 'bold', fontSize: 13 },
  replyText: { fontSize: 14 },

  replyInputContainer: { flexDirection: 'row', marginTop: 5 },
  replyInput: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 20, paddingHorizontal: 10, backgroundColor: '#fff', height: 35 },
  replyButton: { marginLeft: 5, backgroundColor: '#2563EB', paddingHorizontal: 15, justifyContent: 'center', borderRadius: 20 },
  replyButtonText: { color: '#fff', fontWeight: 'bold' },


  inputContainer: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderColor: '#ddd' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 20, paddingHorizontal: 15, backgroundColor: '#fff' },
  sendButton: { marginLeft: 10, backgroundColor: '#2563EB', paddingHorizontal: 20, justifyContent: 'center', borderRadius: 20 },
  sendText: { color: '#fff', fontWeight: 'bold' },
});
