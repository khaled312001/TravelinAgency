export const useMessageCounter = () => {
  const unreadCount = ref(0)
  const totalCount = ref(0)

  const fetchMessageCounts = async () => {
    try {
      const response = await $fetch('/api/contact-messages')
      if (response && response.messages) {
        const messages = response.messages
        totalCount.value = messages.length
        unreadCount.value = messages.filter((msg: any) => msg.status === 'new').length
      }
    } catch (error) {
      console.error('Error fetching message counts:', error)
    }
  }

  const updateCounts = (newTotal: number, newUnread: number) => {
    totalCount.value = newTotal
    unreadCount.value = newUnread
  }

  const markAsRead = () => {
    unreadCount.value = 0
  }

  const incrementCount = () => {
    totalCount.value++
    unreadCount.value++
  }

  return {
    unreadCount: readonly(unreadCount),
    totalCount: readonly(totalCount),
    fetchMessageCounts,
    updateCounts,
    markAsRead,
    incrementCount
  }
}
