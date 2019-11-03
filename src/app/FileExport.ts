

export interface FileExportOptions
{
  type?: string;
  content: string;
  name: string;
}

export async function exportFile({ type, name, content }: FileExportOptions)
{
  const blob = new Blob([content], { type: type || 'text/plain' });
  const href = window.URL.createObjectURL(blob);
  const dlink = document.createElement('a');
  dlink.download = name;
  dlink.href = href;
  dlink.onclick = (e) => setTimeout(() => window.URL.revokeObjectURL(dlink.href), 1500);
  dlink.click();
  dlink.remove();
}
