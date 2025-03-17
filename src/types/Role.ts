export const RolesEnum = ["Admin", "Manager", "Viewer"] as const;
export type RoleType = (typeof RolesEnum)[number];
