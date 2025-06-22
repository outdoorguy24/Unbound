import { COLORS, SPACING } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { getUserProfile } from "@/lib/supabaseUserProfile";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message_text: string;
  created_at: string;
}

export default function ChatScreen() {
  const { partnerId } = useLocalSearchParams<{ partnerId: string }>();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [partnerName, setPartnerName] = useState("Partner");
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation();

  useEffect(() => {
    if (!partnerId) return;

    const fetchPartnerProfile = async () => {
      const profile = await getUserProfile(partnerId);
      if (profile) {
        const name = profile.first_name || "Partner";
        setPartnerName(name);
        navigation.setOptions({ 
          title: name,
          headerBackTitle: 'Back'
        });
      }
    };

    fetchPartnerProfile();
  }, [partnerId, navigation]);

  const fetchMessages = useCallback(async () => {
    if (!user || !partnerId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${user.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${user.id})`
        )
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  }, [user, partnerId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    if (!user || !partnerId) return;

    const channel = supabase
      .channel(`chat-room-${user.id}-${partnerId}`)
      .on<Message>(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${user.id}`,
        },
        (payload) => {
          setMessages((prevMessages) => [...prevMessages, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, partnerId]);

  const handleSend = async () => {
    if (newMessage.trim().length === 0 || !user || !partnerId) return;

    const tempId = `temp_${Date.now()}`;
    const messageToSend = {
      sender_id: user.id,
      receiver_id: partnerId,
      message_text: newMessage.trim(),
    };

    // Optimistic UI update
    setMessages((prevMessages) => [
      ...prevMessages,
      { ...messageToSend, id: tempId, created_at: new Date().toISOString() },
    ]);
    setNewMessage("");

    const { data: dbMessage, error } = await supabase.from("messages").insert(messageToSend).select().single();

    if (error) {
      console.error("Error sending message:", error);
      // On failure, remove the optimistic message
      setMessages((prevMessages) => prevMessages.filter((m) => m.id !== tempId));
      Alert.alert("Error", "Message could not be sent.");
    } else {
      // On success, replace the temp message with the real one from DB
      setMessages((prevMessages) =>
        prevMessages.map((m) => (m.id === tempId ? dbMessage : m))
      );
    }
  };
  
  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };
  
  useEffect(() => {
      if (messages.length > 0) {
          setTimeout(scrollToBottom, 100);
      }
  }, [messages])

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {messages.length === 0 ? (
        <View style={styles.centered}>
            <Text style={styles.emptyMessage}>Start the conversation!</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageContainer,
                item.sender_id === user?.id
                  ? styles.userMessageContainer
                  : styles.partnerMessageContainer,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  { color: item.sender_id === user?.id ? '#FFFFFF' : COLORS.textPrimary },
                ]}
              >
                {item.message_text}
              </Text>
            </View>
          )}
          contentContainerStyle={styles.listContentContainer}
          onContentSizeChange={scrollToBottom}
        />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1E6', // Parchment-like background
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContentContainer: {
    padding: SPACING.md,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messageContainer: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 20,
    marginBottom: SPACING.md,
    maxWidth: "80%",
  },
  userMessageContainer: {
    alignSelf: "flex-end",
    backgroundColor: COLORS.primary,
  },
  partnerMessageContainer: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderColor: '#E6D3A7',
    borderWidth: 1,
  },
  messageText: {
    fontFamily: 'Vollkorn-Regular',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    paddingBottom: Platform.OS === 'ios' ? SPACING.lg : SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: '#E6D3A7',
    backgroundColor: "#F5F1E6",
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingHorizontal: SPACING.md,
    marginRight: SPACING.sm,
    fontFamily: 'Vollkorn-Regular',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E6D3A7',
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontFamily: 'Vollkorn-Bold',
    fontSize: 16,
  },
  emptyMessage: {
    fontSize: 18,
    color: COLORS.textPrimary,
    fontFamily: 'Vollkorn-SemiBold'
  }
}); 