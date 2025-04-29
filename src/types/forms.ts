export type FieldType = 
  | 'text' 
  | 'email' 
  | 'number' 
  | 'phone' 
  | 'date' 
  | 'select' 
  | 'checkbox' 
  | 'radio'
  | 'file'
  | 'textarea';

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select, checkbox, radio
  defaultValue?: string;
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}

export interface EventForm {
  id: string;
  title: string;
  description?: string;
  logoUrl?: string;
  backgroundImageUrl?: string;
  primaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
  sections: FormSection[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FormResponse {
  id: string;
  formId: string;
  responses: Record<string, any>;
  submittedAt: Date;
  checkedIn: boolean;
  checkedInAt?: Date;
}