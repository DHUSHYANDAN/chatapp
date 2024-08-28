export const createChatSlice = (set, get) => ({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [],
  
    setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
  
    setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
  
    setSelectedChatMessages: (selectedChatMessages) => set({ selectedChatMessages }),
  
    closeChat: () => set({
      selectedChatData: undefined,
      selectedChatType: undefined,
      selectedChatMessages: [],
    }),
  
    addMessage: (message) => {
      const selectedChatMessages = get().selectedChatMessages;
      const selectedChatType = get().selectedChatType;
  
      set({
        selectedChatMessages: [
          ...selectedChatMessages,
          {
            ...message,
            recipient: selectedChatType === "channel"
              ? message.recipient
              : message.recipient._id,
            sender: selectedChatType === "channel"
              ? message.sender
              : message.sender._id,
          },
        ],
      });
    },
  });
  