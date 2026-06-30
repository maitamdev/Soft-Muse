export const sidebarDesktop = {
  collapsed: { width: 80, transition: { type: "spring", stiffness: 300, damping: 30 } },
  expanded: { width: 260, transition: { type: "spring", stiffness: 300, damping: 30 } }
};

export const sidebarMobile = {
  closed: { x: "100%", transition: { type: "spring", stiffness: 300, damping: 30 } },
  open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }
};
