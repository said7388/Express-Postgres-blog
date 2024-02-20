
export interface Comment {
  id: number;
  content: string;
  author_id: number;
  post_id: number;
  created_at: Date;
  updated_at: Date;
}