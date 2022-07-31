import type { GetSession } from "@sveltejs/kit"

function parseCookies(str: string): Record<string, string> {
  if (str === '') return {};
  const result: Record<string, string> = {};
  for (const cookie of str.split(';')) {
    const [name, value] = cookie.trim().split('=');
    result[name] = value;
  }
  return result;
}

export const getSession: GetSession = (event) => {
  const cookies = parseCookies(event.request.headers.get('cookie') ?? "");
  const theme = cookies.theme ?? 'light';
  return { theme };
}
