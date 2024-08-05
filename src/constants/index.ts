export const keyPossmessage = {
  CAN_POP: 'canPop',
  CALL: 'call'
}

export const typeOfMessage = {
  TEXT: 0,
  IMAGE: 1
}

export const typeOfSocket = {
  JOIN_CONVERSATION_ROOM: 'join-conversation-room',
  LEAVE_CONVERSATION_ROOM: 'leave-conversation-room',
  MESSAGE_ARRIVE: 'message-arrive',
  MESSAGE_TYPING: 'message-typing'
}

export type TypeOfRule = (typeof typeOfRule)[keyof typeof typeOfRule]

export const typeOfRule = {
  CLIENT: 'client',
  WORKER: 'worker'
} as const
