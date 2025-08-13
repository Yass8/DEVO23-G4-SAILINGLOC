
export function getInitials(firstname, lastname) {
  if (!firstname || !lastname) return "";
  return (
    firstname.charAt(0).toUpperCase() +
    lastname.charAt(0).toUpperCase()
  );
}