export interface Seller {
  id: string;
  name: string;
  businessType: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  owner: string;
  status: "Pending" | "Reviewing" | "Approved" | "Rejected";
  submissionDate: string;
  documentsSubmitted: boolean;
}
