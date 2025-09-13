import { getCurrentUser } from "../../../services/authService";
import { updateUser } from "../../../services/userServices";

export const EnsureUserHasTenantRole = async () => {
  const user = getCurrentUser();
  if (!user) return;

  const roles = user.roles || [];
  if (!roles.includes("tenant")) {
    const updatedRoles = [...roles, "tenant"];

    // Mise à jour côté serveur
    await updateUser(user.id, { roles: updatedRoles });

    // Mise à jour côté client (localStorage)
    const updatedUser = { ...user, roles: updatedRoles };
    localStorage.setItem("user", JSON.stringify(updatedUser));
  }
};