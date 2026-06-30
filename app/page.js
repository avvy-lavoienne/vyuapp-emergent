import { cookies } from 'next/headers';
import { LocaleProvider } from '@/components/LocaleProvider';
import HomeContent from '@/components/HomeContent';

export default async function HomePage() {
  const cookieStore = await cookies();
  const locale = cookieStore.get('vyu-locale')?.value === 'en' ? 'en' : 'id';

  return (
    <LocaleProvider initialLocale={locale}>
      <HomeContent />
    </LocaleProvider>
  );
}
