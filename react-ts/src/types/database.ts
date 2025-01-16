export interface Event {
  _id: string;
  title: string;
  description: string | null;
  location: string | null;
  startTime: string;
  endTime: string;
  category: string | null;
  createdBy: string;
  attendees: Array<{
    user: string;
    status: 'attending' | 'maybe' | 'not_attending';
  }>;
  createdAt: string;
  updatedAt: string;
}