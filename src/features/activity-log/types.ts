export type ActivityLogUser = {
  _id: string;
  firstName: string;
  lastName: string;
  role: string;
};

export type ActivityLogDoc = {
  _id?: string;
  name?: string;
};

export type ActivityLogRow = {
  _id: string;
  user: ActivityLogUser;
  page: string;
  action: string;
  oldDoc: ActivityLogDoc | null;
  newDoc: ActivityLogDoc | null;
  createdAt: string;
  updatedAt: string;
};

export type ActivityLogPayload = {
  success: boolean;
  totalAvailableLogs: number;
  totalPages: number;
  currentPage: number;
  data: ActivityLogRow[];
};

