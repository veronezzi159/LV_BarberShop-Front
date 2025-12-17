export const getHomeRouteByRole = (roles: string[]): string => {
  if (roles.includes("manager")) {
    return "/gerente";
  }
  if (roles.includes("barber")) {
    return "/barbeiro";
  }
  if (roles.includes("client")) {
    return "/cliente";
  }
  return "/unauthorized";
};