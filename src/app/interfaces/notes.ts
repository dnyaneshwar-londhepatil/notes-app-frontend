export interface Note {
  _id: string;
  category: string;
  title: string;
  content: string;
  summarizedNotes?: string;
  isPinned: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  category: string;
}
