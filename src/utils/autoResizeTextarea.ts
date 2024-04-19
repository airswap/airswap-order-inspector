export const autoResizeTextarea = (textarea: HTMLTextAreaElement | null) => {
  if (!textarea) return;

  textarea.style.height = 'fit';

  if (textarea.value === '' || !textarea.value) {
    textarea.style.height = '3rem';
  } else {
    textarea.style.height = textarea.scrollHeight + 'px';
  }
};
