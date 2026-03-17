export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  requestId?: string;
}

export interface PageQuery {
  page: number;
  pageSize: number;
  keyword?: string;
  status?: string;
}

export interface PageResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface OptionItem {
  label: string;
  value: string;
}
