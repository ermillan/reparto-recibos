// utils/path-utils.ts
export const normalizePath = (parent: string, child?: string) => {
  const base = parent.toLowerCase();

  if (child) {
    let sub = child.toLowerCase();

    // Reglas de limpieza
    sub = sub.replace("bandeja-", ""); // quita "Bandeja-"
    sub = sub.replace("actualizar-", "actualizar-"); // mantiene actualizar
    sub = sub.replace("crear-", "crear-"); // mantiene crear

    return `${base}/${sub}`;
  }

  return base;
};
