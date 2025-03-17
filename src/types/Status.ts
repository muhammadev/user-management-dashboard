export const StatusEnum = ["Active", "Inactive"] as const;
export type StatusType = (typeof StatusEnum)[number];
