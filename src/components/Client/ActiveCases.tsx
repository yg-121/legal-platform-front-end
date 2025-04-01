import { Briefcase } from "lucide-react"

interface Case {
  id: number
  title: string
  lawyer: string
  status: string
  lastUpdated: string
}

interface ActiveCasesProps {
  cases: Case[]
}

export default function ActiveCases({ cases }: ActiveCasesProps) {
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
          <h3 className="text-lg font-medium leading-6 text-gray-900">Active Cases</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Your ongoing legal matters.</p>
        </div>
        <Briefcase className="h-5 w-5 text-gray-400" />
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {cases.length > 0 ? (
            cases.map((caseItem) => (
              <li key={caseItem.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{caseItem.title}</div>
                    <div className="text-sm text-gray-500">Lawyer: {caseItem.lawyer}</div>
                    <div className="text-xs text-gray-500">Last updated: {formatDate(caseItem.lastUpdated)}</div>
                  </div>
                  <div>
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {caseItem.status.charAt(0).toUpperCase() + caseItem.status.slice(1)}
                    </span>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-5 sm:px-6 text-center text-gray-500">No active cases</li>
          )}
        </ul>
        <div className="bg-gray-50 px-4 py-4 sm:px-6">
          <a href="/client/cases" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            View all cases
          </a>
        </div>
      </div>
    </div>
  )
}

