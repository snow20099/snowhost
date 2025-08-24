// utilities/events.ts
export const PROFILE_UPDATED_EVENT = 'profileUpdated';

export const emitProfileUpdate = (data: { name?: string; image?: string }) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PROFILE_UPDATED_EVENT, { detail: data }));
  }
};

export const listenToProfileUpdates = (callback: (data: { name?: string; image?: string }) => void) => {
  if (typeof window === 'undefined') return () => {};
  
  const handler = (event: CustomEvent) => {
    callback(event.detail);
  };
  
  window.addEventListener(PROFILE_UPDATED_EVENT, handler as EventListener);
  
  return () => {
    window.removeEventListener(PROFILE_UPDATED_EVENT, handler as EventListener);
  };
};
