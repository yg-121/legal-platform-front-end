import { MessageSquare } from "lucide-react"

interface Message {
  id: number
  from: string
  message: string
  date: string
  read: boolean
}

interface RecentMessagesProps {
  messages: Message[]
}

export default function RecentMessages({ messages }: RecentMessagesProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Messages</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Your latest communications.</p>
        </div>
        <MessageSquare className="h-5 w-5 text-gray-400" />
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {messages.length > 0 ? (
            messages.map((message) => (
              <li key={message.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          {message.from
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">{message.from}</div>
                        {!message.read && (
                          <span className="ml-2 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-blue-600"></span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{message.message}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">{formatDate(message.date)}</div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-5 sm:px-6 text-center text-gray-500">No recent messages</li>
          )}
        </ul>
        <div className="bg-gray-50 px-4 py-4 sm:px-6">
          <a href="/client/messages" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            View all messages
          </a>
        </div>
      </div>
    </div>
  )
}

