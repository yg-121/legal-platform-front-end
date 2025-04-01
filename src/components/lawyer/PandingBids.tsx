import { FileText } from "lucide-react"

interface Bid {
  id: number
  title: string
  client: string
  amount: number
  submitted: string
  expires: string
}

interface PendingBidsProps {
  bids: Bid[]
}

export default function PendingBids({ bids }: PendingBidsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">Pending Bids</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Your submitted proposals awaiting client response.</p>
        </div>
        <FileText className="h-5 w-5 text-gray-400" />
      </div>
      <div className="border-t border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Case
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Client
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Submitted
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Expires
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bids.length > 0 ? (
                bids.map((bid) => (
                  <tr key={bid.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bid.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bid.client}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${bid.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(bid.submitted)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(bid.expires)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No pending bids
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-4 py-4 sm:px-6">
          <a href="/lawyer/bids" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            View all bids
          </a>
        </div>
      </div>
    </div>
  )
}

