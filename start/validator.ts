import vine, { SimpleMessagesProvider } from '@vinejs/vine'

vine.convertEmptyStringsToNull = true

vine.messagesProvider = new SimpleMessagesProvider({
  'database.exists': 'The {{ field }} does not exist',
})
