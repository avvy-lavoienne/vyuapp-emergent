import LoginForm from './LoginForm';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Login' };

export default async function LoginPage({ searchParams }) {
  const { next } = await searchParams;
  return <LoginForm next={next || '/admin'} />;
}
