export interface Task {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  dependencies?: string[];
  assignee?: string;
  // to resolve build issue please check this added
  fileType?: any;
}

export interface GanttChartProps {
  tasks: Task[];
  onTaskUpdate?: (task: Task) => void;
  onTaskSelect?: (taskId: string) => void;
}
// to resolve build issue please check this added
export type FileType = any;
export type TimelineConfig = any;
export type GanttViewProps = any;