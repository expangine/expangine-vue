

export interface SendMailOptions
{
  to: string;
  cc?: string[];
  bcc?: string[];
  subject?: string;
  body?: string;
  sameTab?: boolean;
}


export function getSendMail({ to, cc, bcc, subject, body, sameTab }: SendMailOptions)
{
  const parts: string[] = [];

  if (cc && cc.length > 0) {
    parts.push('cc=' + cc.join(','));
  }

  if (bcc && bcc.length > 0) {
    parts.push('bcc=' + bcc.join(','));
  }

  if (subject) {
    parts.push('subject=' + encodeURIComponent(subject));
  }

  if (body) {
    parts.push('body=' + encodeURIComponent(body));
  }

  const href = parts.length > 0
    ? 'mailto:' + to + '?' + parts.join('&')
    : 'mailto:' + to;

  const a = document.createElement('A') as HTMLAnchorElement;
  a.href = href;
  if (!sameTab) {
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  }
  a.click();
  a.remove();
}
