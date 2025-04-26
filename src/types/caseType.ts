export interface ClientCaseDocument {
    filePath: string;
    fileName: string;
    category: string;
    visibility: string;
    uploadedBy: string;
    _id: string;
    uploadedAt: string;
  }
  
  export interface ClientCase {
    _id: string;
    client: string;
    description: string;
    category: string;
    deadline: string;
    status: string;
    documents: ClientCaseDocument[];
    winning_bid: any; // Change to appropriate type if not null
    assigned_lawyer: any; // Change to appropriate type if not null
    additionalDeadlines: any[]; // Define structure if known
    formTemplates: any[]; // Define structure if known
    notes: any[]; // Define structure if known
    createdAt: string;
    updatedAt: string;
    __v: number;
    bids: any[]; // Define structure if known
  }