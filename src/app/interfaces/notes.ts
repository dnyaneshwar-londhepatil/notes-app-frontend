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

export type SearchResultNote = Omit<
  Pick<Note, '_id' | 'category' | 'title' | 'content' | 'isPinned' | 'createdAt'>,
  'createdAt'
> & {
  createdAt: string;
  score: number;
};

export interface SearchNotesResponse {
  success: boolean;
  results: SearchResultNote[];
}

export interface CreateNotePayload {
  title: string;
  content: string;
  category: string;
}
