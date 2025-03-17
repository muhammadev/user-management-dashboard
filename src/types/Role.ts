export const Roles = ["Admin", "Manager", "Viewer"] as const;
export type RoleType = (typeof Roles)[number];