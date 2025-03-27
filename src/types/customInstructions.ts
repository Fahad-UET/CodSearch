export interface CustomInstruction {
  id: string;
  name: string;
  content: string;
  tabId: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInstructionDto {
  name: string;
  content: string;
  tabId: string;
  isDefault?: boolean;
}
