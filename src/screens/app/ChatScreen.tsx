import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  LayoutChangeEvent,
} from 'react-native';
import auth from '@react-native-firebase/auth';

import useGlobalMessages, { ChatMsg } from '../../hooks/useGlobalMessages';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { sendGift, sendMessage } from '../../features/chat/api/send';

const ACCENT = '#009BFF';
const BG = '#0D0D0D';
const CARD = '#141414';
const BORDER = '#1e1e1e';
const TEXT = '#FFFFFF';
const SUB = '#8A8A8A';

export default function ChatScreen() {
  const me = auth().currentUser?.uid;
  const listRef = useRef<FlatList<ChatMsg>>(null);

  const { msgs, loading, loadMore } = useGlobalMessages(40);
  const [input, setInput] = useState('');
  const [inputBarHeight, setInputBarHeight] = useState(56);
  const insets = useSafeAreaInsets();

  const safeAreaInsets = useSafeAreaInsets();

  const onInputBarLayout = (e: LayoutChangeEvent) => {
    setInputBarHeight(Math.ceil(e.nativeEvent.layout.height));
  };


  const data = useMemo(() => msgs, [msgs]);

  const onSend = async () => {
    const t = input.trim();
    if (!t) return;
    setInput('');
    await sendMessage(t);
    // scroll to top (since list is inverted)
    requestAnimationFrame(() =>
      listRef.current?.scrollToOffset({ offset: 0, animated: true }),
    );
  };

  const onGift = async () => {
    await sendGift();
  };

  const renderItem = ({ item }: { item: ChatMsg }) => {
    const mine = item.senderId === me;
    return (
      <View style={[styles.row, mine ? styles.rowMine : styles.rowOther]}>
        {!mine && (
          <View style={[styles.avatar, { backgroundColor: '#222' }]}>
            <Text style={styles.avatarText}>
              {getInitials(item.senderName, item.senderEmail)}
            </Text>
          </View>
        )}
        <View
          style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleOther]}
        >
          <Text style={[styles.sender, mine && { color: '#BBDFFF' }]}>
            {getDisplayLabel(item.senderEmail, item.senderName)}
          </Text>
          <Text style={styles.msgText}>{item.text}</Text>
          {item.type === 'gift' && (
            <View style={styles.giftTag}>
              <Ionicons name="gift-outline" size={14} color="#000" />
              <Text style={styles.giftText}>Gift</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.screen,
        {
          paddingTop: safeAreaInsets.top,
          paddingBottom: safeAreaInsets.bottom,
        },
      ]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={insets.bottom || 0}
    >
      <FlatList
        ref={listRef}
        data={msgs}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        inverted
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          padding: 12,
          paddingBottom: inputBarHeight + insets.bottom,
        }}
        style={styles.list}
        onEndReachedThreshold={0.2}
        onEndReached={loadMore}
      />

      <View style={styles.inputBar} onLayout={onInputBarLayout}>
        <TouchableOpacity onPress={onGift} style={styles.iconBtn}>
          <Ionicons name="gift-outline" size={20} color={ACCENT} />
        </TouchableOpacity>

        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type a message"
          placeholderTextColor={SUB}
          style={styles.input}
        />
        <TouchableOpacity onPress={onSend} style={styles.sendBtn}>
          <Ionicons name="send" size={18} color="#000" />
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

function getDisplayLabel(email?: string | null, name?: string | null) {
  if (name && name.trim()) return name.trim();
  if (email) return email.split('@')[0];
  return 'User';
}

function getInitials(name?: string | null, email?: string | null) {
  const label = getDisplayLabel(email, name);
  const parts = label
    .replace(/[^a-z0-9 ]/gi, '')
    .trim()
    .split(/\s+/);
  const initial = (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
  return initial.toUpperCase() || 'U';
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: CARD },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    borderBottomColor: BORDER,
    borderBottomWidth: 1,
  },
  title: { color: TEXT, fontSize: 16, fontWeight: '700' },

  list: { flex: 1 },

  row: { flexDirection: 'row', marginVertical: 6, paddingHorizontal: 12 },
  rowMine: { justifyContent: 'flex-end' },
  rowOther: { justifyContent: 'flex-start' },

  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 12 },

  bubble: {
    maxWidth: '80%',
    backgroundColor: CARD,
    borderColor: BORDER,
    borderWidth: 1,
    borderRadius: 14,
    padding: 10,
  },
  bubbleMine: { backgroundColor: '#0F1E28', borderColor: '#14384F' },
  bubbleOther: {},

  sender: { color: SUB, fontSize: 12, marginBottom: 4 },
  msgText: { color: TEXT, fontSize: 14 },

  giftTag: {
    marginTop: 6,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: 6,
    backgroundColor: ACCENT,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  giftText: { color: '#000', fontSize: 12, fontWeight: '700' },

  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderTopColor: BORDER,
    borderTopWidth: 1,
    padding: 10,
    backgroundColor: CARD,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderColor: BORDER,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0E0E0E',
  },
  input: {
    flex: 1,
    height: 40,
    color: TEXT,
    backgroundColor: '#0E0E0E',
    borderColor: BORDER,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  sendBtn: {
    flexDirection: 'row',
    gap: 6,
    backgroundColor: ACCENT,
    paddingHorizontal: 14,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendText: { color: '#000', fontWeight: '700' },
});
