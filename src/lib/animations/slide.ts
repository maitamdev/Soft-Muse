export const slideInRight = {
 initial: { opacity: 0, x: 20 },
 animate: { opacity: 1, x: 0 },
 exit: { opacity: 0, x: -20 },
 transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const }
};

export const slideInLeft = {
 initial: { opacity: 0, x: -20 },
 animate: { opacity: 1, x: 0 },
 exit: { opacity: 0, x: 20 },
 transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const }
};
