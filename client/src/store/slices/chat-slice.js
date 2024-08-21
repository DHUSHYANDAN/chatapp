export const createChatSlice=(set,get)=>({
    selectedChatType:undefined,
    selectedChatData:undefined,
    selectedChatMessages:[],

    setSelectedChatType:(selectedChatType)=>set({selectedChatType}),

    setSelectedChatData:
    (selectedChatData)=>set({selectedChatData}),

    setSelectedChatMessage:(selectedChatMessages)=>set({selectedChatMessages}),

    closeChat:()=>set({selectedChatData:undefined,
        selectedChatType:undefined,
        selectedChatMessages:[],
    })
})